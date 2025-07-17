import React, { useEffect } from "react";
import { googleLogin } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { auth } from "../../constants/firebaseConfig";

function GoogleLogin() {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const uid = user.uid;
        console.log("User already logged in. UID:", uid);

        user.getIdToken(true).then((idToken) => {
          console.log("🔑 Firebase ID Token:", idToken);
          localStorage.setItem("id_token", idToken);
        }).catch((err) => {
          console.error("Error fetching ID Token:", err);
        });

        localStorage.setItem("user_id", uid);
        navigate("/useronboarding/select-region", { replace: true });
      } else {
        console.log("🔄 No user logged in. Triggering Google Sign-In...");

        googleLogin()
          .then((uid) => {
            console.log(" Google Sign-In successful. UID:", uid);
            localStorage.setItem("user_id", uid);
            navigate("/useronboarding/select-region", { replace: true });
          })
          .catch((err) => {
            console.error("Google Sign-In failed:", err);
            alert("Google Sign-In failed. Please try again.");
            navigate("/lobby", { replace: true }); 
          });
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  return null;
}

export default GoogleLogin;
