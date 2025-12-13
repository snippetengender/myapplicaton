import React, { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  updateOnboardingData,
  updateOnboardingStep,
} from "../../features/userSlice/onboardingSlice";
import nextArrow from "../assets/next.svg";


const bioOptions = [
  "Just another person trying to figure things out",
  "Living my life, taking it one day at a time",
  "Regular human doing regular things",
  "Here, there, everywhere",
  "Making my way through life",
];

export default function PromptEditor() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showBioOptions, setShowBioOptions] = useState(false);

  const { prompt } = useSelector((state) => state.onboarding.profileData);

  const handleInputChange = (value) => {
    dispatch(
      updateOnboardingData({
        prompt: { ...prompt, name: value, reference_id: "I want" },
      })
    );
  };

  const handleAutoFill = () => {
    const randomBio = bioOptions[Math.floor(Math.random() * bioOptions.length)];
    dispatch(
      updateOnboardingData({
        prompt: { ...prompt, name: randomBio, reference_id: "I want"},
      })
    );
  };

  const handleSaveAndNext = () => {
  const payload = {
    prompt: {
      name: prompt?.name,
      reference_id: "I want",  
    },
  };

  dispatch(updateOnboardingStep(payload));
  navigate("/useronboarding/relationship-status");
};

  return (
    <div className="min-h-screen bg-black text-brand-off-white px-4 py-6 flex flex-col justify-between">
      {/* Top Navigation */}
      <div className="flex-1">
        <button className="mb-3" onClick={() => navigate(-1)}>
          <ArrowLeft className="text-brand-off-white" size={24} />
        </button>

        {/* Heading */}
        <h1 className="text-2xl font-bold mb-2">something about you</h1>
        <p className="text-[12px] text-brand-off-white mb-6">
          Write your bio. Try to sound cool but not trying-too-hard cool. Good
          luck with that balance.
        </p>

        {/* Bio Input Area */}
        <div className="relative">
          <textarea
            rows={6}
            maxLength={250}
            placeholder="draft something about you or use the button below"
            value={prompt?.name || ""}
            onChange={(e) => handleInputChange(e.target.value)}
            className="h-[150px] w-full bg-transparent border border-brand-charcoal rounded-lg p-4 text-brand-off-white placeholder-brand-charcoal text-[12px] outline-none resize-none"
          />
          <div className="flex justify-between mt-2">
            <span className="text-xs text-brand-charcoal">
              {(prompt?.name?.length || 0)}/250
            </span>
            <button
              onClick={handleAutoFill}
              className="text-xs  text-brand-off-white"
            >
              <span className="w-full h-full border border-brand-charcoal px-4 py-1 rounded-lg font-medium text-[14px]">auto fill</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-8">
        <button
          disabled={!prompt?.name?.trim()}
          onClick={handleSaveAndNext}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-300 ${
            !prompt?.name?.trim()
              ? "bg-brand-charcoal cursor-not-allowed opacity-50"
              : "bg-brand-off-white"
          }`}
        >
          <img 
            src={nextArrow} 
            alt="Next arrow" 
          />
        </button>
      </div>
    </div>
  );
}
