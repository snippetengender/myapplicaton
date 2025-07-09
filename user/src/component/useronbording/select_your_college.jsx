import { useState } from 'react';
import { ChevronLeft, Search, ArrowRight } from 'lucide-react';

const regions = [
  "PSG", "CIT", "PSG CAS", "SKCET", "PSG Tech",
  "SREC CBE",
];

export default function RegionSelect() {
  const [selected, setSelected] = useState("coimbatore");

  return (
    <div className="min-h-screen bg-black text-white px-4 py-6 flex flex-col justify-between">
      {/* Top Section */}
      <div>
        {/* Back Arrow */}
        <button className="text-white mb-4">
          <ChevronLeft size={24} />
        </button>

        {/* Title */}
        <h1 className="text-2xl font-semibold mb-2">Select your college</h1>
        <p className="text-sm text-gray-300 mb-4">
          Lorem ipsum dolor sit amet consectetur. Sit porta blandit montes cursus.
          Tempus accumsan mauris in cras sit. <span className="underline">Learn more</span>
        </p>

        {/* Search Box */}
        <div className="flex items-center gap-2 border border-gray-600 rounded-md px-3 py-2 mb-4">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            placeholder="search for region"
            className="bg-transparent outline-none text-sm w-full placeholder:text-gray-400"
          />
        </div>

        {/* Selected Region */}
        <div className="mb-6">
          <button
            className="border px-4 py-1 rounded-full text-sm"
            style={{
              
              borderColor: "#F06CB7"
            }}
          >
            {selected}
          </button>
        </div>

        {/* College Region Section */}
        <div>
          <p className="font-semibold text-base mb-3">Showing colleges of Coimbatore</p>
          <div className="flex flex-wrap gap-2">
            {regions.map((region, index) => (
              <button
                key={index}
                className="border border-white text-sm px-4 py-1 rounded-full"
                onClick={() => setSelected(region)}
              >
                {region}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="flex justify-between items-center mt-10 mb-4">
        <p className="text-sm text-white">
          Can’t find your Region?{" "}
          <span className="text-[#F06CB7] underline cursor-pointer">Add em</span>
        </p>
        <button className="w-12 h-12 rounded-full bg-[#2e2e2e] flex items-center justify-center">
          <ArrowRight size={22} className="text-white" />
        </button>
      </div>
    </div>
  );
}
