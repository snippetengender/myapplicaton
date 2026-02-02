import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

import All_listing from "./smarket_pages/all_listing";
import Your_listing from "./smarket_pages/your_listing";
import BottomTabs from "../shared/BottomTabs";
import Sidebar from "../Home_page/Sidebar";

import SearchIcon from "../snippetIcon/search-status.svg";
import HamburgerIcon from "../snippetIcon/menu.svg";
import LogoIcon from "../snippetIcon/Vector.svg";

export default function Smarket() {
    const location = useLocation();
    const [activeMTab, setActiveMTab] = useState(location.state?.activeTab || "all_listing");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const userId = localStorage.getItem("user_id");

    const renderTab = () => {
        switch (activeMTab) {
            case "all_listing":
                return <All_listing />
            case "your_listing":
                return <Your_listing />
        }
    }

    return (
        <div className="bg-black min-h-screen text-white flex flex-col pt-[60px] pb-16">
            {/* Sidebar */}
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            {/* Header/Navbar */}
            <nav className="fixed top-0 left-0 right-0 flex justify-between items-center w-full h-15 p-3 bg-black border-b border-brand-almost-black z-20">
                {/* Left Side: Menu and Logo */}
                <div className="flex items-center space-x-2">
                    <div className="cursor-pointer" onClick={() => setIsSidebarOpen(true)}>
                        <img src={HamburgerIcon} alt="menu" className="w-6 h-6" />
                    </div>
                    <div className="cursor-pointer">
                        <img src={LogoIcon} alt="logo" className="w-[35px] h-[35px]" />
                    </div>
                </div>

                {/* Right Side: Actions */}
                <div className="flex items-center space-x-4">
                    {/* Start Selling Now Button */}
                    <button
                        onClick={() => navigate('/smarket/selling_now')}
                        className="border border-brand-charcoal rounded-[25px] px-3 py-1 text-[12px]"
                    >
                        Start Selling Now
                    </button>

                    {/* Search Icon */}
                    <div className="cursor-pointer">
                        <img src={SearchIcon} alt="search" className="w-6 h-6" />
                    </div>
                </div>
            </nav>

            {/* TABS */}
            <div className="flex w-full border-b border-gray-800">
                <button
                    onClick={() => setActiveMTab("all_listing")}
                    className={`flex-1 py-3 text-[13px] font-medium relative ${activeMTab === 'all_listing'
                        ? "text-white"
                        : "text-gray-500"
                        }`}
                >
                    all listing
                    {activeMTab === 'all_listing' && (
                        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-white w-1/3 mx-auto"></div>
                    )}
                </button>
                <button
                    onClick={() => setActiveMTab("your_listing")}
                    className={`flex-1 py-3 text-[13px] font-medium relative ${activeMTab === 'your_listing'
                        ? "text-white"
                        : "text-gray-500"
                        }`}
                >
                    your listing
                    {activeMTab === 'your_listing' && (
                        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-white w-1/3 mx-auto"></div>
                    )}
                </button>
            </div>

            {/* Content */}
            <div className="flex-grow overflow-y-auto">
                {renderTab()}
            </div>

            {/* Bottom Navigation */}
            <BottomTabs userId={userId} />
        </div>
    );
}
