import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, Search } from "lucide-react";
import Header from "../desktop_components/Header";
import LeftSidebar from "../desktop_components/LeftSidebar";
import RightSidebar from "../desktop_components/RightSidebar";

// --- Mock Data ---
const tags = [
  "confession",
  "question",
  "academics",
  "showoff",
  "polls",
  "jusssaying",
  "moments",
];
const availableNetworks = [
  { id: 1, name: "something", topic: "Music" },
  { id: 2, name: "React Developers", topic: "Technology" },
  { id: 3, name: "Gamers Unite", topic: "Gaming" },
  { id: 4, name: "Book Club", topic: "Literature" },
];
// -----------------

// --- Network Selection Popup Component ---
const NetworkSelectionPopup = ({ onClose, onSelectNetwork, triggerRef }) => {
  const popupRef = useRef(null);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });

  useEffect(() => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY + 8, // Position below the button
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [triggerRef]);

  // Close popup if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      ref={popupRef}
      className="absolute bg-[#1d1d1d] border border-zinc-700 text-[#E7E9EA] z-30 p-4 rounded-lg shadow-lg"
      style={{ top: position.top, left: position.left, width: position.width }}
    >
      <div className="relative mb-4">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
          size={18}
        />
        <input
          type="text"
          placeholder="Search for network"
          className="w-full bg-black border border-zinc-600 rounded-md pl-9 pr-3 py-1.5 text-sm placeholder-zinc-500"
        />
      </div>
      <div className="max-h-60 overflow-y-auto">
        {availableNetworks.map((network) => (
          <div
            key={network.id}
            className="flex items-center gap-3 p-2 cursor-pointer hover:bg-gray-800 rounded-md"
            onClick={() => onSelectNetwork(network)}
          >
            <div className="w-8 h-8 bg-zinc-300 rounded-full flex-shrink-0" />
            <div>
              <p className="font-semibold text-sm">{network.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function Dashboard() {
  // Poll state
  const [pollOptions, setPollOptions] = useState([]);
  const [newOption, setNewOption] = useState("");

  const addPollOption = () => {
    if (newOption.trim() && newOption.length <= 50) {
      setPollOptions([...pollOptions, newOption.trim()]);
      setNewOption("");
    }
  };
  const removePollOption = (index) => {
    setPollOptions(pollOptions.filter((_, i) => i !== index));
  };

  const [selectedTag, setSelectedTag] = useState("");
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState(null);
  const navigate = useNavigate();
  const networkButtonRef = useRef(null);

  const isPostEnabled =
    selectedNetwork &&
    selectedTag &&
    (title.trim().length > 0 || text.trim().length > 0 || pollOptions.length > 0);

  const handleSelectNetwork = (network) => {
    setSelectedNetwork(network);
    setIsPopupOpen(false);
  };

  const handleResetNetwork = () => {
    setSelectedNetwork(null);
    setTitle("");
    setText("");
    setPollOptions([]);
    setSelectedTag("");
  };

  return (
    <div className="min-h-screen bg-black text-[#E7E9EA] font-sans">
      {isPopupOpen && (
        <NetworkSelectionPopup
          onClose={() => setIsPopupOpen(false)}
          onSelectNetwork={handleSelectNetwork}
          triggerRef={networkButtonRef}
        />
      )}
      <Header />
      <div className="flex">
        <LeftSidebar />

        <main className="flex-1 px-10 py-6 overflow-y-auto ml-10 mr-64 pt-20">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold mb-2">Yeah, open up</h2>
            <p className="text-gray-400 mb-6">
              Lorem ipsum dolor sit amet consectetur. Pulvinar risus donec aenean
              tristique risus eu vitae felis. Donec lacus accumsan ultricies metus.
            </p>

            {/* Select Network */}
            <div
              ref={networkButtonRef}
              onClick={() => !selectedNetwork && setIsPopupOpen(true)}
              className={`bg-[#1d1d1d] px-4 py-3 rounded-xl mb-4 flex items-center gap-3 border border-zinc-700 ${
                !selectedNetwork ? "cursor-pointer" : ""
              }`}
            >
              {!selectedNetwork ? (
                <>
                  <div className="w-5 h-5 rounded-full bg-zinc-700" />
                  <span className="text-sm text-zinc-400">Select a Network</span>
                </>
              ) : (
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-500" />
                    <span className="text-sm font-semibold text-[#E7E9EA]">
                      {selectedNetwork.name}
                    </span>
                  </div>
                  <button
                    onClick={handleResetNetwork}
                    className="text-sm text-zinc-400 hover:text-[#E7E9EA]"
                  >
                    Reset
                  </button>
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-3 mb-6">
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() =>
                    setSelectedTag((prev) => (prev === tag ? "" : tag))
                  }
                  className={`px-4 py-1 rounded-full border text-sm ${
                    selectedTag === tag
                      ? "border-zinc-300 text-[#E7E9EA]"
                      : "border-zinc-700 text-zinc-400"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Content area */}
            {!selectedNetwork ? (
              // no network selected
              <div className="relative">
                <textarea
                  placeholder="Open up here now..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  maxLength={200}
                  className="w-full h-32 bg-transparent border border-gray-700 rounded-xl p-4 text-[#E7E9EA] placeholder-gray-500 resize-none"
                />
                <span className="absolute bottom-2 right-4 text-gray-500 text-sm">
                  {text.length}/200
                </span>
              </div>
            ) : selectedTag === "polls" ? (
              // Poll flow
              <div className="space-y-6">
                {/* Poll Question */}
                <div>
                  <p className="text-sm text-zinc-400 mb-2">Poll Question</p>
                  <input
                    type="text"
                    placeholder="Which social media application is used by college students the most?"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={200}
                    className="w-full bg-transparent border-b border-zinc-700 focus:outline-none text-lg font-semibold placeholder-zinc-600 pb-1"
                  />
                  <span className="text-xs text-gray-500">
                    {title.length}/200
                  </span>
                </div>

                {/* Poll Options */}
                <div className="space-y-3">
                  {pollOptions.map((opt, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 bg-[#1d1d1d] px-3 py-2 rounded-lg border border-zinc-700"
                    >
                      <span className="flex-1 text-white text-sm">{opt}</span>
                      <button
                        onClick={() => removePollOption(i)}
                        className="text-zinc-400 hover:text-red-400"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Add Option"
                      value={newOption}
                      onChange={(e) => setNewOption(e.target.value)}
                      maxLength={50}
                      className="flex-1 bg-transparent border border-zinc-700 rounded-lg px-3 py-2 text-sm placeholder-zinc-500"
                    />
                    <button
                      onClick={addPollOption}
                      className="px-3 py-2 text-sm rounded-lg border border-zinc-600 hover:bg-zinc-800"
                    >
                      add
                    </button>
                  </div>
                  <span className="text-xs text-gray-500">
                    {newOption.length}/50
                  </span>
                </div>
              </div>
            ) : (
              // Normal post flow
              <div className="space-y-8">
                <div>
                  <p className="text-sm text-zinc-400 mb-2">give your thought a</p>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      maxLength={100}
                      className="w-full bg-transparent focus:outline-none text-2xl font-bold placeholder-zinc-600 pb-1"
                    />
                    <span className="absolute -bottom-5 right-0 text-gray-500 text-sm">
                      {title.length}/100
                    </span>
                  </div>
                </div>
                <div className="relative">
                  <textarea
                    placeholder="Open up here now..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    maxLength={1000}
                    className="w-full h-40 bg-transparent border border-gray-700 rounded-xl p-4 text-[#E7E9EA] placeholder-gray-500 resize-none"
                  />
                  <span className="absolute bottom-2 right-4 text-gray-500 text-sm">
                    {text.length}/1000
                  </span>
                </div>
              </div>
            )}

            {/* Post button */}
            <div className="mt-6 flex justify-end">
              <button
                disabled={!isPostEnabled}
                className={`px-6 py-2 rounded-full font-semibold ${
                  isPostEnabled
                    ? "bg-white text-black"
                    : "bg-[#1d1d1d] text-gray-500 cursor-not-allowed"
                }`}
              >
                Post
              </button>
            </div>
          </div>
        </main>

        <RightSidebar />
      </div>
    </div>
  );
}
