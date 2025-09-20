import React, { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../providers/api";

export default function RealHappiness() {
  const navigate = useNavigate();
  const [realHappiness, setRealHappiness] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    const fetchReactedBouquets = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        const res = await api.get(`/bouquet/${userId}?responded=true`);
        const data = res.data?.data || [];

        const reactedList = data.map((item) => ({
          id: item.id,
          user: item.receiver?.name || "Unknown",
          prompt: item.prompt?.name || "No prompt",
          time: convertToRelativeTime(item.reacted_at || item.sent_at), 
        }));

        setRealHappiness(reactedList);
      } catch (err) {
        console.error("Error fetching real happiness:", err);
        setRealHappiness([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReactedBouquets();
  }, [userId]);

  const convertToRelativeTime = (isoString) => {
    const now = new Date();
    const sent = new Date(isoString);
    const diffMs = now - sent;

    const seconds = diffMs / 1000;
    const minutes = seconds / 60;
    const hours = minutes / 60;
    const days = hours / 24;
    const weeks = days / 7;

    if (weeks >= 1) return `${Math.floor(weeks)}w`;
    if (days >= 1) return `${Math.floor(days)}d`;
    if (hours >= 1) return `${Math.floor(hours)}h`;
    if (minutes >= 1) return `${Math.floor(minutes)}m`;
    return `${Math.floor(seconds)}s`;
  };

  return (
    <div className="min-h-screen bg-black text-[#E7E9EA] px-2 py-6">
      {/* Header */}
      <div className="px-2">
        <button className="mb-5" onClick={() => navigate("/bouquet/myscreen")}>
          <ArrowLeft className="text-[#E7E9EA]" size={24} />
        </button>
        <div className="flex items-center mb-4">
          <h1 className="text-2xl font-semibold">Real Happiness</h1>
        </div>
      </div>

      {/* Reaction List */}
      <div className="flex flex-col">
        {loading ? (
          <p className="text-gray-400 px-4">Loading reactions...</p>
        ) : realHappiness.length === 0 ? (
          <p className="text-gray-300 px-4 text-sm">
            You haven’t sent any prompts yet, or no one has reacted yet. Patience brings the flowers 🌸
          </p>
        ) : (
          realHappiness.map((item) => (
            <div key={item.id} className="border-b border-gray-800 px-4 py-4">
              <p className="text-base text-gray-200 leading-relaxed">
                <span className="text-gray-500 font-semibold">&lt;{item.user}&gt;</span> liked the prompt you sent - "{item.prompt}"
                <span className="text-gray-500 text-[10px] ml-1">• {item.time}</span>
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
