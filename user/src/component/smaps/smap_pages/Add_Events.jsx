import { ArrowLeft, MapPin, Plus, Image as ImageIcon, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import statesData from '../../../data/india-states-districts.json';
import categoriesData from '../../../data/all-categorys.json';

export default function Add_events() {
    const navigate = useNavigate();
    const [eventData, setEventData] = useState({
        name: '',
        college: '',
        s_time: '',
        e_time: '',
        image: null,
        location: null,
        description: '',
        state: '',
        district: '',
        category: '',
        registrationLink: ''
    });
    const [availableDistricts, setAvailableDistricts] = useState([]);

    // Search terms for filtering
    const [stateSearchTerm, setStateSearchTerm] = useState('');
    const [districtSearchTerm, setDistrictSearchTerm] = useState('');
    const [categorySearchTerm, setCategorySearchTerm] = useState('');

    // Dropdown visibility
    const [showStateDropdown, setShowStateDropdown] = useState(false);
    const [showDistrictDropdown, setShowDistrictDropdown] = useState(false);
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

    // Refs for click outside detection
    const stateRef = useRef(null);
    const districtRef = useRef(null);
    const categoryRef = useRef(null);

    useEffect(() => {
        // Load temp data if exists (resuming draft)
        const savedData = localStorage.getItem('temp_event_data');
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            setEventData(parsedData);
        }

        // Check if we have a location returned from Add_location
        const savedLocation = localStorage.getItem('temp_location');
        if (savedLocation) {
            const { lat, lng } = JSON.parse(savedLocation);
            setEventData(prev => ({ ...prev, location: { lat, lng } }));
            // We keep temp_location until save to be safe
        }
    }, []);

    // Update available districts when state changes
    useEffect(() => {
        if (eventData.state) {
            const state = statesData.states.find(s => s.name === eventData.state);
            setAvailableDistricts(state ? state.districts : []);
            // Only reset district if it's not valid for the current state
            // This check ensures we don't reset a valid district when loading saved data
            if (eventData.district && state && !state.districts.includes(eventData.district)) {
                setEventData(prev => ({ ...prev, district: '' }));
            }
        } else {
            setAvailableDistricts([]);
        }
    }, [eventData.state]);

    // Click outside detection
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (stateRef.current && !stateRef.current.contains(event.target)) {
                setShowStateDropdown(false);
            }
            if (districtRef.current && !districtRef.current.contains(event.target)) {
                setShowDistrictDropdown(false);
            }
            if (categoryRef.current && !categoryRef.current.contains(event.target)) {
                setShowCategoryDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setEventData(prev => ({ ...prev, image: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddLocation = () => {
        // Save current state before navigating away
        localStorage.setItem('temp_event_data', JSON.stringify(eventData));
        navigate('/events/add_location');
    };

    const handleSave = () => {
        if (!eventData.name.trim()) return;

        const storedEvents = JSON.parse(localStorage.getItem('user_events') || '[]');
        const newEvent = {
            id: Date.now(),
            name: eventData.name,
            college: eventData.college,
            s_time: eventData.s_time,
            e_time: eventData.e_time,
            image: eventData.image || `https://picsum.photos/200/200?random=${Date.now()}`,
            description: eventData.description,
            state: eventData.state,
            district: eventData.district,
            category: eventData.category,
            registrationLink: eventData.registrationLink,
            // Add location data if available, or default to center of India if critical
            lat: eventData.location?.lat || 19.1334,
            lng: eventData.location?.lng || 72.9133
        };

        const updatedEvents = [newEvent, ...storedEvents];
        localStorage.setItem('user_events', JSON.stringify(updatedEvents));

        // Clear temp data
        localStorage.removeItem('temp_event_data');
        localStorage.removeItem('temp_location');

        navigate('/events/all_events');
    };

    // Filter functions
    const filteredStates = statesData.states.filter(state =>
        state.name.toLowerCase().includes(stateSearchTerm.toLowerCase())
    );

    const filteredDistricts = availableDistricts.filter(district =>
        district.toLowerCase().includes(districtSearchTerm.toLowerCase())
    );

    const filteredCategories = categoriesData.categories.filter(category =>
        category.toLowerCase().includes(categorySearchTerm.toLowerCase())
    );

    // Selection handlers
    const handleStateSelect = (stateName) => {
        setEventData({ ...eventData, state: stateName });
        setStateSearchTerm('');
        setShowStateDropdown(false);
    };

    const handleDistrictSelect = (districtName) => {
        setEventData({ ...eventData, district: districtName });
        setDistrictSearchTerm('');
        setShowDistrictDropdown(false);
    };

    const handleCategorySelect = (categoryName) => {
        setEventData({ ...eventData, category: categoryName });
        setCategorySearchTerm('');
        setShowCategoryDropdown(false);
    };

    return (
        <div className="bg-black min-h-screen text-white font-sans flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-gray-800 sticky top-0 bg-black/80 backdrop-blur-md z-10 flex items-center gap-4">
                <button
                    className="text-white hover:text-gray-300 transition-colors"
                    onClick={() => {
                        localStorage.removeItem('temp_event_data');
                        localStorage.removeItem('temp_location');
                        navigate("/events/all_events");
                    }}
                >
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-lg font-semibold">Add New Event</h1>
            </div>

            {/* Form Body */}
            <div className="p-6 max-w-md mx-auto w-full flex-grow flex flex-col gap-6">

                {/* Image Upload Area */}
                <div className="flex justify-center mb-4">
                    <div className="relative w-32 h-32 bg-gray-900 rounded-2xl border border-gray-800 flex items-center justify-center overflow-hidden group cursor-pointer hover:border-gray-600 transition-all">
                        {eventData.image ? (
                            <img src={eventData.image} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                            <div className="text-center p-2 flex flex-col items-center gap-2 text-gray-600 group-hover:text-gray-400">
                                <ImageIcon size={28} />
                                <span className="text-xs">Add Cover</span>
                            </div>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={handleImageChange}
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm text-gray-400 ml-1">Event Name</label>
                        <input
                            type="text"
                            placeholder="e.g. Tech Symposium 2024"
                            className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-gray-600 focus:bg-gray-900 transition-all"
                            value={eventData.name}
                            onChange={(e) => setEventData({ ...eventData, name: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-gray-400 ml-1">College Name</label>
                        <input
                            type="text"
                            placeholder="e.g. Stanford University"
                            className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-gray-600 focus:bg-gray-900 transition-all"
                            value={eventData.college}
                            onChange={(e) => setEventData({ ...eventData, college: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-gray-400 ml-1">Description</label>
                        <textarea
                            placeholder="Describe your event..."
                            className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-gray-600 focus:bg-gray-900 transition-all resize-none h-32"
                            value={eventData.description}
                            onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-gray-400 ml-1">Start Time</label>
                        <input
                            type="datetime-local"
                            className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-gray-600 focus:bg-gray-900 transition-all [color-scheme:dark]"
                            value={eventData.s_time}
                            onChange={(e) => setEventData({ ...eventData, s_time: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-gray-400 ml-1">End Time</label>
                        <input
                            type="datetime-local"
                            className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-gray-600 focus:bg-gray-900 transition-all [color-scheme:dark]"
                            value={eventData.e_time}
                            onChange={(e) => setEventData({ ...eventData, e_time: e.target.value })}
                        />
                    </div>

                    {/* State Searchable Dropdown */}
                    <div className="space-y-2" ref={stateRef}>
                        <label className="text-sm text-gray-400 ml-1">State</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={showStateDropdown ? stateSearchTerm : (eventData.state || '')}
                                onChange={(e) => {
                                    setStateSearchTerm(e.target.value);
                                    setShowStateDropdown(true);
                                }}
                                onFocus={() => {
                                    setShowStateDropdown(true);
                                    setStateSearchTerm('');
                                }}
                                placeholder={eventData.state || "Search or select state..."}
                                className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 pr-10 text-white placeholder-gray-600 focus:outline-none focus:border-gray-600 focus:bg-gray-900 transition-all"
                            />
                            <ChevronDown
                                size={20}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                            />
                            {showStateDropdown && (
                                <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                                    {filteredStates.length > 0 ? (
                                        filteredStates.map((state) => (
                                            <div
                                                key={state.name}
                                                onClick={() => handleStateSelect(state.name)}
                                                className="px-4 py-2.5 text-white hover:bg-gray-700 cursor-pointer transition-colors"
                                            >
                                                {state.name}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="px-4 py-2.5 text-gray-500">No results found</div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* District Searchable Dropdown */}
                    <div className="space-y-2" ref={districtRef}>
                        <label className="text-sm text-gray-400 ml-1">District</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={showDistrictDropdown ? districtSearchTerm : (eventData.district || '')}
                                onChange={(e) => {
                                    setDistrictSearchTerm(e.target.value);
                                    setShowDistrictDropdown(true);
                                }}
                                onFocus={() => {
                                    if (eventData.state) {
                                        setShowDistrictDropdown(true);
                                        setDistrictSearchTerm('');
                                    }
                                }}
                                disabled={!eventData.state}
                                placeholder={eventData.district || "Search or select district..."}
                                className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 pr-10 text-white placeholder-gray-600 focus:outline-none focus:border-gray-600 focus:bg-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                            <ChevronDown
                                size={20}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                            />
                            {showDistrictDropdown && eventData.state && (
                                <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                                    {filteredDistricts.length > 0 ? (
                                        filteredDistricts.map((district) => (
                                            <div
                                                key={district}
                                                onClick={() => handleDistrictSelect(district)}
                                                className="px-4 py-2.5 text-white hover:bg-gray-700 cursor-pointer transition-colors"
                                            >
                                                {district}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="px-4 py-2.5 text-gray-500">No results found</div>
                                    )}
                                </div>
                            )}
                        </div>
                        {!eventData.state && (
                            <p className="text-xs text-gray-500 ml-1">Select a state first</p>
                        )}
                    </div>

                    {/* Category Searchable Dropdown */}
                    <div className="space-y-2" ref={categoryRef}>
                        <label className="text-sm text-gray-400 ml-1">Category</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={showCategoryDropdown ? categorySearchTerm : (eventData.category || '')}
                                onChange={(e) => {
                                    setCategorySearchTerm(e.target.value);
                                    setShowCategoryDropdown(true);
                                }}
                                onFocus={() => {
                                    setShowCategoryDropdown(true);
                                    setCategorySearchTerm('');
                                }}
                                placeholder={eventData.category || "Search or select category..."}
                                className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 pr-10 text-white placeholder-gray-600 focus:outline-none focus:border-gray-600 focus:bg-gray-900 transition-all"
                            />
                            <ChevronDown
                                size={20}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                            />
                            {showCategoryDropdown && (
                                <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                                    {filteredCategories.length > 0 ? (
                                        filteredCategories.map((category) => (
                                            <div
                                                key={category}
                                                onClick={() => handleCategorySelect(category)}
                                                className="px-4 py-2.5 text-white hover:bg-gray-700 cursor-pointer transition-colors"
                                            >
                                                {category}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="px-4 py-2.5 text-gray-500">No results found</div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-gray-400 ml-1">Registration Link (Optional)</label>
                        <input
                            type="url"
                            placeholder="e.g. https://forms.google.com/..."
                            className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-gray-600 focus:bg-gray-900 transition-all"
                            value={eventData.registrationLink}
                            onChange={(e) => setEventData({ ...eventData, registrationLink: e.target.value })}
                        />
                        <p className="text-xs text-gray-500 ml-1">Add a Google Form or registration page link</p>
                    </div>

                    {/* Add Location Button */}
                    <button
                        onClick={handleAddLocation}
                        className={`w-full py-3 px-4 border rounded-xl flex items-center justify-start gap-3 transition-all group ${eventData.location
                            ? 'border-green-800 bg-green-900/20 text-green-400'
                            : 'border-gray-800 text-gray-400 hover:text-white hover:bg-gray-900/50 hover:border-gray-600'
                            }`}
                    >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${eventData.location ? 'bg-green-900 text-green-400' : 'bg-gray-900 group-hover:bg-gray-800'}`}>
                            <MapPin size={16} />
                        </div>
                        <span>{eventData.location ? 'Location Added' : 'Add Location'}</span>
                    </button>
                </div>

                <div className="mt-auto pt-8 pb-4">
                    <button
                        onClick={handleSave}
                        disabled={!eventData.name}
                        className="w-full bg-white text-black font-semibold py-3 px-4 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-white/10"
                    >
                        Create Event
                    </button>
                </div>
            </div>
        </div>
    );
}