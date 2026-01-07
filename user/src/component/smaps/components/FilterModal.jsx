import { useState, useEffect, useRef } from 'react';
import { X, ChevronDown } from 'lucide-react';
import statesData from '../../../data/india-states-districts.json';
import categoriesData from '../../../data/all-categorys.json';

export default function FilterModal({ isOpen, onClose, onApplyFilter, currentState, currentDistrict, currentCategory }) {
    const [selectedState, setSelectedState] = useState(currentState || '');
    const [selectedDistrict, setSelectedDistrict] = useState(currentDistrict || '');
    const [selectedCategory, setSelectedCategory] = useState(currentCategory || '');
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

    // Update districts when state changes
    useEffect(() => {
        if (selectedState) {
            const state = statesData.states.find(s => s.name === selectedState);
            setAvailableDistricts(state ? state.districts : []);
            // Reset district if it's not in the new state's districts
            if (selectedDistrict && state && !state.districts.includes(selectedDistrict)) {
                setSelectedDistrict('');
            }
        } else {
            setAvailableDistricts([]);
            setSelectedDistrict('');
        }
    }, [selectedState]);

    // Sync with props when modal opens
    useEffect(() => {
        if (isOpen) {
            setSelectedState(currentState || '');
            setSelectedDistrict(currentDistrict || '');
            setSelectedCategory(currentCategory || '');
            setStateSearchTerm('');
            setDistrictSearchTerm('');
            setCategorySearchTerm('');
        }
    }, [isOpen, currentState, currentDistrict, currentCategory]);

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

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isOpen]);

    const handleApply = () => {
        onApplyFilter(selectedState, selectedDistrict, selectedCategory);
        onClose();
    };

    const handleClear = () => {
        setSelectedState('');
        setSelectedDistrict('');
        setSelectedCategory('');
        setStateSearchTerm('');
        setDistrictSearchTerm('');
        setCategorySearchTerm('');
        onApplyFilter('', '', '');
        onClose();
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
        setSelectedState(stateName);
        setStateSearchTerm('');
        setShowStateDropdown(false);
    };

    const handleDistrictSelect = (districtName) => {
        setSelectedDistrict(districtName);
        setDistrictSearchTerm('');
        setShowDistrictDropdown(false);
    };

    const handleCategorySelect = (categoryName) => {
        setSelectedCategory(categoryName);
        setCategorySearchTerm('');
        setShowCategoryDropdown(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-gray-900 border border-gray-800 rounded-2xl p-6 w-[90%] max-w-md shadow-2xl">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-white">Filter Events</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Filter Options */}
                <div className="space-y-4 mb-6">
                    {/* State Searchable Dropdown */}
                    <div className="space-y-2" ref={stateRef}>
                        <label className="text-sm text-gray-400 ml-1">State</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={showStateDropdown ? stateSearchTerm : (selectedState || '')}
                                onChange={(e) => {
                                    setStateSearchTerm(e.target.value);
                                    setShowStateDropdown(true);
                                }}
                                onFocus={() => {
                                    setShowStateDropdown(true);
                                    setStateSearchTerm('');
                                }}
                                placeholder={selectedState || "Search or select state..."}
                                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 pr-10 text-white focus:outline-none focus:border-gray-600 transition-all"
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
                                value={showDistrictDropdown ? districtSearchTerm : (selectedDistrict || '')}
                                onChange={(e) => {
                                    setDistrictSearchTerm(e.target.value);
                                    setShowDistrictDropdown(true);
                                }}
                                onFocus={() => {
                                    if (selectedState) {
                                        setShowDistrictDropdown(true);
                                        setDistrictSearchTerm('');
                                    }
                                }}
                                disabled={!selectedState}
                                placeholder={selectedDistrict || "Search or select district..."}
                                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 pr-10 text-white focus:outline-none focus:border-gray-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                            <ChevronDown
                                size={20}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                            />
                            {showDistrictDropdown && selectedState && (
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
                        {!selectedState && (
                            <p className="text-xs text-gray-500 ml-1">Select a state first</p>
                        )}
                    </div>

                    {/* Category Searchable Dropdown */}
                    <div className="space-y-2" ref={categoryRef}>
                        <label className="text-sm text-gray-400 ml-1">Category</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={showCategoryDropdown ? categorySearchTerm : (selectedCategory || '')}
                                onChange={(e) => {
                                    setCategorySearchTerm(e.target.value);
                                    setShowCategoryDropdown(true);
                                }}
                                onFocus={() => {
                                    setShowCategoryDropdown(true);
                                    setCategorySearchTerm('');
                                }}
                                placeholder={selectedCategory || "Search or select category..."}
                                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 pr-10 text-white focus:outline-none focus:border-gray-600 transition-all"
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
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={handleClear}
                        className="flex-1 bg-gray-800 text-white border border-gray-700 rounded-xl px-4 py-3 font-medium hover:bg-gray-700 transition-colors"
                    >
                        Clear
                    </button>
                    <button
                        onClick={handleApply}
                        className="flex-1 bg-white text-black rounded-xl px-4 py-3 font-semibold hover:bg-gray-200 transition-colors shadow-lg shadow-white/10"
                    >
                        Apply
                    </button>
                </div>
            </div>
        </div>
    );
}
