import React, { useState } from "react";
import PropTypes from "prop-types";
import { ChevronDown } from "lucide-react";
import dropDownArrow from "../assets/drop-down.svg";
const ProfileSelector = ({ userDetails, useLowkey, setUseLowkey }) => {
  const [isOpen, setIsOpen] = useState(false);

  const mainProfile = {
    name: userDetails.username,
    image: userDetails.profile,
  };
  const lowkeyProfile = {
    name: userDetails.lowkey_profile.name,
    image: userDetails.lowkey_profile.profile_image,
  };

  const selectedProfile = useLowkey ? lowkeyProfile : mainProfile;

  const handleSelect = (isLowkeySelection) => {
    setUseLowkey(isLowkeySelection);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center w-full py-2 rounded-lg hover:bg-zinc-800 px-1"
      >
        <div className="flex items-center gap-2">
          <img
            src={
              selectedProfile.image ||
              "https://placehold.co/40x40/222/fff?text=P"
            }
            alt={selectedProfile.name}
            className="w-5 h-5 rounded-full object-cover"
          />
          <div className="text-brand-off-white text-[12px]">
            {useLowkey
              ? `{${selectedProfile.name}}`
              : `<${selectedProfile.name}>`}
          </div>
        </div>
        <img
          src={dropDownArrow}
          alt="dropdown arrow"
          className={`ml-4 w-2 h-2 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full  mt-2 bg-[#2e2e2e] border border-zinc-700 rounded-lg z-10 w-max whitespace-nowrap">
          <div
            onClick={() => handleSelect(false)}
            className="flex items-center gap-2 p-2 hover:bg-zinc-700 cursor-pointer"
          >
            <img
              src={mainProfile.image}
              alt={mainProfile.name}
              className="w-5 h-5 rounded-full object-cover"
            />
            <div className="text-gray-300 text-[12px]">{`<${mainProfile.name}>`}</div>
          </div>
          <div
            onClick={() => handleSelect(true)}
            className="flex items-center gap-2 p-2 hover:bg-zinc-700 cursor-pointer"
          >
            <img
              src={
                lowkeyProfile.image ||
                "https://placehold.co/40x40/222/fff?text=L"
              }
              alt={lowkeyProfile.name}
              className="w-5 h-5 rounded-full object-cover"
            />
            <div className="text-gray-300 text-[12px]">{`{${lowkeyProfile.name}}`}</div>
          </div>
        </div>
      )}
    </div>
  );
};

// PropTypes provide excellent documentation for your component's requirements
ProfileSelector.propTypes = {
  userDetails: PropTypes.shape({
    username: PropTypes.string.isRequired,
    profile: PropTypes.string.isRequired,
    lowkey_profile: PropTypes.shape({
      name: PropTypes.string.isRequired,
      profile_image: PropTypes.string,
    }).isRequired,
  }).isRequired,
  useLowkey: PropTypes.bool.isRequired,
  setUseLowkey: PropTypes.func.isRequired,
};

export default ProfileSelector;
