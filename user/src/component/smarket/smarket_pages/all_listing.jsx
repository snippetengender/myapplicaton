import { useNavigate } from "react-router-dom";
import ConnectButton from "./components/Share_button";
import api from "../../../providers/api";
import { useState, useEffect, useRef } from "react";

export default function All_listing(){
    const navigate = useNavigate();
    const [listedItems, setListedItems] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const loaderRef = useRef(null);
    
    const fetchListings = async (page = 1, limit = 10) => {
        try
        {
            const response = await api.get('/marketplace/live', {params: {page, limit}});
            return response.data
        }
        catch (error)
        {
            console.error('Error fetching listings:', error);
        }};

    const loadMoreListings = async (currentPage) => {
        if (!hasMore) return;
        console.log("page value is:", currentPage);
        const res = await fetchListings(currentPage, 10);
        setListedItems(prev => {
            const updated = [...prev, ...res.data];
            if (updated.length >= res.pagination.total) {
            setHasMore(false);
            }
            return updated;
        });
        setPage(p => p + 1);
        };

    useEffect(() => {
        if (!hasMore) return;
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
            observer.disconnect();
            loadMoreListings(page);
            }
        });
        if (loaderRef.current) observer.observe(loaderRef.current);
        return () => observer.disconnect();
        }, [page, hasMore]);

    return(
        <div className="m-4 grid grid-cols-2 gap-4">
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
