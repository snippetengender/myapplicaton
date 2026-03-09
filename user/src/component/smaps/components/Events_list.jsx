import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchAllEventLocations, formatTimestamp } from '../api';
import { MapPin, Tag } from 'lucide-react';

export default function Events_list({ activeTab, selectedState, selectedDistrict, selectedCategory }) {
    const [events, setEvents] = useState([]);
    const [showNoEventsPopup, setShowNoEventsPopup] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();

    // Persistent mapTab across native history
    const [mapTab, setMapTab] = useState(
        location.state?.mapTab || sessionStorage.getItem('mapTabPreference') || 'your'
    );
    useEffect(() => {
        sessionStorage.setItem('mapTabPreference', mapTab);
    }, [mapTab]);

    const navigate = useNavigate();
    const todayRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        async function loadAllEvents() {
            try {
                const storedEvents = await fetchAllEventLocations()
                setEvents(storedEvents);
            }
            catch (error) {
                console.log("can't get all the events from backend: ", error)
            } finally {
                setIsLoading(false);
            }
        }

        loadAllEvents();
    }, []);

    // Filter events based on selected state, district, and category
    const filteredEvents = events.filter(event => {
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

    // Show popup when filters are applied and no events found
    useEffect(() => {
        const hasFilters = selectedState || selectedDistrict || selectedCategory;
        if (hasFilters && filteredEvents.length === 0 && events.length > 0) {
            setShowNoEventsPopup(true);
            const timer = setTimeout(() => {
                setShowNoEventsPopup(false);
            }, 3000);
            return () => clearTimeout(timer);
        } else {
            setShowNoEventsPopup(false);
        }
    }, [filteredEvents.length, selectedState, selectedDistrict, selectedCategory, events.length]);


    // Helper function to format date for grouping key (YYYY-MM-DD)
    const getDateKey = (dateString) => {
        if (!dateString) return '9999-12-31';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return '9999-12-31';
            return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        } catch (e) {
            return '9999-12-31';
        }
    };

    // Helper to get relative date label (Today, Tomorrow, 12th Jan)
    const getDateLabel = (dateStr) => {
        if (dateStr === '9999-12-31') return 'Upcoming';

        const date = new Date(dateStr);
        // Invalid date check
        if (isNaN(date.getTime())) return 'Upcoming';

        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Reset hours for comparison
        today.setHours(0, 0, 0, 0);
        tomorrow.setHours(0, 0, 0, 0);
        const checkDate = new Date(date);
        checkDate.setHours(0, 0, 0, 0);

        if (checkDate.getTime() === today.getTime()) {
            return "Today";
        } else if (checkDate.getTime() === tomorrow.getTime()) {
            return "Tomorrow";
        } else {
            // Format: 26th March 2026
            const day = date.getDate();
            const month = date.toLocaleString('default', { month: 'long' });
            const year = date.getFullYear();

            // Add ordinal suffix
            let suffix = "th";
            if (day % 10 === 1 && day !== 11) suffix = "st";
            else if (day % 10 === 2 && day !== 12) suffix = "nd";
            else if (day % 10 === 3 && day !== 13) suffix = "rd";

            return `${day}${suffix} ${month} ${year}`;
        }
    };

    const getDayName = (dateStr) => {
        if (dateStr === '9999-12-31') return '';
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return '';
        return date.toLocaleDateString('en-US', { weekday: 'long' });
    };

    // Group events
    const groupedEvents = filteredEvents.reduce((groups, event) => {
        // Use getDateKey to handle missing/malformed times safely
        const dateKey = getDateKey(event.event_start_time);

        if (!groups[dateKey]) {
            groups[dateKey] = [];
        }
        groups[dateKey].push(event);
        return groups;
    }, {});

    // Sort dates
    const sortedDates = Object.keys(groupedEvents).sort();

    // Auto-scroll to today's section on mount
    useEffect(() => {
        if (todayRef.current && sortedDates.length > 0) {
            // Small delay to ensure DOM is rendered
            const timer = setTimeout(() => {
                if (todayRef.current && containerRef.current) {
                    const containerTop = containerRef.current.getBoundingClientRect().top;
                    const elementTop = todayRef.current.getBoundingClientRect().top;
                    const scrollOffset = elementTop - containerTop - 10;

                    containerRef.current.scrollTo({
                        top: containerRef.current.scrollTop + scrollOffset,
                        behavior: 'smooth'
                    });
                }
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [sortedDates.length]);

    return (
        <div ref={containerRef} className="relative flex-1 overflow-auto bg-black pb-4" style={{ height: "calc(100vh - 130px)" }}>
            {/* Tabs Header */}
            <div className="sticky top-0 w-full h-[40px] z-[1000] flex items-center bg-black/90 backdrop-blur-sm border-b border-gray-800 mb-4">
                <div
                    onClick={() => setMapTab('your')}
                    className={`relative flex-1 flex justify-center items-center h-full cursor-pointer text-sm font-semibold transition-colors ${mapTab === 'your' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
                >
                    <div className={`h-full flex items-center border-b-[2px] transition-colors ${mapTab === 'your' ? 'border-white' : 'border-transparent'}`}>
                        your hoods
                    </div>
                </div>
                <div
                    onClick={() => setMapTab('other')}
                    className={`relative flex-1 flex justify-center items-center h-full cursor-pointer text-sm font-semibold transition-colors ${mapTab === 'other' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
                >
                    <div className={`h-full flex items-center border-b-[2px] transition-colors ${mapTab === 'other' ? 'border-white' : 'border-transparent'}`}>
                        other hoods
                    </div>
                </div>
            </div>

            {/* No Events Found Popup */}
            {showNoEventsPopup && (
                <div
                    className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-gray-900 border border-gray-700 rounded-lg px-6 py-3 shadow-lg"
                    style={{
                        animation: 'fadeIn 0.3s ease-in-out'
                    }}
                >
                    <p className="text-white text-sm font-medium">No events found</p>
                </div>
            )}

            <div className="flex flex-col pb-20 pl-4">
                {sortedDates.length > 0 ? (
                    sortedDates.map((dateKey, index) => {
                        const dateLabel = getDateLabel(dateKey);
                        const isToday = dateLabel === 'Today';

                        return (
                            <div
                                key={dateKey}
                                className="relative pl-3 pb-4 pr-2 last:pb-0"
                                ref={isToday ? todayRef : null}
                            >
                                {/* Continuous Dotted Line */}
                                {index !== sortedDates.length - 1 && (
                                    <div
                                        className="absolute left-[0px] top-2 -bottom-3 w-[2px] -ml-[2px] z-0 font-bold"
                                        style={{
                                            backgroundImage: 'radial-gradient(circle, #4b5563 1.5px, transparent 1.5px)',
                                            backgroundSize: '4px 10px',
                                            backgroundRepeat: 'repeat-y',
                                            backgroundPosition: 'center top'
                                        }}
                                    ></div>
                                )}
                                {/* Date Header */}

                                <div className="absolute -left-[5px] top-1.5 w-[7px] h-[7px] rounded-full bg-gray-300 z-10"></div>

                                <div className="flex items-baseline gap-2 mb-4">
                                    <h3 className="text-white font-semibold text-[12px]">{dateLabel}</h3>
                                    <span className="text-gray-500 font-semibold text-[12px]">{getDayName(dateKey)}</span>
                                </div>


                                {/* Events for this date */}
                                <div className="flex flex-col gap-4">
                                    {groupedEvents[dateKey].map((event) => (
                                        <div key={event.event_id} className="w-full">
                                            <div
                                                onClick={() => navigate(`/events/event-info/${event.event_id}`, {
                                                    state: {
                                                        activeTab: activeTab,
                                                        mapTab: mapTab
                                                    }
                                                })}
                                                className="cursor-pointer border border-gray-800 rounded-xl bg-black p-2.5 flex flex-col group hover:border-gray-700 transition-colors"
                                            >
                                                {/* Top section: Info + Image */}
                                                <div className="flex justify-between items-start w-full">
                                                    <div className="flex flex-col flex-grow mr-4 min-w-0">
                                                        <div className="text-[10px] text-gray-500 mb-2 font-regular tracking-wide">
                                                            {(() => {
                                                                try {
                                                                    const timestamp = formatTimestamp(event.event_start_time);
                                                                    return timestamp.time || event.event_start_time;
                                                                } catch (e) { return event.event_start_time; }
                                                            })()}
                                                        </div>
                                                        <h2 className="text-brand-off-white font-semibold text-[15px] leading-tight mb-2 line-clamp-2">{event.event_title}</h2>
                                                        <p className="flex items-start gap-1.5 text-[12px] text-brand-off-white mb-2">
                                                            <MapPin size={15} className="shrink-0 mt-0.5" />
                                                            <span className="line-clamp-2">{event.college_name || event.college || "Unknown College"}</span>
                                                        </p>

                                                        {event.category && (
                                                            <div className="inline-flex items-center gap-1.5 bg-white text-black px-3 py-1.5 rounded-lg font-semibold text-[12px] self-start max-w-full">
                                                                <img src="/tag.svg" alt="tag" className="w-3.5 h-3.5 shrink-0" />
                                                                <span className="truncate">{event.category}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="w-[84px] h-[84px] sm:w-[90px] sm:h-[90px] rounded-xl overflow-hidden shrink-0 border border-gray-800 bg-gray-900">
                                                        {event.event_poster ? (
                                                            <img src={event.event_poster} alt={event.event_title} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-500 text-[10px] text-center p-2">No Image</div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Bottom section: Tags */}
                                                <div className="flex flex-wrap items-center gap-2 mt-2">
                                                    {event.is_cash_prize_available && event.cash_prize_amount && (
                                                        <div className="inline-flex items-center gap-1.5 bg-black border border-gray-700 text-gray-300 px-3 py-1 rounded-xl font-medium text-[12px]">
                                                            <span className="text-[14px]">🤑</span> ₹ {event.cash_prize_amount} Prize Pool
                                                        </div>
                                                    )}
                                                    {(event.is_registration_fee_available && event.registration_fee_amount) ? (
                                                        <div className="inline-flex items-center gap-1.5 bg-black border border-gray-700 text-gray-300 px-3 py-1 rounded-xl font-medium text-[12px]">
                                                            <span className="text-[14px]">🎟️</span> ₹ {event.registration_fee_amount} Entry
                                                        </div>
                                                    ) : (
                                                        <div className="inline-flex items-center gap-1.5 bg-black border border-gray-700 text-gray-300 px-3 py-1 rounded-xl font-medium text-[12px]">
                                                            <span className="text-[14px]">🙌</span> FREE Entry
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    filteredEvents.length === 0 && (
                        <div className="text-center text-gray-400 mt-20">
                            <p>No events added yet.</p>
                        </div>
                    )
                )}
            </div>

            {/* Loading Overlay */}
            {isLoading && (
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
        </div>
    );
};