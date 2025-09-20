import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const InReview = () => (
  <div className="border-y border-gray-800 py-6">
    <h2 className="text-xl font-semibold text-[#E7E9EA]">Your Club in Review</h2>
  </div>
);


const ReviewDone = ({ credentials }) => (
  <div className="border-y border-gray-800 py-6">
    <h2 className="text-xl font-semibold text-[#E7E9EA]">Review's Done</h2>
    <p className="text-gray-400 mt-1">You can login now</p>
    <p className="text-gray-400 mt-4">Email: {credentials.email}</p>
    <p className="text-gray-400">Password: {credentials.password}</p>
  </div>
);

const ClubLoginPage = () => {
  const navigate = useNavigate();
  
  // false = in review, true = done. Starts in the 'in review' state.
  const [isReviewDone, setIsReviewDone] = useState(false);
  
  // Mock credentials that are shown after review is complete
  const [clubCredentials] = useState({
    email: 'foss@cit.edu.in',
    password: 'foss_cit',
  });

  return (
    <div className="min-h-screen bg-black text-[#E7E9EA] p-0 flex flex-col">
      {/* Top Bar with back navigation */}
      <header className="px-4 pt-4 mb-8">
        <button onClick={() => navigate(-1)} className="text-[#E7E9EA]">
          <ArrowBackIcon />
        </button>
      </header>

      <main className="flex-grow flex flex-col justify-between px-4">
        {/* Conditional display based on review status */}
        <div>
          {isReviewDone ? (
            <ReviewDone credentials={clubCredentials} />
          ) : (
            <InReview />
          )}
        </div>

        {/* Bottom section with title and action buttons */}
        <div className="pb-8">
          <h2 className="text-xl font-bold text-center">Add your Event</h2>
          <p className="text-gray-400 text-center text-sm mb-6">
            Showcase your Event to thousands for Free
          </p>
          <div className="flex flex-col space-y-4">
            {/* --- UPDATED BUTTON TO NAVIGATE --- */}
            <button 
              onClick={() => navigate('/registerclub')}
              className="bg-white text-black font-semibold py-3 rounded-full hover:bg-gray-200 transition-colors"
            >
              Register Club
            </button>
            
            <button onClick={() => navigate('/club-signin')} className="bg-white text-black font-semibold py-3 rounded-full hover:bg-gray-200 transition-colors">
              Club Login
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ClubLoginPage;

