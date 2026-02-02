import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Events_list({ activeTab, selectedState, selectedDistrict, selectedCategory }) {
    const [events, setEvents] = useState([]);
    const [showNoEventsPopup, setShowNoEventsPopup] = useState(false);
    const navigate = useNavigate();
    const todayRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        const storedEvents = localStorage.getItem('user_events');
        if (storedEvents) {
            setEvents(JSON.parse(storedEvents));
        }
    }, []);

    // Filter events based on selected state, district, and category
    const filteredEvents = events.filter(event => {
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
            return dateString.split('T')[0];
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
            // Format: 27th Jan
            const day = date.getDate();
            const month = date.toLocaleString('default', { month: 'short' });

            // Add ordinal suffix
            let suffix = "th";
            if (day % 10 === 1 && day !== 11) suffix = "st";
            else if (day % 10 === 2 && day !== 12) suffix = "nd";
            else if (day % 10 === 3 && day !== 13) suffix = "rd";

            return `${day}${suffix} ${month}`;
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
        const dateKey = getDateKey(event.s_time);

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
        <div ref={containerRef} className="relative flex-1 overflow-auto bg-black p-4 pl-0" style={{ height: "calc(100vh - 130px)" }}>
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
                                className="relative pl-6 pb-10 last:pb-0"
                                ref={isToday ? todayRef : null}
                            >
                                {/* Continuous Dotted Line */}
                                {index !== sortedDates.length - 1 && (
                                    <div
                                        className="absolute left-[0px] top-2 bottom-0 w-[2px] -ml-[1px]"
                                        style={{
                                            backgroundImage: 'radial-gradient(circle, #6b7280 1.5px, transparent 1.5px)',
                                            backgroundSize: '4px 8px',
                                            backgroundRepeat: 'repeat-y',
                                            backgroundPosition: 'center top'
                                        }}
                                    ></div>
                                )}
                                {/* Date Header */}
                                <div className="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full bg-gray-400"></div>

                                <div className="flex items-baseline gap-2 mb-4 -mt-1.5">
                                    <h3 className="text-white font-bold text-lg">{dateLabel}</h3>
                                    <span className="text-gray-500 text-sm">{getDayName(dateKey)}</span>
                                </div>

                                {/* Events for this date */}
                                <div className="flex flex-col gap-4">
                                    {groupedEvents[dateKey].map((event) => (
                                        <div key={event.id} className="w-full">
                                            <div
                                                onClick={() => navigate("/events/event-info", {
                                                    state: {
                                                        event,
                                                        activeTab: activeTab
                                                    }
                                                })}
                                                className="cursor-pointer border border-gray-800 rounded-xl bg-black p-4 flex justify-between items-center group hover:border-gray-700 transition-colors"
                                            >
                                                <div className="flex flex-col gap-1 flex-grow mr-4">
                                                    <h2 className="text-white font-medium truncate pr-2">{event.name}</h2>
                                                    <p className="text-sm text-gray-400 truncate pr-2">{event.college}</p>
                                                    <div className="text-xs text-gray-500 mb-2">
                                                        {(() => {
                                                            try {
                                                                const [datePart, timePart] = event.s_time.split('T');
                                                                const [hour, minute] = timePart.split(':');
                                                                // Convert to 12-hour format
                                                                const hourInt = parseInt(hour, 10);
                                                                const ampm = hourInt >= 12 ? 'PM' : 'AM';
                                                                const hour12 = hourInt % 12 || 12;
                                                                return `${hour12}:${minute} ${ampm}`;
                                                            } catch (e) { return event.s_time; }
                                                        })()}
                                                    </div>
                                                </div>
                                                <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0 border border-gray-800 bg-gray-900">
                                                    {event.image ? (
                                                        <img src={event.image} alt={event.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-500 text-xs">No Image</div>
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
        </div>
    );
};