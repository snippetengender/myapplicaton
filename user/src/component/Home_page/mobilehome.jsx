import React, { useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import LocationOnIcon from '@mui/icons-material/LocationOn';

import HamburgerIcon from '../snippetIcon/menu.svg';
import LogoIcon from '../snippetIcon/Vector.svg';
import SearchIcon from '../snippetIcon/search-status.svg';
import BellIcon from '../snippetIcon/notification.svg';
// ----------------------------------------------------


const initialPosts = [
  // --- NEW IMAGE POST ---
  {
    tag: "confession",
    user: { profileType: "user", name: "karthikraja", id: "m@cit", avatar: "https://i.pinimg.com/736x/c0/74/9b/c0749b7cc401421662ae901ec8f9f660.jpg" },
    time: "6h",
    label: "confession",
    title: "I got a quote",
    imageUrl: "https://i.pinimg.com/736x/25/6d/d1/256dd183e023748f24f3cb6e044c1f96.jpg",
    stats: { nah: 14, hmm: 0, hellYeah: 78, thoughts: 29 },
  },
  {
    tag: "question",
    user: { profileType: "community", name: "something", avatar: "https://i.pinimg.com/736x/c0/74/9b/c0749b7cc401421662ae901ec8f9f660.jpg" },
    time: "1d",
    label: "question",
    content: "Karikada bai Irukarangla ?\n\nO  Over the past year, I’ve been diving into software development and product management. Most of my projects have been ambitious and complex.",
    stats: { nah: 14, hmm: 14, hellYeah: 78, thoughts: 49 },
  },
  // --- NEW DUMMY COMMUNITY POST ---
   {
    tag: "moments",
    user: { profileType: "community", name: "Tech Geeks", avatar: "https://i.pinimg.com/736x/c0/74/9b/c0749b7cc401421662ae901ec8f9f660.jpg" },
    time: "3h",
    label: "discussion",
    content: "Just released a new open-source library for state management in React. Would love to get some feedback from the community!",
    stats: { nah: 5, hmm: 25, hellYeah: 60, thoughts: 15 },
  },
  {
    tag: "question",
    user: { profileType: "user", name: "tj", id: "m@iimb", avatar: "https://i.pinimg.com/736x/c0/74/9b/c0749b7cc401421662ae901ec8f9f660.jpg" },
    time: "6h",
    label: "question",
    content: "What should I do when I get my girl friend pregnant? I am really confused, please help me people",
    stats: { nah: 14, hmm: 14, hellYeah: 78, thoughts: 49 },
  },
  // --- NEW DUMMY POLL ---
  {
    tag: "poll",
    user: { profileType: "community", name: "Movie Buffs", avatar: "https://i.pinimg.com/736x/c0/74/9b/c0749b7cc401421662ae901ec8f9f660.jpg" },
    time: "10m",
    label: "debate",
    title: "Greatest Sci-Fi Movie of All Time?",
    content: "Let's settle this once and for all. Which movie stands as the pinnacle of science fiction cinema?",
    options: [ { text: "Blade Runner", votes: 35 }, { text: "2001: A Space Odyssey", votes: 45 }, { text: "The Matrix", votes: 20 } ],
    stats: { nah: 2, hmm: 8, hellYeah: 90, thoughts: 33 },
  },
];

const yourHoodEvents = [
    {
        id: 1, day: "Today", date: "Friday", time: "5:00 PM", title: "Indo-UAW Startup Conect", organizer: "NSRCEL, IIM Bangalore", location: "Indian Institute of Management", details: "refreshments, networking, freewifi", imageUrl: "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/tech-event-motion-poster-design-template-93679873ffd20b2872af4da04c4cbe5e.jpg?ts=1567082214"
    },
    {
        id: 2, day: "Today", date: "Friday", time: "5:00 PM", title: "Indo-UAW Startup Conect", organizer: "FOSS, Coimbatore Institute of Tech...", location: "Coimbatore Institute of Tech...", details: "refreshments, networking, freewifi", imageUrl: "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/tech-event-motion-poster-design-template-93679873ffd20b2872af4da04c4cbe5e.jpg?ts=1567082214"
    },
    {
        id: 3, day: "Tomorrow", date: "Saturday", time: "5:00 PM", title: "Indo-UAW Startup Conect", organizer: "NSRCEL, IIM Bangalore", location: "Indian Institute of Management", details: "", imageUrl: null
    }
];

const otherHoodEvents = [
    {
        id: 4, day: "Today", date: "Friday", time: "7:00 PM", title: "Tech Innovators Meetup", organizer: "Google Developer Group", location: "KGISL, Coimbatore", details: "tech talks, snacks, Q&A", imageUrl: "https://i.pinimg.com/736x/a1/3c/79/a13c79873a02e-788e0b674823db94132.jpg"
    },
    {
        id: 3, day: "Tomorrow", date: "Saturday", time: "5:00 PM", title: "Indo-UAW Startup Conect", organizer: "NSRCEL, IIM Bangalore", location: "Indian Institute of Management", details: "", imageUrl: null
    },
    {
        id: 3, day: "Tomorrow", date: "Saturday", time: "5:00 PM", title: "Indo-UAW Startup Conect", organizer: "NSRCEL, IIM Bangalore", location: "Indian Institute of Management", details: "", imageUrl: null
    }
]

const EventCard = ({ event }) => (
    <div className="bg-[#161616] border border-[#2F3336] rounded-xl p-4 flex gap-4">
        <div className="flex-grow">
            <p className="text-xs text-gray-400 mb-1">{event.time}</p>
            <h3 className="text-[#E7E9EA] font-bold text-md mb-2">{event.title}</h3>
            <div className="flex items-center text-xs text-gray-400 mb-1">
                <span className="text-pink-500 mr-2 text-md leading-none">●</span>
                By {event.organizer}
            </div>
            <div className="flex items-center text-xs text-gray-400 mb-2">
                <LocationOnIcon sx={{ fontSize: 16 }} />
                <span className="ml-1">{event.location}</span>
            </div>
            {event.details && <p className="text-sm text-gray-500">and {event.details}</p>}
        </div>
        <div className="flex-shrink-0">
            {event.imageUrl ? (
                <img src={event.imageUrl} alt={event.title} className="w-24 h-40 object-cover rounded-lg" />
            ) : (
                <div className="w-24 h-full bg-[#3E2723] rounded-lg"></div>
            )}
        </div>
    </div>
);

const EventsView = () => {
    const [activeHood, setActiveHood] = useState('your hood');

    const groupEventsByDay = (events) => {
        return events.reduce((acc, event) => {
            const dayKey = `${event.day} ${event.date}`;
            if (!acc[dayKey]) acc[dayKey] = [];
            acc[dayKey].push(event);
            return acc;
        }, {});
    };

    const eventsToShow = activeHood === 'your hood' ? yourHoodEvents : otherHoodEvents;
    const groupedEvents = groupEventsByDay(eventsToShow);

    return (
        <>
            <div className="flex-grow overflow-y-auto px-4">
                <img 
                    src="https://img.freepik.com/free-vector/technology-banner-background-with-hexagonal-shapes-text-space_1017-22589.jpg" 
                    alt="Just Snippet" 
                    className="w-full rounded-lg mb-4"
                />
                
                {Object.entries(groupedEvents).map(([dayKey, events]) => (
                    <div key={dayKey} className="relative pl-6">
                         <div className="absolute left-1 top-2 h-full border-l-2 border-dashed border-gray-700"></div>
                         <div className="absolute left-[-2px] top-2 w-4 h-4 rounded-full bg-gray-700 border-4 border-black"></div>
                        <p className="font-semibold text-gray-300 mb-3">{dayKey.split(' ')[0]} <span className="text-gray-500">{dayKey.split(' ')[1]}</span></p>
                        <div className="space-y-3 mb-6">
                            {events.map((event, index) => (
                                <EventCard key={`${event.id}-${index}`} event={event} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="fixed bottom-0 left-0 right-0 flex justify-around items-center bg-black py-2 border-t border-gray-700 z-10">
                 <button
                    onClick={() => setActiveHood('your hood')}
                    className={`font-semibold py-2 w-1/2 text-center ${activeHood === 'your hood' ? 'text-[#E7E9EA] border-b-2 border-white' : 'text-gray-500'}`}
                >
                    your hood
                </button>
                <button
                    onClick={() => setActiveHood('other hoods')}
                    className={`font-semibold py-2 w-1/2 text-center relative ${activeHood === 'other hoods' ? 'text-[#E7E9EA] border-b-2 border-white' : 'text-gray-500'}`}
                >
                    other hoods
                    <span className="absolute top-2 right-[25%] block h-1.5 w-1.5 rounded-full bg-pink-500"></span>
                </button>
            </div>
        </>
    )
};

const PollComponent = ({ post }) => {
  const [selectedOption, setSelectedOption] = useState(1);

  return (
    <div className="mt-3 space-y-2">
      {post.title && <h3 className="text-[#E7E9EA] font-bold text-lg mb-1">{post.title}</h3>}
      <p className="text-[#E7E9EA] text-[14px] whitespace-pre-line mb-3">{post.content}</p>
      {post.options.map((option, index) => (
        <div
          key={index}
          onClick={() => setSelectedOption(index)}
          className={`border rounded-lg p-3 flex justify-between items-center cursor-pointer transition-all duration-200 ${
            selectedOption === index ? "border-pink-500" : "border-gray-700"
          }`}
        >
          <span className="font-semibold">{option.text}</span>
          <span className="text-gray-400">{option.votes}%</span>
        </div>
      ))}
    </div>
  );
};

const PostCard = ({ post }) => {
  const { user, time, label, content, stats, tag, title, imageUrl } = post;

  return (
    <div className="border-b border-gray-700 py-4">
      {/* Container for padded content (user info, title, text, stats) */}
      <div className="px-1">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
            <div className="text-sm">
              {user.profileType === "user" ? (
                <div className="flex items-center gap-1.5 text-md font-semibold">
                  {"<"}{user.name}{">"}
                  <span className="text-[#616161] font-normal">@{user.id} • {time}</span>
                  <span className="ml-1 text-xs px-2 py-0.5 rounded-full border border-gray-700">{label}</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-[#E7E9EA] font-semibold">
                  {user.name}
                  <span className="text-gray-400 font-normal">• {time}</span>
                  <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-gray-900 border border-gray-700">{label}</span>
                </div>
              )}
            </div>
          </div>
          <button className="text-gray-400">•••</button>
        </div>

        <div className="ml-0.5 pl-1 mt-1">
          {title && <h2 className="text-[#E7E9EA] text-lg font-semibold mb-2">{title}</h2>}
        </div>
      </div>

      {/* Full-width container for the image */}
      {imageUrl && (
        <div className="relative w-full aspect-square mt-2">
          <img src={imageUrl} alt={title || 'Post image'} className="w-full h-full object-cover" />
          
        </div>
      )}

      {/* Container for remaining padded and indented content */}
       <div className="px-4 ml-0.5 pl-1 mt-3">
        {tag === 'poll' ? (
          <PollComponent post={post} />
        ) : (
          content && <p className="text-[#E7E9EA] text-[14px] whitespace-pre-line">{content}</p>
        )}
        <div className="flex justify-between items-center mt-3 text-xs">
          <span className="text-pink-500 font-medium cursor-pointer">{stats.thoughts} thoughts</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 rounded-full border border-gray-700 text-gray-400">{stats.nah} nah</button>
            <button className="px-3 py-1 rounded-full border border-gray-700 text-gray-400">{stats.hmm} hmm</button>
            <button className="px-3 py-1 rounded-full border border-gray-700 text-pink-500">{stats.hellYeah} hell yeah</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const auth = getAuth();

  
  
  const [activeTab, setActiveTab] = useState('mixes');
  const [posts, setPosts] = useState(initialPosts);
  const [hasNotification, setHasNotification] = useState(true);
  const [showLogout, setShowLogout] = useState(false);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log("User signed out");
        navigate("/lobby", { replace: true });
      })
      .catch((error) => console.error("Error signing out:", error));
  };

  return (
    <div className="min-h-screen bg-black text-[#E7E9EA] p-0 flex flex-col">
      {/* Top Bar */}
    <nav className="fixed flex justify-between items-center w-full p-4 bg-black border-b border-gray-700 z-10">
      {/* Left Side: Menu and Logo */}
      <div className="flex items-center space-x-4">
        <div className="cursor-pointer">
          
          <img src={HamburgerIcon} alt="menu" className="w-6 h-6" />
        </div>
        <div className="cursor-pointer">
         
          <img src={LogoIcon} alt="menu" className="w-6 h-6" />
        </div>
      </div>

      {/* Right Side: Actions and Profile */}
      <div className="flex items-center space-x-6">
        <div className="cursor-pointer">
          
          <img src={SearchIcon} alt="menu" className="w-6 h-6" />
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <div className="cursor-pointer">
            
            <img src={BellIcon} alt="menu" className="w-6 h-6" />
          </div>
          {hasNotification && (
            <span
              className="absolute top-0 right-0 block h-2 w-2 rounded-full"
              style={{ backgroundColor: "#F06CB7" }}
            ></span>
          )}
        </div>

        {/* User Avatar & Logout Dropdown */}
        <div className="relative">
          <div
            className="cursor-pointer w-8 h-8 rounded-full bg-gray-300"
            onClick={() => setShowLogout(!showLogout)}
          >
            {/* Avatar image can be added here */}
          </div>
          {showLogout && (
            <button
              onClick={handleLogout}
              className="absolute right-0 mt-2 py-2 px-4 bg-gray-700 text-[#E7E9EA] rounded shadow-lg hover:bg-gray-600 focus:outline-none"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
      
      


      {/* Tabs */}
      <div className="flex justify-around border-b border-gray-700 mb-2 mt-16">
        <button
          onClick={() => setActiveTab('mixes')}
          className={`relative w-full py-2 font-semibold text-center ${
            activeTab === 'mixes' ? 'text-[#E7E9EA]' : 'text-gray-400'
          }`}
        >
          mixes
          {activeTab === 'mixes' && (
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[90px] h-[2px] bg-white rounded"></span>
          )}
        </button>


        <button
          onClick={() => setActiveTab('events')}
          className={`relative w-full py-2 font-semibold text-center ${
            activeTab === 'events' ? 'text-[#E7E9EA]' : 'text-gray-400'
          }`}
        >
          events
          {activeTab === 'events' && (
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[90px] h-[2px] bg-white rounded"></span>
          )}
        </button>
      </div>

      {/* Conditional Content */}
      <div className="flex-grow overflow-y-auto pb-20">
        {activeTab === 'mixes' ? (
          posts.map((post, idx) => <PostCard key={idx} post={post} />)
        ) : (
          <EventsView />
        )}
      </div>

      {activeTab === 'mixes' && (
        <div className="fixed bottom-0 left-0 right-0 px-2 py-1 z-10">
            <div className="backdrop-blur-md bg-black/50 border border-[#2F3336] rounded-3xl px-4 py-2 flex justify-between items-center">
            <span className="text-[#E7E9EA]">Open up now</span>
            <button className="bg-white/10 border border-[#2F3336] text-[#E7E9EA] px-4 py-1 rounded-xl hover:bg-white/20" onClick={() => navigate("/selecttag")}>
                mix
            </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default Home;

