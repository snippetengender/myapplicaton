import React, { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useNavigate } from "react-router-dom"; // Add this import
export default function App() {
  const [refCode, setRefCode] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // State for error message

  // Dummy navigate function for standalone component
  const navigate = useNavigate();

  const handleNext = () => {
    // In a real application, you would validate the refCode here
    // For demonstration, let's just log it.
    if (refCode.trim() === "") {
      setErrorMessage("Please enter a referral code.");
      return;
    }
    // setErrorMessage("Invalid Code or reused code"); // Example error message
    navigate("/regrets"); // Uncomment and replace with actual navigation
  };

  return (
    <div className="min-h-screen bg-black text-[#E7E9EA] px-4 py-6 flex flex-col justify-between font-sans">
      {/* Top Section */}
      <div>
        {/* Back button */}
        <button className="mb-5" onClick={() => navigate("/bouquetprompt")}>
          <ArrowLeft className="text-[#E7E9EA]" size={24} />
        </button>

        {/* Title and Description */}
        <h1 className="text-2xl font-semibold mb-2">Regrets</h1>
        <p className="text-sm text-gray-300 mb-6">
          You need to have a minimum of 10 Snips to unlock this feature.{" "}
          <span className="text-[#0C8AE5] underline cursor-pointer">Learn more</span>
        </p>

        {/* Referral Section */}
        <h2 className="text-2xl font-semibold mb-4">
          But refer a friend <br />
          and earn 30 Snips to unlock
        </h2>
        <p className="text-sm text-gray-300 mb-6">
          Simple, follow the steps below
        </p>

        {/* Steps */}
        <div className="space-y-4 mb-8">
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 flex-shrink-0 rounded-full bg-[#D9D9D9] text-black flex items-center justify-center text-xs font-100">1</span>
            <p className="text-sm text-gray-200">Download The Snippet app on your friends phone</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 flex-shrink-0 rounded-full bg-[#D9D9D9] text-black flex items-center justify-center text-xs font-100">2</span>
            <p className="text-sm text-gray-200">Get to user profile and find the Referral Code</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 flex-shrink-0 rounded-full bg-[#D9D9D9] text-black flex items-center justify-center text-xs font-100">3</span>
            <p className="text-sm text-gray-200">Type it below and slay</p>
          </div>
        </div>

        {/* Ref Code Input */}
        <div className="mb-2">
          <label htmlFor="refCode" className="block text-xl font-semibold mb-2">Ref Code</label>
          <input
            type="text"
            id="refCode"
            placeholder="Enter code" // Added a placeholder for clarity
            className="w-full bg-transparent border-b border-gray-800 text-[#E7E9EA] text-lg pb-2 outline-none focus:border-[#F06CB7]"
            value={refCode}
            onChange={(e) => {
              setRefCode(e.target.value);
              setErrorMessage(""); // Clear error message on input change
            }}
          />
          <p className="text-xs text-gray-500 mt-1">
            {refCode.length}/5 {/* Assuming max 5 characters for demo */}
          </p>
        </div>

        {/* Error/Status Message */}
        {errorMessage && (
          <p className="text-sm text-red-500 mt-2">{errorMessage}</p>
        )}

      </div>

      {/* Bottom Navigation */}
      <div className="flex justify-end mt-10 mb-4">
        <button
          className="w-12 h-12 rounded-full bg-[#2e2e2e] flex items-center justify-center"
          onClick={handleNext}
        >
          <ArrowRight size={22} className="text-[#E7E9EA]" />
        </button>
      </div>
    </div>
  );
}
