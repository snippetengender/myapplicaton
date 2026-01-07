import { useNavigate, useParams, useLocation } from "react-router-dom" ;
// import bucketImage from './Assets/stanley_bucket.webp';
import ConnectButton  from "./components/Share_button";
import api from "../../../providers/api";
import { useState, useEffect } from "react";
import Completed_listing from "./components/completed_button";

export default function Item_Info(){
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from || "all_listing";
    const [listing, setListing] = useState({});
    const { listingId } = useParams();

    const listingInfo = async () => {
        try{
            const listingDetails = await api.get(`/marketplace/${listingId}`, {});
            setListing(listingDetails.data);
        }
        catch (error){
            console.error('Error fetching listing info:', error);
        }
    };

    useEffect(() => {
        listingInfo();
    }, []);

    return(
        <div className="font-inter min-h-screen bg-black text-brand-off-white flex flex-col pt-[0px]">
            {/* Header */}
            <div className="flex justify-between m-4">
                <button className="border-gray-700 border-2 px-6 rounded-xl" onClick={() => navigate('/smarket')}>Back</button>
                <button className="border-gray-700 border-2 px-6 rounded-xl">Share</button>
                {from === "your_listing" ?<button className="border-gray-700 border-2 px-6 rounded-xl" onClick={() =>
                    navigate('/smarket/selling_now', {
                        state: {
                        mode: "edit",
                        listing
                    }})}>Edit</button>: null}
            </div>
            {/* Body */}
            <div className="m-4">
                <img src={listing.product_image?.[0]} className="flex justify-center rounded-md w-auto h-auto"/>
                <h1 className="text-4xl font-semibold my-4">{listing.product_name}</h1>
                <h1 className="text-sm">{listing.category}</h1>

                <h1 className="text-2xl font-semibold my-4">Rs. {listing.price}</h1>
                <h1 className="text-sm">Description : {listing.description}</h1>
                <br/>
                <h1 className="text-2xl font-semibold my-4">Seller Information</h1>

                <div className="grid grid-cols-1 gap-y-4">

                    <div className="flex items-center">
                    <img src="https://picsum.photos/50/50?random=1" alt="Image 1" className="mr-2 rounded-full" />
                    <h1>{listing.owner_name}</h1>
                    </div>

                    <div className="flex items-center">
                    <img src="https://picsum.photos/50/50?random=2" alt="Image 2" className="mr-2 rounded-full" />
                    <h1>{listing.college_name}</h1>
                    </div>

                    <div className="flex items-center">
                    <img src="https://picsum.photos/50/50?random=3" alt="Image 3" className="mr-2 rounded-full" />
                    <h1>{listing.phone_number}</h1>
                    </div>

                    <div className="flex items-center">
                    <img src="https://picsum.photos/50/50?random=4" alt="Image 4" className="mr-2 rounded-full" />
                    <h1>{listing.posted_at}</h1>
                    </div>
                </div>
                {from === "all_listing" ?
                 <ConnectButton phoneNumber={listing.phone_number} productName={listing.product_name}/> : 
                 <Completed_listing listingId={listingId} status = {listing.live}/>}
                <br/>
                <h1 className="text-2xl font-bold my-8">Similar Products</h1>
                <div className="grid grid-cols-2 gap-4">
                    <b>development in progress</b>
                </div>   
                    
                </div>
            </div>
    );
}