import React, { useState, useRef, useEffect, useCallback } from "react";
import { getAuth, signOut } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import HamburgerIcon from "../snippetIcon/menu.svg";
import LogoIcon from "../snippetIcon/Vector.svg";
import SearchIcon from "../snippetIcon/search-status.svg";
import BellIcon from "../snippetIcon/notification.svg";
import { FiSearch, FiSend, FiUser } from "react-icons/fi";
import PostCardSkeleton from "./postSkeleton";
import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "../../features/userSlice/userSlice";
import { fetchMixes, reactMix } from "../../features/mixes/mixSlice";
import upvoteInactive from "../assets/Upvote.svg";
import downvoteInactive from "../assets/Downvote.svg";
import upvoteActive from '../assets/upvoteActive.svg'
import downvoteActive from '../assets/downvoteActive.svg' 
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

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
    imageUrl:
      "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/tech-event-motion-poster-design-template-93679873ffd20b2872af4da04c4cbe5e.jpg?ts=1567082214",
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
    imageUrl:
      "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/tech-event-motion-poster-design-template-93679873ffd20b2872af4da04c4cbe5e.jpg?ts=1567082214",
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
    imageUrl: null,
  },
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
    imageUrl:
      "https://i.pinimg.com/736x/a1/3c/79/a13c79873a02e-788e0b674823db94132.jpg",
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
    imageUrl: null,
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
    imageUrl: null,
  },
];

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
      {event.details && (
        <p className="text-sm text-gray-500">and {event.details}</p>
      )}
    </div>
    <div className="flex-shrink-0">
      {event.imageUrl ? (
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-24 h-40 object-cover rounded-lg"
        />
      ) : (
        <div className="w-24 h-full bg-[#3E2723] rounded-lg"></div>
      )}
    </div>
  </div>
);

const EventsView = () => {
  const [activeHood, setActiveHood] = useState("your hood");

  const groupEventsByDay = (events) => {
    return events.reduce((acc, event) => {
      const dayKey = `${event.day} ${event.date}`;
      if (!acc[dayKey]) acc[dayKey] = [];
      acc[dayKey].push(event);
      return acc;
    }, {});
  };

  const eventsToShow =
    activeHood === "your hood" ? yourHoodEvents : otherHoodEvents;
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
            <p className="font-semibold text-gray-300 mb-3">
              {dayKey.split(" ")[0]}{" "}
              <span className="text-gray-500">{dayKey.split(" ")[1]}</span>
            </p>
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
          onClick={() => setActiveHood("your hood")}
          className={`font-semibold py-2 w-1/2 text-center ${
            activeHood === "your hood"
              ? "text-[#E7E9EA] border-b-2 border-white"
              : "text-gray-500"
          }`}
        >
          your hood
        </button>
        <button
          onClick={() => setActiveHood("other hoods")}
          className={`font-semibold py-2 w-1/2 text-center relative ${
            activeHood === "other hoods"
              ? "text-[#E7E9EA] border-b-2 border-white"
              : "text-gray-500"
          }`}
        >
          other hoods
          <span className="absolute top-2 right-[25%] block h-1.5 w-1.5 rounded-full bg-pink-500"></span>
        </button>
      </div>
    </>
  );
};

export const PollComponent = ({ post, profileType }) => {
  const [selectedOption, setSelectedOption] = useState(null); // no default

  return (
    <div className="mt-3 space-y-2">
      {/* For network: show title + description above options */}
      {profileType === "network" && (
        <>
          {post.title && (
            <h3 className="text-[#E7E9EA] font-bold text-lg mb-1">
              {post.title}
            </h3>
          )}
          {post.content && (
            <p className="text-[#E7E9EA] text-[14px] whitespace-pre-line mb-3">
              {post.content}
            </p>
          )}
        </>
      )}

      {/* For user: only description above options */}
      {profileType === "user" && post.content && (
        <p className="text-[#E7E9EA] text-[14px] whitespace-pre-line mb-3">
          {post.content}
        </p>
      )}

      {/* Options */}
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

export const PostCard = ({ post, profileType: propProfileType }) => {
  const dispatch = useDispatch();
  const user = post.user || {};
  const profileType = propProfileType || user.profileType || "user";
  const { time, label, content, stats = {}, tag, title, imageUrl } = post;

  const navigate = useNavigate();

 const handleReaction = (reactionType) => {
    const newReaction = post.userReaction === reactionType ? "neutral" : reactionType;
    dispatch(reactMix({ mixId: post.id, reaction: newReaction }));
  };


  const netScore = (stats.upvote) - (stats.downvote);


  return (
    <div className="border-b border-gray-700 py-4">
      {/* Header */}
      <div className="px-1">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name || "User"}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white">
                {user.username?.[0]?.toUpperCase() || "?"}
              </div>
            )}

            <div className="text-sm">
              {profileType === "user" ? (
                <div
                  className="flex items-center gap-1.5 text-md font-semibold"
                  onClick={() =>
                    navigate(`/useronboarding/user-profile/${user.id}`)
                  }
                >
                  {"<"}
                  {user.username}
                  {">"}
                  <span className="text-[#616161] font-normal">
                    {user.degree ? (user.degree === "masters" ? "m" : "b") : ""}
                    {user.college} • {time}
                  </span>
                  <span className="ml-1 text-xs px-2 py-0.5 rounded-full border border-gray-700">
                    {label}
                  </span>
                </div>
              ) : (
                <div
                  className="flex items-center gap-1.5 text-[#E7E9EA] font-semibold"
                  onClick={() => navigate(`/communitypage/${user.id}`)}
                >
                  {user.name}
                  <span className="text-gray-400 font-normal">• {time}</span>
                  <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-gray-900 border border-gray-700">
                    {label}
                  </span>
                </div>
              )}
            </div>
          </div>
          <button className="text-gray-400">•••</button>
        </div>
      </div>

      {/* Post content */}
      <div className="px-4 ml-0.5 pl-1 mt-3">
        {tag !== "poll" ? (
          <>
            {/* For image posts */}
            {imageUrl ? (
              <>
                {profileType === "network" && title && (
                  <h2 className="text-[#E7E9EA] text-lg font-semibold mb-2">
                    {title}
                  </h2>
                )}
                {profileType === "user" && content && (
                  <p className="text-[#E7E9EA] text-[14px] whitespace-pre-line mb-2">
                    {content}
                  </p>
                )}
                <div className="relative w-full aspect-square mt-2">
                  <img
                    src={imageUrl}
                    alt={title || "Post image"}
                    className="w-full h-full object-cover"
                  />
                </div>
              </>
            ) : (
              <>
                {profileType === "network" && title && (
                  <h2 className="text-[#E7E9EA] text-lg font-semibold mb-2">
                    {title}
                  </h2>
                )}

                {(profileType === "user" || profileType === "network") &&
                  content && (
                    <p className="text-[#E7E9EA] text-[14px] whitespace-pre-line mb-2">
                      {content}
                    </p>
                  )}
              </>
            )}
          </>
        ) : (
          <PollComponent post={post} profileType={profileType} />
        )}

        {/* Reactions */}
        <div className="flex justify-between items-center mt-3 text-xs">
          <span
            className="text-pink-500 font-medium cursor-pointer"
            onClick={() => navigate(`/comments/${post.id}`)}
          >
            {stats.thoughts} thoughts
          </span>
          <div className="flex gap-2">
            {/* <button className="px-3 py-1 rounded-full border border-gray-700 text-gray-400">
              {stats.nah} nah
            </button>
            <button className="px-3 py-1 rounded-full border border-gray-700 text-gray-400">
              {stats.hmm} hmm
            </button>
            <button className="px-3 py-1 rounded-full border border-gray-700 text-pink-500">
              {stats.hellYeah} hell yeah
            </button> */}

            <div className="flex items-center gap-3">
              <img
                  src={post.userReaction === 'like' ? upvoteActive  : upvoteInactive}
                  alt="upvote reaction"
                  onClick={() => handleReaction("like")}
                  className="w-6 h-6 cursor-pointer"
                />

                <p className="text-gray-400 text-xl font-semibold w-6 text-center">
                  {netScore}
                </p>

                {/* 5. Downvote image with conditional source */}
                <img
                  src={post.userReaction === 'dislike' ? downvoteActive : downvoteInactive}
                  alt="downvote reaction"
                  onClick={() => handleReaction("dislike")}
                  className="w-6 h-6 cursor-pointer"
                />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = getAuth();
  const { posts, status, hasMore, page, fetchError } = useSelector(
    (state) => state.mixes
  );
  const userId = useSelector((state) => state.user.userId);

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  const [activeTab, setActiveTab] = useState("mixes");
  const [hasNotification, setHasNotification] = useState(true);

  useEffect(() => {
    if (status === "idle" && posts.length === 0) {
      dispatch(fetchMixes(1));
    }
  }, [status, posts.length, dispatch]);

  const observer = useRef();
  const loadMoreRef = useCallback(
    (node) => {
      if (status === "loading") return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          dispatch(fetchMixes(page));
        }
      });

      if (node) observer.current.observe(node);
    },
    [status, hasMore, page, dispatch]
  );

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        dispatch(clearUser());
        console.log("User signed out");
        navigate("/lobby", { replace: true });
      })
      .catch((error) => console.error("Error signing out:", error));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setIsProfileMenuOpen(false);
      }
    };

    if (isProfileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileMenuOpen]);

  const isLoading = status === "loading";
  const isInitialLoad = isLoading && posts.length === 0;
  return (
    <div className="min-h-screen bg-black text-[#E7E9EA] flex flex-col pt-20">
      {" "}
      <nav className="fixed top-0 left-0 right-0 flex justify-between items-center w-full p-4 bg-black border-b border-gray-700 z-20">
        {/* Left Side: Menu and Logo */}
        <div className="flex items-center space-x-4">
          <div className="cursor-pointer">
            <img src={HamburgerIcon} alt="menu" className="w-6 h-6" />
          </div>
          <div className="cursor-pointer">
            <img src={LogoIcon} alt="logo" className="w-6 h-6" />
          </div>
        </div>

        {/* Right Side: Actions and Profile */}
        <div className="flex items-center space-x-6">
          <div className="cursor-pointer">
            <img src={SearchIcon} alt="search" className="w-6 h-6" />
          </div>
          <div className="relative cursor-pointer">
            <img src={BellIcon} alt="notifications" className="w-6 h-6" />
            {hasNotification && (
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-[#F06CB7]"></span>
            )}
          </div>

          {/* FIX: The correct profile menu is now integrated here */}
          <div ref={profileMenuRef} className="relative">
            <FiUser
              className="h-6 w-6 cursor-pointer"
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            />
            {isProfileMenuOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-neutral-800 border border-neutral-700 rounded-md shadow-lg z-20">
                <ul className="py-1 text-white">
                  <li>
                    <button
                      onClick={() => {
                        if (userId)
                          navigate(`/useronboarding/user-profile/${userId}`);
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-neutral-700"
                    >
                      Profile
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-neutral-700"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </nav>
      {/* Tabs */}
      <div className="flex justify-around border-b border-gray-700 mb-2">
        <button
          onClick={() => setActiveTab("mixes")}
          className={`relative w-full py-2 font-semibold text-center ${
            activeTab === "mixes" ? "text-[#E7E9EA]" : "text-gray-400"
          }`}
        >
          mixes
          {activeTab === "mixes" && (
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-white rounded"></span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("events")}
          className={`relative w-full py-2 font-semibold text-center ${
            activeTab === "events" ? "text-[#E7E9EA]" : "text-gray-400"
          }`}
        >
          events
          {activeTab === "events" && (
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-white rounded"></span>
          )}
        </button>
      </div>
      {/* FIX: A single, non-duplicated content area */}
      <div className="flex-grow overflow-y-auto px-4 pb-20">
        {activeTab === "mixes" ? (
          <>
            {/* Skeletons for the very first load */}
            {isInitialLoad &&
              Array.from({ length: 5 }).map((_, i) => (
                <PostCardSkeleton key={i} />
              ))}

            {/* Render the list of posts from Redux state */}
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}

            {/* Sentinel element to trigger loading more */}
            <div ref={loadMoreRef} />

            {/* Loading indicator for subsequent pages */}
            {isLoading && !isInitialLoad && <PostCardSkeleton />}

            {fetchError && (
              <p className="text-center text-red-500 p-4">{fetchError}</p>
            )}

            {!hasMore && posts.length > 0 && (
              <p className="text-center text-gray-500 py-4">
                You've reached the end!
              </p>
            )}
          </>
        ) : (
          <EventsView />
        )}
      </div>
      {/* FIX: A single "Open up now" bar that only shows on the "mixes" tab */}
      {activeTab === "mixes" && (
        <div className="fixed bottom-0 left-0 right-0 px-2 py-1 z-10">
          <div className="backdrop-blur-md bg-black/50 border border-[#2F3336] rounded-3xl px-4 py-2 flex justify-between items-center">
            <span className="text-[#E7E9EA]">Open up now</span>
            <button
              className="bg-white/10 border border-[#2F3336] text-[#E7E9EA] px-4 py-1 rounded-xl hover:bg-white/20"
              //style={{ color: 'cyan', fontSize: '18px' }}
              onClick={() => navigate(`/selecttag/${userId}`)}
              //to="/selecttag"
            >
              mix
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
