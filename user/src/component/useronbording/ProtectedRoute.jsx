import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { auth } from "../../constants/firebaseConfig";

export default function ProtectedRoute() {
  const user = auth.currentUser;

  const [loading, setLoading] = React.useState(true);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="text-center text-white">Loading...</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/useronboarding/google-login" replace />;
}
