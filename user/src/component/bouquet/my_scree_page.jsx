import React, { useEffect, useState, useRef } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../providers/api";

export default function MyScreen() {
  const navigate = useNavigate();
  const [someoneSaidThat, setSomeoneSaidThat] = useState([]);
  const [loading, setLoading] = useState(true);
  const [realHappiness, setRealHappiness] = useState([]);

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
          status: b.status,
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
      // Double tap detected
      if (item.status !== "Accepted") {
        try {
          await api.patch("/bouquet", { id: item.id });

          const updated = [...someoneSaidThat];
          updated[index].type = "liked";
          updated[index].status = "Accepted";
          setSomeoneSaidThat(updated);
        } catch (error) {
          console.error("Failed to like bouquet:", error);
        }
      }
    }

    tapRef.current[item.id] = now;
  };

  useEffect(() => {
    const fetchReactedBouquets = async () => {
      if (!userId) return;

      try {
        const res = await api.get(`/bouquet/${userId}?responded=true`);
        const data = res.data?.data || [];

        const reactedList = data.map((item) => ({
          text: `<${item.receiver?.name}> liked your prompt - "${item.prompt?.name}"`,
          time: convertToRelativeTime(item.reacted_at || item.sent_at), // fallback
        }));

        setRealHappiness(reactedList);
      } catch (err) {
        console.error("Error fetching real happiness:", err);
        setRealHappiness([]);
      }
    };

    fetchReactedBouquets();
  }, [userId]);

  return (
    <div className="bg-black min-h-screen text-[#E7E9EA] px-2 py-4">
      <ArrowLeft className="w-6 h-6 mb-4" onClick={() => navigate("/home")} />

      <h1 className="text-2xl font-bold mb-2">
        Send <span style={{ color: "#F06CB7" }}>bouquet</span>
      </h1>
      <p className="text-gray-300 text-sm mb-4" style={{ width: "95%" }}>
        This feature allows you to express your affection or positive feelings
        towards someone you don't know very well.
      </p>
      <p
        className="text-blue-500 text-sm mb-4 text-justify cursor-pointer"
        onClick={() => navigate("/bouquet/findem")}
      >
        find them here and throw it anonymously
      </p>

      {/* Someone Said That */}
      <h2 className="text-lg font-bold mb-1">Someone said that</h2>
      {loading ? (
        <p className="text-gray-400 text-sm">Loading bouquets...</p>
      ) : someoneSaidThat.length === 0 ? (
        <p className="text-gray-300 text-sm mb-4">
          Stay excited, we can't wait to surprise you with beautiful bouquets
          coming your way.
        </p>
      ) : (
        <>
          {someoneSaidThat.slice(0, 2).map((item, idx) => (
            <p
              key={item.id}
              className="text-gray-200 text-sm mb-2 border-b border-gray-700 pb-2 cursor-pointer"
              onClick={() => handleDoubleTap(item, idx)}
            >
              {item.type === "liked" && (
                <span className="text-pink-500">♡ </span>
              )}
              {item.text}
              <span className="text-gray-400 text-[10px] ml-1">
                • {item.time}
              </span>
            </p>
          ))}
          {someoneSaidThat.length > 2 && (
            <p
              className="text-blue-500 text-sm mb-4 cursor-pointer"
              onClick={() => navigate("/bouquet/someonesaidthat")}
            >
              and you got more
            </p>
          )}

          <p
            className="text-blue-500 text-sm mb-4 cursor-pointer"
            onClick={() => navigate("/bouquet/someonesaidthat")}
          >
            and you got more
          </p>
        </>
      )}

      {someoneSaidThat.length !== 0 && !loading && (
        <p className="text-gray-300 text-sm mb-4">
          Note: Double tap the prompt to like it. This simple gesture means a
          lot to the person who shared it.
        </p>
      )}

      {/* Real Happiness Section */}
      <div className="py-2">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-bold">Real Happiness</h3>
          {realHappiness.length !== 0 && (
            <span
              className="text-gray-500 text-xs cursor-pointer"
              onClick={() => navigate("/bouquet/wannahide")}
            >
              wanna hide this?
            </span>
          )}
        </div>

        {realHappiness.length === 0 ? (
          <p className="text-gray-300 text-sm mb-2">
            You haven't sent a single prompt yet, and that's okay. If you've
            already sent one, just be patient. We'll notify you when someone
            likes it.
          </p>
        ) : (
          <>
            {realHappiness.slice(0, 2).map((item, idx) => (
              <p
                key={idx}
                className="text-gray-200 text-sm mb-2 border-b border-gray-700 pb-2"
              >
                {item.text}
                <span className="text-gray-400 text-[10px]">
                  {" "}
                  • {item.time}
                </span>
              </p>
            ))}
            {realHappiness.length > 2 && (
              <p
                className="text-blue-500 text-sm mt-2 cursor-pointer"
                onClick={() => navigate("/bouquet/realhappyness")}
              >
                and you got more
              </p>
            )}

          </>
        )}
      </div>
    </div>
  );
}
