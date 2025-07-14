import React, { useState } from "react";
import { ArrowLeft, ArrowRight, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const prompts = [
  { id: "prompt_1", text: "I’m known for" },
  { id: "prompt_2", text: "My simple pleasures are" },
  { id: "prompt_3", text: "I’m happiest when" },
  { id: "prompt_4", text: "I wanna be a" },
  { id: "prompt_5", text: "Stolen" },
];

export default function PromptEditor() {
  const navigate = useNavigate();
  const [activePrompt, setActivePrompt] = useState(null); 
  const [inputValue, setInputValue] = useState(""); 
  const [saving, setSaving] = useState(false);

  const handlePromptClick = (id) => {
    if (activePrompt === id) {
      setActivePrompt(null);
      setInputValue("");
    } else {
      setActivePrompt(id);
      setInputValue(""); 
    }
  };

  const handleInputChange = (value) => {
    setInputValue(value);
  };

  const handleSaveAndNext = async () => {
    if (!activePrompt || inputValue.trim().length === 0) return;

    const user_id = localStorage.getItem("snippet_user");
    if (!user_id) {
      console.error("User ID missing in localStorage");
      return;
    }

    setSaving(true);
    try {
      await api.patch(`/user/${user_id}`, {
        prompt: {
          reference_id: activePrompt,
          name: inputValue.trim(),
        },
      });
      console.log("Prompt saved successfully");
      navigate("/useronboarding/relationship-status"); 
    } catch (err) {
      console.error("Error saving prompt:", err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 py-6 flex flex-col justify-between">
      {/* Top Navigation */}
      <div>
        <button className="mb-5">
          <ArrowLeft className="text-white" size={24} />
        </button>

        {/* Heading */}
        <h1 className="text-2xl font-bold leading-snug">
          Give a <br />
          <span className="font-bold">try with prompts</span>
        </h1>
        <p className="text-sm text-zinc-400 mt-3 mb-5 leading-relaxed">
          You can only fill one prompt. Choose wisely.
        </p>

        {/* Prompt Sections */}
        <div>
          {prompts.map((prompt) => (
            <div
              key={prompt.id}
              className="border-b border-zinc-800 py-4"
            >
              {activePrompt === prompt.id ? (
                <div className="transition-all duration-100 transform scale-95">
                  <div className="border border-zinc-600 p-3 rounded-lg">
                    <label className="block text-white mb-2 text-sm">
                      {prompt.text}
                    </label>
                    <textarea
                      rows={5}
                      maxLength={150}
                      placeholder="Open up now"
                      value={inputValue}
                      onChange={(e) => handleInputChange(e.target.value)}
                      className="w-full bg-transparent rounded-lg p-3 text-white placeholder-zinc-500 text-xl font-bold outline-none"
                    />
                    <div className="text-xs text-zinc-500 mt-1">
                      {inputValue.length}/150
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className={`flex justify-between items-center cursor-pointer transition duration-200 hover:bg-zinc-800 px-2 py-1 rounded ${
                    activePrompt ? "opacity-50 pointer-events-none" : ""
                  }`}
                  onClick={() => handlePromptClick(prompt.id)}
                >
                  <p className="text-white text-sm">{prompt.text}</p>
                  <Pencil size={18} className="text-zinc-400" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Right Navigation */}
      <div className="flex justify-end mt-8">
        <button
          disabled={!inputValue.trim() || saving}
          onClick={handleSaveAndNext}
          className={`w-12 h-12 rounded-full flex items-center justify-center ${
            !inputValue.trim()
              ? "bg-zinc-700 cursor-not-allowed"
              : "bg-[#2e2e2e]"
          }`}
        >
          <ArrowRight className="text-white" size={22} />
        </button>
      </div>
    </div>
  );
}
