import { useRef, useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

const MapUpdater = ({
    mapTab,
    collegeLocation,
    eventsLoaded,
    selectedState,
    selectedDistrict,
    selectedCategory,
    updateMarkers,
    setCurrentZoom,
    initialMapState
}) => {
    const map = useMap();
    const clusterRef = useRef(null);

    // Track previous tab to detect switch from 'your' -> 'other'
    const prevTabRef = useRef(mapTab);

    // Map is already initialized at correct position via MapContainer props
    // This file is fine. I'll modify Events_map.jsx next. for logging/debugging
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
    }, [map, setCurrentZoom]);

    // Update Markers
    useEffect(() => {
        if (!eventsLoaded) return; // Wait for events to load

        if (clusterRef.current) {
            clusterRef.current.clearLayers(); // Clear all layers in the cluster
            map.removeLayer(clusterRef.current);
        }

        clusterRef.current = updateMarkers(map);

        return () => {
            if (clusterRef.current) {
                clusterRef.current.clearLayers(); // Clear all layers before removal
                map.removeLayer(clusterRef.current);
            }
        };
    }, [map, selectedState, selectedDistrict, selectedCategory, updateMarkers, eventsLoaded]);

    // Handle Tab Locking Behavior
    useEffect(() => {
        if (mapTab === 'your') {
            if (collegeLocation) {
                const [lat, lng] = collegeLocation;

                // Set View and Zoom constraints
                map.setView(collegeLocation, 16);
                map.setMinZoom(15.5);
                map.setMaxZoom(18); // Allow zooming in deep

                // No longer locking bounds as per the requirement
                map.setMaxBounds(null);

                // Enable interactions
                map.dragging.enable();
                map.touchZoom.enable();
                map.doubleClickZoom.enable();
                map.scrollWheelZoom.enable();
                map.boxZoom.enable();
                map.keyboard.enable();
                if (map.tap) map.tap.enable();
            }
        } else {
            // Unlock
            map.setMinZoom(4);
            map.setMaxZoom(18);
            map.setMaxBounds(null);

            // If switching FROM 'your' TO 'other', reinitialize map state
            if (prevTabRef.current === 'your' && mapTab === 'other') {
                if (initialMapState) {
                    map.setView(initialMapState.center, initialMapState.zoom);
                }
            }

            map.dragging.enable();
            map.touchZoom.enable();
            map.doubleClickZoom.enable();
            map.scrollWheelZoom.enable();
            map.boxZoom.enable();
            map.keyboard.enable();
            if (map.tap) map.tap.enable();
        }

        // Update ref
        prevTabRef.current = mapTab;

    }, [mapTab, collegeLocation, map, initialMapState]);

    return null;
};

export default MapUpdater;
