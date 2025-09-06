import React from 'react';
import { ArrowLeft } from 'lucide-react';

// Main component for the "Edit Network" mobile screen
const EditNetworkPageMobile = () => {
  // State for the input fields to make them controlled components
  const [networkName, setNetworkName] = React.useState('');
  const [description, setDescription] = React.useState('');

  return (
    <div className="min-h-screen bg-black text-[#E7E9EA] p-4 font-sans flex flex-col">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <button className="p-1">
          {/* Back Arrow Icon */}
          <ArrowLeft size={24} />
        </button>
        <button className="bg-[#2A2A2A] text-gray-300 px-5 py-2 rounded-full text-sm font-semibold">
          Save
        </button>
      </div>

      {/* Page Title */}
      <h1 className="text-2xl font-bold mb-2">Edit network</h1>

      {/* Page Description */}
      <p className="text-sm text-gray-400 leading-relaxed mb-8">
        Lorem ipsum dolor sit amet consectetur. Pulvinar risus donec aenean tristique risus eu vitae felis. Donec lacus accumsan ultricies metus.
      </p>

      {/* Form Section */}
      <div className="space-y-6">
        {/* Network Name Input */}
        <div>
          <label htmlFor="networkName" className="text-xs text-gray-400 mb-2 block">Network Name</label>
          <input
            type="text"
            id="networkName"
            value={networkName}
            onChange={(e) => setNetworkName(e.target.value)}
            maxLength={15}
            className="w-full bg-transparent border-b border-gray-700 focus:outline-none focus:border-gray-400 pb-1 text-base"
          />
          <p className="text-right text-xs text-gray-500 mt-1">
            {networkName.length}/15
          </p>
        </div>

        {/* Description Input */}
        <div>
          <label htmlFor="description" className="text-xs text-gray-400 mb-2 block">Description</label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={500}
            className="w-full bg-transparent border-b border-gray-700 focus:outline-none focus:border-gray-400 pb-1 text-base"
          />
          <p className="text-right text-xs text-gray-500 mt-1">
            {description.length}/500
          </p>
        </div>
      </div>

      {/* Preview Section - UPDATED */}
      <div className="mt-8">
        <h2 className="text-base font-semibold mb-4">Preview</h2>
        <div className="bg-black border border-gray-600 rounded-2xl p-4 relative">
          <div className='mt-20'><button className="absolute top-4 right-4 text-xs bg-black text-[#E7E9EA] px-4 py-1 rounded-full border border-gray-500">
            edit banner
          </button></div>
          <div>
            
          <div className="flex items-center space-x-3 mb-3 border-t border-gray-600 pt-3">
            {/* Pencil Icon Container */}
            <div className="bg-[#D9D9D9] w-12 h-12 rounded-full flex items-center justify-center ">
              {/* SVG Pencil Icon */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25ZM20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z" fill="#333333"/>
              </svg>
            </div>
            <span className="font-bold text-lg">{networkName}</span>
          </div>
          <p className="text-sm text-[#E7E9EA] mt-3 leading-relaxed">
            Lorem ipsum dolor sit amet consectetur. Pulvinar risus donec aenean tristique risus eu vitae felis. Donec lacus accumsan ultricies metus.
          </p>
          </div>
          
          
          
          
          
        </div>
      </div>
    </div>
  );
};

export default EditNetworkPageMobile;
