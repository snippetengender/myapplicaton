import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import HamburgerIcon from "../snippetIcon/menu.svg";
import LogoIcon from "../snippetIcon/Vector.svg";

import Events_list from "../smaps/components/Events_list";
import Events_map from "../smaps/components/Events_map";
import FilterModal from "../smaps/components/FilterModal";

export default function EventsMapPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize activeTab directly from location.state to prevent flicker
  const [activeTab, setActiveTab] = useState(() => {
    return location.state?.activeTab !== undefined ? location.state.activeTab : false;
  });

  // Filter state
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Cleanup: Clear navigation state on unmount to ensure fresh start on next visit
  useEffect(() => {
    return () => {
      // This ensures that when user navigates away and comes back, state is fresh
      window.history.replaceState({}, document.title);
    };
  }, []);

  return (
    <div className="bg-black min-h-screen text-white flex flex-col relative">
      {/* Header */}
      <div className="flex justify-between items-center w-full p-3 border-b-2 border-gray-800 bg-black z-10">
        <div className="flex items-center space-x-2">
          <div className="cursor-pointer">
            <img src={HamburgerIcon} alt="menu" className="w-6 h-6" />
          </div>
          <div className="cursor-pointer" onClick={() => navigate("/home")}>
            <img src={LogoIcon} alt="logo" className="w-[35px] h-[35px]" />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate("/events/all_events")}
            className="bg-black border-2 border-gray-700 text-white rounded-[25px] px-6 py-1 text-sm hover:bg-gray-900 transition"
          >
            Add Event
          </button>

          {/* Filter Button */}
          <button
            onClick={() => setShowFilterModal(true)}
            className={`bg-black border-2 text-white rounded-[25px] px-6 py-1 text-sm hover:bg-gray-900 transition relative ${selectedState || selectedDistrict || selectedCategory ? 'border-pink-600' : 'border-gray-700'
              }`}
          >
            Filter
            {(selectedState || selectedDistrict || selectedCategory) && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-pink-600 rounded-full border-2 border-black"></span>
            )}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative w-full overflow-hidden">
        {activeTab ? (
          <Events_list
            activeTab={activeTab}
            selectedState={selectedState}
            selectedDistrict={selectedDistrict}
            selectedCategory={selectedCategory}
          />
        ) : (
          <Events_map
            activeTab={activeTab}
            selectedState={selectedState}
            selectedDistrict={selectedDistrict}
            selectedCategory={selectedCategory}
          />
        )}
      </div>

      {/* Filter Modal */}
      <FilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApplyFilter={(state, district, category) => {
          setSelectedState(state);
          setSelectedDistrict(district);
          setSelectedCategory(category);
        }}
        currentState={selectedState}
        currentDistrict={selectedDistrict}
        currentCategory={selectedCategory}
      />

      {/* Floating Toggle Button */}
      <div className="fixed bottom-[80px] left-1/2 transform -translate-x-1/2 z-[1002]">
        <button
          onClick={() => setActiveTab(!activeTab)}
          className="flex items-center justify-center space-x-2 bg-gray-900 border border-gray-600 rounded-full px-1 py-1 shadow-lg backdrop-blur-md"
        >
          <span
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${!activeTab ? "bg-white text-black shadow-sm" : "text-gray-400 hover:text-white"
              }`}
          >
            Map
          </span>
          <span
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${activeTab ? "bg-white text-black shadow-sm" : "text-gray-400 hover:text-white"
              }`}
          >
            List
          </span>
        </button>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 px-2 py-1 z-20 bg-gradient-to-t from-black to-transparent pb-4">
        <div className="bg-black border border-brand-charcoal rounded-[15px] px-4 py-2 flex justify-between items-center shadow-2xl">
          <button
            className="bg-black text-brand-off-white text-[12px] px-4 py-1 rounded-[10px] hover:bg-gray-900 transition"
            onClick={() => navigate('/home')}
          >
            Home
          </button>
          <button
            className="bg-black text-brand-off-white text-[12px] px-4 py-1 rounded-[10px] hover:bg-gray-900 transition"
            onClick={() => navigate('/events')}
          >
            Events
          </button>
          <button
            className="bg-black text-brand-off-white text-[12px] px-4 py-1 rounded-[10px] hover:bg-gray-900 transition"
            onClick={() => navigate('/smarket')}
          >
            Marketplace
          </button>
          <button
            className="bg-black text-brand-off-white text-[12px] px-4 py-1 rounded-[10px] hover:bg-gray-900 transition"
          >
            Profile
          </button>
        </div>
      </div>
    </div>
  );
}
