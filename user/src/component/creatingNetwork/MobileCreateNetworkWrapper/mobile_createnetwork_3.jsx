// src/components/MobileCreateNetwork3.jsx

import React from 'react';
import { Search, ArrowRight, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setFormData, createNetwork, resetForm } from '../../../features/networkCreate/networkSlice';

export default function MobileCreateNetwork3() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { interest } = useSelector((state) => state.network.formData);
  const { status, error } = useSelector((state) => state.network.creation);
  
  const interests = ["music", "software", "anime", "dancing", "yoga", "dogs", "feminism", "fire & camping", "ilayaraja playlist", "MR. Beast", "cats", "video"];

  const handleSelectInterest = (item) => {
    // Toggle functionality: if same interest is clicked, deselect it.
    const newInterest = interest === item ? null : item;
    dispatch(setFormData({ field: 'interest', value: newInterest }));
  };

  const handleSubmit = async () => {
    // Prevent double-clicking
    if (status === 'loading') return;

    const resultAction = await dispatch(createNetwork());
    if (createNetwork.fulfilled.match(resultAction)) {
      // On success, reset the form and navigate away
      alert('Network created successfully!');
      dispatch(resetForm());
      navigate('/communitypage');
    }
    // The rejected case will be handled by the UI below
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 pt-6 pb-28">
      <header className="flex items-center gap-2 mb-4">
        <button onClick={() => navigate('/mobile_createnetwork_2')} className="p-2 -ml-2">
          <ArrowLeft className="w-6 h-6 text-neutral-300" />
        </button>
        <span className="ml-auto bg-[#2F3336] px-3 py-1 rounded-full text-sm">3/3</span>
      </header>
      <h2 className="text-lg font-semibold">Network interest</h2>
      <p className="text-gray-400 text-sm mb-4">Pick one interest that best describes your network. This helps others discover it.</p>
      
      <div className="flex flex-wrap gap-2">
        {interests.map((item) => {
          const isSelected = interest === item;
          return (
            <button
              key={item}
              onClick={() => handleSelectInterest(item)}
              className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                isSelected ? 'border-pink-500 text-pink-500 bg-pink-900/20' : 'border-neutral-700 text-neutral-400'
              }`}
            >
              {item}
            </button>
          );
        })}
      </div>

      {/* Show API error message on failure */}
      {status === 'failed' && (
        <p className="text-red-500 text-sm mt-4">Creation Failed: {error}</p>
      )}

      <footer className="fixed bottom-0 left-0 right-0 flex items-center justify-between bg-black px-6 py-4">
        <p className="text-md">Can’t find your Interest?</p>
        <button
          onClick={handleSubmit}
          disabled={!interest || status === 'loading'} // Disable button if no interest is selected or if loading
          className="w-12 h-12 rounded-full bg-[#2e2e2e] flex items-center justify-center disabled:opacity-50"
        >
          {status === 'loading' ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <ArrowRight size={22} className="text-white" />
          )}
        </button>
      </footer>
    </div>
  );
}