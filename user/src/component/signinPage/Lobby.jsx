import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
// Make sure this import path is correct for your project structure
import { resetAuthState } from "../../features/userSlice/authSlice";
import snippyBaller from "../assets/Snippy_baller.png";

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

  const handleAboutUs = () => {
    navigate("/about-us");
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-black p-6">
      <div className="flex-1 flex flex-col items-center justify-center">
        <img 
          src={snippyBaller} 
          alt="Snippy mascot" 
          className="absolute w-64 mb-6 top-0 right-0"
        />
        
        <h1 className="text-brand-off-white text-3xl font-bold mb-1 pt-[240px] text-left">Hlo,</h1>
        <h2 className="text-brand-off-white text-2xl font-bold mb-3 text-left">This is Snippet</h2>
        
        <p className="text-brand-off-white text-left mb-8 max-w-xs text-[15px] font-bold">
          With Snippet you will be able to know about the occurences and events
        </p>
        
        <div className="w-full max-w-xs space-y-3">
          <button
            onClick={handleGetStarted}
            className="w-full py-3 bg-brand-off-white text-black rounded-2xl font-medium hover:bg-gray-200 transition"
          >
            Sign Up with your College Mail ID
          </button>
          
          <button
            onClick={handleLogin}
            className="w-full py-3 bg-brand-off-white text-black rounded-2xl font-medium hover:bg-gray-200 transition"
          >
            Log In if youre returning
          </button>
          
          <button
            onClick={handleAboutUs}
            className="w-full py-3 bg-brand-off-white text-black rounded-2xl font-medium hover:bg-gray-200 transition"
          >
            Get to know us whos behind this
          </button>
        </div>
      </div>
      
      <p className="text-brand-off-white text-[10px] mt-6 text-center">
        யாமறிந்த மொழிகளிலே தமிழ்மொழி போல் <br/> இனிதாவது எங்கும் காணோம்
      </p>
    </div>
  );
}