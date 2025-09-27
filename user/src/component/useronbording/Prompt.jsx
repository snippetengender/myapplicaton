import React from "react";
import { ArrowLeft, ArrowRight, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  updateOnboardingData,
  updateOnboardingStep,
} from "../../features/userSlice/onboardingSlice";

const prompts = [
  { id: "prompt_1", text: "I’m known for" },
  { id: "prompt_2", text: "My simple pleasures are" },
  { id: "prompt_3", text: "I’m happiest when" },
  { id: "prompt_4", text: "I wanna be a" },
  { id: "prompt_5", text: "Stolen" },
];

export default function PromptEditor() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { prompt } = useSelector((state) => state.onboarding.profileData);

  const handlePromptClick = (promptId) => {
    dispatch(
      updateOnboardingData({
        prompt: { reference_id: promptId, name: "" },
      })
    );
  };

  const handleInputChange = (value) => {
    dispatch(
      updateOnboardingData({
        prompt: { ...prompt, name: value },
      })
    );
  };

  const handleSaveAndNext = () => {

  dispatch(updateOnboardingStep({ prompt }));

  navigate("/useronboarding/relationship-status");
};
  return (
    <div className="min-h-screen bg-black text-[#E7E9EA] px-4 py-6 flex flex-col justify-between">
      {/* Top Navigation */}
      <div>
        <button className="mb-5" onClick={() => navigate(-1)}>
          <ArrowLeft className="text-[#E7E9EA]" size={24} />
        </button>

        {/* Heading */}
        <h1 className="text-2xl font-bold leading-snug">
          Give a <br />
          <span className="font-bold">try with prompts</span>
        </h1>
        <p className="text-sm text-zinc-400 mt-3 mb-5 leading-relaxed">
          You can only save one prompt. Switching will overwrite the previous
          one.
        </p>

        {/* Prompt Sections */}
        <div>
          {prompts.map((p) => (
            <div
              key={p.id}
              className="border-b border-zinc-800 py-4 transition-opacity duration-300"
            >
              {prompt?.reference_id === p.id ? (
                <div className="transition-all duration-150 transform scale-95">
                  <div className="border border-zinc-600 p-3 rounded-lg">
                    <label className="block text-[#E7E9EA] mb-2 text-sm">
                      {p.text}
                    </label>
                    <textarea
                      rows={5}
                      maxLength={150}
                      placeholder="Open up now"
                      value={prompt.name || ""}
                      onChange={(e) => handleInputChange(e.target.value)}
                      className="w-full bg-transparent rounded-lg p-3 text-[#E7E9EA] placeholder-zinc-500 text-xl font-bold outline-none"
                    />
                    <div className="text-xs text-zinc-500 mt-1">
                      {prompt.name?.length || 0}/150
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className="flex justify-between items-center px-2 py-1 rounded transition duration-200 hover:bg-zinc-800 cursor-pointer"
                  onClick={() => handlePromptClick(p.id)}
                >
                  <p className="text-[#E7E9EA] text-sm">{p.text}</p>
                  <Pencil size={18} className="text-zinc-400" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end mt-8">
        <button
          disabled={!prompt?.name?.trim()}
          onClick={handleSaveAndNext}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-300 ${
            !prompt?.name?.trim()
              ? "bg-gray-600 cursor-not-allowed opacity-50"
              : "bg-[#2e2e2e] hover:bg-[#1f1f1f]"
          }`}
        >
          <ArrowRight className="text-[#E7E9EA]" size={22} />
        </button>
      </div>
    </div>
  );
}
