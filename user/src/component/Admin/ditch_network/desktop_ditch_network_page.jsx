import React, { useState } from "react";
import Header from "../../desktop_components/Header";
import LeftSidebar from "../../desktop_components/LeftSidebar";
import RightSidebar from "../../desktop_components/RightSidebar";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

// Placeholder components to make the example runnable.
// In a real app, these would be in separate files.
// const Header = () => <header className="h-16 bg-gray-900 border-b border-gray-800 flex items-center px-6"><p className="text-xl font-bold">Header</p></header>;
// const LeftSidebar = () => <aside className="w-64 bg-black border-r border-gray-800 p-6 h-full"><h2 className="text-lg font-semibold mb-4">Left Sidebar</h2></aside>;
// const RightSidebar = () => <aside className="w-64 bg-black border-l border-gray-800 p-6 h-full"><h2 className="text-lg font-semibold mb-4">Right Sidebar</h2></aside>;


export default function Dashboard() {
  const navigate = useNavigate();
  // State for the input field to make it a controlled component
  const [networkName, setNetworkName] = useState('');

  return (
    <div className="min-h-screen bg-black text-[#E7E9EA] font-sans">
      <Header />
      <div className="flex" style={{ height: 'calc(100vh - 4rem)' }}>
        <LeftSidebar />

        {/* Main content updated to the "Ditch Network" interface */}
        <main className="flex-1 px-10 py-6 overflow-y-auto">
          {/* Header section with back arrow */}
          <div className="flex items-center mb-6">
            <button onClick={() => navigate(-1)} className="p-1 rounded-full hover:bg-gray-800">
              <ArrowLeft className="h-6 w-6" />
            </button>
          </div>

          <div className="max-w-[60%]">
             {/* Page Title */}
            <h1 className="text-2xl font-bold mb-4">ditch network</h1>

            {/* Description paragraph */}
            <p className="text-gray-400 mb-8">
              Lorem ipsum dolor sit amet consectetur. Pulvinar risus donec aenean
              tristique risus eu vitae felis. Donec lacus accumsan ultricies
              metus.
            </p>

            {/* Network Name Input */}
            <div className="mb-6">
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
              className="bg-[#2F3336] text-gray-300 px-6 py-2 rounded-full text-sm font-semibold hover:bg-gray-700 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed"
              disabled={!networkName.trim()}
              onClick={() => navigate('/finalpage')}
            >
              Ditch network
            </button>
          </div>
        </main>

        <RightSidebar />
      </div>
    </div>
  );
}
