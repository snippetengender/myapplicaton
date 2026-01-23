import { useNavigate } from "react-router-dom";
import ConnectButton from "./components/Share_button";
import api from "../../../providers/api";
import { useState, useEffect, useRef } from "react";
import { LISTING_CATEGORY } from "./constants/listingStatus";

export default function All_listing(){
    const navigate = useNavigate();
    const [listedItems, setListedItems] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const loaderRef = useRef(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    
    const fetchListings = async (page = 1, limit = 10, category = null) => {
        try
        {
            const params = { page, limit };
            if (category) params.category = category;   

            const response = await api.get('/marketplace/live', {params: params});
            return response.data
        }
        catch (error)
        {
            console.error('Error fetching listings:', error);
        }};

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
        };

    useEffect(() => {
        setListedItems([]); 
        setPage(1);           
        setHasMore(true);
        }, [selectedCategory]);

    useEffect(() => {
        if (!hasMore) return;
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
            loadMoreListings(page);
            }
        });
        if (loaderRef.current) observer.observe(loaderRef.current);
        return () => observer.disconnect();
        }, [page, hasMore, selectedCategory]);

    return(
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
            {listedItems.length === 0 ? (
                <h1 className="text-center col-span-2 text-gray-500 mt-10">
                    No items listed for sale.
                </h1>
            ) : (
                listedItems.map((listing) => (
            <div key={listing.listing_id}
            className="border-2 border-gray-700 rounded-2xl p-5 hover:bg-gray-900 w-full h-min">
                <div className="flex flex-col justify-start font-medium">
                    <img 
                        src={listing.product_image?.[0]} 
                        alt={listing.product_name}
                        className="rounded-2xl"
                        onClick={() => navigate(`/smarket/${listing.listing_id}`)}/>
                    <h1 className="text-xl mt-2">
                        {listing.product_name}
                    </h1>
                    
                    <div className="flex grid-cols-2 justify-between">
                        <h1 className="text-2xl">
                            Rs. {listing.price}
                        </h1>
                        <h1 className="text-right "onClick={() => alert("share")}>share</h1>
                    </div>
                    <h1 className="text-[10px]">{listing.show}</h1>
                    </div>
                    <div><h1 className="text-[10px]"> {listing.posted_at}</h1></div>
                    <ConnectButton 
                        className="bg-white text-black text-2xl font-normal mt-2 px-2 rounded-md w-full"
                        phoneNumber={listing.phone_number} productName={listing.product_name}/>
            </div>) ))}
        <div ref={loaderRef} className="col-span-2 h-10" />
        </div>
    );
}
