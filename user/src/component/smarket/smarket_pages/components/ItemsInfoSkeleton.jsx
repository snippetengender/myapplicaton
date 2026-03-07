import React from 'react';
import { FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const ItemsInfoSkeleton = () => {
    const navigate = useNavigate();

    return (
        <div className="font-inter min-h-screen bg-black text-white flex flex-col relative animate-pulse">
            {/* Header */}
            <div className="absolute top-0 left-0 w-full p-4 z-10 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
                <button
                    onClick={() => navigate(-1)}
                    className="text-white hover:text-gray-300 transition-colors"
                >
                    <FiX size={28} />
                </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto pb-24 no-scrollbar">
                {/* Product Image Skeleton */}
                <div className="mx-4 mt-14 mb-4 border-[3px] border-gray-800 rounded-3xl">
                    <div className="w-full aspect-square bg-gray-900 rounded-[32px]"></div>
                </div>

                <div className="px-4">
                    {/* Title & Category Skeleton */}
                    <div className="h-8 bg-gray-800 rounded-md w-3/4 mb-3"></div>
                    <div className="h-4 bg-gray-800 rounded-md w-1/2 mb-6"></div>

                    {/* Price Skeleton */}
                    <div className="h-8 bg-gray-800 rounded-md w-1/3 mb-6"></div>

                    {/* Description Skeleton */}
                    <div className="space-y-3 mb-8">
                        <div className="h-4 bg-gray-800 rounded-md w-full"></div>
                        <div className="h-4 bg-gray-800 rounded-md w-full"></div>
                        <div className="h-4 bg-gray-800 rounded-md w-5/6"></div>
                    </div>

                    {/* Seller Information Skeleton */}
                    <div className="mb-8">
                        <div className="h-6 bg-gray-800 rounded-md w-1/2 mb-6"></div>
                        <div className="space-y-5">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <div className="w-5 h-5 bg-gray-800 rounded-full flex-shrink-0"></div>
                                    <div className="h-4 bg-gray-800 rounded-md w-2/3"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Fixed Footer Button Skeleton */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-black z-20">
                <div className="w-full py-3 h-12 bg-gray-800 rounded-lg"></div>
            </div>
        </div>
    );
};

export default ItemsInfoSkeleton;
