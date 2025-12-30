import { useState, useRef } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";
import "leaflet/dist/leaflet.css";

export default function Add_location() {
    const navigate = useNavigate();
    const mapRef = useRef(null);
    const [center, setCenter] = useState({ lat: 19.1334, lng: 72.9133 }); // Default center

    // Component to track map movement
    function MapEvents() {
        const map = useMap();
        // Update center state when map move ends
        map.on('moveend', () => {
            setCenter(map.getCenter());
        });
        return null;
    }

    const handleSaveLocation = () => {
        // Get the current center of the map directly from the ref or state
        // Using ref is often more precise if state update is lagging,
        // but state is updated on moveend so it should be fine.
        const currentCenter = mapRef.current ? mapRef.current.getCenter() : center;

        localStorage.setItem('temp_location', JSON.stringify({
            lat: currentCenter.lat,
            lng: currentCenter.lng
        }));

        navigate('/events/add_events');
    };

    return (
        <div className="relative h-screen w-full bg-black">
            {/* Header / Back Button */}
            <div className="absolute top-0 left-0 right-0 z-[1000] p-4 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
                <button
                    onClick={() => navigate('/events/add_events')}
                    className="pointer-events-auto bg-black/50 backdrop-blur-md p-2 rounded-full text-white border border-white/10"
                >
                    <ArrowLeft size={24} />
                </button>
            </div>

            {/* Map */}
            <MapContainer
                center={[19.1334, 72.9133]}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
                ref={mapRef}
                zoomControl={false}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; OpenStreetMap contributors'
                />
                <MapEvents />
            </MapContainer>

            {/* Center Marker Overlay */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[900] pointer-events-none flex flex-col items-center justify-center pb-8">
                {/* Pin Icon */}
                <div className="relative">
                    <div className="w-4 h-4 rounded-full border-2 border-white bg-red-500 shadow-lg shadow-black/30 z-10 relative"></div>
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[2px] h-4 bg-black/50"></div>
                </div>
                {/* Optional: explicit text label if desired, but a pin is usually enough */}
                <div className="mt-1 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded-full backdrop-blur-sm">
                    Center
                </div>
            </div>

            {/* Save Button */}
            <div className="absolute bottom-8 left-0 right-0 px-4 z-[1000]">
                <button
                    onClick={handleSaveLocation}
                    className="w-full bg-white text-black font-semibold py-3 px-4 rounded-xl shadow-lg hover:bg-gray-200 transition-transform active:scale-95 flex items-center justify-center gap-2"
                >
                    <Check size={20} />
                    Set Location
                </button>
            </div>
        </div>
    );
}