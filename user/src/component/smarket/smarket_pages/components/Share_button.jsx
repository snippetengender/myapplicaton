import React from 'react';

const ConnectButton = ({ phoneNumber, productName }) => {
  const handleShareClick = () => {
    // Clean up the phone number (remove spaces if any)
    const cleanedPhoneNumber = phoneNumber.replace(/\s+/g, '');
    
    const message = `Hi, I am here to talk about your ${productName} selling in Snippet Marketplace. I want to know more about it.`;
    const encodedMessage = encodeURIComponent(message);
    
    // WhatsApp URL with cleaned phone number
    const whatsappUrl = `https://wa.me/${cleanedPhoneNumber}?text=${encodedMessage}`;
    
    window.location.href = whatsappUrl;  // Redirect to WhatsApp
  };

  return (
    <button
      onClick={handleShareClick}
      className="bg-white text-black text-2xl font-normal mt-2 px-2 rounded-md w-full"
    >
      Connect
    </button>
  );
};

export default ConnectButton;
