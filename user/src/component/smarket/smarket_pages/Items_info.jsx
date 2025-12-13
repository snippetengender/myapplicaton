import { useNavigate } from "react-router-dom" ;
import bucketImage from './Assets/stanley_bucket.webp';
import ConnectButton  from "./components/Share_button"


export default function Item_Info(){
    const navigate = useNavigate();

    const phoneNumber = '+919487079169'; // Your phone number
    const productName = 'Awesome Widget'; // Your product name
    return(
        <div className="font-inter min-h-screen bg-black text-brand-off-white flex flex-col pt-[0px]">
            {/* Header */}
            <div className="flex justify-between m-4">
                <button className="border-gray-700 border-2 px-6 rounded-xl" onClick={() => navigate('/smarket')}>Back</button>
                <button className="border-gray-700 border-2 px-6 rounded-xl">Share</button>
            </div>
            {/* Body */}
            <div className="m-4">
                <img src={bucketImage} className="flex justify-center rounded-md w-auto h-auto"/>
                <h1 className="text-4xl font-semibold my-4">Bucket</h1>
                <h1 className="text-sm">Electronics and Gadgets</h1>

                <h1 className="text-2xl font-semibold my-4">Rs. 150</h1>
                <h1 className="text-sm">Description : Step into the world of The Stanley Parable with the iconic Stanley Bucket – a must-have item for anyone navigating the strange and unpredictable office landscape. Whether you're questioning your existence or just in need of a good bucket, this trusty container is here to assist in all your metaphysical adventures.</h1>
                <br/>
                <h1 className="text-2xl font-semibold my-4">Seller Information</h1>

                <div className="grid grid-cols-1 gap-y-4">

                    <div className="flex items-center">
                    <img src="https://picsum.photos/50/50?random=1" alt="Image 1" className="mr-2 rounded-full" />
                    <h1>Aditya Bagala</h1>
                    </div>

                    <div className="flex items-center">
                    <img src="https://picsum.photos/50/50?random=2" alt="Image 2" className="mr-2 rounded-full" />
                    <h1>Coimbatore Institute of Technology</h1>
                    </div>

                    <div className="flex items-center">
                    <img src="https://picsum.photos/50/50?random=3" alt="Image 3" className="mr-2 rounded-full" />
                    <h1>Phone Number</h1>
                    </div>

                    <div className="flex items-center">
                    <img src="https://picsum.photos/50/50?random=4" alt="Image 4" className="mr-2 rounded-full" />
                    <h1>Updated on</h1>
                    </div>
                </div>
                <ConnectButton 
                        className="bg-white text-black text-2xl font-normal mt-2 px-2 rounded-md w-full"
                        phoneNumber={phoneNumber} productName={productName}/>
                <br/>
                <h1 className="text-2xl font-bold my-8">Similar Products</h1>

                <div className="grid grid-cols-2 gap-4">
                    <div className="border-2 border-gray-700 rounded-2xl p-5 hover:bg-gray-900 w-full h-min">
                        <div className="flex flex-col justify-start font-medium">
                            <img 
                                src={bucketImage}
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

                    {/* <div className="border-2 border-gray-700 rounded-2xl p-5 hover:bg-gray-900 w-full h-min">
                        <div className="flex flex-col justify-start font-medium">
                            <img 
                                src={bucketImage}
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
                                src={bucketImage}
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
                                src={bucketImage}
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
            </div>
        </div>
    );
}