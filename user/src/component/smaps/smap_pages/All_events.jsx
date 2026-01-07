import { ArrowLeft, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';


export default function All_events() {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const storedEvents = localStorage.getItem('user_events');
        if (storedEvents) {
            setEvents(JSON.parse(storedEvents));
        }
    }, []);

    return (
        <div className="bg-black min-h-screen text-white font-sans">
            {/* Header */}
            <div className="p-6 border-b border-gray-800 sticky top-0 bg-black/80 backdrop-blur-md z-10 flex justify-between items-center">
                <button
                    className="text-white hover:text-gray-300 transition-colors"
                    onClick={() => navigate("/events")}
                >
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-lg font-semibold">Your Events</h1>
                <div className="w-6"></div> {/* Spacer for centering if needed, or just empty */}
            </div>

            {/* Body */}
            <div className="p-6 max-w-md mx-auto w-full flex flex-col h-[calc(100vh-80px)]">

                <div className="flex-grow overflow-y-auto pb-20">
                    <div className="flex flex-col gap-4">
                        {/* Events List */}
                        {events.map((event) => (
                            <div key={event.id} className="w-full">
                                <div
                                    onClick={() => navigate("/events/event-info", { state: { event } })}
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
                                                    )
                                                } catch (e) { return event.time; }
                                            })()}
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate("/events/event-info", { state: { event } });
                                            }}
                                            className="bg-white text-black text-xs font-bold py-2 px-4 rounded-lg w-fit hover:bg-gray-200 transition-colors"
                                        >
                                            View Event
                                        </button>
                                    </div>
                                    <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0 border border-gray-800 bg-gray-900">
                                        <img src={event.image} alt={event.name} className="w-full h-full object-cover" />
                                    </div>
                                </div>
                            </div>

                        ))}

                        {events.length === 0 && (
                            <div className="text-center text-gray-800 mt-20 flex flex-col items-center gap-2">
                                <p>No events added yet.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Floating Action Button or Fixed Button at Bottom */}
                <div className="pt-4 mt-auto">
                    <button
                        onClick={() => navigate("/events/add_events")}
                        className="w-full bg-white text-black font-semibold py-3 px-4 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-white/10"
                    >
                        <Plus size={20} />
                        Add Events
                    </button>
                </div>
            </div>
        </div>
    );
};