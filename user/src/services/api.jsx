import axios from "axios";
import { auth } from "../firebaseConfig";

let cachedToken = null;
let tokenExpiresAt = 0; 

const api = axios.create({
  baseURL: "http://localhost:8000", 
  withCredentials: false,
  timeout: 30000,
});

const getToken = async () => {
  const now = Date.now();

  if (cachedToken && tokenExpiresAt - now > 5 * 60 * 1000) { 
    return cachedToken;
  }

  const user = auth.currentUser;
  if (!user) {
    console.warn("No Firebase user. Returning null token.");
    return null;
  }

  try {
    console.log("Refreshing Firebase token...");
    const token = await user.getIdToken(true);
    const tokenResult = await user.getIdTokenResult();

    cachedToken = token;
    tokenExpiresAt = new Date(tokenResult.expirationTime).getTime();
    console.log("New token cached, expires at:", new Date(tokenExpiresAt).toLocaleTimeString());

    return token;
  } catch (err) {
    console.error("Failed to refresh Firebase token:", err);
    cachedToken = null;
    tokenExpiresAt = 0;
    return null;
  }
};

api.interceptors.request.use(
  async (config) => {
    console.log(` API Request: ${config.method?.toUpperCase()} ${config.url}`);

    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn("Sending request without Authorization header (no token).");
    }

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
