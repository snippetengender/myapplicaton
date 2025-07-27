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
    <div className="bg-black min-h-screen text-white px-2 py-4">
      {/* Back */}
      <ArrowLeft
        className="w-6 h-6 mb-4 cursor-pointer"
        onClick={() => navigate("/bouquet/myscreen")}
      />

      <h1 className="text-2xl font-bold mb-4">Someone said that</h1>

      {loading ? (
        <p className="text-gray-400 text-sm">Loading bouquets...</p>
      ) : someoneSaidThat.length === 0 ? (
        <p className="text-gray-300 text-sm mb-4">
          Stay excited, we can't wait to surprise you with beautiful bouquets
          coming your way.
        </p>
      ) : (
        someoneSaidThat.map((item, idx) => (
          <p
            key={item.id}
            className="text-gray-200 text-sm mb-2 border-b border-gray-700 pb-2 cursor-pointer"
            onClick={() => handleDoubleTap(item, idx)}
          >
            {item.type === "liked" && <span className="text-pink-500">♡ </span>}
            {item.text}
            <span className="text-gray-400 text-[10px] ml-1">
              • {item.time}
            </span>
          </p>
        ))
      )}

      {!loading && someoneSaidThat.length !== 0 && (
        <p className="text-gray-300 text-sm mt-4">
          Note: Double tap the prompt to like it. This simple gesture means a
          lot to the person who shared it.
        </p>
      )}
    </div>
  );
}
