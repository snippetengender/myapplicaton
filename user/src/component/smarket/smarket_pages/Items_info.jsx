import { useNavigate, useParams, useLocation } from "react-router-dom";
import api from "../../../providers/api";
import { useState, useEffect } from "react";
import { FiX, FiUser, FiMapPin, FiPhone, FiCalendar } from "react-icons/fi";
import ConnectButton from "./components/Share_button";
import Completed_listing from "./components/completed_button";

export default function Item_Info() {
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from || "all_listing";
    const [listing, setListing] = useState({});
    const { listingId } = useParams();

    const listingInfo = async () => {
        try {
            const listingDetails = await api.get(`/marketplace/${listingId}`, {});
            setListing(listingDetails.data);
        } catch (error) {
            console.error("Error fetching listing info:", error);
        }
    };

    useEffect(() => {
        listingInfo();
    }, []);

    return (
        <div className="font-inter min-h-screen bg-black text-white flex flex-col relative">
            {/* Header with Close Button */}
            {/* Header with Close Button and Edit Button */}
            <div className="absolute top-0 left-0 w-full p-4 z-10 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
                <button
                    onClick={() => navigate(-1)}
                    className="text-white hover:text-gray-300 transition-colors"
                >
                    <FiX size={28} />
                </button>
                {from === "your_listing" && (
                    <button
                        className="backdrop-blur-md text-white p-2 rounded-full hover:bg-white/20 transition-colors"
                        onClick={() => navigate('/smarket/selling_now', {
                            state: {
                                mode: "edit",
                                listing
                            }
                        })}
                    >
                        <img src="/Edit.svg" alt="Edit" className="w-5 h-5" />
                    </button>
                )}
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto pb-24 no-scrollbar">
                {/* Product Image */}
                <div className="px-4 mt-14 mb-4">
                    <div className="w-full aspect-square bg-white rounded-[32px] overflow-hidden flex items-center justify-center">
                        {listing.product_image?.[0] ? (
                            <img
                                src={listing.product_image[0]}
                                alt={listing.product_name}
                                className="w-full h-full object-contain"
                            />
                        ) : (
                            <div className="text-black/50">No Image</div>
                        )}
                    </div>
                </div>

                <div className="px-4">
                    {/* Title & Category */}
                    <h1 className="text-3xl font-bold mb-1">{listing.product_name}</h1>
                    <p className="text-gray-400 text-xs mb-4">
                        Category : {listing.category || "Electronics and Gadgets"}
                    </p>

                    {/* Price */}
                    <div className="text-2xl font-bold mb-4">Rs. {listing.price}</div>

                    {/* Description */}
                    <p className="text-gray-300 text-xs leading-relaxed mb-8">
                        <span className="text-gray-400">Description : </span>
                        {listing.description ||
                            "This is a very good product, offering exceptional quality and reliability. Its features are well-designed, user-friendly, and deliver strong value."}
                    </p>

                    {/* Seller Information */}
                    <div className="mb-8">
                        <h2 className="text-lg font-medium mb-4">Seller Infromation</h2>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <FiUser className="text-white w-5 h-5 flex-shrink-0" />
                                <span className="text-sm font-medium">
                                    {listing.owner_name || listing.seller_username || "Unknown"}
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                <FiMapPin className="text-white w-5 h-5 flex-shrink-0" />
                                <span className="text-sm font-medium">
                                    {listing.college_name || "Coimbatore Institute of Technology"}
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                <FiPhone className="text-white w-5 h-5 flex-shrink-0" />
                                <span className="text-sm font-medium">
                                    {listing.phone_number || "9487079169"}
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                <FiCalendar className="text-white w-5 h-5 flex-shrink-0" />
                                <span className="text-sm font-medium">
                                    Updated On {listing.posted_at || "Dec 6, 8 : 44 PM"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Fixed Footer Buttons */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-black border-t border-gray-900 grid grid-cols-2 gap-4 z-20">
                <div className="w-full">
                    {from === "all_listing" ? (
                        <ConnectButton
                            className="w-full py-3 bg-gray-200 text-black text-base font-bold rounded-lg hover:bg-white transition-colors flex justify-center items-center"
                            phoneNumber={listing.phone_number}
                            productName={listing.product_name}
                        />
                    ) : (
                        <Completed_listing listingId={listingId} status={listing.live} />
                    )}
                </div>

                <button
                    onClick={() => {
                        if (listing.live === 'sold') return;
                        if (navigator.share) {
                            navigator.share({
                                title: listing.product_name,
                                text: `Check out ${listing.product_name} on Snippet!`,
                                url: window.location.href
                            }).catch(console.error);
                        }
                    }}
                    disabled={listing.live === 'sold'}
                    className={`w-full py-3 text-base font-bold rounded-lg transition-colors ${listing.live === 'sold'
                        ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                        : from === "your_listing"
                            ? "bg-transparent border border-gray-500 text-gray-300 hover:border-white hover:text-white"
                            : "bg-gray-200 text-black hover:bg-white"
                        }`}
                >
                    Share
                </button>
            </div>
        </div>
    );
}