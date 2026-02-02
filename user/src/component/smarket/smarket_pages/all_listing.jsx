import { useNavigate } from "react-router-dom";
import ProductCard from "./components/ProductCard";
import ProductCardSkeleton from "./components/ProductCardSkeleton";
import api from "../../../providers/api";
import { useState, useEffect, useRef } from "react";
import { LISTING_CATEGORY } from "./constants/listingStatus";

export default function All_listing() {
    const navigate = useNavigate();
    const [listedItems, setListedItems] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const loaderRef = useRef(null);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const fetchListings = async (page = 1, limit = 10, category = null) => {
        try {
            const params = { page, limit };
            if (category) params.category = category;

            const response = await api.get('/marketplace/live', { params: params });
            return response.data
        }
        catch (error) {
            console.error('Error fetching listings:', error);
        }
    };

    const loadMoreListings = async (currentPage) => {
        if (!hasMore) return;
        console.log("page value is:", currentPage);
        if (currentPage === 1 && listedItems.length > 0) return;
        const res = await fetchListings(currentPage, 10, selectedCategory);
        setListedItems(prev => {
            const existingIds = new Set(prev.map(i => i.listing_id));
            const newItems = res.data.filter(
                item => !existingIds.has(item.listing_id)
            );
            const updated = [...prev, ...newItems];
            if (updated.length >= res.pagination.total) {
                setHasMore(false);
            }
            return updated;
        });
        setPage(p => p + 1);
        setIsLoading(false);
    };

    // Initial load on mount
    useEffect(() => {
        loadMoreListings(1);
    }, []);

    // IntersectionObserver for infinite scroll (subsequent loads)
    useEffect(() => {
        setListedItems([]);
        setPage(1);
        setHasMore(true);
    }, [selectedCategory]);

    useEffect(() => {
        if (!hasMore || isLoading || page === 1) return;
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                observer.disconnect();
                loadMoreListings(page);
            }
        });
        if (loaderRef.current) observer.observe(loaderRef.current);
        return () => observer.disconnect();
    }, [page, hasMore, selectedCategory, isLoading]);

    const handleConnect = (listing) => {
        // Implement connect logic here
        // e.g., open a modal or navigate to chat
        console.log("Connect with", listing);
    };

    const handleShare = (listing) => {
        // Implement share logic
        if (navigator.share) {
            navigator.share({
                title: listing.product_name,
                text: `Check out ${listing.product_name} on Snippet!`,
                url: window.location.href + `/smarket/${listing.listing_id}`
            }).catch(console.error);
        } else {
            alert("Share feature not supported on this browser");
        }
    };

    return (
        <div className="flex flex-col h-full bg-black">
            {/* Filter Chips */}
            {/* <div className="flex overflow-x-auto no-scrollbar gap-2 p-4">
                {filters.map((filter) => (
                    <button
                        key={filter}
                        onClick={() => setActiveFilter(filter)}
                        className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-medium border transition-colors ${activeFilter === filter
                            ? "bg-gray-800 text-white border-gray-600"
                            : "bg-black text-gray-400 border-gray-700 hover:border-gray-500"
                            }`}
                    >
                        {filter}
                    </button>
                ))}
            </div> */}

            <div className="px-4 pb-20 grid grid-cols-2 gap-4">
                <div className="col-span-2 mb-4">
                    <label className="block text-sm mb-1 text-gray-400">
                        Select Category
                    </label>
                    <select
                        value={selectedCategory || ""}
                        onChange={(e) => setSelectedCategory(e.target.value || null)}
                        className="w-full p-2 rounded-md bg-black text-white border border-gray-600">
                        <option value="">All Categories</option>
                        {Object.entries(LISTING_CATEGORY).map(([key, label]) => (
                            <option key={key} value={label}>
                                {label}
                            </option>
                        ))}
                    </select>
                </div>
                {isLoading ? (
                    // Show skeletons while loading
                    [...Array(6)].map((_, index) => (
                        <ProductCardSkeleton key={index} />
                    ))
                ) : listedItems.length === 0 ? (
                    <h1 className="text-center col-span-2 text-gray-500 mt-10">
                        No items listed for sale.
                    </h1>
                ) : (
                    listedItems.map((listing) => (
                        <ProductCard
                            key={listing.listing_id}
                            listing={listing}
                            navigate={navigate}
                            onConnect={handleConnect}
                            onShare={handleShare}
                        />
                    ))
                )}
                <div ref={loaderRef} className="col-span-2 h-10" />
            </div>
        </div>
    );
}
