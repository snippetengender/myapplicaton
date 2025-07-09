import React, { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function RelationshipStatusPage() {
  const [status, setStatus] = useState('');

  const options = ['Taken', 'Single', 'Prefer not to say'];

  return (
    <div className="min-h-screen bg-black text-white px-5 py-6 flex flex-col justify-between">
      <div>
        {/* Back Arrow */}
        <button className="mb-6">
          <ArrowLeft className="text-white" size={24} />
        </button>

        {/* Headings */}
        <h1 className="text-2xl font-bold leading-tight">
          BRAVO, leeus jump into <br /> Relationship Status
        </h1>
        <p className="text-sm text-zinc-400 mt-3 mb-6 leading-relaxed">
          Lorem ipsum dolor sit amet consectetur. Pulvinar risus donec aenean
          tristique risus eu vitae felis. Donec lacus accumsan ultricies metus.
        </p>

        {/* Options */}
        {options.map((opt) => (
          <label
            key={opt}
            className="flex items-center justify-between py-3 text-3xl font-bold text-zinc-400"
          >
            {opt}
            <input
              type="radio"
              name="relationship"
              value={opt}
              checked={status === opt}
              onChange={() => setStatus(opt)}
              className="w-5 h-5 accent-white"
            />
          </label>
        ))}
      </div>

      {/* Bottom Next Button */}
      <div className="flex justify-end mt-10">
        <button className="w-14 h-14 rounded-full bg-[#2e2e2e] flex items-center justify-center">
          <ArrowRight className="text-white" size={22} />
        </button>
      </div>
    </div>
  );
}
