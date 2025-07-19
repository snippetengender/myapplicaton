import React from 'react';
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom"; // Add this import
export default function App() {
 
  const navigate = useNavigate();

  // Dummy data for "liked" prompts
  const likedPrompts = [
    {
      id: 'like1',
      user: 'sam',
      prompt: "There's something magical about the way you...",
      time: "5d"
    },
    {
      id: 'like2',
      user: 'sreeleela',
      prompt: "I never knew music could feel so personal until...",
      time: "3w"
    },
  ];

  
  return (
    <div className="min-h-screen bg-black text-white px-0 py-6 font-sans">
      {/* Top Section with padding */}
      <div className="px-2">
        {/* Header */}
        <button className="mb-5" onClick={() => navigate("/myscreen")}>
          <ArrowLeft className="text-white" size={24} />
        </button>
        <div className="flex items-center mb-6">
          <h1 className="text-2xl font-semibold">Real Happiness</h1>
        </div>
      </div>

      {/* Liked Prompts List */}
      <div className="flex flex-col">
        {likedPrompts.map((item) => (
          <div key={item.id} className="border-b border-gray-800 px-4 py-4">
            <p className="text-base text-gray-200 leading-relaxed">
              <span className="text-gray-500 font-semibold">&lt;{item.user}&gt;</span> liked the prompt sent - "{item.prompt}"{" "}
              <span className="text-gray-500 text-[10px]">• {item.time}</span>
            </p>
          </div>
        ))}

        
        
      </div>
    </div>
  );
}
