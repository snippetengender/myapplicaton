import React from "react";
import Header from "../desktop_components/Header";
import LeftSidebar from "../desktop_components/LeftSidebar";

export default function NetworkProfilePage() {
  return (
    <div className="min-h-screen flex flex-col bg-black text-[#E7E9EA]">
      <Header />

      <div className="flex flex-1">
        <LeftSidebar />

        <main className="flex-1 overflow-y-auto">
          {/* Full-width Banner */}
          <div className="w-full px-8 py-3">
            <img
              src="https://i.pinimg.com/736x/8c/90/d9/8c90d9c67afd8c9bbf92cbe73fbe4102.jpg"
              alt="banner"
              className="w-full h-56 object-cover rounded-3xl"
            />
          </div>

          {/* Content below banner */}
          <div className="max-w-[90%] mx-auto px-0 pb-8 pt-4 flex gap-8">
            {/* Left Column */}
            <div className="flex-1 flex flex-col gap-6">
              {/* Profile Header */}
              <div className="flex items-center gap-4 rounded-full">
                <img
                  src="https://i.pinimg.com/736x/c0/74/9b/c0749b7cc401421662ae901ec8f9f660.jpg"
                  alt="profile"
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h2 className="text-xl font-bold">rantcit</h2>
                  <p className="text-sm text-gray-400">talks about buzzing</p>
                </div>
                <button className="ml-auto px-4 py-1 border rounded-full text-sm">
                  open up now
                </button>
              </div>

              {/* Open Up Now Box */}
          {/* Open Up Now Box */}
          <div className="p-4 border border-gray-800 rounded-xl flex items-center justify-between bg-black">
          {/* Left side - Icon and Text */}
          <div className="p-4  rounded-xl bg-black">
  {/* Top Row: Circle + Title */}
  <div className="flex items-center gap-3">
    <div className="w-10 h-10 rounded-full bg-gray-500" />
    <p className="text-lg font-bold text-[#E7E9EA]">Open up now pal</p>
  </div>

  {/* Subtitle: Full width below */}
  <p className="text-sm text-gray-400 leading-snug mt-2">
    There is no one who's gonna judge you in this network<br />
    Rely on us
  </p>
</div>


          {/* Right side - Button */}
          <button className="px-5 py-2 mt-10 border border-white rounded-full text-sm text-[#E7E9EA] hover:bg-white hover:text-black transition">
          open up now
          </button>
          </div>



              {/* No Post Yet */}
              <p className="text-center text-gray-500 mt-10">No post yet</p>
            </div>

            {/* Right Profile Card */}
            <div className="w-[300px] p-5 border-l border-[#2F3336] h-[550px] space-y-4  overflow-y-auto">
              <h2 className="text-xl font-semibold">&lt;rant_cit&gt;
              <span className="ml-10" ><button className="ml-auto px-4 py-1 border rounded-full text-sm">
                joined
              </button></span>
              </h2>
              <p className="text-sm text-gray-300">
                Lorem ipsum dolor sit amet consectetur. Sit porta blandit montes cursus.
                Tempus accumsan mauris in cras sit.
              </p>
              <p className="text-xs text-[#616161] font-medium gap-2">
                <span className="text-lg font-bold text-[#E7E9EA]">45K</span> <span className="pr-1">members&nbsp;</span>
                <span className="text-lg font-bold text-[#E7E9EA]">450</span> mixes
              </p>
              <p className="text-sm text-[#616161]">network by</p>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gray-600 rounded-full" />
                <span className="text-sm font-medium">&lt;karthikraja&gt;</span>
                <span className="text-xs text-gray-400">• m@cit</span>
              </div>
              
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
