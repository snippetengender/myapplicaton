import { auth, provider } from "../firebaseConfig.jsx";
import { signInWithPopup } from "firebase/auth";

export async function googleLogin() {
  try {
    const result = await signInWithPopup(auth, provider);
    const uid = result.user.uid;
    console.log("Firebase UID:", uid);
    localStorage.setItem("snippet_user", uid);
    console.log("UID saved to localStorage:", uid);
    return uid;
  } catch (error) {
    console.error("Google Login Error:", error);
    throw error;
  }
}
