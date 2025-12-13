import React, { useState } from "react";
import Header from "../../desktop_components/Header";
import LeftSidebar from "../../desktop_components/LeftSidebar";
import RightSidebar from "../../desktop_components/RightSidebar";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  // State for the input fields to make them functional
  const [networkName, setNetworkName] = useState('something');
  const [description, setDescription] = useState('Lorem ipsum dolor sit amet consectetur.');

  return (
    <div className="min-h-screen bg-black text-[#E7E9EA] font-sans">
      <Header />
      <div className="flex">
        <LeftSidebar />

        {/* Main content updated to the "Edit Network" interface */}
        <main className="flex-1 px-10 py-6 ">
          {/* Header section with back arrow and save button */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <button onClick={() => navigate(-1)} className="mr-4 p-1 rounded-full hover:bg-gray-800">
                <ArrowLeft className="h-6 w-6" />
              </button>
              <h1 className="text-2xl font-bold">edit network</h1>
            </div>
            <button className="bg-[#2A2A2A] text-gray-300 px-5 py-2 rounded-full text-sm font-semibold hover:bg-gray-700">
              save changes
            </button>
          </div>

          {/* Description paragraph */}
          <p className="text-gray-400 mb-8 max-w-2xl">
            Lorem ipsum dolor sit amet consectetur. Pulvinar risus donec aenean
            tristique risus eu vitae felis. Donec lacus accumsan ultricies
            metus.
          </p>

          {/* Form Section */}
          <div className="space-y-6 max-w-2xl">
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

          {/* Preview Section */}
          <div className="mt-10 max-w-2xl">
            <div className="bg-black border border-gray-700 rounded-2xl p-6 relative ">
              <button className="absolute top-4 right-4 text-xs bg-black text-[#E7E9EA] px-4 py-1 rounded-full border border-gray-500 hover:bg-gray-800 mt-6">
                edit banner
              </button>
              
              <div className="flex items-center space-x-4 mt-20 border-t border-gray-700 pt-3">
                {/* Plus Icon Container */}
                <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center">
                  {/* SVG Plus Icon */}
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" fill="black"/>
                  </svg>
                </div>
                <span className="font-bold text-2xl">rantcit</span>
              </div>
              
              <p className="text-sm text-[#E7E9EA] mt-4 leading-relaxed">
                Lorem ipsum dolor sit amet consectetur. Pulvinar risus donec aenean tristique risus eu vitae felis. Donec lacus accumsan ultricies metus. Lorem ipsum dolor sit amet consectetur. Pulvinar risus donec aenean tristique risus eu vitae felis. Donec lacus accumsan ultricies metus.
              </p>
            </div>
          </div>
        </main>

        <RightSidebar />
      </div>
    </div>
  );
}
