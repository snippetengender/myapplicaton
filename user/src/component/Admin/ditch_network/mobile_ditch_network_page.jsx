import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

// Main component for the "Ditch Network" mobile screen
const DitchNetworkPageMobile = () => {
  // State to manage the input field's value
  const [networkName, setNetworkName] = useState('');
  // State to control the visibility of the success message
  const [isDeleted, setIsDeleted] = useState(false);

  // Function to handle the button click
  const handleDitchNetwork = () => {
    if (networkName.trim()) {
      // In a real app, you would have API call logic here
      console.log(`Ditching network: ${networkName}`);
      setIsDeleted(true);
    }
  };

  return (
    <div className="min-h-screen bg-black text-[#E7E9EA] p-4 font-sans flex flex-col">
      {/* Header Section */}
      <div className="flex items-center mb-6">
        <button className="p-1">
          {/* Back Arrow Icon */}
          <ArrowLeft size={24} />
        </button>
      </div>

      <div className="max-w-md">
        {/* Page Title */}
        <h1 className="text-2xl font-bold mb-4">Ditch Network</h1>

        {/* Page Description */}
        <p className="text-sm text-gray-400 leading-relaxed mb-8">
          Lorem ipsum dolor sit amet consectetur. Pulvinar risus donec aenean tristique risus eu vitae felis. Donec lacus accumsan ultricies metus.
        </p>

        {/* Network Name Input */}
        <div className="mb-4">
          <input
            type="text"
            value={networkName}
            onChange={(e) => setNetworkName(e.target.value)}
            placeholder="type your network name"
            className="w-full bg-transparent border border-gray-700 rounded-lg px-4 py-3 text-sm placeholder-gray-500 focus:outline-none focus:border-gray-400"
          />
        </div>

        {/* Ditch Network Button */}
        <button 
          onClick={() => navigate('/finalpage')}
          className="w-full bg-[#2A2A2A] text-[#E7E9EA] px-6 py-3 rounded-lg text-sm font-semibold hover:bg-gray-700 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed"
          disabled={!networkName.trim()}
        >
          Ditch Network
        </button>

        {/* Success Message */}
        {isDeleted && (
          <p className="mt-6 text-green-500 font-mono text-sm">
            &gt;&gt;&gt; Network Deleted Successfully
          </p>
        )}
      </div>
    </div>
  );
};

export default DitchNetworkPageMobile;
