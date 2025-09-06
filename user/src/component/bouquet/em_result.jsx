import React, { useState, useMemo } from 'react';
import { ChevronLeft, Search , ArrowLeft  } from 'lucide-react'; // Removed Sparkle icon
import debounce from 'lodash.debounce'; // For debouncing the search input
import { useNavigate } from "react-router-dom"; // Add this import
// Main App component
export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Dummy user data for demonstration
  const allUsers = [
    {
      id: "1",
      name: "Girish Mathrubootham",
      username: "girish",
      institution: "b@cit",
      imageUrl: "https://pbs.twimg.com/profile_images/1577081029890019328/FGW8gs4B_400x400.jpg" // Placeholder image
    },
    {
      id: "2",
      name: "Pushpa Raj",
      username: "pushpa_na_brandhu",
      institution: "b@cit",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAhSSEvHpJ-n32hOYqqnkBwblW-66Nba7CZQ&s" // Placeholder image
    },
    
  ];

  // Dummy navigation function for demonstration
  const navigate = useNavigate();

  // Debounced function to filter users based on search query
  const debouncedSetSearchQuery = useMemo(
    () =>
      debounce((value) => {
        setSearchQuery(value);
      }, 300), // Debounce for 300ms
    []
  );

  // Filter users based on the search query
  const filteredUsers = useMemo(() => {
    if (!searchQuery) {
      return allUsers; // Show all users if search query is empty
    }
    const lowerCaseQuery = searchQuery.toLowerCase();
    return allUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(lowerCaseQuery) ||
        user.username.toLowerCase().includes(lowerCaseQuery) ||
        user.institution.toLowerCase().includes(lowerCaseQuery)
    );
  }, [searchQuery, allUsers]);

  return (
    <div className="min-h-screen bg-black text-[#E7E9EA] px-0 py-6 flex flex-col font-sans">
      {/* Top Section with padding */}
      <div className="px-2">
        {/* Back button */}
        <ArrowLeft className="w-6 h-6 mb-4" onClick={() => navigate("/findem")}/>

        {/* Page Title and Description */}
        <h1 className="text-2xl font-semibold mb-2">Well, you are here</h1>
        <p className="text-sm text-gray-300 mb-4" style={{ width: "95%" }}>
          Lorem ipsum dolor sit amet consectetur. Pulvinar risus donec aenean tristique risus eu vitae felis. Donec lacus accumsan ultricies metus.
        </p>

        {/* Search Input */}
        <div className="flex items-center gap-2 border border-gray-600 rounded-md px-3 py-2 mb-6">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            placeholder="search for name"
            className="bg-transparent outline-none text-sm w-full placeholder:text-gray-600"
            onChange={(e) => debouncedSetSearchQuery(e.target.value)}
          />
        </div>

        {/* User List */}
        <div className="space-y-4">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div key={user.id} className="flex items-center gap-4" onClick={() => navigate("/bouquetprompt")}> {/* Reverted to original user item styling */}
                <img
                  src={user.imageUrl}
                  alt={user.name}
                  className="w-14 h-14 rounded-full object-cover border border-gray-600"
                  onError={(e) => {
                    e.target.onerror = null; // Prevents infinite loop if placeholder also fails
                    e.target.src = `https://placehold.co/60x60/F06CB7/ffffff?text=${user.name.charAt(0)}`; // Fallback to initial
                  }}
                />
                <div>
                  <p className="text-base font-medium">{user.name} <span className="text-[10px]" style={{color:"#676767"}} >• {user.institution}</span></p>
                  <p className="text-sm " style={{color:"#676767"}}>&lt;{user.username}&gt;</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-center mt-8">No users found matching your search.</p>
          )}
        </div>
      </div>
    </div>
  );
}
