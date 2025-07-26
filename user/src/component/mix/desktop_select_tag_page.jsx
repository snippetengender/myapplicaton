import React, { useState } from "react";
import Header from "../desktop_components/Header";
import LeftSidebar from "../desktop_components/LeftSidebar";
import RightSidebar from "../desktop_components/RightSidebar";
import { useNavigate } from "react-router-dom";
const tags = [
  "confession",
  "question",
  "academics",
  "showoff",
  "polls",
  "jusssaying",
  "moments",
];

export default function Dashboard() {
  const [selectedTag, setSelectedTag] = useState("");
  const [text, setText] = useState("");
  const navigate = useNavigate();
  const isPostEnabled = selectedTag && text.trim().length > 0;

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <Header />
      <div className="flex">
        <LeftSidebar />

        <main className="flex-1 px-10 py-6 overflow-y-auto">
          <h2 className="text-2xl font-bold mb-2">Yeah, open up</h2>
          <p className="text-gray-400 mb-4">
            Lorem ipsum dolor sit amet consectetur. Pulvinar risus donec aenean
            tristique risus eu vitae felis. Donec lacus accumsan ultricies
            metus.
          </p>

          <div className="bg-[#2e2e2e] text-zinc-400 px-4 py-3 rounded-xl mb-4 flex items-center gap-3 border border-dashed border-zinc-500">
            <div className="w-5 h-5 rounded-full border border-dashed border-zinc-400" />
            <span className="text-sm">Select a Network</span>
          </div>

          <div className="flex flex-wrap gap-3 mb-4">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() =>
                  setSelectedTag((prev) => (prev === tag ? "" : tag))
                }
                className={`px-4 py-1 rounded-full border ${
                  selectedTag === tag
                    ? "border-[#F06CB7] text-white"
                    : "border-zinc-500 text-zinc-300"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          <div className="relative">
            <textarea
              placeholder="Open up here now..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={200}
              className="w-full h-32 bg-transparent border border-gray-700 rounded-xl p-4 text-white placeholder-gray-500 resize-none"
            />
            <span className="absolute bottom-2 right-4 text-gray-500 text-sm">
              {text.length}/200
            </span>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              disabled={!isPostEnabled}
              className={`px-6 py-2 rounded-full font-semibold ${
                isPostEnabled
                  ? "bg-white text-black"
                  : "bg-[#2F3336] text-gray-500 cursor-not-allowed"
              }`}
              onClick={() => {
              if (isPostEnabled) {
                // Handle post submission logic here
                console.log('Post submitted with tag:', selectedTag, 'and text:', text);
                navigate("/home"); // Redirect after posting
              }
            }}
            >
              Post
            </button>
          </div>
        </main>

        <RightSidebar />
      </div>
    </div>
  );
}
