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
  const [showNoEventsPopup, setShowNoEventsPopup] = useState(false);

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
  const [currentZoom, setCurrentZoom] = useState(initialMapState.zoom);
  const [filteredEventCount, setFilteredEventCount] = useState(0);

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

    // Update filtered event count for popup logic
    setFilteredEventCount(filteredEvents.length);

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
  const ZoomOutButton = () => {
    if (zoomLevel < 10) {
      setZoom(4);
    };
  }
  const MapUpdater = () => {
    const map = useMap();
    const clusterRef = useRef(null);
    const location = useLocation();

    // Map is already initialized at correct position via MapContainer props
    // This effect is just for logging/debugging
    useEffect(() => {
      console.log("Map initialized at:", map.getCenter(), "zoom:", map.getZoom());
    }, [map]);

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

    useEffect(() => {
      if (clusterRef.current) {
        map.removeLayer(clusterRef.current);
      }

      clusterRef.current = updateMarkers(map);

      return () => {
        if (clusterRef.current) {
          map.removeLayer(clusterRef.current);
        }
      };
    }, [map, selectedState, selectedDistrict, selectedCategory]);

    return null;
  };

  // Show popup when filters are applied and no events found
  useEffect(() => {
    const storedEvents = JSON.parse(localStorage.getItem('user_events') || '[]');
    const hasFilters = selectedState || selectedDistrict || selectedCategory;
    const hasEvents = events.length > 0 || storedEvents.length > 0;

    if (hasFilters && filteredEventCount === 0 && hasEvents) {
      setShowNoEventsPopup(true);
      const timer = setTimeout(() => {
        setShowNoEventsPopup(false);
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      setShowNoEventsPopup(false);
    }
  }, [filteredEventCount, selectedState, selectedDistrict, selectedCategory]);

  return (
    <div className="relative flex-1" style={{ height: "calc(100vh - 130px)", width: "100%" }}>
      {/* No Events Found Popup */}
      {showNoEventsPopup && (
        <div
          className="fixed top-20 left-1/2 transform -translate-x-1/2 z-[1001] bg-gray-900 border border-gray-700 rounded-lg px-6 py-3 shadow-lg"
          style={{
            animation: 'fadeIn 0.3s ease-in-out'
          }}
        >
          <p className="text-white text-sm font-medium">No events found</p>
        </div>
      )}

      {/* Button that appears when zoom > 6 */}
      {currentZoom > 6 && (
        <button
          className="absolute top-2.5 right-2.5 z-[1000] px-4 py-2.5 bg-[#F06CB7] text-white border-none rounded-lg cursor-pointer font-bold shadow-md flex items-center gap-2 hover:bg-[#E05BA6] transition-colors"
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
        <button onClick={ZoomOutButton}>
          Zoom Out
        </button>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution=''
        />

      </MapContainer>
    </div>
  );
}