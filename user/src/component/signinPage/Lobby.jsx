import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
// Make sure this import path is correct for your project structure
import { resetAuthState } from "../../features/userSlice/authSlice";

export default function Lobby() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // This hook will run every time the Lobby component is shown
  useEffect(() => {
    // Dispatch the reset action to clear any previous login state/errors
    dispatch(resetAuthState());
  }, [dispatch]);

  const handleGetStarted = () => {
    // We remove navigate from here and pass it in the component that needs it
    navigate("/useronboarding/google-login", { state: { mode: "getStarted" } });
  };

  const handleLogin = () => {
    navigate("/useronboarding/google-login", { state: { mode: "login" } });
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