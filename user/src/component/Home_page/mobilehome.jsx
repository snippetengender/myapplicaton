import React, { useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

// --- SVG Icon Components (replaces react-icons) ---
const FiSearch = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const FiSend = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
);

const FiUser = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);
// ----------------------------------------------------


const initialPosts = [
  {
    tag: "confession",
    user: {
      profileType: "user",
      name: "karthikraja",
      id: "m@cit",
      avatar: "https://i.pinimg.com/736x/c0/74/9b/c0749b7cc401421662ae901ec8f9f660.jpg",
    },
    time: "6h",
    label: "confession",
    content:
      "While walking near my college canteen, I happened to see a beautiful girl. Her elegance and charm instantly caught my attention, making me pause for a moment.",
    stats: { nah: 14, hmm: 0, hellYeah: 78, thoughts: 29 },
  },
  {
    tag: "question",
    user: {
      profileType: "community",
      name: "something",
      avatar: "https://i.pinimg.com/736x/c0/74/9b/c0749b7cc401421662ae901ec8f9f660.jpg",
    },
    time: "1d",
    label: "question",
    content:
      "Karikada bai Irukarangla ?\n\nO  Over the past year, I’ve been diving into software development and product management. Most of my projects have been ambitious and complex.",
    stats: { nah: 14, hmm: 14, hellYeah: 78, thoughts: 49 },
  },
  {
    tag: "question",
    user: {
      profileType: "user",
      name: "tj",
      id: "m@iimb",
      avatar: "https://i.pinimg.com/736x/c0/74/9b/c0749b7cc401421662ae901ec8f9f660.jpg",
    },
    time: "6h",
    label: "question",
    content:
      "What should I do when I get my girl friend pregnant? I am really confused, please help me people",
    stats: { nah: 14, hmm: 14, hellYeah: 78, thoughts: 49 },
  },
   // --- New Poll Posts ---
  {
    tag: "poll",
    user: {
      profileType: "user",
      name: "tj",
      id: "m@iimb",
      avatar: "https://i.pinimg.com/736x/c0/74/9b/c0749b7cc401421662ae901ec8f9f660.jpg",
    },
    time: "1m",
    label: "jusssaying",
    content: "Which social media application is used by college students the most",
    options: [
      { text: "instagram", votes: 4 },
      { text: "snippet", votes: 93 },
      { text: "facebook", votes: 3 },
    ],
    stats: { nah: 12, hmm: 5, hellYeah: 82, thoughts: 0 },
  },
  {
    tag: "poll",
    user: {
      profileType: "community",
      name: "IPL",
      avatar: "https://i.pinimg.com/736x/c0/74/9b/c0749b7cc401421662ae901ec8f9f660.jpg",
    },
    time: "1m",
    label: "question",
    title: "Who will win today",
    content: "The stadium floods with CSK's yellow army, their cheers drowning all others. Despite popular opinion, this match captivates everyone with its dramatic swings, skillful pla...",
    options: [
      { text: "Mumbai Indians", votes: 4 },
      { text: "Chennai Super Kings", votes: 96 },
    ],
    stats: { nah: 10, hmm: 2, hellYeah: 99, thoughts: 0 },
  },
];

const PollComponent = ({ post }) => {
  const [selectedOption, setSelectedOption] = useState(1); // Default to the second option as selected

  return (
    <div className="mt-3 space-y-2">
      {post.title && <h3 className="text-white font-bold text-lg mb-1">{post.title}</h3>}
      <p className="text-white text-[14px] whitespace-pre-line mb-3">{post.content}</p>
      {post.options.map((option, index) => (
        <div
          key={index}
          onClick={() => setSelectedOption(index)}
          className={`border rounded-lg p-3 flex justify-between items-center cursor-pointer transition-all duration-200 ${
            selectedOption === index
              ? "border-pink-500"
              : "border-gray-700"
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
          <img
            src={user.avatar}
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="text-sm">
            {user.profileType === "user" ? (
              <div className="flex items-center gap-1 text-md font-semibold">
                {"<"}
                {user.name}
                {">"}{" "}
                <span className="text-[#616161] font-normal">
                  @{user.id} • {time}
                </span>
                <span className="ml-2 text-xs px-2 py-0.5 rounded-full  border border-gray-700">
                  {label}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-white font-semibold">
                {user.name}{" "}
                <span className="text-gray-400 font-normal">• {time}</span>
                <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-gray-900 border border-gray-700">
                  {label}
                </span>
              </div>
            )}
          </div>
        </div>
        <button className="text-gray-400">•••</button>
      </div>

      {tag === 'poll' ? (
        <PollComponent post={post} />
      ) : (
        <p className="text-white text-[14px] mt-3 whitespace-pre-line">{content}</p>
      )}


      <div className="flex justify-between items-center mt-3 text-xs">
        <span className="text-pink-500 font-medium cursor-pointer">
          {stats.thoughts} thoughts
        </span>
        <div className="flex gap-2">
          <button className="px-3 py-1 rounded-full  border border-gray-700 text-gray-400">
            {stats.nah} nah
          </button>
          <button className="px-3 py-1 rounded-full  border border-gray-700 text-gray-400">
            {stats.hmm} hmm
          </button>
          <button className="px-3 py-1 rounded-full  border border-gray-700 text-pink-500">
            {stats.hellYeah} hell yeah
          </button>
        </div>
        {/* <div className="flex items-center border border-gray-700 rounded-full px-3 py-1 text-gray-400 text-xs">
          <span>{stats.nah} nah</span>
          <div className="border-l border-gray-600 h-4 mx-3"></div>
          <span>{stats.hmm} hmm</span>
          <div className="border-l border-gray-600 h-4 mx-3"></div>
          <span>{stats.hellYeah} hell yeah</span>
        </div> */}
      </div>
    </div>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const auth = getAuth();

  const [posts, setPosts] = useState(initialPosts);
  const [hasNotification, setHasNotification] = useState(true);
  const [showLogout, setShowLogout] = useState(false);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log("User signed out");
        navigate("/lobby", { replace: true });
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

  return (
    <div className="min-h-screen bg-black text-white p-0 flex flex-col">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-6 px-4 pt-4">
        <h1 className="text-2xl font-bold">the snippet</h1>
        <div className="flex items-center space-x-6">
          <div className="cursor-pointer"><FiSearch /></div>
          <div className="relative">
            <div className="cursor-pointer"><FiSend /></div>
            {hasNotification && (
              <span
                className="absolute top-0 left-6 block h-2 w-2 rounded-full"
                style={{ backgroundColor: "#F06CB7" }}
              ></span>
            )}
          </div>
          <div className="relative">
            <div
              className="cursor-pointer"
              onClick={() => setShowLogout(!showLogout)}
            >
              <FiUser />
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

      {/* Description */}
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

      {/* Tabs */}
      <div className="flex justify-between border-b border-gray-700 mb-2 px-10">
        <div className="px-4 py-2 text-white font-semibold border-b-2 border-white">
          mixes
        </div>
        <div className="px-4 py-2 text-gray-400">events</div>
      </div>

      {/* Feed UI */}
      <div className="flex-grow overflow-y-auto pb-20">
        {posts.map((post, idx) => (
          <PostCard key={idx} post={post} />
        ))}
      </div>

      {/* Open up now bar */}
      <div className="fixed bottom-0 left-0 right-0 px-2 py-1 z-10">
        <div className="backdrop-blur-md bg-black/50 border border-[#2F3336] rounded-3xl px-4 py-2 flex justify-between items-center">
          <span className="text-white">Open up now</span>
          <button className="bg-white/10 border border-[#2F3336] text-white px-4 py-1 rounded-xl hover:bg-white/20" onClick={() => navigate("/selecttag")}>
            mix
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
