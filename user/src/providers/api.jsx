import axios from "axios";
import { auth, authReady } from "../constants/firebaseConfig";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: false,
  timeout: 30000,
});

let cachedToken = null;
let tokenExpiresAt = 0;
let cachedUid = null;

const getToken = async () => {
  const now = Date.now();
  const user = auth.currentUser || await authReady;

  if (!user) {
    console.warn("No Firebase user. Returning null token.");
    cachedToken = null;
    cachedUid = null;
    return null;
  }

  // 🚨 If user switched accounts, reset cache
  if (cachedUid && cachedUid !== user.uid) {
    cachedToken = null;
    tokenExpiresAt = 0;
  }

  if (cachedToken && tokenExpiresAt - now > 5 * 60 * 1000) {
    return cachedToken;
  }

  try {
    const token = await user.getIdToken(true); // always refresh
    const tokenResult = await user.getIdTokenResult();

    cachedToken = token;
    cachedUid = user.uid; // ✅ track per-user
    tokenExpiresAt = new Date(tokenResult.expirationTime).getTime();

    return token;
  } catch (err) {
    console.error("Failed to refresh Firebase token:", err);
    cachedToken = null;
    tokenExpiresAt = 0;
    cachedUid = null;
    return null;
  }
};
api.interceptors.request.use(
  async (config) => {

    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }
    console.log("📤 OUTGOING REQUEST:");
    console.log("URL:", config.baseURL + config.url);
    console.log("METHOD:", config.method);
    console.log("HEADERS:", config.headers);
    console.log("DATA:", config.data);
    console.log("PARAMS:", config.params);

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.warn(" 401 Unauthorized: Attempting token refresh...");

      cachedToken = null;
      tokenExpiresAt = 0;

      const token = await getToken();
      if (token) {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      } else {
        console.warn("No user during retry. Signing out.");
        auth.signOut();
        localStorage.removeItem("id_token");
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
