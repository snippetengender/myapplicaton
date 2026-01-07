import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import statesData from '../../../data/india-states-districts.json';
import categoriesData from '../../../data/all-categorys.json';

export default function FilterModal({ isOpen, onClose, onApplyFilter, currentState, currentDistrict, currentCategory }) {
    const [selectedState, setSelectedState] = useState(currentState || '');
    const [selectedDistrict, setSelectedDistrict] = useState(currentDistrict || '');
    const [selectedCategory, setSelectedCategory] = useState(currentCategory || '');
    const [availableDistricts, setAvailableDistricts] = useState([]);

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
        }
    }, [isOpen, currentState, currentDistrict, currentCategory]);

    const handleApply = () => {
        onApplyFilter(selectedState, selectedDistrict, selectedCategory);
        onClose();
    };

    const handleClear = () => {
        setSelectedState('');
        setSelectedDistrict('');
        setSelectedCategory('');
        onApplyFilter('', '', '');
        onClose();
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
                    {/* State Dropdown */}
                    <div className="space-y-2">
                        <label className="text-sm text-gray-400 ml-1">State</label>
                        <select
                            value={selectedState}
                            onChange={(e) => setSelectedState(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gray-600 transition-all cursor-pointer"
                        >
                            <option value="">All States</option>
                            {statesData.states.map((state) => (
                                <option key={state.name} value={state.name}>
                                    {state.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* District Dropdown */}
                    <div className="space-y-2">
                        <label className="text-sm text-gray-400 ml-1">District</label>
                        <select
                            value={selectedDistrict}
                            onChange={(e) => setSelectedDistrict(e.target.value)}
                            disabled={!selectedState}
                            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gray-600 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <option value="">All Districts</option>
                            {availableDistricts.map((district) => (
                                <option key={district} value={district}>
                                    {district}
                                </option>
                            ))}
                        </select>
                        {!selectedState && (
                            <p className="text-xs text-gray-500 ml-1">Select a state first</p>
                        )}
                    </div>

                    {/* Category Dropdown */}
                    <div className="space-y-2">
                        <label className="text-sm text-gray-400 ml-1">Category</label>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gray-600 transition-all cursor-pointer"
                        >
                            <option value="">All Categories</option>
                            {categoriesData.categories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
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
