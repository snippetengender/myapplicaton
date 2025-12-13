import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { Menu, RefreshCw, MapPin } from "lucide-react";
import "leaflet/dist/leaflet.css";

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
        </div>
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
    iconSize: [60, 68],
    iconAnchor: [30, 68],
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
  const [selectedFilter, setSelectedFilter] = useState("Online and Offline");

  return (
    <div className="bg-black min-h-screen text-white flex flex-col">
      {/* Header */}
      <div className="bg-black p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button className="text-white">
            <Menu size={24} />
          </button>
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <span className="text-black font-bold text-xl">SP</span>
          </div>
        </div>
        <button className="text-white">
          <RefreshCw size={24} />
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-black px-4 pb-4 flex items-center justify-between">
        <button className="text-white flex items-center gap-2">
          <span>{selectedFilter}</span>
          <span className="text-sm">▼</span>
        </button>
        <button className="text-white text-sm">Add Event</button>
      </div>

      {/* Map */}
      <div className="relative h-64 w-full">
        <MapContainer
          center={[19.1334, 72.9133]}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
          zoomControl={false}
        >
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

      {/* Events List */}
      <div className="flex-1 bg-black px-4 py-4 space-y-4 overflow-y-auto">
        {events.map((event, index) => (
          <div key={event.id}>
            <div className="text-gray-400 text-sm mb-2">{event.date}</div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 flex gap-3">
              <img
                src={event.image}
                alt={event.title}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h3 className="text-white font-medium mb-1">{event.title}</h3>
                <div className="flex items-center gap-1 text-gray-400 text-sm mb-1">
                  <MapPin size={14} />
                  <span>{event.location}</span>
                </div>
                <div className="text-gray-400 text-sm">{event.time}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 px-2 py-1 z-10">
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
              onClick={() => { 
                navigate('/smarket')
              } }
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