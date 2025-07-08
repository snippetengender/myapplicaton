import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Search } from 'lucide-react';

export default function InterestPage() {
  const allInterests = [
    'music', 'software', 'animae', 'dancing', 'yoga', 'dogs',
    'feminism', 'fire & camping', 'ilayaraja playlist', 'MR. Beast', 'cats', 'video',
  ];
  const [selectedInterests, setSelectedInterests] = useState(['music']);
  const [search, setSearch] = useState('');

  const toggleInterest = (item) => {
    if (selectedInterests.includes(item)) {
      setSelectedInterests(selectedInterests.filter(i => i !== item));
    } else {
      if (selectedInterests.length < 3) {
        setSelectedInterests([...selectedInterests, item]);
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 py-6 flex flex-col justify-between">
      <div>
        {/* Back Arrow */}
        <button className="mb-6">
          <ArrowLeft className="text-white" size={24} />
        </button>

        {/* Headings */}
        <h1 className="text-2xl font-bold leading-tight">
          What you're into <br /> Leeus start with your Interest
        </h1>
        <p className="text-sm text-zinc-300 mt-3 mb-4 leading-relaxed">
          Lorem ipsum dolor sit amet consectetur. Pulvinar risus donec aenean
          tristique risus eu vitae felis. Donec lacus accumsan ultricies metus.
        </p>

        {/* Search Box */}
        <div className="flex items-center gap-2 border border-zinc-600 rounded-md px-3 py-2">
          <Search className="text-zinc-400" size={18} />
          <input
            type="text"
            placeholder="search for interest"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none w-full text-sm text-white placeholder-zinc-500"
          />
        </div>

        {/* Selected Interests */}
        <div className="flex flex-wrap gap-2 mt-4">
          {selectedInterests.map((item) => (
            <span
              key={item}
              className="px-3 py-1 border border-[#F06CB7] rounded-full text-sm text-white"
            >
              {item}
            </span>
          ))}
        </div>

        {/* Suggestion Heading */}
        <p className="text-sm font-semibold mt-6 mb-2">Any 3 from here</p>

        {/* Tag Suggestions */}
        {/* Tag Suggestions */}
<div className="border border-dashed border-zinc-700 p-3 rounded-md">
  <div className="flex flex-wrap gap-2">
    {allInterests.map((item, idx) => (
      <button
        key={`${item}-${idx}`}
        onClick={() => toggleInterest(item)}
        className={`px-3 py-1 rounded-full text-sm border transition ${
          selectedInterests.includes(item)
            ? 'border-[#F06CB7] text-white'
            : 'border-zinc-500 text-zinc-300'
        }`}
      >
        {item}
      </button>
    ))}
  </div>
</div>

      </div>

      {/* Bottom Section */}
      <div className="flex items-center justify-between mt-6">
        <p className="text-sm text-zinc-400">
          Can’t find your Interest?{' '}
          <span className="text-[#F06CB7] cursor-pointer">Add em</span>
        </p>
        <button className="w-12 h-12 rounded-full bg-[#2e2e2e] flex items-center justify-center">
          <ArrowRight className="text-white" size={22} />
        </button>
      </div>
    </div>
  );
}
