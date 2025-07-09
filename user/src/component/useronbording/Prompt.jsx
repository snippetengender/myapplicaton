import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Pencil } from 'lucide-react';

const prompts = [
  'I’m known for',
  'My simple please are',
  'I’m happiest when',
  'I’m wanna be a',
  'Stolen',
];

export default function PromptEditor() {
  const [activePrompt, setActivePrompt] = useState(null);
  const [inputValues, setInputValues] = useState({});

  const handlePromptClick = (index) => {
    setActivePrompt(index === activePrompt ? null : index);
  };

  const handleInputChange = (index, value) => {
    setInputValues({ ...inputValues, [index]: value });
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 py-6 flex flex-col justify-between">
      {/* Top Navigation */}
      <div>
        <button className="mb-5">
          <ArrowLeft className="text-white" size={24} />
        </button>

        {/* Heading */}
        <h1 className="text-2xl font-bold leading-snug">
          give a <br />
          <span className="font-bold">try with prompts</span>
        </h1>
        <p className="text-sm text-zinc-400 mt-3 mb-5 leading-relaxed">
          Lorem ipsum dolor sit amet consectetur. Pulvinar risus donec aenean
          tristique risus eu vitae felis. Donec lacus accumsan ultricies metus.
        </p>

        {/* Prompt Sections */}
        <div>
          {prompts.map((prompt, index) => (
            <div key={index} className="border-b border-zinc-800 py-4">
              {activePrompt === index ? (
                <div
                  className="transition-all duration-100  transform scale-95 ">
                  <div className="border border-zinc-600 p-3 rounded-lg">
                    <label className="block text-white mb-2 text-sm">
                      {prompt}
                    </label>
                    <textarea
                      rows={5}
                      maxLength={150}
                      placeholder="Open up now"
                      value={inputValues[index] || ''}
                      onChange={(e) => handleInputChange(index, e.target.value)}
                      className="w-full bg-transparent rounded-lg p-3 text-white placeholder-zinc-500 text-xl font-bold outline-none"
                    />
                    <div className="text-xs text-zinc-500 mt-1">
                      {inputValues[index]?.length || 0}/150
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className="flex justify-between items-center cursor-pointer transition duration-200 hover:bg-zinc-800 px-2 py-1 rounded"
                  onClick={() => handlePromptClick(index)}
                >
                  <p className="text-white text-sm">{prompt}</p>
                  <Pencil size={18} className="text-zinc-400" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Right Navigation */}
      <div className="flex justify-end mt-8">
        <button className="w-12 h-12 rounded-full bg-[#2e2e2e] flex items-center justify-center">
          <ArrowRight className="text-white" size={22} />
        </button>
      </div>
    </div>
  );
}
