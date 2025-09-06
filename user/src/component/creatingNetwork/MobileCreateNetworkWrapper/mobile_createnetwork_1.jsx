import React, { useState, useEffect, useCallback } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  setFormData,
  checkNetworkName,
} from "../../../features/networkCreate/networkSlice";

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
  const handleBack = () => navigate("/communitypage");

  return (
    <div className="bg-black text-white min-h-screen flex flex-col p-6 pb-10">
      {/* Header */}
      <header className="flex items-center justify-between w-full">
        <button onClick={handleBack} className="p-2 -ml-2 text-neutral-300">
          <ArrowLeft size={24} />
        </button>
        <div className="bg-neutral-800 text-xs rounded-full px-3 py-1.5">
          1/3
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow w-full pt-4">
        <h1 className="text-2xl font-semibold mb-2">About your Network</h1>
        <p className="text-xs text-neutral-400 mb-6">
          Start with a name and a short description to tell people what your
          network is about.
        </p>

        {/* Title Input Section */}
        <div className="space-y-2">
          <label className="text-base">give your network a</label>
          <div className="flex justify-between items-baseline mt-1">
            <div className="flex items-center text-2xl flex-grow">
              <input
                type="text"
                name="name" // Added name attribute
                value={name}
                onChange={handleInputChange}
                maxLength={15}
                placeholder="Title"
                autoComplete="off"
                className="w-full bg-transparent font-semibold placeholder:text-[#676767] focus:outline-none focus:bg-transparent"
              />
            </div>
            <span className="text-xs whitespace-nowrap ml-4">
              #15 character only
            </span>
          </div>
        </div>

        {/* Description Textarea Section */}
        <div className="mt-4 space-y-1">
          <textarea
            name="description" // Added name attribute
            value={description}
            onChange={handleInputChange}
            maxLength={500}
            className="w-full h-28 bg-transparent border border-neutral-700 rounded-xl p-4 focus:outline-none"
            placeholder="Open up here now..."
          />
          <div className="px-1">
            <p className="text-left text-sm text-neutral-500">
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
          className="w-14 h-14 rounded-full bg-neutral-800 flex items-center justify-center"
        >
          <ArrowRight size={24} className="text-white" />
        </button>
      </footer>
    </div>
  );
}
