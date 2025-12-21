import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom"; 

import All_listing from "./smarket_pages/all_listing";
import Your_listing from "./smarket_pages/your_listing";

import SearchIcon from "../snippetIcon/search-status.svg";
import HamburgerIcon from "../snippetIcon/menu.svg";
import LogoIcon from "../snippetIcon/Vector.svg";

<<<<<<< HEAD
export default function Smarket() {

    const [activeMTab, setActiveMTab] = useState("all_listing");
=======
export default function Smarket(){
    const location = useLocation();
    const [activeMTab, setActiveMTab] = useState(location.state?.activeTab || "all_listing");
>>>>>>> f939ee4a3176cf5592d5105ac60c10036df4526d
    const navigate = useNavigate();
    const renderTab = () => {
        switch (activeMTab) {
            case "all_listing":
                return <All_listing />
            case "your_listing":
                return <Your_listing />
        }
    }

    return (
        <div className="bg-black min-h-screen text-white">
            {/* Header */}
            <div className="flex justify-between items-center w-full p-3 border-b-2 border-gray-800">
                <div className="flex items-center space-x-2">
                    <div className="cursor-pointer" onClick={() => setIsSidebarOpen(true)}>
                        <img src={HamburgerIcon} alt="menu" className="w-6 h-6" />
                    </div>
                    <div className="cursor-pointer">
                        <img src={LogoIcon} alt="logo" className="w-[35px] h-[35px]" />
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => navigate('/smarket/selling_now')} // Replace with actual path
                        className="bg-black border-2 border-gray-700 text-white rounded-[25px] px-6 py-1 text-sm"
                    >
                        Start Selling Now
                    </button>

                    {/* Search Icon */}
                    <div className="cursor-pointer">
                        <img src={SearchIcon} alt="search" className="w-6 h-6" />
                    </div>
                </div>
            </div>



            {/* TABS */}
            <div className="flex justify-between border-b-2 border-gray-700 px-16">
                <button
                    onClick={() => setActiveMTab("all_listing")}
                    className={`${activeMTab === 'all_listing' ? "text-white border-b-2 p-2 border-white" : "p-2 text-gray-500"}`}>
                    all_listing
                </button>
                <button
                    onClick={() => setActiveMTab("your_listing")}
                    className={`${activeMTab === 'your_listing' ? "text-white border-b-2 p-2 border-white" : "p-2 text-gray-500"}`}>
                    your_listing
                </button>
            </div>

            <div>
                {renderTab()}
            </div>

            <div className="fixed bottom-0 left-0 right-0 px-2 py-1 z-10">
                <div className="bg-black border border-brand-charcoal rounded-[15px] px-4 py-2 flex justify-between items-center">
                    <button
                        className="bg-black text-brand-off-white text-[12px] font-medium px-4 py-1 rounded-[10px]"
                        onClick={() => navigate('/home')}
                    >
                        Home
                    </button>
                    <button
                        className="bg-black text-brand-off-white text-[12px] font-medium px-4 py-1 rounded-[10px]"
                        onClick={() => navigate('/events')}

                    >
                        Events
                    </button>
                    <button
                        className="bg-black text-brand-off-white text-[12px] font-medium px-4 py-1 rounded-[10px]"
                        onClick={() => {
                            navigate('/smarket')
                        }
                        }
                    >
                        Marketplace
                    </button>
                    <button
                        className="bg-black text-brand-off-white text-[12px] font-medium px-4 py-1 rounded-[10px]"
                    // onClick={() => navigate(`/profile/${userId}`)}
                    >
                        Profile
                    </button>
                </div>
            </div>

        </div>
    );
}
