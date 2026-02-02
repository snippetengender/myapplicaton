import React from "react";

const ProductCardSkeleton = () => {
    return (
        <div className="flex flex-col w-full bg-black animate-pulse">
            {/* Image Container Skeleton */}
            <div className="w-full aspect-square bg-gray-800 rounded-2xl"></div>

            {/* Seller Info Skeleton */}
            <div className="mt-2 h-3 w-12 bg-gray-800 rounded"></div>

            {/* Product Name Skeleton */}
            <div className="h-4 w-3/4 bg-gray-800 rounded mt-1.5"></div>

            {/* Price Skeleton */}
            <div className="h-4 w-16 bg-gray-800 rounded mt-1.5"></div>

            {/* Date Skeleton */}
            <div className="h-2 w-24 bg-gray-800 rounded mt-1.5 mb-2"></div>

            {/* Actions Skeleton */}
            <div className="flex gap-2 items-center mt-auto">
                <div className="flex-1 h-8 bg-gray-800 rounded-lg"></div>
                <div className="w-10 h-8 bg-gray-800 rounded-lg"></div>
            </div>
        </div>
    );
};

export default ProductCardSkeleton;
