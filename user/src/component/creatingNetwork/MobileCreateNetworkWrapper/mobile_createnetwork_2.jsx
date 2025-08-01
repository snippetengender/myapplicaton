// Filename: mobile_createnetwork_2.jsx

import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function MobileCreateNetwork2() {
  const navigate = useNavigate();

  // CORRECTED: Next button now navigates to page 3
  const handleNext = () => navigate('/mobile_createnetwork_3'); 
  
  // CORRECTED: Back button now navigates to page 1
  const handleBack = () => navigate('/mobile_createnetwork_1');

  return (
    <div className="bg-black text-white min-h-screen flex flex-col p-6 pb-28">
      {/* Header */}
      <header className="flex items-center justify-between w-full mb-6">
        <button 
          onClick={handleBack} 
          className="p-2 -ml-2 text-neutral-300 hover:text-white transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="bg-neutral-800 text-neutral-300 text-xs font-medium rounded-full px-3 py-1.5">
          2/3
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full">
        <h1 className="text-2xl font-semibold text-white mb-2">
          Style your Network
        </h1>
        <p className="text-xs text-neutral-400 leading-relaxed mb-8">
          Lorem ipsum dolor sit amet consectetur. Pulvinar risus donec aenean tristique risus eu vitae felis. Donec lacus accumsan ultricies metus.
        </p>

        {/* Profile Preview Card */}
        <div className="bg-black border border-neutral-800 rounded-2xl p-4 space-y-4">
          <div className="flex justify-end">
            <button className="text-xs border border-neutral-600 rounded-md px-3 py-1.5 hover:bg-neutral-800 transition-colors">
              add banner
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-neutral-200 rounded-full flex-shrink-0"></div>
            <span className="font-semibold text-lg text-white">something</span>
          </div>
          <p className="text-sm text-neutral-400 leading-relaxed">
            Lorem ipsum dolor sit amet consectetur. Pulvinar risus donec aenean tristique risus eu vitae felis. Donec lacus accumsan ultricies metus.
          </p>
        </div>
      </main>

      {/* Fixed Footer Button */}
      <footer className="fixed bottom-6 right-6">
        <button
          onClick={handleNext}
          className="w-14 h-14 rounded-full bg-neutral-800 flex items-center justify-center hover:bg-neutral-700 transition-colors"
        >
          <ArrowRight size={24} className="text-white" />
        </button>
      </footer>
    </div>
  );
}