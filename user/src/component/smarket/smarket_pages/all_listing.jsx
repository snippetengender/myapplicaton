import { useNavigate } from "react-router-dom";
import ConnectButton  from "./components/Share_button";
import api from "../../../providers/api";
import { useState, useEffect } from "react";

export default function All_listing(){
    const navigate = useNavigate();
    const [listedItems, setListedItems] = useState([]);
    
    const ListedForSale = async () => {
        try
        {
            const listedItems = await api.get('/marketplace/', {});
            setListedItems(listedItems.data);
            console.log("Listings fetched:", listedItems.data);
        }
        catch (error)
        {
            console.error('Error fetching listings:', error);
        }}

    useEffect(() => {
        ListedForSale();
    }, []);

    return(
        <div className="m-4 grid grid-cols-2 gap-4">
            {listedItems.length === 0 ? (
                <h1 className="text-center col-span-2 text-gray-500 mt-10">
                    No items listed for sale.
                </h1>
            ) : (
                listedItems.map((listing) => (
            <div className="border-2 border-gray-700 rounded-2xl p-5 hover:bg-gray-900 w-full h-min">
                <div className="flex flex-col justify-start font-medium">
                    <img 
                        src={listing.product_image?.[0]} 
                        alt={listing.product_name}
                        className="rounded-2xl"
                        onClick={() => navigate(`/smarket/${listing.listing_id}`)}/>
                    <h1 className="text-xl mt-2">
                        {listing.name}
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
        </div>
    );
}


