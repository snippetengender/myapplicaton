import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, MoreVertical } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNetworkById,
  clearCurrentNetwork,
} from "../../../features/networkCreate/networkSlice";

export default function MobileNetworkPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const { data: networkData, status } = useSelector(
    (state) => state.network.currentNetwork
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchNetworkById(id));
    }
    return () => {
      dispatch(clearCurrentNetwork());
    };
  }, [id, dispatch]);

  // Handle loading and error states
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }
  if (status === "failed" || !networkData) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Error: Network not found.
      </div>
    );
  }

  // Render the page with dynamic data
  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <div className="relative w-full h-40">
        <img
          src={networkData.banner || "default_banner_url.jpg"}
          alt="Banner"
          className="w-full h-full object-cover"
        />

        {/* Left Back Icon */}
        <div className="absolute top-3/4 left-2 -translate-y-1/2">
          <button
            onClick={() => navigate("/home")}
            className="bg-black bg-opacity-70 p-2 rounded-full"
          >
            <ChevronLeft className="text-white" size={20} />
          </button>
        </div>

        {/* Right Menu Icon - This is the corrected part */}
        <div
          ref={menuRef}
          className="absolute top-3/4 right-2 -translate-y-1/2"
        >
          {/* This button toggles the menu's visibility */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="bg-black bg-opacity-70 p-2 rounded-full"
          >
            <MoreVertical className="text-white" size={20} />
          </button>

          {/* Conditionally render the dropdown menu */}
          {isMenuOpen && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-neutral-800 border border-neutral-700 rounded-md shadow-lg z-20">
              <ul className="py-1 text-white">
                <li>
                  <button
                    onClick={() => navigate(`/communitypage/${id}/editnetwork`)}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-neutral-700"
                  >
                    Edit
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate(`/communitypage/${id}/finalpage`)}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-neutral-700"
                  >
                    Introduce Rules
                  </button>
                </li>
                <li>
                  <button
                    onClick={() =>
                      navigate(`/communitypage/${id}/ditchnetwork`)
                    }
                    className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-neutral-700"
                  >
                    Ditch Network
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 space-y-2 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={networkData.image}
              alt="Logo"
              className="w-12 h-12 bg-gray-600 rounded-full object-cover"
            />
            <div>
              <h2 className="text-lg text-[#D8D7DC] font-semibold">
                {networkData.name}
              </h2>
              <p className="text-sm text-[#D8D7DC]">
                {networkData.members_count}{" "}
                <span className="text-[#616161]">members</span>
              </p>
            </div>
          </div>
          <button className="bg-black border border-[#7E8389] text-white text-sm px-3 py-1 rounded-full">
            got in
          </button>
        </div>
        <p className="text-sm text-gray-300 mt-1">{networkData.description}</p>
        <p className="text-xs text-gray-500 mt-2">Network created by</p>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <img
            src={networkData.created_by.image_url || "default_avatar.png"}
            alt="Creator"
            className="w-6 h-6 bg-gray-500 rounded-full object-cover"
          />
          <span className="text-[#D8D7DC]">{networkData.created_by.name}</span>
        </div>
      </div>

      {/* Footer remains the same */}
      <div className="fixed bottom-1 left-0 right-0 px-2 py-1 z-10">
        {/* ... */}
      </div>
    </div>
  );
}
