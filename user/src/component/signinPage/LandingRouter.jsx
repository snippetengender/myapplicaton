import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const LandingRouter = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("Already signed in user:", user.uid);
        navigate("/home", { replace: true });
      } else {
        console.log("User is logged out or new");
        navigate("/lobby", { replace: true });
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  return null;
};

export default LandingRouter;
