import { useState, useEffect } from 'react';

export default function Events_list() {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const storedEvents = localStorage.getItem('user_events');
        if (storedEvents) {
            setEvents(JSON.parse(storedEvents));
        }
    }, []);

    return (
        <div className="relative flex-1 overflow-auto bg-black p-4" style={{ height: "calc(100vh - 130px)" }}>
            <div className="flex flex-col gap-4 pb-20">
                {events.map((event) => (
                    <div key={event.id} className="border border-gray-800 rounded-xl bg-black p-4 flex justify-between items-center group hover:border-gray-700 transition-colors">
                        <div className="flex flex-col gap-1 flex-grow mr-4">
                            <h2 className="text-white font-medium truncate pr-2">{event.name}</h2>
                            <p className="text-sm text-gray-400 truncate pr-2">{event.college}</p>
                            <p className="text-xs text-gray-500">
                                {(() => {
                                    if (!event.time) return '';
                                    try {
                                        const [datePart, timePart] = event.time.split('T');
                                        if (!datePart || !timePart) return event.time;
                                        const [year, month, day] = datePart.split('-');
                                        const [hour, minute] = timePart.split(':');
                                        return (
                                            <>
                                                Date: {day}-{month}-{year} <br />
                                                Time: {hour}:{minute}
                                            </>
                                        );
                                    } catch (e) { return event.time; }
                                })()}
                            </p>
                        </div>
                        <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0 border border-gray-800 bg-gray-900">
                            {event.image ? (
                                <img src={event.image} alt={event.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-500 text-xs">No Image</div>
                            )}
                        </div>
                    </div>
                ))}

                {events.length === 0 && (
                    <div className="text-center text-gray-400 mt-20">
                        <p>No events added yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};