import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function RegretsModal() {
  const navigate = useNavigate();
  const [reminded, setReminded] = useState(false);

  const handleRemind = () => {
    setReminded(true);
  };

  const handleClose = () => {
    navigate("/home", { replace: true });
  };

  useEffect(() => {
    window.history.pushState(null, "", window.location.href);

    const handlePopState = () => {
      navigate("/home", { replace: true });
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-black text-[#E7E9EA] px-5 py-6">
      {/* Close button */}
      <button className="mb-6" onClick={handleClose}>
        <X size={24} className="text-[#E7E9EA]" />
      </button>

      {/* Title */}
      <h1 className="text-2xl font-semibold mb-2">Regrets</h1>

      {/* Description */}
      <p className="text-gray-300 text-sm leading-relaxed mb-4">
        You will be able to use this bouquet feature of The Snippet
        <br />
        once 6 hrs a day.{" "}
        <span className="text-blue-400 cursor-pointer">Learn more</span>
      </p>

      {/* Remind button */}
      {!reminded && (
        <button
          onClick={handleRemind}
          className="border border-gray-400 text-[#E7E9EA] text-sm rounded-full px-4 py-2 mb-6"
        >
          Remind me after 6 hours
        </button>
      )}

      {/* Conversation Message */}
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-gray-400 rounded-md"></div>
        <p className="text-gray-300 text-sm">
          {reminded
            ? "I will remind on time broskie, chillzz"
            : "Now start a conversation by sending a warm message"}
        </p>
      </div>
    </div>
  );
}
