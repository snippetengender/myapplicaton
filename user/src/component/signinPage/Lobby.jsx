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
      {/* Create a separate container for the entire content area */}
      <div className="w-full flex-1 flex flex-col items-center">
        {/* Top section with image aligned to center */}
        <div className="w-full flex justify-end mb-6 mt-3">
          <img
            src={snippyBaller}
            alt="Snippy mascot"
            className="w-[270px]"
          />
        </div>

        {/* Rest of your content */}
        <div className="w-full flex-1 flex flex-col">
          <div className="w-full h-auto">
            <h1 className="text-brand-off-white text-[35px] leading-[36px] font-bold tracking-tight text-left">
              Yap<br />
              without rotting<br />
              inside,<br />
              Find Events,<br />
              Buy/Sell Needs
            </h1>
          </div>

          <p className="text-brand-off-white text-left mt-8 mb-12 text-[20px] font-bold leading-tight max-w-[320px]">
            By joining Snippet, you can<br />
            see what’s happening around you.
          </p>

          <div className="w-full mt-auto mb-8 space-y-3">
            <p className="text-brand-off-white text-[14px] mb-2 text-left">
              already have an account ? <button onClick={handleLogin} className="text-[#00A3FF]">Log In</button>
            </p>
            <button
              onClick={handleGetStarted}
              className="w-full py-2.5 bg-[#DCDDDF] text-black rounded-[14px] text-[18px] font-bold hover:bg-gray-200 transition"
            >
              See what’s happening
            </button>

            {/* <button
              onClick={handleAboutUs}
              className="w-full py-3 bg-brand-off-white text-black rounded-2xl font-medium hover:bg-gray-200 transition"
            >
              Get to know us whos behind this
            </button> */}
          </div>
        </div>
      </div>

      <p className="text-[#8D9295] text-[10px] mb-2 text-center">
        Made with ♥ for only college students
      </p>
    </div>
  );
}