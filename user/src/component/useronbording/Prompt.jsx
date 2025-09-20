import React, { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../providers/api";

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

  const userInterest = JSON.parse(localStorage.getItem("snippet_user_interests"));

  // Redirect if previous step incomplete
  useEffect(() => {
    if (!userInterest) {
      console.warn("Fill the previous page");
      navigate("/useronboarding/interests");
    }
  }, [navigate, userInterest]);

  // Load saved prompt if exists
  useEffect(() => {
    const savedPrompt = JSON.parse(localStorage.getItem("snippet_user_prompt"));
    if (savedPrompt) {
      setActivePrompt(savedPrompt.reference_id);
      setInputValue(savedPrompt.name);
    }
  }, []);

  const handlePromptClick = (id) => {
    if (activePrompt !== id) {
      // Save current prompt if filled before switching
      if (activePrompt && inputValue.trim()) {
        saveToLocalStorage(activePrompt, inputValue);
        sendPromptToBackend(activePrompt, inputValue);
      }

      // Switch to new prompt
      setActivePrompt(id);
      setInputValue("");
    }
  };

  const handleInputChange = (value) => {
    setInputValue(value);
  };

  const saveToLocalStorage = (reference_id, text) => {
    const selectedPrompt = prompts.find((p) => p.id === reference_id);
    const promptData = {
      reference_id,
      text: selectedPrompt?.text || "Prompt",
      name: text.trim(),
    };
    localStorage.setItem("snippet_user_prompt", JSON.stringify(promptData));
    console.log("Prompt saved to localStorage:", promptData);
  };

  const sendPromptToBackend = async (reference_id, text) => {
    const user_id = localStorage.getItem("user_id");
    if (!user_id) {
      console.error("User ID missing in localStorage");
      return;
    }

    try {
      await api.patch(`/user/${user_id}`, {
        prompt: { reference_id, name: text.trim() },
      });
      console.log("Prompt saved to backend");
    } catch (err) {
      console.error("Error saving prompt to backend:", err.message);
    }
  };

  const handleSaveAndNext = async () => {
    if (!activePrompt || inputValue.trim().length === 0) {
      alert("Please select a prompt and fill it.");
      return;
    }

    setSaving(true);
    try {
      saveToLocalStorage(activePrompt, inputValue);
      await sendPromptToBackend(activePrompt, inputValue);
      navigate("/useronboarding/relationship-status");
    } catch (err) {
      console.error("Error saving prompt:", err.message);
    } finally {
      setSaving(false);
    }
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
          You can only save one prompt. Switching will overwrite the previous one.
        </p>

        {/* Prompt Sections */}
        <div>
          {prompts.map((prompt) => (
            <div
              key={prompt.id}
              className="border-b border-zinc-800 py-4 transition-opacity duration-300"
            >
              {activePrompt === prompt.id ? (
                <div className="transition-all duration-150 transform scale-95">
                  <div className="border border-zinc-600 p-3 rounded-lg">
                    <label className="block text-[#E7E9EA] mb-2 text-sm">
                      {prompt.text}
                    </label>
                    <textarea
                      rows={5}
                      maxLength={150}
                      placeholder="Open up now"
                      value={inputValue}
                      onChange={(e) => handleInputChange(e.target.value)}
                      className="w-full bg-transparent rounded-lg p-3 text-[#E7E9EA] placeholder-zinc-500 text-xl font-bold outline-none"
                    />
                    <div className="text-xs text-zinc-500 mt-1">
                      {inputValue.length}/150
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className="flex justify-between items-center px-2 py-1 rounded transition duration-200 hover:bg-zinc-800 cursor-pointer"
                  onClick={() => handlePromptClick(prompt.id)}
                >
                  <p className="text-[#E7E9EA] text-sm">{prompt.text}</p>
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
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-300 ${
            saving
              ? "bg-gray-600 animate-pulse cursor-not-allowed"
              : !inputValue.trim()
              ? "bg-gray-600 cursor-not-allowed opacity-50"
              :  "bg-[#2e2e2e] hover:bg-[#1f1f1f]"
          }`}
        >
          <ArrowRight className="text-[#E7E9EA]" size={22} />
        </button>
      </div>

      {/* Saving Indicator */}
      {saving && (
        <p className="text-sm text-blue-400 mt-2 text-right">Saving...</p>
      )}
    </div>
  );
}
