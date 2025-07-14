import React, { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function RelationshipStatusPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  const options = [
    { label: "Taken", value: "taken" },
    { label: "Broken", value: "broken" },
    { label: "Prefer not to say", value: "prefer not to say" },
  ];

  const handleSaveAndNext = async () => {
    if (!status) return;

    const user_id = localStorage.getItem("snippet_user");
    if (!user_id) {
      console.error("User ID missing in localStorage");
      return;
    }

    setSaving(true);
    try {
      await api.patch(`/user/${user_id}`, {
        relationship_status: status,
      });
      console.log("Relationship status updated");
      navigate("/useronboarding/next-page");
    } catch (err) {
      console.error("Error saving relationship status:", err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-5 py-6 flex flex-col justify-between">
      <div>
        {/* Back Arrow */}
        <button className="mb-6">
          <ArrowLeft className="text-white" size={24} />
        </button>

        {/* Headings */}
        <h1 className="text-2xl font-bold leading-tight">
          BRAVO, leeus jump into <br /> Relationship Status
        </h1>
        <p className="text-sm text-zinc-400 mt-3 mb-6 leading-relaxed">
          Choose your relationship status.
        </p>

        {/* Options */}
        {options.map((opt) => (
          <label
            key={opt.value}
            className="flex items-center justify-between py-3 text-3xl font-bold text-zinc-400"
          >
            {opt.label}
            <input
              type="radio"
              name="relationship"
              value={opt.value}
              checked={status === opt.value}
              onChange={() => setStatus(opt.value)}
              className="w-5 h-5 accent-white"
            />
          </label>
        ))}
      </div>

      {/* Bottom Next Button */}
      <div className="flex justify-end mt-10">
        <button
          disabled={!status || saving}
          onClick={handleSaveAndNext}
          className={`w-14 h-14 rounded-full flex items-center justify-center ${
            !status ? "bg-zinc-700 cursor-not-allowed" : "bg-[#2e2e2e]"
          }`}
        >
          <ArrowRight className="text-white" size={22} />
        </button>
      </div>
    </div>
  );
}
