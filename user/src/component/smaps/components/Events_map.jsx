import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';
import "leaflet/dist/leaflet.css";
import { fetchAllEventLocations, fetchUserCollegeLocation } from "../api";
import MapUpdater from "./MapUpdater";
import { useNotification } from "../../../providers/NotificationContext";

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
  const { hasUnreadPrivateEvents, markPrivateEventsRead } = useNotification();
  const [showNoEventsPopup, setShowNoEventsPopup] = useState(false);
  const [filteredEventCount, setFilteredEventCount] = useState(0);
  const [storedEvents, setStoredEvents] = useState([]);
  const [eventsLoaded, setEventsLoaded] = useState(false);

  // New state for tabs and location locking
  const [mapTab, setMapTab] = useState(
    location.state?.mapTab || sessionStorage.getItem('mapTabPreference') || 'other'
  );
  useEffect(() => {
    sessionStorage.setItem('mapTabPreference', mapTab);
  }, [mapTab]);
  const [collegeLocation, setCollegeLocation] = useState(null);

  // Find college location when 'your hood' is selected
  useEffect(() => {
    const fetchLocation = async () => {
      if (mapTab === 'your' && !collegeLocation) {
        try {
          const locationData = await fetchUserCollegeLocation();
          if (locationData && locationData.coordinates) {
            // coordinates are [lng, lat] from backend
            const [lng, lat] = locationData.coordinates;
            setCollegeLocation([lat, lng]);
          }
        } catch (err) {
          console.error("Failed to fetch college location", err);
        }
      }
    };
    fetchLocation();
  }, [mapTab, collegeLocation]);

  // Memoize initial map state to avoid recalculation
  const initialMapState = useMemo(() => {
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
  }, [location.state?.focusEvent, location.state?.restoredMapState]);

  const [zoomLevel, setZoom] = useState(initialMapState.zoom);
  const [currentZoom, setCurrentZoom] = useState(initialMapState.zoom);

  // Fetch events only once on component mount
  useEffect(() => {
    const loadEvents = async () => {
      try {
        const events = await fetchAllEventLocations();
        setStoredEvents(events || []);
      } catch (error) {
        console.error('Error fetching events:', error);
        setStoredEvents([]);
      } finally {
        setEventsLoaded(true);
      }
    };

    loadEvents();
  }, []); // Empty dependency array - runs only once

  // Function to add markers to the map
  const updateMarkers = useCallback((map) => {
    const markerCluster = new L.MarkerClusterGroup({
      maxClusterRadius: 40,
      removeOutsideVisibleBounds: false,
      spiderfyOnMaxZoom: false,
      chunkedLoading: true,
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

    const userEvents = storedEvents.map(e => ({
      id: e.event_id,
      title: e.event_title,
      location: e.college,
      lat: e.location?.coordinates ? e.location.coordinates[1] : null,
      lng: e.location?.coordinates ? e.location.coordinates[0] : null,
      s_time: e.event_start_time,
      image: e.event_poster,
      state: e.state,
      district: e.district,
      category: e.category,
      visibility: e.visibility || 'public',
    }));

    // Deduplicate events by id
    const uniqueEventsMap = new Map();
    [...events, ...userEvents].forEach(ev => {
      if (ev.id) uniqueEventsMap.set(ev.id, ev);
    });
    const allEvents = Array.from(uniqueEventsMap.values());

    // Apply filters
    const filteredEvents = allEvents.filter(event => {
      // Filter by visibility (private events are not shown in 'other' hood)
      if (mapTab === 'other' && event.visibility === 'private') {
        return false;
      }

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
            width: 80px;
            height: 90px;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background-color: transparent; 
            padding: 4px;
            box-sizing: border-box;
            color: white; 
            font-family: sans-serif; 
            font-size: 10px; 
            line-height: 1.2;
            cursor: pointer;
        ">
          <img src=${event.image} style="width: 45px; height: 45px; border-radius: 5px; object-fit: cover; margin-bottom: 4px;" />
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
            const start = new Date(event.s_time).getTime();
            if (isNaN(start)) return '';
            const now = Date.now();
            const diff = start - now;

            if (diff <= 0) return '<span style="color: #ccc; font-size: 9px; display: block; margin-top: 2px;">Live Now</span>';

            const minutes = Math.floor(diff / (1000 * 60));
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const weeks = Math.floor(days / 7);
            const months = Math.floor(days / 30);
            const years = Math.floor(days / 365);

            let text = '';
            if (minutes < 2) text = 'In a Moment';
            else if (hours < 1) text = `In ${minutes} minute${minutes > 1 ? 's' : ''}`;
            else if (days < 1) text = `In ${hours} hour${hours > 1 ? 's' : ''}`;
            else if (weeks < 1) text = `In ${days} day${days > 1 ? 's' : ''}`;
            else if (months < 1) text = `In ${weeks} week${weeks > 1 ? 's' : ''}`;
            else if (years < 1) text = `In ${months} month${months > 1 ? 's' : ''}`;
            else text = `In ${years} year${years > 1 ? 's' : ''}`;

            return `<span style="color: #ccc; font-size: 9px; display: block; margin-top: 2px;">${text}</span>`;
          } catch (e) {
            return '';
          }
        })() : ''}
        </div>
      `, { permanent: true, direction: 'top', className: 'compact-popup', offset: [0, -10], interactive: true });

      const tooltip = marker.getTooltip();
      const id = event.id;
      tooltip.on('click', () => {
        const center = map.getCenter();
        const mapState = {
          center: [center.lat, center.lng],
          zoom: map.getZoom()
        };
        console.log("Saving Map State:", mapState);

        navigate(`/events/event-info/${id}`, {
          state: {
            mapState,
            activeTab,
            mapTab
          }
        });
      });
      markerCluster.addLayer(marker);
    });

    map.addLayer(markerCluster);
    return markerCluster;
  }, [storedEvents, selectedState, selectedDistrict, selectedCategory, mapTab]); // Add filter dependencies
  const ZoomOutButton = () => {
    if (zoomLevel < 10) {
      setZoom(4);
    };
  }
  // Removed internal MapUpdater component

  // Show popup when filters are applied and no events found
  useEffect(() => {
    const hasFilters = selectedState || selectedDistrict || selectedCategory;

    if (hasFilters && filteredEventCount === 0 && storedEvents.length > 0) {
      setShowNoEventsPopup(true);
      const timer = setTimeout(() => {
        setShowNoEventsPopup(false);
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      setShowNoEventsPopup(false);
    }
  }, [filteredEventCount, selectedState, selectedDistrict, selectedCategory, storedEvents.length]);

  return (
    <div className="relative flex-1" style={{ height: "calc(100vh - 130px)", width: "100%" }}>
      {/* Tabs Header */}
      <div className="absolute top-0 w-full h-[40px] z-[1000] flex items-center bg-black/80 backdrop-blur-sm border-b border-gray-800">
        <div
          onClick={() => setMapTab('other')}
          className={`flex-1 flex justify-center items-center h-full cursor-pointer text-sm font-medium transition-colors ${mapTab === 'other' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
        >
          other hood
        </div>
        <div
          onClick={() => {
            setMapTab('your');
            markPrivateEventsRead();
          }}
          className={`relative flex-1 flex justify-center items-center h-full cursor-pointer text-sm font-medium transition-colors ${mapTab === 'your' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
        >
          your hood
          {hasUnreadPrivateEvents && mapTab !== 'your' && (
            <span className="absolute top-3 right-[35%] w-2 h-2 bg-pink-500 rounded-full shadow-sm shadow-pink-500/50"></span>
          )}
        </div>
      </div>

      {/* Loading Overlay */}
      {!eventsLoaded && (
        <div className="absolute inset-0 z-[2000] flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="flex flex-col items-center z-10">
            <div className="w-8 h-8 rounded-full border-4 border-[#F06CB7] border-t-transparent animate-spin"></div>
            <p className="text-white mt-4 text-sm">Loading Events...</p>
          </div>
          <img
            src="/snippy-assets/Snippy_butler.png"
            alt="Loading companion"
            className="absolute bottom-4 right-4 w-[150px] h-[150px] object-contain"
          />
        </div>
      )}

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

      {/* Button that appears when zoom > 6 and not in 'your hood' */}
      {currentZoom > 6 && mapTab !== 'your' && (
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
        <MapUpdater
          mapTab={mapTab}
          collegeLocation={collegeLocation}
          eventsLoaded={eventsLoaded}
          selectedState={selectedState}
          selectedDistrict={selectedDistrict}
          selectedCategory={selectedCategory}
          updateMarkers={updateMarkers}
          setCurrentZoom={setCurrentZoom}
          initialMapState={initialMapState}
        />
        <button onClick={ZoomOutButton}>
          Zoom Out
        </button>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution=''
          keepBuffer={8}
          updateWhenZooming={false}
          updateWhenIdle={false}
        />

      </MapContainer>
    </div>
  );
}