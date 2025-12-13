import React from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HidePromptHistory() {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate("/myscreen");
  };

  return (
    <div className="bg-black min-h-screen text-[#E7E9EA] px-4 py-6">
      {/* Close button */}
      <X className="w-6 h-6 mb-4" onClick={handleClose} />

      {/* Title */}
      <h1 className="text-2xl font-bold mb-3">wanna hide this ?</h1>

      {/* Description */}
      <p className="text-gray-300 text-sm mb-6">
        So you dont wanna any one see whom you are sending prompts
      </p>

      {/* Hide Button */}
      <button
        className="border border-gray-500 rounded-lg px-4 py-2 text-sm mb-6"
        onClick={() => alert("Prompt history hidden")}
      >
        hide sent prompt history
      </button>

      {/* Note */}
      <p className="text-gray-400 text-sm">
        Note : You can unhide it by getting into settings
      </p>
    </div>
  );
}
