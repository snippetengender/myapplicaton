import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// --- MUI Icon Imports ---
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// ----------------------------------------------------

// Custom styled input component
const FormInput = ({ placeholder, value, onChange }) => (
  <input
    type="text"
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-[#E7E9EA] placeholder-gray-500 focus:outline-none focus:border-pink-500"
  />
);

const RegisterClubPage = () => {
  const navigate = useNavigate();

  // State for all form fields
  const [clubName, setClubName] = useState('');
  const [clubEmail, setClubEmail] = useState('');
  const [clubPhone, setClubPhone] = useState('');
  const [clubInstagram, setClubInstagram] = useState('');
  const [college, setCollege] = useState('');

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission
    const clubData = { clubName, clubEmail, clubPhone, clubInstagram, college };

    // Navigate to the club login page after submission
    navigate('/addclubs');
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
        <h1 className="text-xl font-bold text-[#E7E9EA] mb-2">Add Club/Sympo Request Form</h1>
        <p className="text-gray-400 text-sm mb-8">
          Pulvinar risus donec aenean tristique risus eu vitae felis. Donec lacus accumsan ultricies metus.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5 text-sm">
          <FormInput placeholder="Club Name" value={clubName} onChange={(e) => setClubName(e.target.value)} />
          <FormInput placeholder="Club Email ID" value={clubEmail} onChange={(e) => setClubEmail(e.target.value)} />
          <FormInput placeholder="Club Phone Number" value={clubPhone} onChange={(e) => setClubPhone(e.target.value)} />
          <FormInput placeholder="Club Instagram ID" value={clubInstagram} onChange={(e) => setClubInstagram(e.target.value)} />

          {/* College Dropdown */}
          <div className="relative">
            <select
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-[#E7E9EA] text-sm appearance-none focus:outline-none focus:border-pink-500"
            >
              <option value="" disabled>College</option>
              <option value="CIT">Coimbatore Institute of Technology</option>
              <option value="PSG">PSG College of Technology</option>
              <option value="KCT">Kumaraguru College of Technology</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M5.516 7.548c.436-.446 1.144-.446 1.58 0L10 10.42l2.904-2.872c.436-.446 1.144-.446 1.58 0 .436.446.436 1.17 0 1.615l-3.694 3.66a1.12 1.12 0 0 1-1.58 0L5.516 9.163c-.436-.446-.436-1.17 0-1.615z" />
              </svg>
            </div>
          </div>
          
          <button type="submit" className="w-full bg-black border border-gray-700 text-[#E7E9EA] font-semibold py-3 rounded-lg hover:bg-gray-800 transition-colors mt-4">
            Add Club
          </button>
        </form>
      </main>
    </div>
  );
};

export default RegisterClubPage;
