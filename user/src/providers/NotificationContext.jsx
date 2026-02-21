import React, { createContext, useState, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from './api';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const [hasUnreadMarketplace, setHasUnreadMarketplace] = useState(false);
    const location = useLocation();

    // Persist key
    const LAST_SEEN_KEY = 'snippet_marketplace_last_seen_id';
    const LAST_SYNC_KEY = 'snippet_marketplace_last_sync_timestamp';

    const checkNewListings = async () => {
        try {
            const lastSync = localStorage.getItem(LAST_SYNC_KEY);
            const now = Date.now();

            // If time diff < 5 mins, no refresh
            if (lastSync && (now - parseInt(lastSync, 10)) < 5 * 60 * 1000) {
                return;
            }

            // Fetch only the latest 1 item to check
            const response = await api.get('/marketplace/live', {
                params: { page: 1, limit: 1 }
            });

            // Update last sync time
            localStorage.setItem(LAST_SYNC_KEY, now.toString());

            const latestListing = response.data.data && response.data.data[0];

            if (latestListing) {
                const lastSeenId = localStorage.getItem(LAST_SEEN_KEY);

                // If we have a latest listing, and we haven't seen it yet
                if (!lastSeenId || lastSeenId !== latestListing.listing_id) {
                    setHasUnreadMarketplace(true);
                }
            }
        } catch (error) {
            console.error("Failed to check for new marketplace listings:", error);
        }
    };

    const [isInitialCheckDone, setIsInitialCheckDone] = useState(false);

    useEffect(() => {
        const currentPath = location.pathname;
        const pathsToCheck = ['/home', '/events', '/user-profile-owner', '/'];

        const shouldCheck = !isInitialCheckDone || pathsToCheck.some(p => currentPath === p || currentPath.startsWith('/user-profile-owner'));

        if (shouldCheck) {
            checkNewListings();
            if (!isInitialCheckDone) {
                setIsInitialCheckDone(true);
            }
        }
    }, [location.pathname, isInitialCheckDone]);

    const markMarketplaceRead = async () => {
        setHasUnreadMarketplace(false);
        // When reading, we fetch the latest one again (or we could store it in state) to update 'last seen'
        try {
            // We can just update it with what we know is the latest, 
            // but to be safe let's quickly fetch the top one or use the one from state if we stored it.
            // For simplicity, let's fetch top 1.
            const response = await api.get('/marketplace/live', {
                params: { page: 1, limit: 1 }
            });
            const latest = response.data.data && response.data.data[0];
            if (latest) {
                localStorage.setItem(LAST_SEEN_KEY, latest.listing_id);
            }
        } catch (e) {
            console.error(e);
        }
    };

    // Manual trigger still useful for "instant" feedback when posting
    const markMarketplaceUnread = () => {
        setHasUnreadMarketplace(true);
    };

    return (
        <NotificationContext.Provider value={{
            hasUnreadMarketplace,
            markMarketplaceRead,
            markMarketplaceUnread
        }}>
            {children}
        </NotificationContext.Provider>
    );
};
