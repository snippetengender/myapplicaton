// Filename: mobile_createnetwork_1.jsx

import React, { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function MobileCreateNetwork1() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('sorry, network title already taken');
  const navigate = useNavigate();

  // Next button navigates to page 2
  const handleNext = () => navigate('/mobile_createnetwork_2');
  
  // Back button navigates away from the flow
  const handleBack = () => navigate('/communitypage');

  return (
    <div className="bg-black text-[#E7E9EA] min-h-screen flex flex-col p-6 pb-10">
      {/* Header */}
      <header className="flex items-center justify-between w-full">
        <button 
          onClick={handleBack} 
          className="p-2 -ml-2 text-neutral-300 hover:text-[#E7E9EA] transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="bg-neutral-800 text-neutral-300 text-xs font-medium rounded-full px-3 py-1.5">
          1/3
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow w-full pt-4">
        <h1 className="text-2xl font-semibold text-[#E7E9EA] mb-2">
          About your Network
        </h1>
        <p className="text-xs text-neutral-400 leading-relaxed mb-6">
          Lorem ipsum dolor sit amet consectetur. Pulvinar risus donec aenean tristique risus eu vitae felis. Donec lacus accumsan ultricies metus.
        </p>
        
        {/* Title Input Section */}
        <div className="space-y-2">
          <label className="text-base text-[#E7E9EA]">
            give your network a
          </label>
          <div className="flex justify-between items-baseline mt-1">
            <div className="flex items-center text-2xl text-[#E7E9EA] flex-grow">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={15}
                placeholder="Title"
                className="w-full bg-transparent font-semibold placeholder:text-[#676767] focus:outline-none border-l-2 border-neutral-600 pl-1"
              />
            </div>
            <span className="text-xs text-[#E7E9EA] whitespace-nowrap ml-4">
              #15 character only for Title
            </span>
          </div>
        </div>
        
        {/* Description Textarea Section */}
        <div className="mt-4 space-y-1">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={500}
            className="w-full h-28 bg-transparent border border-neutral-700 rounded-xl p-4 text-base text-neutral-200 placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-neutral-500 resize-none transition-all"
            placeholder="Open up here now..."
          />
          <div className="px-1">
            <p className="text-left text-sm text-neutral-500">
              {description.length}/500
            </p>
            {error && (
              <p className="text-red-500 text-sm mt-1">{error}</p>
            )}
          </div>
        </div>

        {/* Note Section */}
        <div className="mt-10 text-xs text-neutral-400 leading-relaxed">
          <p>
            <span className="font-semibold text-neutral-300">Note:</span> Lorem ipsum dolor sit amet consectetur. Pulvinar risus donec aenean tristique risus eu vitae felis. Donec lacus accumsan ultricies metus.
          </p>
        </div>
      </main>

      {/* Fixed Footer Button */}
      <footer className="fixed bottom-6 right-6">
        <button
          onClick={handleNext}
          className="w-14 h-14 rounded-full bg-neutral-800 flex items-center justify-center hover:bg-neutral-700 transition-colors"
        >
          <ArrowRight size={24} className="text-[#E7E9EA]" />
        </button>
      </footer>
    </div>
  );
}