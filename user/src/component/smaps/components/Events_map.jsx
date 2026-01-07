import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
        background-color: #F06CB7;
        border-radius: 50%;
        border: 2px solid white;
      "></div>
    `,
    iconSize: [12, 12],      // MUST match actual size
    iconAnchor: [6, 6],      // Center of the dot
  });
};

const events = [];

export default function Events_map({ activeTab, selectedState, selectedDistrict, selectedCategory }) {
  const location = useLocation();
  const mapRef = useRef();
  const navigate = useNavigate();

  // Compute initial map state from navigation state
  const getInitialMapState = () => {
    const focusEvent = location.state?.focusEvent;
    const restoredState = location.state?.restoredMapState;

    // Priority: focusEvent > restoredMapState > default
    if (focusEvent && focusEvent.lat && focusEvent.lng) {
      console.log("Initializing with focusEvent:", focusEvent);
      return {
        center: [focusEvent.lat, focusEvent.lng],
        zoom: 18
      };
    } else if (restoredState && restoredState.center && restoredState.zoom) {
      console.log("Initializing with restoredMapState:", restoredState);
      return {
        center: restoredState.center,
        zoom: restoredState.zoom
      };
    }
    console.log("Initializing with default state");
    return {
      center: [11.027456478466824, 77.02760607004167],
      zoom: 4
    };
  };

  const initialMapState = getInitialMapState();
  const [zoomLevel, setZoom] = useState(initialMapState.zoom);

  // Function to add markers to the map
  const updateMarkers = (map) => {
    const markerCluster = new L.MarkerClusterGroup({
      iconCreateFunction: (cluster) => {
        return L.divIcon({
          html: `
            <div style="
              width: 40px;
              height: 40px;
              background-color: rgba(240, 108, 183, 0.6);
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
            ">
              <span style="
                background-color: #F06CB7;
                border-radius: 50%;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: bold;
                font-family: sans-serif;
              ">
                ${cluster.getChildCount()}
              </span>
            </div>
          `,
          className: 'custom-cluster-icon',
          iconSize: [40, 40],
          iconAnchor: [20, 20],
        });
      }
    });

    // Combine default events with user events
    const storedEvents = JSON.parse(localStorage.getItem('user_events') || '[]');

    const userEvents = storedEvents.map(e => ({
      id: e.id,
      title: e.name,
      location: e.college,
      lat: e.lat,
      lng: e.lng,
      s_time: e.s_time,
      image: e.image,
      state: e.state,           // Include state for filtering
      district: e.district,     // Include district for filtering
      category: e.category,     // Include category for filtering
    }));

    const allEvents = [...events, ...userEvents];

    // Apply filters
    const filteredEvents = allEvents.filter(event => {
      // Filter by state
      if (selectedState && event.state !== selectedState) {
        return false;
      }
      // Filter by district
      if (selectedDistrict && event.district !== selectedDistrict) {
        return false;
      }
      // Filter by category
      if (selectedCategory && event.category !== selectedCategory) {
        return false;
      }
      return true;
    });

    filteredEvents.forEach((event) => {
      if (!event.lat || !event.lng) return;

      const latlng = [event.lat, event.lng];
      const marker = L.marker(latlng, { icon: createCustomIcon() });

      marker.bindTooltip(`
        <div style="
            width: 70px;
            height: 80px;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background-color: white; 
            border-radius: 20px;
            padding: 1px;
            box-sizing: border-box;
            color: black; 
            font-family: sans-serif; 
            font-size: 10px; 
            line-height: 1.2;
            cursor: pointer;
        ">
          <img src=${event.image} style="width: 40px; height: 40px; border-radius: 5px; object-fit: cover; margin-bottom: 4px;" />
          <strong style="
              display: block; 
              white-space: nowrap; 
              overflow: hidden; 
              text-overflow: ellipsis; 
              max-width: 100%;
              text-align: center;
          ">${event.title}</strong>
          
          ${event.s_time ? (() => {
          try {
            const datePart = event.s_time.split('T')[0];
            if (!datePart) return '';
            const [year, month, day] = datePart.split('-');
            return `<span style="color: #666; font-size: 9px; display: block; margin-top: 2px;">${day}-${month}-${year}</span>`;
          } catch (e) {
            return '';
          }
        })() : ''}
        </div>
      `, { permanent: true, direction: 'top', className: 'compact-popup', offset: [0, -10], interactive: true });

      const tooltip = marker.getTooltip();
      tooltip.on('click', () => {
        const center = map.getCenter();
        const mapState = {
          center: [center.lat, center.lng],
          zoom: map.getZoom()
        };
        console.log("Saving Map State:", mapState);

        navigate('/events/event-info', {
          state: {
            event,
            mapState,
            activeTab: activeTab  // Save which tab user was on
          }
        });
      });
      markerCluster.addLayer(marker);
    });

    map.addLayer(markerCluster);
    return markerCluster;
  };

  const MapUpdater = () => {
    const map = useMap();
    const clusterRef = useRef(null);
    const location = useLocation();

    // Map is already initialized at correct position via MapContainer props
    // This effect is just for logging/debugging
    useEffect(() => {
      console.log("Map initialized at:", map.getCenter(), "zoom:", map.getZoom());
    }, [map]);

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
    }, [zoomLevel, map, selectedState, selectedDistrict, selectedCategory]);

    return null;
  };

  return (
    <div className="relative flex-1" style={{ height: "calc(100vh - 130px)", width: "100%" }}>
      <MapContainer
        ref={mapRef}
        center={initialMapState.center}
        zoom={initialMapState.zoom}
        minZoom={4}
        maxZoom={18}
        style={{ height: "100%", width: "100%" }}
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
        <MapUpdater />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution=''
        />

      </MapContainer>
    </div>
  );
}