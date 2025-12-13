import React, { useState, useEffect, useCallback } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  setFormData,
  checkNetworkName,
} from "../../../features/networkCreate/networkSlice";
import nextArrow from "../../assets/next.svg";

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

export default function MobileCreateNetwork1() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Read data from the Redux store
  const { formData, nameCheck } = useSelector((state) => state.network);
  const { name, description } = formData;

  // Debounce the network name input to avoid excessive API calls
  const debouncedName = useDebounce(name, 500); // 500ms delay

  useEffect(() => {
    // Only check if the debounced name has a value
    if (debouncedName) {
      dispatch(checkNetworkName(debouncedName));
    }
  }, [debouncedName, dispatch]);

  const handleInputChange = (e) => {
    dispatch(setFormData({ field: e.target.name, value: e.target.value }));
  };

  const handleNext = () => navigate("/mobile_createnetwork_2");
  const handleBack = () => navigate(-1);

  return (
    <div className="bg-black text-brand-off-white min-h-screen flex flex-col p-6 pb-10 font-inter">
      {/* Header */}
      <header className="flex items-center justify-between w-full">
        <button onClick={handleBack} className="p-2 -ml-2 transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div className="bg-brand-charcoal w-[65px] h-[32px] text-[15px] rounded-full px-3 py-1.5 text-black justify-center items-center flex">
          1/3
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow w-full pt-[7px]">
        <h1 className="text-[20px] font-bold text-brand-off-white mb-2">
          About your Network
        </h1>
        <p className="text-xs text-brand-off-white leading-relaxed mb-[15px]">
          Create your community. Name it something that sounds way more
          exclusive than it actually is.
        </p>

        {/* Title Input Section */}
        <div className="">
          <label className="text-base text-brand-off-white">
            give your network a
          </label>
          <div className="flex justify-between items-baseline mt-1">
            <div className="flex items-center text-2xl text-brand-off-white flex-grow">
              <input
                type="text"
                name="name" // Added name attribute
                value={name}
                onChange={handleInputChange}
                maxLength={15}
                placeholder="Title"
                autoComplete="off"
                className="w-full bg-transparent font-semibold placeholder:text-brand-medium-gray focus:outline-none focus:bg-transparent"
              />
            </div>
            {/* <span className="text-xs text-brand-off-white whitespace-nowrap ml-4">
              #15 character only for Title
            </span> */}
          </div>
        </div>

        {/* Description Textarea Section */}
        <div className="mt-[15px] space-y-1">
          <textarea
            name="description" // Added name attribute
            value={description}
            onChange={handleInputChange}
            maxLength={500}
            className="w-full h-28 bg-transparent text-[12px] text-brand-dark-gray border border-brand-charcoal rounded-xl p-2 focus:outline-none"
            placeholder="Open up here now..."
          />
          <div className="px-1">
            <p className="text-left text-sm text-brand-charcoal">
              {description.length}/500
            </p>
            {/* Dynamic error/status message */}
            {nameCheck.status === "loading" && (
              <p className="text-yellow-500 text-sm mt-1">Checking name...</p>
            )}
            {nameCheck.status === "succeeded" &&
              !nameCheck.isAvailable &&
              name.length > 0 && (
                <p className="text-red-500 text-sm mt-1">
                  Sorry, this network name is already taken.
                </p>
              )}
            {nameCheck.status === "succeeded" &&
              nameCheck.isAvailable &&
              name.length > 0 && (
                <p className="text-green-500 text-sm mt-1">
                  Name is available!
                </p>
              )}
          </div>
        </div>
      </main>

      {/* Footer Button */}
      <footer className="fixed bottom-6 right-6">
        <button
          onClick={handleNext}
          disabled={
            !(
              nameCheck.status === "succeeded" &&
              nameCheck.isAvailable &&
              description.length > 10 &&
              name.length > 0
            )
          }
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-opacity duration-300
    ${
      nameCheck.status === "succeeded" &&
      nameCheck.isAvailable &&
      description.length > 10 &&
      name.length > 0
        ? "bg-[#E7E9EA]" // ✅ Enabled color
        : "bg-neutral-800 opacity-50 cursor-not-allowed" // Disabled state
    }
  `}
        >
          <img
            src={nextArrow}
            alt="Next arrow"
            className={
              nameCheck.status === "succeeded" &&
              nameCheck.isAvailable &&
              description.length > 10 &&
              name.length > 0
                ? ""
                : "opacity-50"
            }
          />
        </button>
      </footer>
    </div>
  );
}
