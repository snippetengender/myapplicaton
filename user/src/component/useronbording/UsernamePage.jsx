import React, { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function UsernamePage() {
  const [username, setUsername] = useState('');
  const [isTaken, setIsTaken] = useState(true); // Simulating taken status

  const handleCheckAvailability = () => {
    // Simulate username availability check
    setIsTaken(username.toLowerCase() === 'taken'); // simple mock logic
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 py-6 flex flex-col justify-between">
      <div>
        {/* Back Button */}
        <button className="mb-6">
          <ArrowLeft className="text-white" size={24} />
        </button>

        {/* Heading */}
        <h1 className="text-2xl font-bold leading-tight mb-6">
          Profile and Username <br /> Stuffs
        </h1>

        {/* Profile Placeholder */}
        <div className="w-20 h-20 rounded-full bg-zinc-300 mx-2 mb-5"></div>

        {/* Username Prompt */}
        <p className="text-sm text-zinc-400 mb-6 ">give it a try for username</p>

        {/* Username Input (custom style like the screenshot) */}
        <div className="w-full border-l-4 border-white pl-3 mb-3">
          <input
            type="text"
            placeholder="<username>"
            maxLength={15}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="bg-transparent text-xl font-bold outline-none w-full placeholder:text-zinc-600"
          />
        </div>

        {/* Character Count */}
        <p className="text-xs text-zinc-500 mb-4">{username.length}/15</p>

        {/* Error Message */}
        {isTaken && username && (
          <p className="text-sm text-red-400 mb-3">sorry, username already taken</p>
        )}

        {/* Check Availability Button */}
        <button
          onClick={handleCheckAvailability}
          className="border border-white text-white text-xs px-4 py-1 rounded-full"
        >
          Check Availability
        </button>
      </div>

      {/* Next Button */}
      <div className="flex justify-end mt-10 mb-4">
        <button className="w-12 h-12 rounded-full bg-[#2e2e2e] flex items-center justify-center">
          <ArrowRight className="text-white" size={22} />
        </button>
      </div>
    </div>
  );
}
