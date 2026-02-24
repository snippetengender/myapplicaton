import React, { createContext, useState, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from './api';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const [hasUnreadMarketplace, setHasUnreadMarketplace] = useState(false);
    const [hasUnreadEvents, setHasUnreadEvents] = useState(false);
    const [hasUnreadPrivateEvents, setHasUnreadPrivateEvents] = useState(() => localStorage.getItem('has_unread_private_smap') === 'true');
    const location = useLocation();

    // Persist key
    const LAST_SEEN_KEY = 'snippet_marketplace_last_seen_id';
    const LAST_SYNC_KEY = 'snippet_marketplace_last_sync_timestamp';

    const LAST_SEEN_EVENT_KEY = 'snippet_events_last_seen_id';
    const LAST_SYNC_EVENT_KEY = 'snippet_events_last_sync_timestamp';

    const checkNewListings = async (force = false) => {
        const userId = localStorage.getItem('user_id');
        if (!userId) return; // Prevent 401 fetches if unauthenticated

        try {
            const lastSync = localStorage.getItem(LAST_SYNC_KEY);
            const now = Date.now();

            // If time diff < 5 mins and not forced, no refresh
            if (!force && lastSync && (now - parseInt(lastSync, 10)) < 5 * 60 * 1000) {
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

    const checkNewEvents = async (force = false) => {
        const userId = localStorage.getItem('user_id');
        if (!userId) return;

        try {
            const lastSync = localStorage.getItem(LAST_SYNC_EVENT_KEY);
            const now = Date.now();

            if (!force && lastSync && (now - parseInt(lastSync, 10)) < 5 * 60 * 1000) {
                return;
            }

            // Fetch latest created event
            const response = await api.get('/smaps/latest');
            localStorage.setItem(LAST_SYNC_EVENT_KEY, now.toString());

            const latestEvent = response.data;
            if (!latestEvent || !latestEvent.event_id) return;

            const lastSeenId = localStorage.getItem(LAST_SEEN_EVENT_KEY);

            // Compare explicitly with string value
            if (latestEvent.event_id !== lastSeenId && latestEvent.created_by !== userId) {
                setHasUnreadEvents(true);

                if (latestEvent.visibility === 'private') {
                    setHasUnreadPrivateEvents(true);
                    localStorage.setItem('has_unread_private_smap', 'true');
                }
            }
        } catch (error) {
            console.error("Failed to check for new events:", error);
        }
    };

    const [isInitialCheckDone, setIsInitialCheckDone] = useState(false);

    useEffect(() => {
        const currentPath = location.pathname;
        const pathsToCheck = ['/home', '/events', '/user-profile-owner', '/'];

        const shouldCheck = !isInitialCheckDone || pathsToCheck.some(p => currentPath === p || currentPath.startsWith('/user-profile-owner'));

        if (shouldCheck) {
            checkNewListings(!isInitialCheckDone);
            checkNewEvents(!isInitialCheckDone);
            if (!isInitialCheckDone) {
                setIsInitialCheckDone(true);
            }
        }
    }, [location.pathname, isInitialCheckDone]);

    // Add a 1 minute polling interval to pick up new events continuously
    useEffect(() => {
        const intervalId = setInterval(() => {
            // we pass false because we want it to respect the 5 minute caching
            // so essentially this guarantees the data refreshes dynamically every 5 minutes 
            // even if the user never changes tabs!
            checkNewListings(false);
            checkNewEvents(false);
        }, 60 * 1000);

        return () => clearInterval(intervalId);
    }, []);

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

    const markEventsRead = async () => {
        setHasUnreadEvents(false);
        try {
            const response = await api.get('/smaps/latest');
            const latest = response.data;
            if (latest && latest.event_id) {
                localStorage.setItem(LAST_SEEN_EVENT_KEY, latest.event_id.toString());
            }
        } catch (e) {
            console.error(e);
        }
    };

    const markPrivateEventsRead = () => {
        setHasUnreadPrivateEvents(false);
        localStorage.setItem('has_unread_private_smap', 'false');
    };

    const markEventsUnread = (isPrivate = false) => {
        setHasUnreadEvents(true);
        if (isPrivate) {
            setHasUnreadPrivateEvents(true);
        }
    };

    return (
        <NotificationContext.Provider value={{
            hasUnreadMarketplace,
            markMarketplaceRead,
            markMarketplaceUnread,
            hasUnreadEvents,
            hasUnreadPrivateEvents,
            markEventsRead,
            markPrivateEventsRead,
            markEventsUnread
        }}>
            {children}
        </NotificationContext.Provider>
    );
};
