import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Share, MoreVertical, Navigation, ExternalLink } from 'lucide-react';
import { useEffect, useState } from 'react';
import { fetchEventById, formatTimestamp } from '../api';

export default function Event_Info() {
    const location = useLocation();
    const navigate = useNavigate();
    const { eventId } = useParams();
    const { mapState, activeTab } = location.state || {};

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    // const storedEvents = JSON.parse(localStorage.getItem('user_events') || '[]');


    // Try to get event from navigation state, or fall back to localStorage
    // let currentEvent = userEvents.find(e => e.id === event?.id) || event;

    useEffect(() => {
        if (!eventId) {
            setError(true);
            setLoading(false);
            return;
        }

        async function loadEvent() {
            try {
                const data = await fetchEventById(eventId);
                setEvent(data);
            } catch (err) {
                console.error("failed to fetch the event: ", err)
            } finally {
                setLoading(false);
            }
        }

        loadEvent()
    }, [eventId]);

    if (loading) {
        return (
            <div className="bg-black min-h-screen text-white flex items-center justify-center">
                <p>Loading Event...</p>
            </div>
        );
    }

    if (error || !event) {
        return (
            <div className="bg-black min-h-screen text-white p-6 flex flex-col items-center justify-center">
                <p>Event not found.</p>
                <button
                    onClick={() => navigate("/events")}
                    className="mt-4 text-blue-500 hover:underline"
                >Go back
                </button>
            </div>
        );
    }

    const {
        event_title,
        description,
        event_start_time,
        event_end_time,
        event_poster,
        college_name,
        location: eventLocation,
        registrationLink
    } = event;

    // const currentEvent = event;

    // const name = event_title;
    // const s_time = event_start_time;
    // const e_time = event_end_time;
    // const image = event_poster;

    // const formatTimestamp = (timeString) => {
    //     if (!timeString) return { date: '', s_time: '' };
    //         const dateObj = new Date(timeString);
    //         return {
    //             date: dateObj.toLocaleDateString('en-US', {
    //                 weekday: 'long',
    //                 month: 'long',
    //                 day: 'numeric'
    //             }),
    //             time: dateObj.toLocaleDateString('en-US', {
    //                 hour: 'numeric',
    //                 minute: '2-digit'
    //             })
    //         };
    //     };

    const start = formatTimestamp(event_start_time);
    const end = formatTimestamp(event_end_time);

    return (
        <div className="bg-black min-h-screen text-white font-sans pb-24">
            {/* Top Navigation */}
            <br />
            <div className="fixed top-0 left-0 right-0 z-20 flex justify-between items-center p-4 bg-gradient-to-b from-black/80 to-transparent">
                <button
                    onClick={() => {
                        if (mapState) {
                            navigate("/events", {
                                state: { restoredMapState: mapState, activeTab }
                            });
                        } else if (activeTab !== undefined) {
                            // If no mapState but we have activeTab (from list view)
                            navigate("/events", {
                                state: { activeTab: activeTab }
                            });
                        } else {
                            console.log("No mapState found, going back default.");
                            navigate(-1);
                        }
                    }}
                    className="p-2 bg-black/50 backdrop-blur rounded-full hover:bg-black/70 transition-colors border border-white/10">
                    <ArrowLeft size={20} />
                </button>

                <div className="flex gap-3">
                    <button className="p-2 bg-black/50 backdrop-blur rounded-full hover:bg-black/70 transition-colors border border-white/10">
                        <Share size={20} />
                    </button>
                    <button className="p-2 bg-black/50 backdrop-blur rounded-full hover:bg-black/70 transition-colors border border-white/10">
                        <MoreVertical size={20} />
                    </button>
                </div>
            </div>

            {/* Hero Image */}
            <div className="w-full flex justify-center mt-20 mb-6">
                <div className="relative w-[90%] aspect-video rounded-2xl border-2 border-gray-800 overflow-hidden shadow-2xl bg-gray-900">
                    {event_poster ? (
                        <img src={event_poster} alt={event_title} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-700">No Image</div>
                    )}
                </div>
            </div>

            {/* Content Container */}
            <div className="px-6 -mt-18 relative z-20">
                {/* Tag */}
                <div className="inline-block bg-white/10 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-xs font-medium text-white mb-5 uppercase tracking-wide">
                    Event
                </div>

                {/* Title */}
                <h1 className="text-3xl font-bold leading-tight mb-4">
                    {event_title}
                </h1>

                {/* Registration Button */}
                {registrationLink && (
                    <a
                        href={registrationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-semibold px-6 py-3 rounded-xl hover:from-pink-700 hover:to-purple-700 transition-all transform active:scale-95 shadow-lg mb-6"
                    >
                        <ExternalLink size={18} />
                        Register Now
                    </a>
                )}

                {/* Info Grid */}
                <div className="flex flex-col gap-6 mb-8">
                    {/* Start time */}
                    <h1>Start Time</h1>
                    <div className="flex items-start gap-4">
                        <div className="bg-gray-800/50 p-3 rounded-xl border border-white/10 shrink-0">
                            <Calendar size={24} className="text-white" />
                        </div>
                        <div>
                            <p className="font-semibold text-lg text-white">{start.date}</p>
                            <p className="text-gray-400">{start.time}</p>
                        </div>
                    </div>
                    {/* End Time */}
                    <h1>End Time</h1>
                    <div className="flex items-start gap-4">
                        <div className="bg-gray-800/50 p-3 rounded-xl border border-white/10 shrink-0">
                            <Calendar size={24} className="text-white" />
                        </div>
                        <div>
                            <p className="font-semibold text-lg text-white">{end.date}</p>
                            <p className="text-gray-400">{end.time}</p>
                        </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-start gap-4">
                        <div className="bg-gray-800/50 p-3 rounded-xl border border-white/10 shrink-0">
                            <MapPin size={24} className="text-white" />
                        </div>
                        <div>
                            <p className="font-semibold text-lg text-white">{college_name || "Unknown College"}</p>
                            <p className="text-sm text-gray-400 mt-0.5">College</p>
                        </div>
                    </div>
                </div>

                {/* About Section */}
                <div className="mb-10">
                    <h3 className="text-lg font-bold mb-3 text-white">About Event</h3>
                    <p className="text-gray-300 leading-relaxed text-base font-light">
                        {description || "No description provided for this event. Huh weird."}
                    </p>
                </div>

                {/* Host Section */}
                {/* <div className="mb-8 border-t border-gray-800 pt-6">
                    <h3 className="text-xs text-gray-500 mb-4 uppercase tracking-widest font-bold">Hosted By</h3>
                    <div className="flex items-center gap-4 bg-gray-900/50 p-4 rounded-xl border border-white/5">
                        <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center font-bold text-xl text-gray-300">
                            {name ? name.charAt(0) : "H"}
                        </div>
                        <div>
                            <p className="font-bold text-white">{college}</p>
                            <p className="text-xs text-gray-400 uppercase tracking-wide mt-0.5">Organizer</p>
                        </div>
                    </div>
                </div> */}
            </div>

            {/* Bottom Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 p-4 border-t border-gray-800 bg-black/80 backdrop-blur-xl z-30 pb-8">
                <div className="flex gap-3">
                    <button
                        onClick={() => {
                            // Open Google Maps with directions from user's current location to event location
                            const destination = `${eventLocation.coordinates[1]},${eventLocation.coordinates[0]}`;
                            const googleMapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(destination)}`;
                            window.open(googleMapsUrl, '_blank');
                        }}
                        className={`${location.state?.mapState ? 'flex-1' : 'flex-1'} bg-gray-800 text-white font-semibold text-base py-4 rounded-2xl hover:bg-gray-700 transition-all transform active:scale-95 shadow-lg border border-gray-700 flex items-center justify-center gap-2`}
                    >
                        <Navigation size={20} />
                        Directions
                    </button>
                    {/* Only show "Locate on Map" button when NOT coming from map view */}
                    {!mapState && (
                        <button
                            onClick={() => navigate("/events", { state: { focusEvent: event, activeTab: false } })}
                            className="flex-1 bg-white text-black font-bold text-base py-4 rounded-2xl hover:bg-gray-200 transition-all transform active:scale-95 shadow-lg shadow-white/5"
                        >
                            Locate on Map
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
};