import React, { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function CreatingNetworkPage1({ onNext }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const isButtonDisabled = title.trim() === '' || description.trim() === '';

  return (
    <div className="text-[#E7E9EA] px-0 py-0 flex flex-col justify-between">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <ArrowLeft className="text-[#E7E9EA]" />
          <div className="bg-[#2E2E2E] text-xs text-[#E7E9EA] px-3 py-1 rounded-full">1/3</div>
        </div>

        {/* Title and Description */}
        <div className="mt-6">
          <h1 className="text-2xl font-semibold">About your Network</h1>
          <p className="text-sm text-gray-300 mt-2 leading-relaxed">
            Lorem ipsum dolor sit amet consectetur. Pulvinar risus donec aenean
            tristique risus eu vitae felis. Donec lacus accumsan ultricies metus.
          </p>
        </div>

        {/* Form */}
        <div className="mt-6">
          <p className="text-sm text-[#E7E9EA] mb-1">give your network a</p>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-transparent border-b border-gray-700 text-xl font-semibold placeholder-gray-500 outline-none py-2"
          />
          <div className="mt-6">
            <textarea
              rows="4"
              maxLength="500"
              placeholder="Open up here now..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-transparent text-[#E7E9EA] placeholder-gray-500 border border-gray-700 rounded-xl p-4 resize-none outline-none"
            ></textarea>
            <div className="text-xs text-gray-500 mt-2">
              {description.length}/500
            </div>
          </div>
        </div>

        {/* Next Button */}
        <div className="flex justify-end mt-6">
          <button
            onClick={onNext}
            disabled={isButtonDisabled}
            className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm ${
              isButtonDisabled
                ? 'bg-[#2E2E2E] text-gray-400 cursor-not-allowed'
                : 'bg-[#2E2E2E] text-[#E7E9EA]'
            }`}
          >
            next <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
