import React from "react";
import { ChevronLeft, MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom"; // 1. Import useNavigate

export default function MobileNetworkPage() {
  const navigate = useNavigate(); // 2. Initialize the navigate function
  

  return (
    <div className="min-h-screen bg-black text-[#E7E9EA] font-sans">
      <div className="relative w-full h-30 rounded-lg overflow-hidden">
        <img
          src="https://i.pinimg.com/736x/8c/90/d9/8c90d9c67afd8c9bbf92cbe73fbe4102.jpg"
          alt="Banner"
          className="w-full h-full object-cover"
        />

        {/* Left Back Icon - Vertically Centered */}
        <div className="absolute top-3/4 left-2 -translate-y-1/2">
          {/* 3. Add the onClick handler */}
          <button 
            onClick={() => navigate('/createnetworkwrapper')} 
            className="bg-black bg-opacity-70 p-2 rounded-full"
          >
            <ChevronLeft className="text-[#E7E9EA]" size={20} />
          </button>
        </div>

        {/* Right Menu Icon - Vertically Centered */}
        <div className="absolute top-3/4 right-2 -translate-y-1/2 pr-1">
          <button className="bg-black bg-opacity-70 p-2 rounded-full">
            <MoreVertical className="text-[#E7E9EA]" size={20} />
          </button>
        </div>
      </div>

      {/* Profile Header */}
      <div className="p-4 space-y-2 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-600 rounded-full" />
            <div>
              <h2 className="text-lg text-[#D8D7DC] font-semibold">something</h2>
              <p className="text-sm text-[#D8D7DC]">
                21.8K <span className="text-[#616161]">members</span> • 382 <span className="text-[#616161]">mixes</span>
              </p>
            </div>
          </div>
          <button className="bg-black border border-[#7E8389] text-[#E7E9EA] text-sm px-3 py-1 rounded-full">
            got in
          </button>
        </div>
        <p className="text-sm text-gray-300 mt-1">
          /r/beermoneyindia is community for people to discuss mostly online
          making-making opportunities in India. You could make dece...
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Network created by    
        </p>
        {/* Network By */}
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <div className="w-6 h-6 bg-gray-500 rounded-full" />
          <span className="text-[#D8D7DC]">&lt;tj&gt;</span>
          <span>•</span>
          <span>m@iitm</span>
        </div>
      </div>

      {/* Footer Action Input */}
      <div className="fixed bottom-1 left-0 right-0 px-2 py-1 z-10">
        <div className="backdrop-blur-md  border border-[#2F3336] rounded-3xl px-4 py-2 flex justify-between items-center">
          <span className="text-sm text-[#E7E9EA]">Open up now</span>
          <button className="bg-white/10 border border-[#2F3336] text-[#E7E9EA] px-4 py-1 rounded-xl hover:bg-white/30" onClick={() => navigate("/selecttag")}>
            mix
          </button>
        </div>
      </div>
      
    </div>
  );
}