import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD_dfKMZs_WP3dkaPbAMhuEBjfFwHUYLkE",
  authDomain: "snippet-engender.firebaseapp.com",
  projectId: "snippet-engender",
  storageBucket: "snippet-engender.appspot.com",
  messagingSenderId: "368938622742",
  appId: "1:368938622742:web:5694f8a33867f37d9f7a37",
  measurementId: "G-42VN276CNY"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
