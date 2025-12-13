import React, { useState } from "react";
import { Search } from "lucide-react"; 
import NetworkHeader from "../../../desktop_components/Header";
import NetworkLeftSidebar from "../../../desktop_components/LeftSidebar";

// --- Reusable PostCard Component (from our previous session) ---
// I've added state for the dropdown menu as seen in the image.
const PostCard = ({ post }) => {
  const { user, time, label, content, stats } = post;
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="border-t border-gray-800 p-4 relative">
      <div className="flex justify-between">
        <div className="flex items-center gap-3">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="text-sm">
            <div className="flex items-center gap-1 text-md font-semibold">
              {"<"}
              {user.name}
              {">"}
              <span className="text-[#616161] font-normal">
                {" "}
                • @{user.id} • {time}
              </span>
              <span className="ml-2 text-xs px-2 py-0.5 rounded-full border border-gray-700">
                {label}
              </span>
            </div>
          </div>
        </div>
        <button className="text-gray-400" onClick={() => setShowMenu(!showMenu)}>
          •••
        </button>
      </div>

      {/* Dropdown Menu */}
      {showMenu && (
        <div className="absolute top-10 right-4 mt-2 w-48 bg-[#181818] border border-gray-700 rounded-lg shadow-lg z-10 text-sm">
          <ul>
            <li className="px-4 py-2 hover:bg-gray-800 cursor-pointer rounded-t-lg">
              report user
            </li>
            <li className="px-4 py-2 hover:bg-gray-800 cursor-pointer rounded-b-lg">
              block user from my network
            </li>
          </ul>
        </div>
      )}

      <h3 className="font-bold text-[#E7E9EA] text-md mt-3 ml-1">
        Pitch your SaaS in 3 words
      </h3>
      <p className="text-[#E7E9EA]/80 text-[14px] mt-1 ml-1 whitespace-pre-line leading-relaxed">
        {content}
      </p>

      <div className="flex justify-between items-center mt-4 text-xs ml-1">
        <span className="text-brand-pink font-medium cursor-pointer">
          {stats.thoughts} thoughts
        </span>
        <div className="flex gap-2 items-center">
            <button className="px-3 py-1 rounded-full border border-gray-700 text-gray-400">
                <span className="font-bold text-lg">✓</span>
            </button>
            <button className="px-3 py-1 rounded-full border border-gray-700 text-gray-400">
                <span className="font-bold text-lg">✕</span>
            </button>
          <div className="inline-flex items-center rounded-full border border-gray-700 p-1 text-sm">
  {/* "nah" section */}
  <span className="px-3 py-1 text-gray-400">
    {stats.nah} nah
  </span>

  {/* Vertical Divider */}
  <div className="h-4 w-px bg-gray-700" />

  {/* "hmm" section */}
  <span className="px-3 py-1 text-gray-400">
    {stats.hmm} hmm
  </span>

  {/* Vertical Divider */}
  <div className="h-4 w-px bg-gray-700" />

  {/* "hell yeah" section */}
  <span className="px-3 py-1 font-semibold text-brand-pink">
    {stats.hellYeah} hell yeah
  </span>
</div>
        </div>
      </div>
    </div>
  );
};



// --- Main Page Component ---
export default function NetworkProfilePage() {
    // Data for the PostCard component, taken from the image
    const samplePost = {
        user: {
            name: "sujan",
            id: "m@cit",
            avatar: "https://i.pinimg.com/736x/c0/749b/c0749b7cc401421662ae901ec8f9f660.jpg",
        },
        time: "6h",
        label: "showoff",
        content:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        stats: { thoughts: 15, nah: 14, hmm: 14, hellYeah: 14 },
    };

  return (
    <div className="min-h-screen flex flex-col bg-black text-[#E7E9EA] font-sans">
      <NetworkHeader />
      <div className="flex flex-1">
        <NetworkLeftSidebar />
        <main className="flex-1 overflow-y-auto">
          {/* Stylized Banner */}
          <div className="px-6 py-3">
            <div className="w-full h-40 bg-yellow-400 rounded-2xl flex items-center justify-center relative overflow-hidden">
                <p className="text-black text-6xl font-black italic transform -skew-y-6">just snippet</p>
            </div>
          </div>
          <div className="flex gap-6 px-6 pb-8">
            {/* Left Column */}
            <div className="w-2/3 flex flex-col gap-5">
              <div className="flex items-center gap-4">
                <img
                  src="https://i.pinimg.com/736x/8f/3c/60/8f3c6031235de4a868f7004351b8c160.jpg"
                  alt="profile"
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h2 className="text-xl font-bold">react</h2>
                  <p className="text-sm text-gray-400">talks about buzzing</p>
                </div>
                <button className="ml-auto px-4 py-1 border border-gray-600 rounded-full text-sm hover:bg-white hover:text-black transition-colors">
                  open up now
                </button>
              </div>
              <div className="p-4 border border-gray-800 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-800" />
                    <div>
                        <p className="font-bold text-[#E7E9EA]">Open up now pal</p>
                        <p className="text-sm text-gray-400 mt-1">
                            There is no one whos gonna judge you in this network<br />Rely on us
                        </p>
                    </div>
                </div>
                <button className="px-4 py-1 border border-gray-600 rounded-full text-sm hover:bg-white hover:text-black transition-colors">
                  open up now
                </button>
              </div>
              {/* Reused PostCard Component */}
              <PostCard post={samplePost} />
            </div>
            {/* Right Column */}
            <div className="w-1/3 p-5 border-l border-[#2F3336]">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">&lt;rant_cit&gt;</h2>
                    <button className="px-4 py-1 border border-gray-600 rounded-full text-sm bg-gray-800">
                        joined
                    </button>
                </div>
                <p className="text-sm text-gray-300 my-4 leading-relaxed">
                    Lorem ipsum dolor sit amet consectetur. Sit porta blandit montes cursus. Tempus accumsan mauris in cras sit.
                </p>
                <p className="text-xs text-gray-400 font-medium space-x-4">
                    <span className="text-lg font-bold text-[#E7E9EA]">45K</span><span>members</span>
                    <span className="text-lg font-bold text-[#E7E9EA]">450</span><span>mixes</span>
                </p>
                <p className="text-sm text-gray-500 mt-4">network by</p>
                <div className="flex items-center gap-2 mt-2">
                    <img src="https://i.pinimg.com/736x/c0/749b/c0749b7cc401421662ae901ec8f9f660.jpg" alt="admin avatar" className="w-6 h-6 rounded-full" />
                    <span className="text-sm font-medium">&lt;karthikraja&gt;</span>
                    <span className="text-xs text-gray-400">• m@cit</span>
                </div>
                <div className="mt-8 space-y-4 text-[#E7E9EA] font-medium">
                    <p className="cursor-pointer hover:underline">edit network</p>
                    <p className="cursor-pointer hover:underline">ditch network</p>
                    <p className="cursor-pointer hover:underline">introduce rules</p>
                </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}