import React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  updateOnboardingData,
  updateOnboardingStep,
} from "../../features/userSlice/onboardingSlice";
import snippyPointer from "../assets/Snippy_pointer.png";
import nextArrow from "../assets/next.svg";

export default function RelationshipStatusPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { relationship_status } = useSelector(
    (state) => state.onboarding.profileData
  );

  const options = [
    { label: "Taken", value: "taken" },
    { label: "Broken", value: "broken" },
    { label: "Prefer not to say", value: "prefer not to say" },
  ];

  const handleStatusChange = (value) => {
    dispatch(updateOnboardingData({ relationship_status: value }));
  };

  const handleSaveAndNext = () => {
    dispatch(updateOnboardingStep({ relationship_status}));

    navigate("/useronboarding/user-name");
  };

  return (
    <div className="min-h-screen bg-black text-brand-off-white px-4 py-6 flex flex-col justify-between">
      <div>
        <button className="mb-3" onClick={() => navigate(-1)}>
          <ArrowLeft className="text-brand-off-white" size={24} />
        </button>

        <h1 className="text-[20px] font-bold leading-tight">
          jumping into your <br/>Relationship Status
        </h1>
        <p className="text-[12px] text-brand-off-white mt-3 mb-6">
          Choose your relationship status. Plot twist: you'll be back here faster than you can say ITS COMPLICATED
        </p>

        {options.map((opt) => (
          <label
            key={opt.value}
            className={`flex items-center justify-between text-[28px] font-bold transition-colors ${
              relationship_status === opt.value ? "text-brand-off-white" : "text-brand-medium-gray"
            }`}
          >
            {opt.label}
            <div className="relative w-6 h-6 flex items-center justify-center">
              <input
                type="radio"
                name="relationship"
                value={opt.value}
                checked={relationship_status === opt.value}
                onChange={() => handleStatusChange(opt.value)}
                className="appearance-none w-6 h-6 rounded-full border border-brand-off-white absolute"
              />
              {relationship_status === opt.value && (
                <div className="w-3 h-3 rounded-full bg-brand-off-white absolute pointer-events-none"></div>
              )}
            </div>
          </label>
        ))}
      </div>

      <div className="flex justify-end items-end mt-10 gap-2">
        <img 
          src={snippyPointer} 
          alt="Snippy Pointer" 
          className="w-[180px] h-auto transform  mr-4" 
        />
        <button
          disabled={!relationship_status}
          onClick={handleSaveAndNext}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors duration-200 ${
            !relationship_status
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
