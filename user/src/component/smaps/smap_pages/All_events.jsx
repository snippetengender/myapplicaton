import { ArrowLeft, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { fetchAllEventLocationsOfUser } from '../api';


export default function All_events() {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);

    useEffect(() => {
        async function loadEvents() {
            try {
                const data = await fetchAllEventLocationsOfUser();
                setEvents(data);
            } catch (err) {
                console.error(err);
            }
        }
        loadEvents(); 
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
                        {events.map((event) => {
                            const formatDT = (dt) => {
                                if (!dt) return 'N/A';
                                try {
                                    const d = new Date(dt);
                                    if (isNaN(d.getTime())) return dt;
                                    const dateStr = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
                                    let hours = d.getHours();
                                    const ampm = hours >= 12 ? 'PM' : 'AM';
                                    hours = hours % 12;
                                    hours = hours ? hours : 12; // the hour '0' should be '12'
                                    const minutes = d.getMinutes().toString().padStart(2, '0');
                                    hours = hours.toString().padStart(2, '0');
                                    return `${dateStr} ${hours} : ${minutes} ${ampm}`;
                                } catch { return 'N/A'; }
                            };

                            let statusColor = 'bg-green-500';
                            let statusText = 'Your Event is Listed';
                            if (event.status === 'removed') {
                                statusColor = 'bg-yellow-400';
                                statusText = 'You Removed this Event';
                            } else if (event.status === 'banned') {
                                statusColor = 'bg-red-500';
                                statusText = 'Snippet removed this Event';
                            } else if (event.event_end_time && Date.now() > new Date(event.event_end_time).getTime()) {
                                statusColor = 'bg-blue-500';
                                statusText = 'Event Got Over';
                            }

                            return (
                                <div key={event.event_id} className="w-full">
                                    <div
                                        onClick={() => navigate(`/events/event-info/${event.event_id}`)}
                                        className="cursor-pointer border border-gray-800 rounded-xl bg-black p-4 flex justify-between items-center group hover:border-gray-700 transition-colors"
                                    >
                                        <div className="flex flex-col gap-1.5 flex-grow mr-4">
                                            <h2 className="text-xl text-white font-bold truncate pr-2">{event.event_title}</h2>
                                            <h2 className="text-sm text-gray-200 mt-1 capitalize font-medium">Visibility : {event.visibility || 'Public'}</h2>
                                            <div className="text-sm font-medium text-gray-200">
                                                <span>Start time : {formatDT(event.event_start_time)}</span><br />
                                                <span>End time : {formatDT(event.event_end_time)}</span>
                                            </div>
                                            <div className="flex items-center gap-2 mt-2">
                                                <div className={`w-3 h-3 rounded-full ${statusColor}`}></div>
                                                <span className="text-sm text-gray-200 font-medium">{statusText}</span>
                                            </div>
                                        </div>
                                        <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0 border border-gray-800 bg-gray-900 self-start mt-2">
                                            <img src={event.event_poster} alt={event.event_title} className="w-full h-full object-cover" />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

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