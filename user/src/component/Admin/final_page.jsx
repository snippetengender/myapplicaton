import React from 'react';

// A simple X icon component for the close button
const CloseIcon = () => (
  <svg 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className="text-[#E7E9EA]"
  >
    <path 
      d="M18 6L6 18" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M6 6L18 18" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);


// Main component for the "Work in Progress" screen
const WorkInProgressPage = () => {
  return (
    <div className="fixed inset-0 bg-black text-[#E7E9EA] flex flex-col items-center justify-center font-sans z-50">
      {/* Close button positioned at the top-left corner */}
      <button className="absolute top-4 left-4 p-2 rounded-full hover:bg-gray-800">
        <CloseIcon />
      </button>

      <div className="text-center">
      
        <p className="text-lg text-gray-300">
          Our Developers are working on it
        </p>
      </div>
    </div>
  );
};

export default WorkInProgressPage;
