import React from "react";
import { useNavigate } from "react-router-dom";

export default function Lobby() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/useronboarding/google-login");
  };

  const handleLogin = () => {
    navigate("/home");
  };

  return (
    <div className="flex flex-col justify-end items-center min-h-screen bg-black p-6">
      <h1 className="text-[#E7E9EA] text-lg font-semibold mb-6">The Snippet</h1>
      <div className="w-full max-w-sm space-y-4">
        <button
          onClick={handleGetStarted}
          className="w-full py-3 bg-white text-black rounded-lg font-medium hover:bg-gray-200 transition"
        >
          Get Started
        </button>
        <button
          onClick={handleLogin}
          className="w-full py-3 bg-white text-black rounded-lg font-medium hover:bg-gray-200 transition"
        >
          Login
        </button>
      </div>
    </div>
  );
}
