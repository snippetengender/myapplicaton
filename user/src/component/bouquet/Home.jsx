import React, { useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiSend, FiUser } from "react-icons/fi";

const Home = () => {
  const navigate = useNavigate();
  const auth = getAuth();

  const [hasNotification, setHasNotification] = useState(true);
  const [showLogout, setShowLogout] = useState(false);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log("User signed out");
        navigate("/lobby", { replace: true });
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

  return (
    <div className="min-h-screen bg-black text-white p-4">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">the snippet</h1>
        <div className="flex items-center space-x-6">
          <FiSearch className="h-6 w-6 cursor-pointer" />
          <div className="relative">
            <FiSend className="h-6 w-6 cursor-pointer" />
            {hasNotification && (
              <span
                className="absolute top-0 left-6  block h-2 w-2 rounded-full"
                style={{ backgroundColor: "#F06CB7" }}
              ></span>
            )}
          </div>
          <div className="relative">
            <FiUser className="h-6 w-6 cursor-pointer" onClick={() => setShowLogout(!showLogout)} />
            {showLogout && (
              <button
                onClick={handleLogout}
                className="absolute right-0 mt-2 py-2 px-4 bg-gray-700 text-white rounded shadow-lg hover:bg-gray-600 focus:outline-none"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
      

      {/* Description */}
      <p
        className="text-gray-400 mb-2 cursor-pointer"
      >
        UK's history, finance, and influence stand strong. send stealth{" "}
        <span style={{ color: "#F06CB7" }} className="font-semibold" onClick={() => navigate("/myscreen")}>
          bouquet
        </span>{" "}
        and check yours
      </p>

      {/* Tabs */}
      <div className="flex justify-between border-b border-gray-700 mb-2 px-10 ">
        <div className="px-4 py-2 text-white font-semibold border-b-2 border-white">
          mixes
        </div>
        <div className="px-4 py-2 text-gray-400">events</div>
      </div>
      {/* Content Area - Currently Black */}
      <div className="flex-grow bg-black">
        {/* This area will be populated with content based on tab selection */}
      </div>
    </div>
  );
};

export default Home;