import React from "react";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  return (
    <div className="flex justify-between gap-4 items-center px-6 py-4 border-b border-zinc-800">
      <div className="w-8 h-8 mb-8">
        <img src="Vector.svg" alt="Logo" className="w-full h-full p-4" />
      </div>
      <div className="relative flex-grow max-w-2xl">
        <input
          type="text"
          placeholder="spill some tea broskie"
          className="bg-black border border-[#2F3336] text-sm px-4 py-2 rounded-full w-full focus:outline-none placeholder-zinc-500 pl-10"
        />
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </span>
      </div>
      <div className="flex items-center gap-6 text-md text-[#E7E9EA]">
        <span className="cursor-pointer">notifications</span>
        <span onClick={() => navigate("/selecttag")} className="cursor-pointer">open up now</span>
        <span className="cursor-pointer">messages</span>
        <div className="w-10 h-10 bg-zinc-400 rounded-full" />
      </div>
    </div>
  );
}
