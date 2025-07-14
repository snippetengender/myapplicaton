import React from "react";
import { googleLogin } from "../../services/authService";
import { useNavigate } from "react-router-dom";

function GoogleLogin() {
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const uid = await googleLogin();
      navigate("/useronboarding/select-region");
    } catch (err) {
      console.error("Google Sign-In failed:", err);
      alert("Google Sign-In failed. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl mb-4">Login to TheSnippet</h1>
      <button
        onClick={handleLogin}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Sign in with Google
      </button>
    </div>
  );
}

export default GoogleLogin;
