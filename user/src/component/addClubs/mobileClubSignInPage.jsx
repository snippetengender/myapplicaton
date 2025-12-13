import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// --- MUI Icon Imports ---
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
// ----------------------------------------------------

// Custom styled input component
const FormInput = ({ placeholder, type = 'text', value, onChange }) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-[#E7E9EA] placeholder-gray-500 focus:outline-none focus:border-pink-500"
  />
);

const ClubSignInPage = () => {
  const navigate = useNavigate();

  // State for form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Handle form submission
  const handleLogin = (event) => {
    event.preventDefault();
    // Navigate to the club admin page on successful login
    navigate('/club-admin');
  };

  return (
    <div className="min-h-screen bg-black text-[#E7E9EA] p-0 flex flex-col">
      {/* Top Bar with back navigation */}
      <header className="px-4 pt-4 mb-8">
        <button onClick={() => navigate(-1)} className="text-[#E7E9EA]">
          <ArrowBackIcon />
        </button>
      </header>

      <main className="flex-grow px-4">
        <h1 className="text-3xl font-bold text-[#E7E9EA] leading-tight">Heyy, welcome back</h1>
        <h1 className="text-3xl font-bold text-[#E7E9EA] mb-2">AGAIN bro</h1>
        
        <p className="text-gray-400 mb-8">
          Lorem ipsum dolor sit amet consectetur. Sit porta blandit montes cursus. Tempus accumsan mauris in cras sit. Learn more
        </p>

        <form onSubmit={handleLogin} className="space-y-5">
          <FormInput placeholder="email Id here" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <FormInput placeholder="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </form>
      </main>

      {/* Fixed bottom navigation button */}
      <div className="px-4 pb-8">
        <button 
          onClick={handleLogin}
          className="float-right bg-gray-800 text-[#E7E9EA] rounded-full h-14 w-14 flex items-center justify-center hover:bg-gray-700 transition-colors"
        >
          <ArrowForwardIosIcon />
        </button>
      </div>
    </div>
  );
};

export default ClubSignInPage;
