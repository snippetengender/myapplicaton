import React from "react";
import { FiShare2 } from "react-icons/fi";

const ProductCard = ({ listing, onConnect, onShare, navigate }) => {
    return (
        <div className="flex flex-col w-full bg-black">
            {/* Image Container */}
            <div
                className="relative w-full aspect-square bg-gray-900 rounded-2xl overflow-hidden cursor-pointer"
                onClick={() => navigate(`/smarket/${listing.listing_id}`)}
            >
                {listing.product_image?.[0] ? (
                    <img
                        src={listing.product_image[0]}
                        alt={listing.product_name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-500">
                        No Image
                    </div>
                )}
            </div>

            {/* Product Name */}
            <h3 className="text-brand-off-white text-[12px] font-semibold truncate mt-[9px]">
                {listing.product_name}
            </h3>

            {/* Price */}
            <div className="text-brand-off-white text-[18px] font-semibold mt-0.5">
                Rs. {listing.price}
            </div>

            <div className="flex">
                {/* Seller Info */}
                <div className="text-[8px] text-white font-semibold">
                    {listing.show || "@cit"}
                </div>
                <div className="mx-1 text-[8px] text-white font-bold">
                    {"•"}
                </div>
                {/* Date */}
                <div className="text-[8px] text-white font-bold">
                    {listing.posted_at ? new Date(Number(listing.posted_at)).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }) : "Dec 8, 05:44 PM"}
                </div>
            </div>


            {/* Actions */}
            {(onConnect || onShare) && (
                <div className="flex gap-2 items-center mt-auto">
                    {onConnect && (
                        <button
                            onClick={() => onConnect(listing)}
                            className="flex-1 bg-gray-200 text-black text-[13px] font-semibold py-1.5 px-3 rounded-lg hover:bg-white transition-colors"
                        >
                            Connect
                        </button>
                    )}
                    {onShare && (
                        <button
                            onClick={() => onShare(listing)}
                            className="p-1.5 bg-gray-200 rounded-lg text-black hover:bg-white transition-colors"
                        >
                            <FiShare2 size={16} />
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProductCard;
