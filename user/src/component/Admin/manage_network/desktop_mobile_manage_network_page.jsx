import React from "react";
import Header from "../../desktop_components/Header";
import LeftSidebar from "../../desktop_components/LeftSidebar";
import RightSidebar from "../../desktop_components/RightSidebar";
import { useNavigate } from "react-router-dom";
// Import icons for the UI
import { ArrowLeft, ChevronRight } from "lucide-react";

// A reusable component for the clickable list items, styled with Tailwind CSS
const NetworkItem = ({ title, onClick }) => (
  <div
    onClick={onClick}
    className="flex justify-between items-center py-4 border-b border-gray-800 cursor-pointer hover:bg-gray-900/50"
  >
    <span className="text-[#E7E9EA] text-base">{title}</span>
    <ChevronRight className="text-[#E7E9EA] h-5 w-5" />
  </div>
);

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-[#E7E9EA] font-sans">
      <Header />
      <div className="flex">
        <LeftSidebar />

        {/* The main content is now the "Manage Network" screen */}
        <main className="flex-1 px-10 py-6 overflow-y-auto">
          {/* Header section with back arrow and title */}
          <div className="flex items-center mb-4">
            <button onClick={() => navigate(-1)} className="mr-4 p-1 rounded-full hover:bg-gray-800">
              <ArrowLeft className="h-6 w-6" />
            </button>
            
          </div>
          <h1 className="text-2xl font-bold mb-4">Manage Network</h1>
          {/* Description paragraph */}
          <p className="text-gray-400 mb-8 ">
            Lorem ipsum dolor sit amet consectetur. Pulvinar risus donec aenean
            tristique risus eu vitae felis. Donec lacus accumsan ultricies
            metus.
          </p>

          {/* Subheading for the network section */}
         

          {/* Using the reusable NetworkItem component */}
          <NetworkItem
            title="react"
            
          />
          <NetworkItem
            title="establish network (2/3)"
           
          />
        </main>

        <RightSidebar />
      </div>
    </div>
  );
}