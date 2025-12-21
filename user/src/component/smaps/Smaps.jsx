import { useState, useRef, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { useNavigate } from "react-router-dom";

import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';
import "leaflet/dist/leaflet.css";

import SearchIcon from "../snippetIcon/search-status.svg";
import HamburgerIcon from "../snippetIcon/menu.svg";
import LogoIcon from "../snippetIcon/Vector.svg";

// Fix default Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Custom marker icon
const createCustomIcon = () => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: 12px;
        height: 12px;
        background-color: #ff00c2;
        border-radius: 50%;
        border: 2px solid white;
      "></div>
    `,
    iconSize: [12, 12],      // MUST match actual size
    iconAnchor: [6, 6],      // Center of the dot
  });
};

// Events with various test cases (adjusted near Delhi, Mumbai, Chennai)
const events = [
  { id: 1, title: "Mood Indigo", location: "IIT Bombay", lat: 19.1334, lng: 72.9133 },  // Near Mumbai
  { id: 2, title: "Mood Indigo", location: "IIT Bombay", lat: 19.1434, lng: 72.9233 },  // Near Mumbai
  { id: 3, title: "Manad Blitz Bangalore", location: "By NSRCEL, IIM Bangalore", lat: 19.1234, lng: 72.9033 }, // Near Mumbai

  // New events near Delhi
  { id: 5, title: "Tech Summit", location: "Mumbai", lat: 28.5721, lng: 77.3200 },  // Near Delhi
  { id: 6, title: "Hackathon", location: "IIT Delhi", lat: 28.5421, lng: 77.1688 },  // Near Delhi
  { id: 7, title: "Music Carnival", location: "Hyderabad", lat: 28.7041, lng: 77.1025 }, // Near Delhi

  // New events near Chennai
  { id: 8, title: "Startup Expo", location: "Bangalore", lat: 13.0827, lng: 80.2707 },  // Near Chennai
  { id: 9, title: "Art Gallery", location: "Delhi", lat: 13.0878, lng: 80.2785 },  // Near Chennai
  { id: 10, title: "Food Festival", location: "Chennai", lat: 13.0827, lng: 80.2707 }  // Near Chennai
];


export default function EventsMapPage() {
  const [zoomLevel, setZoomLevel] = useState(5);  // Default zoom level for India
  const mapRef = useRef();
  const navigate = useNavigate();

  // Function to add markers to the map
  const updateMarkers = (map) => {
    // Clear existing markers if any (optional but good if we had updates)
    // For now, we are creating a fresh group.

    const markerCluster = new L.MarkerClusterGroup();

    // Combine default events with user events
    const storedEvents = JSON.parse(sessionStorage.getItem('user_events') || '[]');
    const userEvents = storedEvents.map(e => ({
      id: e.id,
      title: e.name,
      location: e.college,
      lat: e.lat,
      lng: e.lng,
      time: e.time
    }));

    const allEvents = [...events, ...userEvents];

    allEvents.forEach((event) => {
      if (!event.lat || !event.lng) return;

      const latlng = [event.lat, event.lng];
      const marker = L.marker(latlng, { icon: createCustomIcon() });

      marker.bindPopup(`
        <div style="color: black; font-family: sans-serif;">
            <strong style="display: block; margin-bottom: 4px;">${event.title}</strong>
            <span style="color: #666; display: block;">${event.location}</span>
            ${event.time ? `<span style="color: #999; font-size: 12px; display: block; margin-top: 4px;">${event.time}</span>` : ''}
        </div>
      `);

      markerCluster.addLayer(marker);
    });

    map.addLayer(markerCluster);

    // Save reference if needed for cleanup, but for this simple scoped component it's okay
    // We could return the layer to cleanup in useEffect
    return markerCluster;
  };

  const MapUpdater = () => {
    const map = useMap();
    const clusterRef = useRef(null);

    useEffect(() => {
      map.setZoom(zoomLevel);

      // Clean up previous cluster group
      if (clusterRef.current) {
        map.removeLayer(clusterRef.current);
      }

      // Add new markers
      clusterRef.current = updateMarkers(map);

      return () => {
        if (clusterRef.current) {
          map.removeLayer(clusterRef.current);
        }
      };
    }, [zoomLevel, map]);

    return null;
  };

  return (
    <div className="bg-black min-h-screen text-white">
      {/* Header */}
      <div className="flex justify-between items-center w-full p-3 border-b-2 border-gray-800">
        <div className="flex items-center space-x-2">
          <div className="cursor-pointer" onClick={() => setIsSidebarOpen(true)}>
            <img src={HamburgerIcon} alt="menu" className="w-6 h-6" />
          </div>
          <div className="cursor-pointer">
            <img src={LogoIcon} alt="logo" className="w-[35px] h-[35px]" onClick={() => navigate("/home")} />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate("/events/all_events")}
            className="bg-black border-2 border-gray-700 text-white rounded-[25px] px-6 py-1 text-sm">
            Add Event
          </button>

          {/* Search Icon */}
          <button className="bg-black border-2 border-gray-700 text-white rounded-[25px] px-6 py-1 text-sm">
            Filter
          </button>
        </div>
      </div>
      {/* Left side: Map */}
      <div className="relative flex-1 overflow-auto">
        <MapContainer
          ref={mapRef}
          center={[19.1334, 72.9133]}  // Center of India
          zoom={zoomLevel}
          minZoom={1}  // Zoom out level 1-> full zoom out
          maxZoom={18}  // Zoom in level 18->full zoom in
          style={{ height: "calc(100vh - 130px)", width: "100%" }}
          zoomControl={false}  // Disable Leaflet's default zoom control
        >
          <MapUpdater />

          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
        </MapContainer>
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
            onClick={() => navigate('/smarket')}
          >
            Marketplace
          </button>
          <button
            className="bg-black text-brand-off-white text-[12px] px-4 py-1 rounded-[10px]"
          >
            Profile
          </button>
        </div>
      </div>
    </div>
  );
}






























// import { useState, useRef, useEffect } from "react";
// import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
// import L from "leaflet";
// import { useNavigate } from "react-router-dom";

// import "leaflet/dist/leaflet.css";

// // Fix default Leaflet marker icons
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
//   iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
//   shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
// });

// // Custom icon with optional count
// const createCustomIcon = (count = 1) => {
//   return L.divIcon({
//     className: "custom-marker",
//     html: `
//       <div style="
//         position: relative;
//         width: 30px;
//         height: 30px;
//         background-color: #ff00c5;
//         border-radius: 50%;
//         border: 2px solid white;
//         display: flex;
//         align-items: center;
//         justify-content: center;
//         font-size: 14px;
//         font-weight: bold;
//         color: white;
//       ">
//         ${count}
//       </div>
//     `,
//     iconSize: [30, 30],
//     iconAnchor: [15, 15],
//   });
// };

// const events = [
//   { id: 1, title: "Mood Indigo", location: "IIT Bombay", lat: 19.1334, lng: 72.9133 },
//   { id: 2, title: "Mood Indigo", location: "IIT Bombay", lat: 19.1434, lng: 72.9233 },
//   { id: 3, title: "Manad Blitz Bangalore", location: "IIM Bangalore", lat: 19.1234, lng: 72.9033 },
// ];

// export default function EventsMapPage() {
//   const [zoomLevel, setZoomLevel] = useState(5);
//   const mapRef = useRef();
//   const navigate = useNavigate();

//   const eventsCenter = [
//     events.reduce((sum, e) => sum + e.lat, 0) / events.length,
//     events.reduce((sum, e) => sum + e.lng, 0) / events.length,
//   ];

//   // Component that renders markers based on zoom
//   const Markers = () => {
//     const map = useMap();

//     useEffect(() => {
//       const handleZoom = () => setZoomLevel(map.getZoom());
//       map.on("zoomend", handleZoom);

//       setZoomLevel(map.getZoom()); // initial zoom
//       return () => map.off("zoomend", handleZoom);
//     }, [map]);

//     if (zoomLevel <= 10) {
//       return (
//         <Marker position={eventsCenter} icon={createCustomIcon(events.length)}>
//           <Popup>
//             <div className="text-black">{events.length} Events here</div>
//           </Popup>
//         </Marker>
//       );
//     } else {
//       return events.map((e) => (
//         <Marker key={e.id} position={[e.lat, e.lng]} icon={createCustomIcon()}>
//           <Popup>
//             <div className="text-black">
//               <strong>{e.title}</strong>
//               <br />
//               {e.location}
//             </div>
//           </Popup>
//         </Marker>
//       ));
//     }
//   };

//   return (
//     <div className="bg-black min-h-screen text-white flex">
//       <div className="relative flex-1 overflow-auto">
//         <MapContainer
//           ref={mapRef}
//           center={[19.1334, 72.9133]}
//           zoom={zoomLevel}
//           minZoom={5}
//           maxZoom={18}
//           style={{ height: "100vh", width: "100%" }}
//           zoomControl={false}
//         >
//           <TileLayer
//             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//             attribution='&copy; OpenStreetMap contributors'
//           />
//           <Markers />
//         </MapContainer>
//       </div>
//     </div>
//   );
// }





