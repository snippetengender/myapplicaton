import React from "react";

const YourListingSkeleton = () => {
    return (
        <div className="bg-black border border-gray-800 rounded-2xl p-4 w-full animate-pulse">
            <div className="flex gap-4">
                {/* Image Skeleton - Left Side */}
                <div className="w-24 h-24 flex-shrink-0 bg-gray-800 rounded-2xl"></div>

                {/* Info Skeleton - Right Side */}
                <div className="flex flex-col flex-1 min-w-0">
                    {/* Seller */}
                    <div className="h-2 w-8 bg-gray-800 rounded mb-1"></div>
                    {/* Product Name */}
                    <div className="h-4 w-3/4 bg-gray-800 rounded mb-2"></div>
                    {/* Price */}
                    <div className="h-5 w-16 bg-gray-800 rounded mb-2"></div>
                    {/* Date */}
                    <div className="h-2 w-28 bg-gray-800 rounded mb-3"></div>
                    {/* Status */}
                    <div className="flex items-center gap-1.5 mt-auto">
                        <div className="w-2 h-2 rounded-full bg-gray-800"></div>
                        <div className="h-2 w-20 bg-gray-800 rounded"></div>
                    </div>
                </div>
            </div>

            {/* Edit Button Skeleton */}
            <div className="w-full mt-3 h-8 bg-gray-800 rounded-lg"></div>
        </div>
    );
};

export default YourListingSkeleton;
