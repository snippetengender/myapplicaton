import { useNavigate } from "react-router-dom";
import ConnectButton  from "./components/Share_button";
import api from "../../../providers/api";

export default function All_listing(){
    const navigate = useNavigate();
    

    const ListedForSale = async () => {
        ListedItems = await api.get('/marketplace/');
        return ListedItems.data;
    }

    const phoneNumber = '+919487079169'; // Your phone number
    const productName = 'Awesome Widget'; // Your product name

    return(
        <div className="m-4 grid grid-cols-2 gap-4">

            {/* Items */}
            <div className="border-2 border-gray-700 rounded-2xl p-5 hover:bg-gray-900 w-full h-min">
                <div className="flex flex-col justify-start font-medium">
                    <img 
                        src="./src/component/smarket/smarket_pages/Assets/stanley_bucket.webp"
                        className="rounded-2xl"
                        onClick={() => navigate('/smarket/item-info')}/>
                    <h1 className="text-xl mt-2">Bucket</h1>
                    <div className="flex grid-cols-2 justify-between">
                        <h1 className="text-2xl">Rs. 30,000</h1>
                        <h1 className="text-right "onClick={() => alert("share")}>share</h1>
                    </div>
                    <h1 className="text-[10px]">Coimbatore Institute Of Technology</h1>
                </div>
                    <ConnectButton 
                        className="bg-white text-black text-2xl font-normal mt-2 px-2 rounded-md w-full"
                        phoneNumber={phoneNumber} productName={productName}/>
            </div>
{/*             
            <div className="border-2 border-gray-700 rounded-2xl p-5 hover:bg-gray-900 w-full h-min">
                <div className="flex flex-col justify-start font-medium">
                    <img 
                        src="./src/component/smarket/smarket_pages/Assets/stanley_bucket.webp"
                        className="rounded-2xl"
                        onClick={() => navigate('/smarket/item-info')}/>
                    <h1 className="text-xl mt-2">Bucket</h1>
                    <div className="flex grid-cols-2 justify-between">
                        <h1 className="text-2xl">Rs. 30,000</h1>
                        <h1 className="text-right "onClick={() => alert("share")}>share</h1>
                    </div>
                    <h1 className="text-[10px]">Coimbatore Institute Of Technology</h1>
                </div>
                    <button 
                        className="bg-white text-black text-2xl font-normal mt-2 px-2 rounded-md w-full"
                        onClick={() => alert("connected")}>connect</button>
            </div>
            
            <div className="border-2 border-gray-700 rounded-2xl p-5 hover:bg-gray-900 w-full h-min">
                <div className="flex flex-col justify-start font-medium">
                    <img 
                        src="./src/component/smarket/smarket_pages/Assets/stanley_bucket.webp"
                        className="rounded-2xl"
                        onClick={() => navigate('/smarket/item-info')}/>
                    <h1 className="text-xl mt-2">Bucket</h1>
                    <div className="flex grid-cols-2 justify-between">
                        <h1 className="text-2xl">Rs. 30,000</h1>
                        <h1 className="text-right "onClick={() => alert("share")}>share</h1>
                    </div>
                    <h1 className="text-[10px]">Coimbatore Institute Of Technology</h1>
                </div>
                    <button 
                        className="bg-white text-black text-2xl font-normal mt-2 px-2 rounded-md w-full"
                        onClick={() => alert("connected")}>connect</button>
            </div>
            <div className="border-2 border-gray-700 rounded-2xl p-5 hover:bg-gray-900 w-full h-min">
                <div className="flex flex-col justify-start font-medium">
                    <img 
                        src="./src/component/smarket/smarket_pages/Assets/stanley_bucket.webp"
                        className="rounded-2xl"
                        onClick={() => navigate('/smarket/item-info')}/>
                    <h1 className="text-xl mt-2">Bucket</h1>
                    <div className="flex grid-cols-2 justify-between">
                        <h1 className="text-2xl">Rs. 30,000</h1>
                        <h1 className="text-right "onClick={() => alert("share")}>share</h1>
                    </div>
                    <h1 className="text-[10px]">Coimbatore Institute Of Technology</h1>
                </div>
                    <button 
                        className="bg-white text-black text-2xl font-normal mt-2 px-2 rounded-md w-full"
                        onClick={() => alert("connected")}>connect</button>
            </div>
            <div className="border-2 border-gray-700 rounded-2xl p-5 hover:bg-gray-900 w-full h-min">
                <div className="flex flex-col justify-start font-medium">
                    <img 
                        src="./src/component/smarket/smarket_pages/Assets/stanley_bucket.webp"
                        className="rounded-2xl"
                        onClick={() => navigate('/smarket/item-info')}/>
                    <h1 className="text-xl mt-2">Bucket</h1>
                    <div className="flex grid-cols-2 justify-between">
                        <h1 className="text-2xl">Rs. 30,000</h1>
                        <h1 className="text-right "onClick={() => alert("share")}>share</h1>
                    </div>
                    <h1 className="text-[10px]">Coimbatore Institute Of Technology</h1>
                </div>
                    <button 
                        className="bg-white text-black text-2xl font-normal mt-2 px-2 rounded-md w-full"
                        onClick={() => alert("connected")}>connect</button>
            </div>
            <div className="border-2 border-gray-700 rounded-2xl p-5 hover:bg-gray-900 w-full h-min">
                <div className="flex flex-col justify-start font-medium">
                    <img 
                        src="./src/component/smarket/smarket_pages/Assets/stanley_bucket.webp"
                        className="rounded-2xl"
                        onClick={() => navigate('/smarket/item-info')}/>
                    <h1 className="text-xl mt-2">Bucket</h1>
                    <div className="flex grid-cols-2 justify-between">
                        <h1 className="text-2xl">Rs. 30,000</h1>
                        <h1 className="text-right "onClick={() => alert("share")}>share</h1>
                    </div>
                    <h1 className="text-[10px]">Coimbatore Institute Of Technology</h1>
                </div>
                    <button 
                        className="bg-white text-black text-2xl font-normal mt-2 px-2 rounded-md w-full"
                        onClick={() => alert("connected")}>connect</button>
            </div>
            <div className="border-2 border-gray-700 rounded-2xl p-5 hover:bg-gray-900 w-full h-min">
                <div className="flex flex-col justify-start font-medium">
                    <img 
                        src="./src/component/smarket/smarket_pages/Assets/stanley_bucket.webp"
                        className="rounded-2xl"
                        onClick={() => navigate('/smarket/item-info')}/>
                    <h1 className="text-xl mt-2">Bucket</h1>
                    <div className="flex grid-cols-2 justify-between">
                        <h1 className="text-2xl">Rs. 30,000</h1>
                        <h1 className="text-right "onClick={() => alert("share")}>share</h1>
                    </div>
                    <h1 className="text-[10px]">Coimbatore Institute Of Technology</h1>
                </div>
                    <button 
                        className="bg-white text-black text-2xl font-normal mt-2 px-2 rounded-md w-full"
                        onClick={() => alert("connected")}>connect</button>
            </div> */}
        </div>
    );
}


