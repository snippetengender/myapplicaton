import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { fetchAllEventLocationsOfUser } from '../api';

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
        <div className="bg-black min-h-[100dvh] text-white font-sans flex flex-col relative w-full max-w-md mx-auto">
            {/* Header */}
            <div className="px-5 py-5 flex items-center relative shrink-0">
                <button
                    className="text-white hover:text-gray-300 transition-colors z-10"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft size={24} />
                </button>
                <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
                    <h1 className="text-[17px] font-bold">Your Events</h1>
                </div>
            </div>

            {/* Body */}
            <div className="px-[18px] pb-[100px] flex-grow flex flex-col overflow-y-auto w-full">
                {events.length === 0 ? (
                    <div className="flex-grow flex flex-col items-center justify-center text-center px-4 pb-16">
                        <p className="text-[#888888] text-[16px] font-semibold leading-tight">
                            Add your first event<br />
                            now for free and<br />
                            attract a big crowd.
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-[15px]">
                        {events.map((event) => {
                            let statusColor = 'bg-[#00FF00]';
                            let statusText = 'Your Event is Listed';
                            if (event.status === 'removed') {
                                statusColor = 'bg-[#FFFF00]';
                                statusText = 'You Removed this Event';
                            } else if (event.status === 'banned') {
                                statusColor = 'bg-[#FF453A]';
                                statusText = 'Snippet removed this Event';
                            } else if (event.event_end_time && Date.now() > new Date(event.event_end_time).getTime()) {
                                statusColor = 'bg-[#00A3FF]';
                                statusText = 'Event Got Over';
                            }

                            return (
                                <div
                                    key={event.event_id}
                                    onClick={() => navigate(`/events/event-info/${event.event_id}`)}
                                    className="cursor-pointer border border-[#333333] rounded-[10px] p-[16px] flex justify-between bg-black relative"
                                >
                                    <div className="flex flex-col w-[65%]">
                                        <h2 className="text-[18px] text-white font-semibold mb-1">{event.event_title}</h2>
                                        <h2 className="text-[10px] text-white font-semibold mb-1 capitalize">Visibility : {event.visibility || 'Public'}</h2>
                                        <div className="text-[10px] font-semibold text-white flex flex-col mb-1">
                                            <span>Start time : {formatDT(event.event_start_time)}</span>
                                            <span>End time : {formatDT(event.event_end_time)}</span>
                                        </div>
                                        <div className="flex items-center gap-[6px] mt-auto">
                                            <div className={`w-[8px] h-[8px] rounded-full shrink-0 ${statusColor}`}></div>
                                            <span className="text-[8px] text-white font-bold">{statusText}</span>
                                        </div>
                                    </div>
                                    <div className="w-[100px] h-[100px] shrink-0 rounded-[8px] overflow-hidden ml-3 bg-gray-900 self-center">
                                        <img src={event.event_poster} alt={event.event_title} className="w-full h-full object-cover" />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Bottom Button */}
            <div className="fixed bottom-0 left-0 right-0 px-[18px] pb-[20px] bg-black pt-2 z-20 mx-auto max-w-md">
                <button
                    onClick={() => navigate("/events/add_events")}
                    className="w-full bg-[#E6E6E6] text-black font-bold text-[16px] py-[13px] rounded-[16px]"
                >
                    Add Events
                </button>
            </div>
        </div>
    );
}