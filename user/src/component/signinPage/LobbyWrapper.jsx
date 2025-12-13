import React, { useState, useRef } from 'react';
import Lottie from 'lottie-react';
import Lobby from './Lobby';
// Import your animation file - update the path to your actual file location
import startAnimation from '../assets/Startup animation.json';

const LobbyWrapper = () => {
  const [animationComplete, setAnimationComplete] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const lottieRef = useRef(null);

  const handleAnimationComplete = () => {
    setFadeOut(true);
    setTimeout(() => {
      setAnimationComplete(true);
    }, 500); // Time for fade out animation
  };

  return (
    <>
      {!animationComplete ? (
        <div 
          className={`fixed inset-0 bg-black flex items-center justify-center z-50 transition-opacity duration-500 ${
            fadeOut ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <Lottie
            lottieRef={lottieRef}
            animationData={startAnimation}
            loop={false}
            autoplay={true}
            style={{ width: '80%', maxWidth: '300px' }}
            onComplete={handleAnimationComplete}
          />
        </div>
      ) : (
        <Lobby />
      )}
    </>
  );
};

export default LobbyWrapper;