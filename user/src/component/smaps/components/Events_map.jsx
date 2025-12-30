import { useState, useRef, useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';
import "leaflet/dist/leaflet.css";

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

const events = [];

export default function Events_map() {
  const [zoomLevel, setZoom] = useState(5);
  const mapRef = useRef();

  // Function to add markers to the map
  const updateMarkers = (map) => {
    const markerCluster = new L.MarkerClusterGroup();

    // Combine default events with user events
    const storedEvents = JSON.parse(localStorage.getItem('user_events') || '[]');
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
                    ${event.time ? (() => {
          try {
            const [datePart, timePart] = event.time.split('T');
            if (!datePart || !timePart) return `<span style="color: #999; font-size: 12px; display: block; margin-top: 4px;">${event.time}</span>`;
            const [year, month, day] = datePart.split('-');
            const [hour, minute] = timePart.split(':');
            return `<span style="color: #999; font-size: 12px; display: block; margin-top: 4px;">Date: ${day}-${month}-${year} Time: ${hour}:${minute}</span>`;
          } catch (e) {
            return `<span style="color: #999; font-size: 12px; display: block; margin-top: 4px;">${event.time}</span>`;
          }
        })() : ''}
                </div>
            `);

      markerCluster.addLayer(marker);
    });

    map.addLayer(markerCluster);
    return markerCluster;
  };

  const MapUpdater = () => {
    const map = useMap();
    const clusterRef = useRef(null);

    useEffect(() => {
      map.setZoom(zoomLevel);

      if (clusterRef.current) {
        map.removeLayer(clusterRef.current);
      }

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
    <div className="relative flex-1" style={{ height: "calc(100vh - 130px)", width: "100%" }}>
      <MapContainer
        ref={mapRef}
        center={[19.1334, 72.9133]}
        zoom={zoomLevel}
        minZoom={1}
        maxZoom={18}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
      >
        <MapUpdater />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
      </MapContainer>
    </div>
  );
}