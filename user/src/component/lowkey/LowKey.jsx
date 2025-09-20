import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function LowkeyProfile() {
  const [username, setUsername] = useState("");
  const [isTaken, setIsTaken] = useState(true); // simulate username taken

  return (
    <div className="min-h-screen bg-black text-white flex flex-col p-6 relative">
      {/* Back button */}
      <button className="absolute top-4 left-4">
        <ArrowLeft className="w-6 h-6" />
      </button>

      {/* Content */}
      <div className="flex flex-col flex-1 justify-center max-w-md mx-auto space-y-6">
        {/* Title */}
        <div>
          <h1 className="text-lg font-semibold">about</h1>
          <h2 className="text-2xl font-bold">lowkey profile</h2>
          <p className="text-gray-400 text-sm mt-2 leading-relaxed">
            Lorem ipsum dolor sit amet consectetur. Sit porta blandit montes
            cursus. Tempus accumsan mauris in cras sit.
          </p>
        </div>

        {/* Profile Icon */}
        <div className="flex">
          <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-black font-bold text-2xl">
            {"{u}"}
          </div>
        </div>

        {/* Username Input */}
        <div className="space-y-2">
          <label className="block text-gray-400 text-sm">
            give your lowkey profile a
          </label>
          <input
            type="text"
            value={username}
            maxLength={15}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="{username}"
            className="w-full bg-transparent border-b border-gray-600 focus:outline-none text-xl placeholder-gray-500"
          />
          <div className="flex justify-between text-gray-500 text-xs">
            <span>{username.length}/15</span>
          </div>

          {/* Error message */}
          {isTaken && (
            <p className="text-red-500 text-sm">sorry, username already taken</p>
          )}

          {/* Check Availability Button */}
          <button className="mt-2 px-4 py-1 border border-white rounded-full text-sm hover:bg-white hover:text-black transition">
            Check Availability
          </button>
        </div>
      </div>

      {/* Next Button (bottom right) */}
      <button className="absolute bottom-6 right-6 bg-gray-700 rounded-full p-4 hover:bg-gray-600 transition">
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
}
