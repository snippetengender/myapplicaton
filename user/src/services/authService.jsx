import { auth, provider } from "../constants/firebaseConfig.jsx";
import { signInWithPopup } from "firebase/auth";

export async function googleLogin() {
  try {
    const result = await signInWithPopup(auth, provider);
    const uid = result.user.uid;
    localStorage.setItem("snippet_user", uid);
    return uid;
  } catch (error) {
    console.error("Google Login Error:", error);
    throw error;
  }
}
