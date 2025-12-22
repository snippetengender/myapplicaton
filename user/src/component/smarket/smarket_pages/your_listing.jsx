import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../../providers/api";

export default function  Your_listing(){

    const user_id = localStorage.getItem("user_id", "");
    const navigate = useNavigate();
    const [userListings, setUserListings] = useState([]);

    const fetchUserListing = async () => {
        try {
            const response = await api.get(`/marketplace/${user_id}/listings`, {});
            setUserListings(response.data);
            console.log("Listings fetched:", response.data);
        } catch (error) {
            console.error('Error fetching listings:', error);
        }
    };

    useEffect(() => {
        fetchUserListing();
    }, []);

    return (
    <div className="m-4 grid grid-cols-2 gap-4">
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
                onClick={() => navigate(`/smarket/${listing.listing_id}`, {state: { from: "your_listing" }})}
            />

            <h1 className="text-xl mt-2">
                {listing.product_name}
            </h1>

            <div className="flex justify-between items-center">
                <h1 className="text-2xl">
                Rs. {listing.price}
                </h1>

                <button
                className="cursor-pointer text-sm"
                onClick={() => alert("share")}
                >
                share
                </button>
            </div>

            <h1 className="text-[10px] text-gray-400">
                {listing.show}
            </h1>
            <div><h1 className="text-[10px]"> {listing.live}</h1></div>
            </div>
            <div><h1 className="text-[10px]"> {listing.posted_at}</h1></div>
        </div>
        )))}
    </div>
    );
}


