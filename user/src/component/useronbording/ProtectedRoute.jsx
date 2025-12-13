import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { auth } from "../../constants/firebaseConfig";
import Lottie from "lottie-react";
import loadingAnimation from "../assets/1 second Loop.json";

export default function ProtectedRoute() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-6 bg-black min-h-screen">
        <Lottie 
          animationData={loadingAnimation} 
          loop={true}
          style={{ width: 120, height: 120 }} // Adjust size as needed
        />
      </div>
    );
  }

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/useronboarding/google-login" replace />
  );
}
