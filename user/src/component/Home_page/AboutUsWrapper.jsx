import React, { useState, useEffect } from 'react';
import Lottie from 'lottie-react';
import AboutUs from './AboutUs';
// Import your animation file - update the path to your actual file location
import startAnimation from '../assets/Startup animation.json';

const AboutUsWrapper = () => {
  const [showAnimation, setShowAnimation] = useState(true);

  useEffect(() => {
    // Set a timer to hide the animation after it completes
    const timer = setTimeout(() => {
      setShowAnimation(false);
    }, 3000); // Adjust this time based on your animation duration

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {showAnimation ? (
        <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
          <Lottie
            animationData={startAnimation}
            loop={false}
            autoplay={true}
            style={{ width: '80%', maxWidth: '300px' }}
            onComplete={() => setShowAnimation(false)} // Hide animation when complete
          />
        </div>
      ) : (
        <AboutUs />
      )}
    </>
  );
};

export default AboutUsWrapper;