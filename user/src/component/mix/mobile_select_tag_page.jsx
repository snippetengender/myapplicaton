import React, { useState } from 'react';
import { ArrowLeft, X, Search } from 'lucide-react';
import { useNavigate } from "react-router-dom";

// --- Mock Data ---
const availableTags = [
  'confession', 'question', 'academics',
  'jusssaying', 'polls', 'showoff', 'moments',
];

const availableNetworks = [
  { id: 1, name: 'something', topic: 'Music' },
  { id: 2, name: 'something', topic: 'Music' },
  { id: 3, name: 'something', topic: 'Music' },
  { id: 4, name: 'something', topic: 'Music' },
];

// --- Network Selection Modal Component ---
const NetworkSelectionModal = ({ onClose, onSelectNetwork }) => {
  return (
    <div className="fixed inset-0 bg-black text-white z-50 p-4 flex flex-col">
      {/* Modal Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-1">
            <X size={24} />
          </button>
          <h1 className="text-2xl font-bold">Post to</h1>
        </div>
        <button className="text-sm border border-zinc-500 px-3 py-1 rounded-full">
          establish your own network
        </button>
      </div>
      
      {/* Description */}
      <p className="text-sm text-zinc-300 leading-relaxed mb-6">
        Lorem ipsum dolor sit amet consectetur. Pulvinar risus donec aenean
        tristique risus eu vitae felis. Donec lacus accumsan ultricies metus.
      </p>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
        <input 
          type="text"
          placeholder="search for network"
          className="w-full bg-transparent border border-zinc-700 rounded-lg pl-10 pr-4 py-2 text-sm placeholder-zinc-500"
        />
      </div>

      {/* Network List */}
      <div className="flex-1 overflow-y-auto">
        {availableNetworks.map((network) => (
          <div 
            key={network.id} 
            className="flex items-center gap-4 py-3 cursor-pointer"
            onClick={() => onSelectNetwork(network)}
          >
            <div className="w-12 h-12 bg-zinc-300 rounded-full" />
            <div>
              <p className="font-semibold">{network.name}</p>
              <p className="text-sm text-zinc-400">talks about <span className="font-semibold text-white">{network.topic}</span></p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


// --- Main Page Component ---
export default function TagSelectorPage() {
  const [selectedTag, setSelectedTag] = useState(null);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState(null);

  const navigate = useNavigate();

  // Post button is enabled only if a tag, network, and title are selected.
  const canPost = selectedTag && selectedNetwork && title.trim().length > 0;

  const handleSelectNetwork = (network) => {
    setSelectedNetwork(network);
    setIsModalOpen(false);
  };

  return (
    <>
      {isModalOpen && <NetworkSelectionModal onClose={() => setIsModalOpen(false)} onSelectNetwork={handleSelectNetwork} />}
      
      <div className="min-h-screen bg-black text-white p-4 flex flex-col justify-between">
        <div>
          {/* Top bar */}
          <div className="flex items-center justify-between">
            <button onClick={() => navigate("/home")}>
              <ArrowLeft className="text-white" size={24} />
            </button>
            <button
              disabled={!canPost}
              className={`px-4 py-1 rounded-full text-sm transition ${
                canPost
                  ? 'bg-white text-black'
                  : 'bg-[#2e2e2e] text-zinc-500 cursor-not-allowed'
              }`}
            >
              Post
            </button>
          </div>

          {/* Headings */}
          <h1 className="text-2xl font-bold mt-6 mb-2">Select a Tag</h1>
          <p className="text-sm text-zinc-300 leading-relaxed mb-6">
            Lorem ipsum dolor sit amet consectetur. Pulvinar risus donec aenean
            tristique risus eu vitae felis. Donec lacus accumsan ultricies metus.
          </p>

          {/* --- Conditional Network Box --- */}
          {!selectedNetwork ? (
            <div 
              className="bg-[#2e2e2e] text-zinc-400 px-4 py-3 rounded-xl mb-4 flex items-center gap-3 border border-dashed border-zinc-500 cursor-pointer"
              onClick={() => setIsModalOpen(true)}
            >
              <div className="w-5 h-5 rounded-full border border-dashed border-zinc-400" />
              <span className="text-sm">Select a Network</span>
            </div>
          ) : (
            <div className="bg-[#2e2e2e] text-white px-4 py-3 rounded-xl mb-4 flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-zinc-300" />
              <span className="text-sm font-semibold">{selectedNetwork.name}</span>
            </div>
          )}

          {/* Tag Buttons */}
          <div className="flex flex-wrap gap-2 mb-6">
            {availableTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-4 py-1 rounded-full border text-sm transition ${
                  selectedTag === tag
                    ? 'border-zinc-300 text-white'
                    : 'border-zinc-700 text-zinc-400'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* --- Conditional Text Inputs --- */}
          {!selectedNetwork ? (
            <>
              <div className="relative">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Open up here now..."
                  maxLength={200}
                  className="w-full h-32 p-3 bg-transparent border border-zinc-700 rounded-lg resize-none outline-none text-sm placeholder-zinc-500"
                />
                <span className="absolute bottom-2 right-3 text-xs text-zinc-500">
                  {text.length}/200
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-2">
                Note : You will get more character count when you select a network
              </p>
            </>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-zinc-400">give your thought a</p>
              {/* Title Input */}
              <div className="relative">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Title"
                  maxLength={100}
                  className="w-full bg-transparent border-b border-zinc-700 focus:outline-none text-2xl font-bold placeholder-zinc-600 pb-1"
                />
                <span className="absolute -bottom-5 right-0 text-xs text-zinc-500">
                  {title.length}/100
                </span>
              </div>
              {/* Description Text Area */}
              <div className="relative pt-4">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Open up here now..."
                  maxLength={1000}
                  className="w-full h-40 p-3 bg-transparent border border-zinc-700 rounded-lg resize-none outline-none text-sm placeholder-zinc-500"
                />
                <span className="absolute bottom-2 right-3 text-xs text-zinc-500">
                  {text.length}/1000
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-xs text-zinc-500 text-center mt-8">
          Know Lorem ipsum dolor sit amet consectetur. Pulvinar risus donec aenean
          tristique risus eu vitae felis. Donec lacus acc
        </p>
      </div>
    </>
  );
}
