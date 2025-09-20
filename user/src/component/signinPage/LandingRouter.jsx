// src/component/signinPage/LandingRouter.jsx

import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom"; // <-- Important: Import Navigate
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useDispatch } from "react-redux";
import { setUserId } from "../../features/userSlice/userSlice";

const LandingRouter = () => {
  const dispatch = useDispatch();
  // We use state to track the authentication status
  const [authStatus, setAuthStatus] = useState("checking"); // 'checking', 'loggedIn', or 'loggedOut'

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // If user is found, update their ID and set status to loggedIn
        dispatch(setUserId(user.uid));
        setAuthStatus("loggedIn");
      } else {
        // Otherwise, set status to loggedOut
        setAuthStatus("loggedOut");
      }
    });

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, [dispatch]);


  // While checking, you can show a loading spinner
  if (authStatus === "checking") {
    return <div>Loading...</div>; // Or a proper spinner component
  }

  // If logged in, render the Navigate component to redirect to /home
  if (authStatus === "loggedIn") {
    return <Navigate to="/home" replace />;
  }

  // If logged out, render the Navigate component to redirect to /lobby
  return <Navigate to="/lobby" replace />;
};

export default LandingRouter;