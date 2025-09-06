import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from "react-router-dom"; // Add this import
export default function App() {
  // Dummy navigate function for standalone component
  const navigate = useNavigate();

  // Dummy data for messages
  const messages = [
    {
      id: 'msg1',
      text: "There's something magical about the way you sing. It's like your voice reaches right into my soul and paints the most beautiful emotions I've ever felt.",
      time: "2h",
      type: "quote"
    },
    {
      id: 'msg2',
      text: "Your dedication to fitness isn't just about looks - it's about the strength and discipline that radiates from within. You're truly inspiring.",
      time: "7w",
      type: "quote"
    },
    {
      id: 'msg3',
      text: "",
      time: "10w",
      type: "bouquet"
    },
    {
      id: 'msg4',
      text: "The strength and grace you've developed through your fitness journey is truly captivating. You move with a confidence that's incredibly attractive.",
      time: "12w",
      type: "quote"
    },
  ];

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
