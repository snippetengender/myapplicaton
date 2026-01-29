import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const BottomTabs = ({ userId }) => {
    const navigate = useNavigate();
    const location = useLocation();

    // State for scroll-based visibility
    const [isTabsVisible, setIsTabsVisible] = useState(true);
    const lastScrollY = useRef(0);

    // Determine active tab based on current route
    const getActiveTab = () => {
        if (location.pathname.startsWith("/smarket")) return "marketplace";
        if (location.pathname === "/home" || location.pathname === "/") return "mixes";
        // Add more route checks as needed
        return "mixes";
    };

    const activeTab = getActiveTab();

    // Scroll handler for tabs visibility
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Show tabs when scrolling up, hide when scrolling down
            if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
                // Scrolling down - hide tabs
                setIsTabsVisible(false);
            } else {
                // Scrolling up - show tabs
                setIsTabsVisible(true);
            }

            lastScrollY.current = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div
            className={`fixed bottom-0 left-0 right-0 flex justify-around bg-black border-t border-brand-almost-black z-20 transition-transform duration-300 ease-in-out ${isTabsVisible ? 'translate-y-0' : 'translate-y-full'
                }`}
        >
            <button
                onClick={() => navigate("/home")}
                className={`relative w-full py-3 font-semibold text-center ${activeTab === "mixes" ? "text-brand-off-white" : "text-brand-medium-gray"
                    }`}
            >
                mixes
                {activeTab === "mixes" && (
                    <span className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-[2px] bg-white rounded"></span>
                )}
            </button>
            <button
                onClick={() => navigate("/events")}
                className={`relative w-full py-3 font-semibold text-center ${activeTab === "events" ? "text-brand-off-white" : "text-brand-medium-gray"
                    }`}
            >
                events
                {activeTab === "events" && (
                    <span className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-[2px] bg-brand-off-white rounded"></span>
                )}
            </button>
            <button
                onClick={() => navigate("/smarket")}
                className={`relative w-full py-3 font-semibold text-center ${activeTab === "marketplace" ? "text-brand-off-white" : "text-brand-medium-gray"
                    }`}
            >
                marketplace
                {activeTab === "marketplace" && (
                    <span className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-[2px] bg-brand-off-white rounded"></span>
                )}
            </button>
            <button
                onClick={() => {
                    if (userId) navigate(`/user-profile-owner/${userId}`);
                }}
                className="relative w-full py-3 font-semibold text-center text-brand-medium-gray"
            >
                profile
            </button>
        </div>
    );
};

export default BottomTabs;
