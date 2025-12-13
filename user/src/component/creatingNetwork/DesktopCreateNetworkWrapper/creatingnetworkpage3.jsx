import React, { useState } from "react";
import { ArrowLeft, ArrowRight, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CreatingNetworkPage3({ onBack }) {
  const [selectedTag, setSelectedTag] = useState(null);

  const handleTagClick = (label) => {
    setSelectedTag(label === selectedTag ? null : label);
  };

  const isSelected = (label) => selectedTag === label;
  const navigate = useNavigate();

  return (
    <div className="text-[#E7E9EA] min-h-[calc(100vh-64px)]"> {/* Adjust height below header */}
      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={onBack}>
          <ArrowLeft className="text-[#E7E9EA]" />
        </button>
        <div className="bg-[#2E2E2E] text-xs text-[#E7E9EA] px-3 py-1 rounded-full">
          3/3
        </div>
      </div>

      {/* Title */}
      <div className="mt-6">
        <h1 className="text-2xl font-semibold">Planning to talk about</h1>
        <p className="text-sm text-gray-300 mt-2 leading-relaxed">
          Lorem ipsum dolor sit amet consectetur. Pulvinar risus donec aenean
          tristique risus eu vitae felis. Donec lacus accumsan ultricies metus.
        </p>
      </div>

      {/* Search Box */}
      <div className="mt-6">
        <div className="flex items-center bg-transparent border border-gray-700 rounded-lg px-4 py-2">
          <Search className="text-gray-500 w-4 h-4 mr-2" />
          <input
            type="text"
            placeholder="Search for topics"
            className="bg-transparent text-[#E7E9EA] text-sm w-full outline-none placeholder-gray-500"
          />
        </div>
      </div>

      {/* Select One Label */}
      <p className="text-sm text-[#E7E9EA] mt-6 mb-2 font-medium">
        Select One ({selectedTag ? "1" : "0"}/1)
      </p>

      {/* Topic Sections */}
      <div className="space-y-6">
        <TopicGroup
          title="Anime and Cosplay"
          tags={["add banner", "cosplay", "animation", "manga"]}
          selectedTag={selectedTag}
          onTagClick={handleTagClick}
        />
        <TopicGroup
          title="Art"
          tags={["digital art", "painting"]}
          selectedTag={selectedTag}
          onTagClick={handleTagClick}
        />
        <TopicGroup
          title="Business and Finance"
          tags={["startups", "investment", "crypto"]}
          selectedTag={selectedTag}
          onTagClick={handleTagClick}
        />
      </div>

      {/* Submit Button */}
      <div className="flex justify-end mt-10">
        <button
          disabled={!selectedTag}
          className={`flex items-center gap-1 px-5 py-2 rounded-full text-sm font-medium transition
            ${selectedTag ? "bg-white text-black" : "bg-gray-600 text-[#E7E9EA] cursor-not-allowed"}`}
            onClick={() => navigate("/communitypage")}
        >
          create network <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// Reusable Topic Group
const TopicGroup = ({ title, tags, selectedTag, onTagClick }) => (
  <div>
    <p className="text-sm font-semibold mb-2">{title}</p>
    <div className="flex flex-wrap gap-2">
      {tags.map((label) => (
        <Tag
          key={label}
          label={label}
          isSelected={selectedTag === label}
          onClick={() => onTagClick(label)}
        />
      ))}
    </div>
  </div>
);

// Reusable Tag Button
const Tag = ({ label, isSelected, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-1 border text-sm rounded-full transition
      ${isSelected
        ? "border-[#F06CB7] text-[#F06CB7]"
        : "border-gray-600 text-[#E7E9EA] "}`}
  >
    {label}
  </button>
);
