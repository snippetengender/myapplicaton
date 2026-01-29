import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import api from "../../../providers/api";
import { LISTING_CATEGORY } from "./constants/listingStatus";
import { FiChevronRight } from "react-icons/fi";
import YourListingSkeleton from "./components/YourListingSkeleton";

export default function Your_listing() {

    const navigate = useNavigate();
    const [userListings, setUserListings] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const loaderRef = useRef(null);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const fetchUserListing = async (page = 1, limit = 10, category = null) => {
        try {
            const params = { page, limit };
            if (category) params.category = category;

            const response = await api.get(`/marketplace/user/listings`, { params: params });
            return response.data
        } catch (error) {
            console.error('Error fetching listings:', error);
        }
    };

    const loadMoreListings = async (currentPage) => {
        if (!hasMore) return;
        console.log("page value is:", currentPage);
        if (currentPage === 1 && userListings.length > 0) return;
        const res = await fetchUserListing(currentPage, 10, selectedCategory);
        setUserListings(prev => {
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

    useEffect(() => {
        setUserListings([]);
        setPage(1);
        setHasMore(true);
    }, [selectedCategory]);

    // Initial load on mount
    useEffect(() => {
        loadMoreListings(1);
    }, []);

    // IntersectionObserver for infinite scroll (subsequent loads)
    useEffect(() => {
        if (!hasMore || isLoading || page === 1) return;
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                loadMoreListings(page);
                observer.disconnect();
                loadMoreListings(page);
            }
        });
        if (loaderRef.current) observer.observe(loaderRef.current);
        return () => observer.disconnect();
    }, [page, hasMore, isLoading, selectedCategory]);

    const getStatusInfo = (live, removed) => {
        if (live === "sold") return { color: "bg-red-500", text: "Sold" };
        return { color: "bg-green-500", text: "Live" };
    };

    return (
        <div className="m-4 grid grid-cols-2 gap-4">
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
            {userListings.length === 0 ? (
                <h1 className="text-center col-span-2 text-gray-500 mt-10">
                    You have no listings yet.
                </h1>
            ) : (
                userListings.map((listing) => (
                    <div
                        key={listing.listing_id || listing.posted_at}
                        className="border-2 border-gray-700 rounded-2xl p-5 hover:bg-gray-900 w-full h-min"
                    >
                        <div className="flex flex-col justify-start font-medium">

                            <img
                                src={listing.product_image?.[0]}
                                alt={listing.product_name}
                                className="rounded-2xl cursor-pointer"
                                onClick={() => navigate(`/smarket/${listing.listing_id}`, { state: { from: "your_listing" } })}
                            />

                            {/* Info - Right Side */}
                            <div className="flex flex-col flex-1 min-w-0">
                                <h3 className="text-gray-400 text-[10px] font-medium mb-0.5">@cit</h3>
                                <h2 className="text-white text-md font-bold leading-tight mb-1 truncate">
                                    {listing.product_name}
                                </h2>
                                <div className="text-white text-lg font-bold mb-1">
                                    Rs. {listing.price}
                                </div>
                                <div className="text-gray-400 text-[9px] mb-2">
                                    Updated On : {listing.posted_at || "Dec 8, 05:44 PM"}
                                </div>

                                <div className="flex items-center gap-1.5 mt-auto">
                                    <div className={`w-2 h-2 rounded-full ${status.color}`}></div>
                                    <span className="text-gray-300 text-[10px] font-medium">
                                        {status.text}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Edit Button */}
                        <button
                            onClick={() => navigate('/smarket/selling_now', {
                                state: {
                                    mode: "edit",
                                    listing
                                }
                            })}
                            className="w-full mt-3 bg-gray-200 hover:bg-white text-black text-sm font-bold py-1.5 rounded-lg flex items-center justify-center gap-1 transition-colors"
                        >
                            edit your product <FiChevronRight />
                        </button>
                    </div>
                ))
            )}
            <div ref={loaderRef} className="h-10" />
        </div>
    );
}
