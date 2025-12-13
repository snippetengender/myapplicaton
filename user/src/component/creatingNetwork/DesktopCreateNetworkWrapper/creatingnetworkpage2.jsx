import React from "react";
import { ArrowLeft, ArrowRight, Plus } from "lucide-react";

export default function CreatingNetworkPage2({ onNext, onBack }) {
  return (
    <div className="text-[#E7E9EA]">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button onClick={onBack}>
          <ArrowLeft className="text-[#E7E9EA]" />
        </button>
        <div className="bg-[#2E2E2E] text-xs text-[#E7E9EA] px-3 py-1 rounded-full">
          2/3
        </div>
      </div>

      {/* Title and Subtitle */}
      <div className="mt-6">
        <h1 className="text-2xl font-semibold">Style your Network</h1>
        <p className="text-sm text-gray-300 mt-2 leading-relaxed">
          Lorem ipsum dolor sit amet consectetur. Pulvinar risus donec aenean
          tristique risus eu vitae felis. Donec lacus accumsan ultricies metus.
        </p>
      </div>

      {/* Card */}
       <div className="mt-6 rounded-xl border border-[#2F3336]">
        {/* Add Banner Button */}
        <div className="flex justify-end p-4">
          <button className="text-sm border border-gray-600 text-[#E7E9EA] rounded-full px-4 py-1">
            add banner
          </button>
        </div>

        <div className="border-t border-[#2F3336] px-6 py-5 flex flex-col gap-4">
          {/* Icon + Title */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center">
              <Plus className="text-black w-6 h-6" />
            </div>
            <span className="text-lg font-semibold">rantcit</span>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-400 leading-relaxed">
            Lorem ipsum dolor sit amet consectetur. Pulvinar risus donec aenean
            tristique risus eu vitae felis. Donec lacus accumsan ultricies
            metus. Lorem ipsum dolor sit amet consectetur. Pulvinar risus donec
            aenean tristique risus eu vitae felis. Donec lacus accumsan
            ultricies metus. Lorem ipsum dolor sit amet consectetur.
          </p>
        </div>
      </div>

      {/* Next Button */}
      <div className="flex justify-end mt-6">
        <button
          onClick={onNext}
          className="flex items-center gap-1 bg-[#2E2E2E] text-[#E7E9EA] px-4 py-2 rounded-full text-sm"
        >
          next <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
