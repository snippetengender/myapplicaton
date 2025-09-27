import React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  updateOnboardingData,
  updateOnboardingStep,
} from "../../features/userSlice/onboardingSlice";

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
    <div className="min-h-screen bg-black text-[#E7E9EA] px-5 py-6 flex flex-col justify-between">
      <div>
        <button className="mb-6" onClick={() => navigate(-1)}>
          <ArrowLeft className="text-[#E7E9EA]" size={24} />
        </button>

        <h1 className="text-2xl font-bold leading-tight">
          BRAVO, let’s jump into <br /> Relationship Status
        </h1>
        <p className="text-sm text-zinc-400 mt-3 mb-6 leading-relaxed">
          Choose your relationship status.
        </p>

        {options.map((opt) => (
          <label
            key={opt.value}
            className={`flex items-center justify-between py-3 text-3xl font-bold transition-colors ${
              relationship_status === opt.value ? "text-white" : "text-zinc-400"
            }`}
          >
            {opt.label}
            <input
              type="radio"
              name="relationship"
              value={opt.value}
              checked={relationship_status === opt.value}
              onChange={() => handleStatusChange(opt.value)}
              className="w-5 h-5 accent-white"
            />
          </label>
        ))}
      </div>

      <div className="flex justify-end mt-10">
        <button
          disabled={!relationship_status}
          onClick={handleSaveAndNext}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors duration-200 ${
            !relationship_status
              ? "bg-zinc-700 cursor-not-allowed"
              : "bg-[#2e2e2e] hover:bg-[#1f1f1f]"
          }`}
        >
          <ArrowRight className="text-[#E7E9EA]" size={22} />
        </button>
      </div>
    </div>
  );
}
