import { useState, useRef, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { Menu, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";

import "leaflet/dist/leaflet.css";
import LogoIcon from "../snippetIcon/Vector.svg";

// Fix default Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Custom marker icon with event poster
const createCustomIcon = (imageUrl) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="position: relative;">
        <!-- Image Container -->
        <div style="
          width: 60px;
          height: 60px;
          border-radius: 8px;
          overflow: hidden;
          border: 3px solid #fff;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          background: #000;
        ">
          <img src="${imageUrl}" style="width: 100%; height: 100%; object-fit: cover;" />
          
          <!-- Pink Dot in the Center -->
          <div style="
            position: absolute;
            top: 120%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 12px;
            height: 12px;
            background-color: pink;
            border-radius: 50%;
            border: 2px solid white;
          "></div>
        </div>

        <!-- Triangle Pointer (downward) -->
        <div style="
          position: absolute;
          bottom: -8px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-top: 8px solid #fff;
        "></div>
      </div>
    `,
    iconSize: [60, 68], // The size of the entire icon
    iconAnchor: [30, 68], // Where the icon's anchor is located
  });
};

const events = [
  {
    id: 1,
    title: "Mood Indigo",
    location: "IIT Bombay",
    date: "Aug 2 / Saturday",
    time: "9:00 PM",
    lat: 19.1334,
    lng: 72.9133,
    image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop"
  },
  {
    id: 2,
    title: "Mood Indigo",
    location: "IIT Bombay",
    date: "Aug 2 / Saturday",
    time: "9:00 PM",
    lat: 19.1434,
    lng: 72.9233,
    image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop"
  },
  {
    id: 3,
    title: "Manad Blitz Bangalore",
    location: "By NSRCEL, IIM Bangalore",
    date: "Aug 2 / Saturday",
    time: "9:00 PM",
    lat: 19.1234,
    lng: 72.9033,
    image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop"
  }
];

export default function EventsMapPage() {
  const [zoomLevel, setZoomLevel] = useState(5);  // Default zoom level for India
  const mapRef = useRef();
  const navigate = useNavigate();

  // Hook to update zoom level
  const MapUpdater = () => {
    const map = useMap();
    useEffect(() => {
      map.setZoom(zoomLevel);  // Update zoom when zoomLevel changes
      map.options.zoomSnap = 0.1;  // Finer zoom steps for smooth zooming
      map.options.zoomDelta = 0.5; // Adjust zooming steps for more control
    }, [zoomLevel, map]);

    return null;
  };

  return (
    <div className="bg-black min-h-screen text-white flex">
      {/* Left side: Map */}
      <div className="relative flex-1 overflow-auto">
        <MapContainer
          ref={mapRef}
          center={[19.1334, 72.9133]}  // Center of India
          zoom={zoomLevel}
          minZoom={5}  // Minimum zoom level for India view
          maxZoom={18}  // Maximum zoom level (can adjust)
          style={{ height: "100vh", width: "100%" }}
          zoomControl={false}  // Disable Leaflet's default zoom control
        >
          {/* Update map zoom via custom component */}
          <MapUpdater />
          
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
          {events.map((event) => (
            <Marker
              key={event.id}
              position={[event.lat, event.lng]}
              icon={createCustomIcon(event.image)}
            >
              <Popup>
                <div className="text-black">
                  <strong>{event.title}</strong>
                  <br />
                  {event.location}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Right side: Zoom Slider
      <div className="flex flex-col justify-between p-4 bg-black border-l border-gray-700 overflow-auto">
        <div className="mb-4">
          <label htmlFor="zoom-slider" className="text-white">Zoom Level</label>
          <input
            id="zoom-slider"
            type="range"
            min="3"  // Minimum zoom for India
            max="18"  // Maximum zoom level
            value={zoomLevel}
            onChange={(e) => setZoomLevel(parseInt(e.target.value))}
            className="w-full"
          />
          <div className="text-white text-center mt-2">Zoom: {zoomLevel}</div>
        </div>
      </div> */}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 px-2 py-1 z-10 m-2">
        <div className="bg-black border border-brand-charcoal rounded-[15px] px-4 py-2 flex justify-between items-center">
          <button
            className="bg-black text-brand-off-white text-[12px] px-4 py-1 rounded-[10px]"
            onClick={() => navigate('/home')}
          >
            Home
          </button>
          <button
            className="bg-black text-brand-off-white text-[12px] px-4 py-1 rounded-[10px]"
            onClick={() => navigate('/events')}
          >
            Events
          </button>
          <button
            className="bg-black text-brand-off-white text-[12px] px-4 py-1 rounded-[10px]"
            onClick={() => navigate('/smarket')}
          >
            Marketplace
          </button>
          <button
            className="bg-black text-brand-off-white text-[12px] px-4 py-1 rounded-[10px]"
            // onClick={() => navigate(`/profile/${userId}`)}
          >
            Profile
          </button>
        </div>
      </div>
    </div>
  );
}
