import React, { useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

// --- MUI Icon Imports ---
import SearchIcon from '@mui/icons-material/Search';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LocationOnIcon from '@mui/icons-material/LocationOn';
// ----------------------------------------------------


const initialPosts = [
  {
    tag: "confession",
    user: { profileType: "user", name: "karthikraja", id: "m@cit", avatar: "https://i.pinimg.com/736x/c0/74/9b/c0749b7cc401421662ae901ec8f9f660.jpg" },
    time: "6h",
    label: "confession",
    content: "While walking near my college canteen, I happened to see a beautiful girl. Her elegance and charm instantly caught my attention, making me pause for a moment.",
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
  {
    tag: "question",
    user: { profileType: "user", name: "tj", id: "m@iimb", avatar: "https://i.pinimg.com/736x/c0/74/9b/c0749b7cc401421662ae901ec8f9f660.jpg" },
    time: "6h",
    label: "question",
    content: "What should I do when I get my girl friend pregnant? I am really confused, please help me people",
    stats: { nah: 14, hmm: 14, hellYeah: 78, thoughts: 49 },
  },
  {
    tag: "poll",
    user: { profileType: "user", name: "tj", id: "m@iimb", avatar: "https://i.pinimg.com/736x/c0/74/9b/c0749b7cc401421662ae901ec8f9f660.jpg" },
    time: "1m",
    label: "jusssaying",
    content: "Which social media application is used by college students the most",
    options: [ { text: "instagram", votes: 4 }, { text: "snippet", votes: 93 }, { text: "facebook", votes: 3 } ],
    stats: { nah: 12, hmm: 5, hellYeah: 82, thoughts: 0 },
  },
  {
    tag: "poll",
    user: { profileType: "community", name: "IPL", avatar: "https://i.pinimg.com/736x/c0/74/9b/c0749b7cc401421662ae901ec8f9f660.jpg" },
    time: "1m",
    label: "question",
    title: "Who will win today",
    content: "The stadium floods with CSK's yellow army, their cheers drowning all others. Despite popular opinion, this match captivates everyone with its dramatic swings, skillful pla...",
    options: [ { text: "Mumbai Indians", votes: 4 }, { text: "Chennai Super Kings", votes: 96 } ],
    stats: { nah: 10, hmm: 2, hellYeah: 99, thoughts: 0 },
  },
];

const yourHoodEvents = [
    {
        id: 1,
        day: "Today",
        date: "Friday",
        time: "5:00 PM",
        title: "Indo-UAW Startup Conect",
        organizer: "NSRCEL, IIM Bangalore",
        location: "Indian Institute of Management",
        details: "refreshments, networking, freewifi",
        imageUrl: "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/tech-event-motion-poster-design-template-93679873ffd20b2872af4da04c4cbe5e.jpg?ts=1567082214"
    },
    {
        id: 2,
        day: "Today",
        date: "Friday",
        time: "5:00 PM",
        title: "Indo-UAW Startup Conect",
        organizer: "FOSS, Coimbatore Institute of Tech...",
        location: "Coimbatore Institute of Tech...",
        details: "refreshments, networking, freewifi",
        imageUrl: "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/tech-event-motion-poster-design-template-93679873ffd20b2872af4da04c4cbe5e.jpg?ts=1567082214"
    },
    {
        id: 3,
        day: "Tomorrow",
        date: "Saturday",
        time: "5:00 PM",
        title: "Indo-UAW Startup Conect",
        organizer: "NSRCEL, IIM Bangalore",
        location: "Indian Institute of Management",
        details: "",
        imageUrl: null
    }
];

const otherHoodEvents = [
    {
        id: 4,
        day: "Today",
        date: "Friday",
        time: "7:00 PM",
        title: "Tech Innovators Meetup",
        organizer: "Google Developer Group",
        location: "KGISL, Coimbatore",
        details: "tech talks, snacks, Q&A",
        imageUrl: "https://i.pinimg.com/736x/a1/3c/79/a13c79873a02e788e0b674823db94132.jpg"
    },
    {
        id: 3,
        day: "Tomorrow",
        date: "Saturday",
        time: "5:00 PM",
        title: "Indo-UAW Startup Conect",
        organizer: "NSRCEL, IIM Bangalore",
        location: "Indian Institute of Management",
        details: "",
        imageUrl: null
    },
    {
        id: 3,
        day: "Tomorrow",
        date: "Saturday",
        time: "5:00 PM",
        title: "Indo-UAW Startup Conect",
        organizer: "NSRCEL, IIM Bangalore",
        location: "Indian Institute of Management",
        details: "",
        imageUrl: null
    }
]

const EventCard = ({ event }) => (
    <div className="bg-[#161616] border border-[#2F3336] rounded-xl p-4 flex gap-4">
        <div className="flex-grow">
            <p className="text-xs text-gray-400 mb-1">{event.time}</p>
            <h3 className="text-white font-bold text-md mb-2">{event.title}</h3>
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
            if (!acc[dayKey]) {
                acc[dayKey] = [];
            }
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
                            {events.map(event => (
                                <EventCard key={event.id} event={event} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="fixed bottom-0 left-0 right-0 flex justify-around items-center bg-black py-2 border-t border-gray-700 z-10">
                 <button
                    onClick={() => setActiveHood('your hood')}
                    className={`font-semibold py-2 w-1/2 text-center ${activeHood === 'your hood' ? 'text-white border-b-2 border-white' : 'text-gray-500'}`}
                >
                    your hood
                </button>
                <button
                    onClick={() => setActiveHood('other hoods')}
                    className={`font-semibold py-2 w-1/2 text-center relative ${activeHood === 'other hoods' ? 'text-white border-b-2 border-white' : 'text-gray-500'}`}
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
      {post.title && <h3 className="text-white font-bold text-lg mb-1">{post.title}</h3>}
      <p className="text-white text-[14px] whitespace-pre-line mb-3">{post.content}</p>
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
  const { user, time, label, content, stats, tag } = post;

  return (
    <div className="border-b border-gray-800 p-4">
      <div className="flex justify-between">
        <div className="flex items-center gap-3">
          <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
          <div className="text-sm">
            {user.profileType === "user" ? (
              <div className="flex items-center gap-1 text-md font-semibold">
                {"<"}{user.name}{">"}{" "}
                <span className="text-[#616161] font-normal">@{user.id} • {time}</span>
                <span className="ml-2 text-xs px-2 py-0.5 rounded-full border border-gray-700">{label}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-white font-semibold">
                {user.name}{" "}
                <span className="text-gray-400 font-normal">• {time}</span>
                <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-gray-900 border border-gray-700">{label}</span>
              </div>
            )}
          </div>
        </div>
        <button className="text-gray-400">•••</button>
      </div>

      {tag === 'poll' ? <PollComponent post={post} /> : <p className="text-white text-[14px] mt-3 whitespace-pre-line">{content}</p>}

      <div className="flex justify-between items-center mt-3 text-xs">
        <span className="text-pink-500 font-medium cursor-pointer">{stats.thoughts} thoughts</span>
        <div className="flex gap-2">
          <button className="px-3 py-1 rounded-full border border-gray-700 text-gray-400">{stats.nah} nah</button>
          <button className="px-3 py-1 rounded-full border border-gray-700 text-gray-400">{stats.hmm} hmm</button>
          <button className="px-3 py-1 rounded-full border border-gray-700 text-pink-500">{stats.hellYeah} hell yeah</button>
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
    <div className="min-h-screen bg-black text-white p-0 flex flex-col">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-6 px-4 pt-4">
        <h1 className="text-2xl font-bold">the snippet</h1>
        <div className="flex items-center space-x-6">
          <div className="cursor-pointer"><SearchIcon /></div>
          <div className="relative">
            <div className="cursor-pointer"><SendOutlinedIcon /></div>
            {hasNotification && (
              <span className="absolute top-0 left-6 block h-2 w-2 rounded-full" style={{ backgroundColor: "#F06CB7" }}></span>
            )}
          </div>
          <div className="relative">
            <div className="cursor-pointer" onClick={() => setShowLogout(!showLogout)}>
              <PersonOutlineIcon />
            </div>
            {showLogout && (
              <button
                onClick={handleLogout}
                className="absolute right-0 mt-2 py-2 px-4 bg-gray-700 text-white rounded shadow-lg hover:bg-gray-600 focus:outline-none"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* --- DYNAMIC DESCRIPTION TEXT --- */}
      {activeTab === 'mixes' ? (
            <p className="text-gray-400 mb-2 cursor-pointer px-4 ">
                UK's history, finance, and influence stand strong. send stealth{" "}
                <span
                style={{ color: "#F06CB7" }}
                className="font-semibold"
                onClick={() => navigate("/myscreen")}
                >
                bouquet
                </span>{" "}
                and check yours
            </p>
       ) : (
            <p className="text-gray-400 mb-2 cursor-pointer px-4 ">
                Bring your club's ideas to life. Let the community know and{" "}
                <span
                style={{ color: "#F06CB7" }}
                className="font-semibold"
                onClick={() => navigate("/addclubs")}
                >
                create your event
                </span>.
            </p>
       )}


      {/* Tabs */}
      <div className="flex justify-around border-b border-gray-700 mb-2">
        <button
          onClick={() => setActiveTab('mixes')}
          className={`w-full py-2 font-semibold ${activeTab === 'mixes' ? 'text-white border-b-2 border-white' : 'text-gray-400'}`}
        >
          mixes
        </button>
        <button
          onClick={() => setActiveTab('events')}
          className={`w-full py-2 font-semibold ${activeTab === 'events' ? 'text-white border-b-2 border-white' : 'text-gray-400'}`}
        >
          events
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
            <span className="text-white">Open up now</span>
            <button className="bg-white/10 border border-[#2F3336] text-white px-4 py-1 rounded-xl hover:bg-white/20" onClick={() => navigate("/selecttag")}>
                mix
            </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default Home;