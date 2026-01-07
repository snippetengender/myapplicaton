import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Events_list({ activeTab, selectedState, selectedDistrict, selectedCategory }) {
    const [events, setEvents] = useState([]);
    const [showNoEventsPopup, setShowNoEventsPopup] = useState(false);
    const navigate = useNavigate();

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

    return (
        <div className="relative flex-1 overflow-auto bg-black p-4" style={{ height: "calc(100vh - 130px)" }}>
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

            <div className="flex flex-col gap-4 pb-20">

                {filteredEvents.map((event) => (
                    <div key={event.id} className="w-full">
                        <div
                            onClick={() => navigate("/events/event-info", {
                                state: {
                                    event,
                                    activeTab: activeTab  // Save which tab user was on
                                }
                            })}
                            className="cursor-pointer border border-gray-800 rounded-xl bg-black p-4 flex justify-between items-center group hover:border-gray-700 transition-colors"
                        >
                            <div className="flex flex-col gap-1 flex-grow mr-4">
                                <h2 className="text-white font-medium truncate pr-2">{event.name}</h2>
                                <p className="text-sm text-gray-400 truncate pr-2">{event.college}</p>
                                <div className="text-xs text-gray-500 mb-2">
                                    {(() => {
                                        if (!event.time) return '';
                                        try {
                                            const [datePart, timePart] = event.time.split('T');
                                            if (!datePart || !timePart) return event.time;
                                            const [year, month, day] = datePart.split('-');
                                            const [hour, minute] = timePart.split(':');
                                            return (
                                                <>
                                                    <span>Date: {day}-{month}-{year}</span><br />
                                                    <span>Time: {hour}:{minute}</span>
                                                </>
                                            );
                                        } catch (e) { return event.time; }
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

                {filteredEvents.length === 0 && (
                    <div className="text-center text-gray-400 mt-20">
                        <p>No events added yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};