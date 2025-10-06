import React from 'react';
import { X } from 'lucide-react';
import { useNavigate } from "react-router-dom"; 
export default function App() {
  // Dummy navigate function for standalone component
  const navigate = useNavigate();

  const handleGotIt = () => {
    // You might navigate back to a home screen or another relevant page
    navigate("/myscreen"); // Example navigation
  };

  const handleClose = () => {
    // You might navigate back or close a modal/overlay
    navigate("/home"); // Example navigation
  };

  return (
    <div className="min-h-screen bg-black text-[#E7E9EA] flex flex-col items-center justify-center font-sans relative p-4">
      {/* Close Icon at Top Left */}
      <button className="absolute top-4 left-4 text-[#E7E9EA]" onClick={handleClose}>
        <X size={24} onClick={() => navigate("/home")}/>
      </button>

      {/* Central Content */}
      <div className="flex flex-col items-center text-center px-4">
        {/* Placeholder for the illustration */}
        {/* Replace with your actual image/SVG if available */}
        <img
          src="https://placehold.co/150x150/000000/F06CB7?text=Illustration" // Placeholder image
          alt="Illustration"
          className="mb-8"
          onError={(e) => {
            e.target.onerror = null; // Prevents infinite loop
            e.target.src = "https://placehold.co/150x150/000000/F06CB7?text=🐶"; // Fallback to an emoji if placeholder fails
          }}
        />

        <p className="text-base text-gray-200 mb-8 leading-relaxed max-w-xs">
          We will deliver your message on time, wait for the likes and try sending a newer tomorrow
        </p>

        <button
          className="bg-[#2e2e2e] text-[#E7E9EA] py-3 px-8 rounded-full text-sm font-semibold hover:bg-gray-700 transition-colors duration-200"
          onClick={handleGotIt}
        >
          Got it
        </button>
      </div>
    </div>
  );
}
