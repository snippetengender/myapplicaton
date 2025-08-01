// Filename: mobile_createnetwork_3.jsx

import { useState } from "react";
import { Search, ArrowRight, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MobileCreateNetwork3() {
  const [selectedTags, setSelectedTags] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const interests = [
    "music", "software", "animae", "dancing",
    "yoga", "dogs", "feminism", "fire & camping",
    "ilayaraja playlist", "MR. Beast", "cats", "video"
  ];

  const toggleTag = (item) => {
    setSelectedTags(prevTags => 
      prevTags.includes(item)
        ? prevTags.filter((tag) => tag !== item)
        : [...prevTags, item]
    );
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 pt-6 pb-28">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        {/* CORRECTED: Back button now navigates to page 2 */}
        <button onClick={() => navigate('/mobile_createnetwork_2')} className="p-2 -ml-2">
          <ArrowLeft className="w-6 h-6 text-neutral-300" />
        </button>
        <span className="ml-auto bg-[#2F3336] px-3 py-1 rounded-full text-sm text-neutral-300">3/3</span>
      </div>
      <h2 className="text-lg font-semibold">Network interest</h2>
      <p className="text-gray-400 text-sm mb-4">
        Lorem ipsum dolor sit amet consectetur. Pulvinar risus donec aenean tristique risus eu vitae felis. Donec lacus accumsan ultricies metus.
      </p>

      {/* Search Input */}
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="search for interest"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#111111] rounded-md border border-[#333] pl-10 pr-3 py-2 text-sm focus:outline-none"
        />
      </div>

      {/* Interest options */}
      <p className="text-sm text-gray-400 mb-2">Any 1 from here</p>
      <div className="flex flex-wrap gap-2">
        {interests.map((item) => {
          const isSelected = selectedTags.includes(item);
          return (
            <button
              key={item}
              onClick={() => toggleTag(item)}
              className={`px-3 py-1 rounded-full text-sm border transition-colors duration-200 ${
                isSelected ? 'border-pink-500 text-pink-500' : 'border-neutral-700 text-neutral-400'
              }`}
            >
              {item}
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 flex items-center justify-between bg-black px-6 py-4 border-t border-transparent">
        <p className="text-md">
          <span className="text-neutral-200">Can’t find your Interest? </span>
          <button className="text-[#F06CB7] font-medium hover:underline">
            Add em
          </button>
        </p>
        <button
          className="w-12 h-12 rounded-full bg-[#2e2e2e] flex items-center justify-center"
          onClick={() => navigate("/communitypage")}
        >
          <ArrowRight size={22} className="text-white" />
        </button>
      </footer>
    </div>
  );
}