import { ArrowLeft, MapPin, Plus, Image as ImageIcon, ChevronDown } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import statesData from '../../../data/india-states-districts.json';
import categoriesData from '../../../data/all-categorys.json';
import { createEvent, searchColleges, updateEvent } from "../api"
import { useNotification } from "../../../providers/NotificationContext";

export default function Add_events() {
    const navigate = useNavigate();
    const location = useLocation();
    const editEvent = location.state?.editEvent;

    const [eventData, setEventData] = useState({
        name: '',
        college_id: '',
        collegeName: '',
        event_start_time: '',
        event_end_time: '',
        event_poster: null,
        location: null,
        description: '',
        state: '',
        district: '',
        category: '',
        registration_link: '',
        visibility: 'public',
        college_location: null,
        countryCode: '+91',
        phone_number: '',
        organizer_platform: '',
        is_cash_prize_available: false,
        cash_prize_amount: '',
        is_registration_fee_available: false,
        registration_fee_amount: ''
    });
    const [availableDistricts, setAvailableDistricts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Search terms for filtering
    const [stateSearchTerm, setStateSearchTerm] = useState('');
    const [districtSearchTerm, setDistrictSearchTerm] = useState('');
    const [categorySearchTerm, setCategorySearchTerm] = useState('');

    // Dropdown visibility
    const [showStateDropdown, setShowStateDropdown] = useState(false);
    const [showDistrictDropdown, setShowDistrictDropdown] = useState(false);
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const [showCollegeDropdown, setShowCollegeDropdown] = useState(false);
    const [collegeResults, setCollegeResults] = useState([]);
    const [isSearchingCollege, setIsSearchingCollege] = useState(false);
    const collegeSearchTimeout = useRef(null);

    // Refs for click outside detection
    const stateRef = useRef(null);
    const districtRef = useRef(null);
    const categoryRef = useRef(null);
    const collegeRef = useRef(null);

    useEffect(() => {
        const isResuming = location.state?.resumingDraft;
        const savedData = localStorage.getItem('temp_event_data');

        if (isResuming && savedData) {
            setEventData(JSON.parse(savedData));
        } else if (editEvent && !isResuming) {
            const formatToLocalISO = (timestamp) => {
                if (!timestamp) return '';
                const date = new Date(timestamp);
                if (isNaN(date.getTime())) return '';
                const pad = (n) => n.toString().padStart(2, '0');
                return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
            };

            let editPhone = editEvent.phone_number || '';
            let editCountryCode = '+91';

            if (editPhone.includes(' ')) {
                const parts = editPhone.split(' ');
                if (parts[0].startsWith('+')) {
                    editCountryCode = parts[0];
                    editPhone = parts.slice(1).join('').replace(/\D/g, '');
                }
            } else if (editPhone.startsWith('+91')) {
                editCountryCode = '+91';
                editPhone = editPhone.substring(3).replace(/\D/g, '');
            } else if (editPhone.startsWith('+1')) {
                editCountryCode = '+1';
                editPhone = editPhone.substring(2).replace(/\D/g, '');
            } else if (editPhone.startsWith('+44')) {
                editCountryCode = '+44';
                editPhone = editPhone.substring(3).replace(/\D/g, '');
            } else {
                editPhone = editPhone.replace(/\D/g, '');
            }

            setEventData({
                name: editEvent.event_title || '',
                college_id: editEvent.college_id || '',
                collegeName: editEvent.college_name || '',
                event_start_time: formatToLocalISO(editEvent.event_start_time),
                event_end_time: formatToLocalISO(editEvent.event_end_time),
                event_poster: editEvent.event_poster || null,
                location: editEvent.location?.coordinates ? { lng: editEvent.location.coordinates[0], lat: editEvent.location.coordinates[1] } : null,
                description: editEvent.description || '',
                state: editEvent.state || '',
                district: editEvent.district || '',
                category: editEvent.category || '',
                registration_link: editEvent.registration_link || '',
                visibility: editEvent.visibility || 'public',
                college_location: null,
                countryCode: editCountryCode,
                phone_number: editPhone,
                organizer_platform: editEvent.organizer_platform || '',
                is_cash_prize_available: editEvent.is_cash_prize_available || false,
                cash_prize_amount: editEvent.cash_prize_amount || '',
                is_registration_fee_available: editEvent.is_registration_fee_available || false,
                registration_fee_amount: editEvent.registration_fee_amount || ''
            });
        } else if (savedData) {
            // Load temp data if exists (resuming draft outside of location flow)
            setEventData(JSON.parse(savedData));
        }

        // Check if we have a location returned from Add_location
        const savedLocation = localStorage.getItem('temp_location');
        if (savedLocation) {
            const { lat, lng } = JSON.parse(savedLocation);
            setEventData(prev => ({ ...prev, location: { lat, lng } }));
            // We keep temp_location until save to be safe
        }
    }, [editEvent]);

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
            if (collegeRef.current && !collegeRef.current.contains(event.target)) {
                setShowCollegeDropdown(false);
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
                setEventData(prev => ({ ...prev, event_poster: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddLocation = () => {
        if (!eventData.college_id) return;
        // Save current state before navigating away
        localStorage.setItem('temp_event_data', JSON.stringify(eventData));
        navigate('/events/add_location', { state: { collegeLocation: eventData.college_location, eventLocation: eventData.location, editEvent, resumingDraft: true } });
    };

    const { markEventsUnread } = useNotification();
    const handleSave = async () => {
        const requiredFields = {
            name: "Event Title",
            college_id: "College",
            event_start_time: "Start Time",
            event_end_time: "End Time",
            description: "Description",
            state: "State",
            district: "District",
            category: "Category",
            location: "Location",
            phone_number: "Phone Number",
            organizer_platform: "Instagram/Webpage"
        };

        const missingFields = [];
        Object.keys(requiredFields).forEach(key => {
            if (!eventData[key]) {
                missingFields.push(requiredFields[key]);
            }
        });

        if (eventData.is_cash_prize_available && (!eventData.cash_prize_amount || isNaN(eventData.cash_prize_amount) || Number(eventData.cash_prize_amount) <= 0)) {
            missingFields.push("Valid Cash Prize Amount");
        }

        if (eventData.is_registration_fee_available && (!eventData.registration_fee_amount || isNaN(eventData.registration_fee_amount) || Number(eventData.registration_fee_amount) <= 0)) {
            missingFields.push("Valid Registration Fee Amount");
        }

        if (missingFields.length > 0) {
            alert(`Please fill in the following required fields:\n\n- ${missingFields.join('\n- ')}`);
            return;
        }

        setIsLoading(true);
        const newEvent = {
            event_title: eventData.name,
            college_id: eventData.college_id,
            event_start_time: new Date(eventData.event_start_time).toISOString(),
            event_end_time: new Date(eventData.event_end_time).toISOString(),
            event_poster: eventData.event_poster || `https://picsum.photos/200/200?random=${Date.now()}`,
            description: eventData.description,
            state: eventData.state,
            district: eventData.district,
            category: eventData.category,
            registration_link: eventData.registration_link,
            location: eventData.location,
            visibility: eventData.visibility,
            phone_number: `${eventData.countryCode} ${eventData.phone_number}`,
            organizer_platform: eventData.organizer_platform,
            is_cash_prize_available: eventData.is_cash_prize_available,
            cash_prize_amount: eventData.cash_prize_amount,
            is_registration_fee_available: eventData.is_registration_fee_available,
            registration_fee_amount: eventData.registration_fee_amount,
        };

        try {
            if (editEvent) {
                await updateEvent(editEvent.event_id, newEvent);
            } else {
                await createEvent(newEvent);
            }
            localStorage.removeItem('temp_event_data');
            localStorage.removeItem('temp_location');
            navigate('/events/all_events');
        } catch (error) {
            console.error('failed to save event:', error);
            setIsLoading(false);
        }
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

    const handleCollegeSearch = async (query) => {
        setEventData(prev => ({ ...prev, collegeName: query, college_id: '' }));
        setShowCollegeDropdown(true);

        if (collegeSearchTimeout.current) {
            clearTimeout(collegeSearchTimeout.current);
        }

        if (query.trim().length < 3) {
            setCollegeResults([]);
            return;
        }

        setIsSearchingCollege(true);
        collegeSearchTimeout.current = setTimeout(async () => {
            try {
                const results = await searchColleges(query);
                setCollegeResults(results.data || []);
            } catch (error) {
                console.error('Failed to search colleges', error);
                setCollegeResults([]);
            } finally {
                setIsSearchingCollege(false);
            }
        }, 500); // 500ms debounce
    };

    const handleCollegeSelect = (college) => {
        setEventData(prev => ({
            ...prev,
            college_id: college._id || college.id || '', // Handles your backend projection result
            collegeName: college.name,
            college_location: college.location || null
        }));
        setShowCollegeDropdown(false);
        setCollegeResults([]);
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
                <h1 className="text-lg font-semibold">{editEvent ? "Edit Event" : "Add New Event"}</h1>
            </div>

            {/* Form Body */}
            <div className="p-6 max-w-md mx-auto w-full flex-grow flex flex-col gap-6">

                {/* Image Upload Area */}
                <div className="flex justify-center mb-4">
                    <div className="relative w-32 h-32 bg-gray-900 rounded-2xl border border-gray-800 flex items-center justify-center overflow-hidden group cursor-pointer hover:border-gray-600 transition-all">
                        {eventData.event_poster ? (
                            <img src={eventData.event_poster} alt="Preview" className="w-full h-full object-cover" />
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

                    <div className="space-y-2" ref={collegeRef}>
                        <label className="text-sm text-gray-400 ml-1">College Name</label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="e.g. Stanford University"
                                className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 pr-10 text-white placeholder-gray-600 focus:outline-none focus:border-gray-600 focus:bg-gray-900 transition-all"
                                value={eventData.collegeName}
                                onChange={(e) => handleCollegeSearch(e.target.value)}
                                onFocus={() => setShowCollegeDropdown(true)}
                            />
                            <ChevronDown
                                size={20}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                            />
                            {showCollegeDropdown && (eventData.collegeName.length >= 3 || collegeResults.length > 0) && (
                                <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                                    {isSearchingCollege ? (
                                        <div className="px-4 py-2.5 text-gray-500">Searching...</div>
                                    ) : collegeResults.length > 0 ? (
                                        collegeResults.map((college) => (
                                            <div
                                                key={college._id || college.name}
                                                onClick={() => handleCollegeSelect(college)}
                                                className="px-4 py-2.5 text-white hover:bg-gray-700 cursor-pointer transition-colors"
                                            >
                                                <div className="font-medium">{college.name}</div>
                                                {college.city && <div className="text-xs text-gray-400">{college.city}</div>}
                                            </div>
                                        ))
                                    ) : (
                                        eventData.collegeName.length >= 3 && <div className="px-4 py-2.5 text-gray-500">No results found</div>
                                    )}
                                </div>
                            )}
                        </div>
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
                            value={eventData.event_start_time}
                            onChange={(e) => setEventData({ ...eventData, event_start_time: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-gray-400 ml-1">End Time</label>
                        <input
                            type="datetime-local"
                            className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-gray-600 focus:bg-gray-900 transition-all [color-scheme:dark]"
                            value={eventData.event_end_time}
                            onChange={(e) => setEventData({ ...eventData, event_end_time: e.target.value })}
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
                            value={eventData.registration_link}
                            onChange={(e) => setEventData({ ...eventData, registration_link: e.target.value })}
                        />
                        <p className="text-xs text-gray-500 ml-1">Add a Google Form or registration page link</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-gray-400 ml-1">Phone Number</label>
                        <div className="flex gap-2">
                            <select
                                className="w-[100px] shrink-0 bg-gray-900/50 border border-gray-800 rounded-xl px-2 py-3 text-white focus:outline-none focus:border-gray-600 focus:bg-gray-900 transition-all appearance-none text-center"
                                value={eventData.countryCode || '+91'}
                                onChange={(e) => setEventData({ ...eventData, countryCode: e.target.value })}
                            >
                                <option value="+91">+91 (IN)</option>
                                <option value="+1">+1 (US)</option>
                                <option value="+44">+44 (UK)</option>
                                <option value="+61">+61 (AU)</option>
                            </select>
                            <input
                                type="tel"
                                maxLength="10"
                                placeholder="9876543210"
                                className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-gray-600 focus:bg-gray-900 transition-all"
                                value={eventData.phone_number}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                    setEventData({ ...eventData, phone_number: val });
                                }}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-gray-400 ml-1">Instagram Handle / Webpage</label>
                        <input
                            type="text"
                            placeholder="e.g. IG handle/webpage link"
                            className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-gray-600 focus:bg-gray-900 transition-all"
                            value={eventData.organizer_platform}
                            onChange={(e) => setEventData({ ...eventData, organizer_platform: e.target.value })}
                        />
                    </div>

                    <div className="space-y-4 bg-gray-900/30 p-4 rounded-xl border border-gray-800">
                        <div className="flex items-center justify-between">
                            <div>
                                <label className="text-sm text-white font-medium">Cash Prize</label>
                                <p className="text-xs text-gray-500 mt-1">Is there a cash prize for this event?</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={eventData.is_cash_prize_available}
                                    onChange={(e) => setEventData({ ...eventData, is_cash_prize_available: e.target.checked })}
                                />
                                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                            </label>
                        </div>

                        {eventData.is_cash_prize_available && (
                            <div className="space-y-2 pt-2 border-t border-gray-800">
                                <label className="text-sm text-gray-400 ml-1">Prize Pool</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">₹</span>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        placeholder="e.g. 5000"
                                        className="w-full bg-gray-900/50 border border-gray-800 rounded-xl pl-8 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-gray-600 focus:bg-gray-900 transition-all"
                                        value={eventData.cash_prize_amount}
                                        onChange={(e) => setEventData({ ...eventData, cash_prize_amount: e.target.value.replace(/\D/g, '') })}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-4 bg-gray-900/30 p-4 rounded-xl border border-gray-800">
                        <div className="flex items-center justify-between">
                            <div>
                                <label className="text-sm text-white font-medium">Registration Fee</label>
                                <p className="text-xs text-gray-500 mt-1">How much are you collecting from each team</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={eventData.is_registration_fee_available}
                                    onChange={(e) => setEventData({ ...eventData, is_registration_fee_available: e.target.checked })}
                                />
                                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                            </label>
                        </div>

                        {eventData.is_registration_fee_available && (
                            <div className="space-y-2 pt-2 border-t border-gray-800">
                                <label className="text-sm text-gray-400 ml-1">Registration Amount</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">₹</span>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        placeholder="e.g. 500"
                                        className="w-full bg-gray-900/50 border border-gray-800 rounded-xl pl-8 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-gray-600 focus:bg-gray-900 transition-all"
                                        value={eventData.registration_fee_amount}
                                        onChange={(e) => setEventData({ ...eventData, registration_fee_amount: e.target.value.replace(/\D/g, '') })}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-gray-400 ml-1">Visibility</label>
                        <select
                            className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gray-600 focus:bg-gray-900 transition-all appearance-none"
                            value={eventData.visibility}
                            onChange={(e) => setEventData({ ...eventData, visibility: e.target.value })}
                        >
                            <option value="public">Public (Visible to everyone)</option>
                            <option value="private">Private (Visible only to your college)</option>
                        </select>
                        <p className="text-xs text-gray-500 ml-1">Private events will only appear in "your hood" for your college mates.</p>
                    </div>

                    <button
                        onClick={handleAddLocation}
                        disabled={!eventData.college_id}
                        className={`w-full py-3 px-4 border rounded-xl flex items-center justify-start gap-3 transition-all group ${!eventData.college_id
                            ? 'opacity-50 cursor-not-allowed border-gray-800 text-gray-500'
                            : eventData.location
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
                        disabled={isLoading}
                        className="w-full bg-white text-black font-semibold py-3 px-4 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-white/10"
                    >
                        {isLoading ? (editEvent ? 'Updating...' : 'Creating...') : (editEvent ? 'Update Event' : 'Create Event')}
                    </button>
                </div>
            </div>
        </div>
    );
}