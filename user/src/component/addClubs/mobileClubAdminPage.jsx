import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// --- MUI Icon Imports ---
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
// ----------------------------------------------------

// Mock Data for the page
const clubData = {
  name: 'EBSB_CIT',
  avatar: 'https://logomaster.ai/hs-fs/hubfs/black-logo-montblanc.jpg?width=1700&height=1148&name=black-logo-montblanc.jpg',
  bannerUrl: 'https://img.freepik.com/free-vector/technology-banner-background-with-hexagonal-shapes-text-space_1017-22589.jpg',
  members: 218,
  events: 382,
  description: 'r/beermoneyindia is community for people to discuss mostly online making-making opportunities in India. You could make dece...',
  admins: [
    { name: '<karthikraja>', id: 'm@cit' },
    { name: '<sreeleela>', id: 'm@cit' },
  ]
};

const clubEvents = [
  {
    id: 1,
    day: 'Tomorrow',
    date: 'Saturday',
    time: '5:00 PM',
    title: 'Indo-UAW Startup Conect',
    organizer: 'NSRCEL, IIM Bangalore',
    location: 'Indian Institute of Management',
    imageUrl: null, // This will render the brown placeholder
  }
];

// Reusable component for the event card
const EventCard = ({ event }) => (
    <div className="bg-[#161616] border border-[#2F3336] rounded-xl p-4 flex gap-4 relative">
        <div className="flex-grow">
            <p className="text-xs text-gray-400 mb-1">{event.time}</p>
            <h3 className="text-[#E7E9EA] font-bold text-md mb-2">{event.title}</h3>
            <div className="flex items-center text-xs text-gray-400 mb-1">
                <span className="text-pink-500 mr-2 text-md leading-none">●</span>
                By {event.organizer}
            </div>
            <div className="flex items-center text-xs text-gray-400">
                <LocationOnIcon sx={{ fontSize: 16 }} />
                <span className="ml-1">{event.location}</span>
            </div>
        </div>
        <div className="flex-shrink-0 w-24 h-full bg-[#3E2723] rounded-lg"></div>
        <button className="absolute top-2 right-2 text-[#E7E9EA] text-xs font-semibold flex items-center">
            edit event <ChevronRightIcon sx={{ fontSize: 16 }} />
        </button>
    </div>
);


const ClubAdminPage = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const headerStyle = {
    backgroundImage: `url('${clubData.bannerUrl}')`
  };

  return (
    <div className="min-h-screen bg-black text-[#E7E9EA] p-0">
      <header 
        className="relative h-40 bg-cover bg-center rounded-b-2xl p-4 flex items-start"
        style={headerStyle}
      >
        <div className="absolute inset-0 bg-black/60 rounded-b-2xl"></div>
        <div className="relative z-10 w-full flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate(-1)} className="bg-white/10 backdrop-blur-sm h-10 w-10 rounded-full flex items-center justify-center">
                <ArrowBackIcon />
              </button>
              <div className="text-sm">
                <p className="font-semibold">edit club</p>
                <p className="text-gray-300">settings</p>
              </div>
            </div>
            <div className="relative">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="bg-white/10 backdrop-blur-sm h-10 w-10 rounded-full flex items-center justify-center"
              >
                <MoreVertIcon />
              </button>
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#1C1C1E] border border-gray-700 rounded-md shadow-lg py-1 z-20">
                  <a href="#" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700/50">edit club</a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700/50">settings</a>
                </div>
              )}
            </div>
        </div>
      </header>

      <main className="p-4">
        {/* Club Info Section */}
        <section className="mb-6 -mt-16 relative z-10">
          <div className="flex items-end gap-3 mb-3">
            <img src={clubData.avatar} alt="Club Logo" className="w-16 h-16 rounded-full border-4 border-black" />
            <div>
              <h1 className="text-xl font-bold">{clubData.name}</h1>
              <p className="text-sm text-gray-400">{clubData.members} members • {clubData.events} events</p>
            </div>
          </div>
          <p className="text-sm text-gray-300 mb-4">{clubData.description}</p>
          <div>
            <p className="text-xs text-gray-500 mb-2">headed by</p>
            <div className="space-y-2">
              {clubData.admins.map(admin => (
                <div key={admin.name} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-gray-700 rounded-full"></div>
                  <p className="text-sm font-semibold">{admin.name} <span className="text-gray-500 font-normal">{admin.id}</span></p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Add Event Banner */}
        <button onClick={() => navigate('/add-event')} className="w-full text-left border-y border-gray-800 py-4 flex justify-between items-center mb-6">
          <div>
            <h2 className="font-bold text-[#E7E9EA]">Add your Event</h2>
            <p className="text-sm text-gray-400">Showcase your Event to thousands for Free</p>
          </div>
          <ChevronRightIcon />
        </button>

        {/* Events List Section */}
        <section>
          {clubEvents.map(event => (
            <div key={event.id} className="relative pl-6">
              <div className="absolute left-1 top-2 h-full border-l-2 border-dashed border-gray-700"></div>
              <div className="absolute left-[-2px] top-2 w-4 h-4 rounded-full bg-gray-700 border-4 border-black"></div>
              <p className="font-semibold text-gray-300 mb-3">{event.day} <span className="text-gray-500">{event.date}</span></p>
              <div className="space-y-3 mb-6">
                <EventCard event={event} />
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};

export default ClubAdminPage;

