import React, { useEffect, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../providers/api";

export default function SomeoneSaidThat() {
  const navigate = useNavigate();
  const [someoneSaidThat, setSomeoneSaidThat] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("user_id");
  const tapRef = useRef({});

  useEffect(() => {
    const fetchReceivedBouquets = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        const res = await api.get(`/bouquet/${userId}?received=true`);
        const data = res.data?.data || [];

        const formatted = data.map((b) => ({
          id: b.id,
          type: b.status === "Accepted" ? "liked" : "prompt",
          text: b.prompt?.name || "",
          time: convertToRelativeTime(b.sent_at),
          status: b.status, // Keep track to prevent re-liking
        }));

        setSomeoneSaidThat(formatted);
      } catch (err) {
        console.error("Error fetching bouquets:", err);
        setSomeoneSaidThat([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReceivedBouquets();
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

  const handleDoubleTap = async (item, index) => {
    const now = Date.now();
    const prevTap = tapRef.current[item.id] || 0;

    if (now - prevTap < 300) {
      if (item.status !== "Accepted") {
        try {
          await api.patch("/bouquet", { id: item.id });

          const updatedList = [...someoneSaidThat];
          updatedList[index] = {
            ...item,
            type: "liked",
            status: "Accepted",
          };

          setSomeoneSaidThat(updatedList);
        } catch (error) {
          console.error("Failed to like bouquet:", error);
        }
      }
    }

    tapRef.current[item.id] = now;
  };

  return (
    <div className="min-h-screen bg-black text-[#E7E9EA] px-0 py-6 font-sans">
      {/* Top Section with padding */}
      <div className="px-2">
        {/* Back button */}
        <button className="mb-5" onClick={() => navigate("/myscreen")}>
          <ArrowLeft className="text-[#E7E9EA]" size={24} />
        </button>

        {/* Title */}
        <h1 className="text-2xl font-semibold mb-6">Someone said that</h1>
      </div>

      {/* Messages List */}
      <div className="flex flex-col">
        {messages.map((message) => (
          <div key={message.id} className="border-b border-gray-800 px-4 py-4">
            <p className="text-base text-gray-200 leading-relaxed">
              {message.type === "bouquet" ? (
                <span className="text-[#E7E9EA] ">You got a <span className="text-[#F06CB7] font-semibold">bouquet</span></span>
              ) : (
                `"${message.text}"`
              )}{" "}
              <span className="text-gray-500 text-[10px]">• {message.time}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
