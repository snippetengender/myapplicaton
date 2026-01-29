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

            {/* Seller Info */}
            <div className="mt-2 text-[10px] text-gray-400 font-medium">
                @{listing.seller_username || "cit"}
            </div>

            {/* Product Name */}
            <h3 className="text-white text-[15px] font-semibold truncate mt-0.5">
                {listing.product_name}
            </h3>

            {/* Price */}
            <div className="text-white text-[15px] font-semibold mt-0.5">
                Rs. {listing.price}
            </div>

            {/* Date */}
            <div className="text-[9px] text-gray-400 mt-0.5 mb-2">
                {listing.posted_at || "Dec 8, 05:44 PM"}
            </div>


            {/* Actions */}
            <div className="flex gap-2 items-center mt-auto">
                <button
                    onClick={() => onConnect(listing)}
                    className="flex-1 bg-gray-200 text-black text-[13px] font-semibold py-1.5 px-3 rounded-lg hover:bg-white transition-colors"
                >
                    Connect
                </button>
                <button
                    onClick={() => onShare(listing)}
                    className="p-1.5 bg-gray-200 rounded-lg text-black hover:bg-white transition-colors"
                >
                    <FiShare2 size={16} />
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
