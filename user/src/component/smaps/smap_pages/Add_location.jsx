import { useState, useRef, useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";
import "leaflet/dist/leaflet.css";

export default function Add_location() {
    const navigate = useNavigate();
    const mapRef = useRef(null);
    const [center, setCenter] = useState({ lat: 19.1334, lng: 72.9133 }); // Default center
    const [currentZoom, setCurrentZoom] = useState(5);

    // Component to track map movement and zoom
    function MapEvents() {
        const map = useMap();

        // Track zoom level changes
        useEffect(() => {
            const handleZoomEnd = () => {
                setCurrentZoom(map.getZoom());
            };

            map.on('zoomend', handleZoomEnd);

            return () => {
                map.off('zoomend', handleZoomEnd);
            };
        }, [map]);

        // Update center state when map move ends
        useEffect(() => {
            const handleMoveEnd = () => {
                setCenter(map.getCenter());
            };

            map.on('moveend', handleMoveEnd);

            return () => {
                map.off('moveend', handleMoveEnd);
            };
        }, [map]);

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

            {/* Zoom Out Button - appears when zoom > 6 */}
            {currentZoom > 6 && (
                <button
                    className="absolute top-4 right-4 z-[1000] px-4 py-2.5 bg-[#F06CB7] text-white border-none rounded-lg cursor-pointer font-bold shadow-md flex items-center gap-2 hover:bg-[#E05BA6] transition-colors"
                    onClick={() => {
                        if (mapRef.current) {
                            mapRef.current.setZoom(4);
                        }
                    }}
                >
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="8" y1="11" x2="14" y2="11"></line>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                </button>
            )}

            {/* Map */}
            <MapContainer
                center={[11.027456478466824, 77.02760607004167]} //CIT College Location 
                zoom={5}
                minZoom={4}
                maxZoom={18}
                style={{ height: "100%", width: "100%" }}
                ref={mapRef}
                zoomControl={false}
                zoomSnap={0.1}
                zoomDelta={0.1}
                wheelPxPerZoomLevel={120}
                touchZoom={true}
                scrollWheelZoom={true}
                doubleClickZoom={true}
                boxZoom={true}
                keyboard={true}
                dragging={true}
                zoomAnimation={true}
                zoomAnimationThreshold={4}
                fadeAnimation={true}
                markerZoomAnimation={true}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution=''
                />
                <MapEvents />
            </MapContainer>

            {/* Center Marker Overlay */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1000] pointer-events-none flex flex-col items-center justify-center">
                {/* Pin Icon */}
                <div className="w-4 h-4 rounded-full border-2 border-white bg-red-500 shadow-lg shadow-black/30 relative"></div>

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