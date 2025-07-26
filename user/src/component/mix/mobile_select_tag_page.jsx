import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const availableTags = [
  'confession', 'question', 'academics',
  'jusssaying', 'polls', 'showoff', 'moments',
];

export default function TagSelectorPage() {
  const [selectedTag, setSelectedTag] = useState(null);
  const [text, setText] = useState('');
  const navigate = useNavigate();
  const canPost = selectedTag && text.trim().length > 0;

  return (
    <div className="min-h-screen bg-black text-white p-4 flex flex-col justify-between">
      <div>
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <button>
            <ArrowLeft className="text-white" size={24} onClick={() => navigate("/home")} />
          </button>
          <button
            disabled={!canPost}
            className={`px-4 py-1 rounded-full text-sm transition ${
              canPost
                ? 'bg-white text-black'
                : 'bg-[#2e2e2e] text-zinc-500 cursor-not-allowed'
            }`}
            onClick={() => {
              if (canPost) {
                // Handle post submission logic here
                console.log('Post submitted with tag:', selectedTag, 'and text:', text);
                navigate("/home"); // Redirect after posting
              }
            }}
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

        {/* Select a Network Box */}
        <div className="bg-[#2e2e2e] text-zinc-400 px-4 py-3 rounded-xl mb-4 flex items-center gap-3 border border-dashed border-zinc-500">
          <div className="w-5 h-5 rounded-full border border-dashed border-zinc-400" />
          <span className="text-sm">Select a Network</span>
        </div>

        {/* Tag Buttons */}
        <div className="flex flex-wrap gap-2 mb-6">
          {availableTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-4 py-1 rounded-full border text-sm transition ${
                selectedTag === tag
                  ? 'border-[#F06CB7] text-white'
                  : 'border-zinc-500 text-zinc-300'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Text Area */}
        <div className="relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Open up here now..."
            maxLength={200}
            className="w-full h-32 p-3 bg-transparent border border-zinc-700 rounded-lg resize-none outline-none text-sm placeholder-zinc-500 text-white"
          />
          <span className="absolute bottom-2 right-3 text-xs text-zinc-500">
            {text.length}/200
          </span>
        </div>

        {/* Note */}
        <p className="text-xs text-zinc-400 mt-2">
          Note : You will get more character count when you select a network
        </p>
      </div>

      {/* Footer */}
      <p className="text-xs text-zinc-500 text-center mt-8">
        Know Lorem ipsum dolor sit amet consectetur. Pulvinar risus donec aenean
        tristique risus eu vitae felis. Donec lacus acc
      </p>
    </div>
  );
}
