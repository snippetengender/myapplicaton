import React, { useEffect, useState } from "react";
import { Search, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function EmResult() {
  const [allUsers, setAllUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("searchResult"));
    if (data && Array.isArray(data.data)) {
      setAllUsers(data.data);
    }
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const filteredUsers = allUsers.filter((user) => {
    const name = user.name?.toLowerCase() || "";
    const username = user.username?.toLowerCase() || "";
    const college = user.college_id?.toLowerCase() || "";
    return (
      name.includes(searchQuery) ||
      username.includes(searchQuery) ||
      college.includes(searchQuery)
    );
  });

  return (
    <div className="min-h-screen bg-black text-[#E7E9EA] px-4 py-6 font-sans">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <ArrowLeft
          className="w-6 h-6 cursor-pointer hover:text-pink-500"
          onClick={() => navigate("/bouquet/findem")}
        />
        <h1 className="text-2xl font-semibold">Explore Users</h1>
      </div>

      <p className="text-sm text-gray-400 mb-6">
        Browse all users from your university. Tap to view or send a bouquet 💐.
      </p>

      {/* Search Box */}
      <div className="flex items-center gap-2 border border-gray-700 rounded-lg px-3 py-2 bg-[#111111] focus-within:border-pink-500 mb-6">
        <Search size={18} className="text-gray-400" />
        <input
          type="text"
          placeholder="Search by name, username, or institution"
          className="bg-transparent outline-none text-sm w-full placeholder:text-gray-600"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      {/* User Cards */}
      <div className="space-y-4">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div
              key={user.firebase_id || user.username}
              onClick={() => {
                localStorage.setItem("selectedUser", JSON.stringify(user));
                navigate("/bouquet/bouquetprompt");
              }}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-[#1a1a1a] cursor-pointer transition duration-200 border border-gray-800"
            >
              <img
                src={
                  user.photo_url ||
                  `https://placehold.co/60x60/F06CB7/ffffff?text=${
                    user.name?.charAt(0) || "U"
                  }`
                }
                alt={user.name}
                className="w-14 h-14 rounded-full object-cover border border-gray-700"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://placehold.co/60x60/F06CB7/ffffff?text=${
                    user.name?.charAt(0) || "U"
                  }`;
                }}
              />
              <div className="flex flex-col">
                <p className="text-base font-medium leading-tight">
                  {user.name || "Unnamed User"}
                  <span className="text-xs text-gray-500 ml-1">
                    • {user.college_id || "Institution"}
                  </span>
                </p>
                <p className="text-sm text-gray-500">
                  &lt;{user.username || "unknown"}&gt;
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center mt-10">
            No users found matching your search.
          </p>
        )}
      </div>
    </div>
  );
}
