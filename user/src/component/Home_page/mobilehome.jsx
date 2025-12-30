import React, { useState, useRef, useEffect, useCallback } from "react";
import { getAuth, signOut } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import HamburgerIcon from "../snippetIcon/menu.svg";
import LogoIcon from "../snippetIcon/Vector.svg";
import SearchIcon from "../snippetIcon/search-status.svg";
import BellIcon from "../snippetIcon/notification.svg";
import { FiSearch, FiSend, FiUser } from "react-icons/fi";
import Sidebar from "./Sidebar";
import PostCardSkeleton from "./postSkeleton";
import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "../../features/userSlice/userSlice";
import {
  fetchMixes,
  reactMix,
  voteInPoll,
} from "../../features/mixes/mixSlice";
import upvoteInactive from "../assets/Upvote.svg";
import downvoteInactive from "../assets/Downvote.svg";
import upvoteActive from "../assets/upvoteActive.svg";
import downvoteActive from "../assets/downvoteActive.svg";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { PostCard } from "../mix/PostCard";
import reportFlag from "../assets/flag.svg";
import locationTag from "../assets/location.svg";

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
  <div className="border border-brand-charcoal rounded-xl p-[10px] flex-col gap-4">
    <div className="flex">
      <div className="flex-grow min-w-0 max-w-[200px] mr-2">
        <p className="text-[10px] font-medium text-brand-dark-gray mb-1">{event.time}</p>
        <h3 className="text-brand-off-white font-semibold text-[15px] mb-2 truncate">{event.title}</h3>
        <div className="flex items-center text-xs text-brand-dark-gray mb-1">
          <span className="text-pink-500 w-3 h-3 bg-white rounded-full text-md leading-none mr-[6px]"></span>
          <span className="flex-1 truncate">By {event.organizer}</span>
        </div>
        <div className="flex items-center text-xs text-brand-dark-gray mb-2 min-w-0">
          <img src={locationTag} alt="Location svg" className="h-3 w-[10px] shrink-0" />
          <span className="ml-1 flex-1 truncate">{event.location}</span>
        </div>
      </div>
      <div className="flex-shrink-0 h-[80px]">
        {event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-[78px] h-[78px] object-cover rounded-lg"
          />
        ) : (
          <div className="w-[78px] h-[78px] bg-[#3E2723] rounded-lg"></div>
        )}
      </div>
    </div>
    {event.details && (
      <div className="text-[12px] flex min-w-0">
        <span className="text-brand-medium-gray shrink-0">and</span>
        <span className="text-brand-off-white ml-1 flex-1 truncate">{event.details}</span>
      </div>
    )}
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
      {activeHood === "snippet maps" ? (
        <SnippetMaps />
      ) : (
        <>
          {/* Future update line */}
          <div className="bg-brand-pink w-full h-7 overflow-hidden flex items-center">
            <div className="snips-marquee-track text-[12px]">
              <span className="snips-marquee-item">We are working on these feature. Join Waitlist!</span>
              <span className="snips-marquee-item" aria-hidden="true">We are working on these feature. Join Waitlist!</span>
            </div>
          </div>
          <div className="flex-grow overflow-y-auto px-4">
            <div className="flex items-center justify-center pt-[19px] pb-[21px]"> 
              <img
                src="https://img.freepik.com/free-vector/technology-banner-background-with-hexagonal-shapes-text-space_1017-22589.jpg"
                alt="Just Snippet"
                className="w-[327px] h-[76px] rounded-lg"
              />
            </div>

            {Object.entries(groupedEvents).map(([dayKey, events], idx) => (
              <div key={dayKey} className="relative pl-6">
                {idx < Object.entries(groupedEvents).length -1 && (
                  <div className="absolute left-[5px] top-2 h-full border-l-2 border-dashed border-brand-almost-black"></div>
                )}
                <div className="absolute left-[-2px] top-1 w-4 h-4 rounded-full bg-brand-off-white border-4 border-black"></div>
                <p className="font-semibold text-gray-300 mb-3">
                  {dayKey.split(" ")[0]}{" "}
                  <span className="text-gray-500">{dayKey.split(" ")[1]}</span>
                </p>
                <div className="space-y-3 mb-3">
                  {events.map((event, index) => (
                    <EventCard key={`${event.id}-${index}`} event={event} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="fixed bottom-0 left-0 right-0 flex justify-around items-center bg-black border-t border-brand-charcoal z-10">
        <button
          onClick={() => setActiveHood("your hood")}
          className={`font-semibold py-2 w-1/2 text-[14px] text-center ${
            activeHood === "your hood"
              ? "text-brand-off-white border-t-2 border-white"
              : "text-brand-medium-gray"
          }`}
        >
          your hood
        </button>
        <button
          onClick={() => setActiveHood("other hoods")}
          className={`font-semibold py-2 w-1/2 text-[14px] text-center relative ${
            activeHood === "other hoods"
              ? "text-brand-off-white border-t-2 border-white"
              : "text-brand-medium-gray"
          }`}
        >
          other hoods
          {/* <span className="absolute top-2 right-[25%] block h-1.5 w-1.5 rounded-full bg-pink-500"></span> */}
        </button>
        <button
          onClick={() => setActiveHood("snippet maps")}
          className={`font-semibold py-2 w-1/2 text-[14px] text-center relative ${
            activeHood === "snippet maps"
              ? "text-brand-off-white border-t-2 border-white"
              : "text-brand-medium-gray"
          }`}
        >
          snippet maps
          {/* <span className="absolute top-2 right-[25%] block h-1.5 w-1.5 rounded-full bg-pink-500"></span> */}
        </button>
      </div>
    </>
  );
};


const SnippetMaps = () => {
  const [selectedCard, setSelectedCard] = useState(null);
  const handleSelect = (id) => setSelectedCard((prev) => (prev === id ? null : id));

  return (
    <div className="flex flex-col">
      {/* City header */}
      <div className="h-9 items-center ml-5 flex">
        <h2 className="text-brand-off-white font-semibold text-[14px]">Coimbatore</h2>
      </div>

      {/* Future update line */}
      <div className="bg-brand-pink w-full h-7 overflow-hidden flex items-center">
        <div className="snips-marquee-track text-[12px]">
          <span className="snips-marquee-item">We are working on these feature. Join Waitlist!</span>
          <span className="snips-marquee-item" aria-hidden="true">We are working on these feature. Join Waitlist!</span>
        </div>
      </div>
      
      {/* Map placeholder (design block) */}
      <div className="bg-brand-off-white w-full flex-1 min-h-[330px] flex items-center justify-center">
        <span className="text-black/60 text-[12px]">map preview</span>
      </div>

      {/* Event cards */}
      <div className="">
        <div className="px-[6px] py-[10px]">
          <h3 className="font-semibold text-[14px] mb-[13px]">Aug 2 / <span className="font-medium">Saturday</span></h3>
          <div
            onClick={() => handleSelect('card-1')}
            className={`flex items-center px-[8px] py-[8px] rounded-xl cursor-pointer ${selectedCard === 'card-1' ? 'border border-pink-500' : ''}`}
          >
            <div className="bg-brand-off-white min-h-[69px] w-[69px] rounded-md"></div>
            <div className="font-semibold text-[12px] ml-[15px]">
              <h3>Manad Blitz Bangalore</h3>
              <div className="font-medium flex items-center mt-1">
                <div className="bg-brand-off-white h-[13px] w-[13px] rounded-full mr-1"></div>
                <p>By NSRCEL, IIM Bangalore</p>
              </div>
              <p className="text-[13px] mt-1 font-medium">9:00 PM</p>
            </div>
          </div>
        </div>

        <div className="px-[6px] py-[10px]">
          <h3 className="font-semibold text-[14px] mb-[13px]">Aug 2 / <span className="font-medium">Saturday</span></h3>
          <div
            onClick={() => handleSelect('card-2')}
            className={`flex items-center px-[8px] py-[8px] rounded-xl cursor-pointer ${selectedCard === 'card-2' ? 'border border-pink-500' : ''}`}
          >
            <div className="bg-brand-off-white min-h-[69px] w-[69px] rounded-md"></div>
            <div className="font-semibold text-[12px] ml-[15px]">
              <h3>Manad Blitz Bangalore</h3>
              <div className="font-medium flex items-center mt-1">
                <div className="bg-brand-off-white h-[13px] w-[13px] rounded-full mr-1"></div>
                <p>By NSRCEL, IIM Bangalore</p>
              </div>
              <p className="text-[13px] mt-1 font-medium">9:00 PM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// const PollComponent = ({ post, profileType }) => {
//   const dispatch = useDispatch();

//   const hasVoted = !!post.userVote;
//   const pollTimeInfo = getPollTimeInfo(post.createdAt);

//   const isPollEnded = pollTimeInfo.status === "ended";

//   const handleVote = (optionId) => {
//     if (isPollEnded) return;
//     if (post.userVote === optionId) return;
//     dispatch(voteInPoll({ mixId: post.id, optionId }));
//   };

//   return (
//     <div className="mt-3 space-y-3">
//       {/* Content */}
//       {profileType === "user" && post.content && (
//         <p className="text-[#E7E9EA] text-[14px] whitespace-pre-line mb-3">
//           {post.content}
//         </p>
//       )}
//       {profileType === "network" && post.content && (
//         <>
//           <p className="text-[#E7E9EA] text-[14px] whitespace-pre-line mb-3">
//             {post.title}
//           </p>
//           <p className="text-[#E7E9EA] text-[14px] whitespace-pre-line mb-3">
//             {post.content}
//           </p>
//         </>
//       )}

//       {/* Poll Options */}
//       {post.options.map((option) => {
//         const isSelectedOption = post.userVote === option.id;

//         return (
//           <div
//             key={option.id}
//             onClick={() => handleVote(option.id)}
//             className={`relative border rounded-xl p-3 flex justify-between items-center transition-all duration-200 overflow-hidden
//               ${
//                 !isPollEnded
//                   ? "cursor-pointer hover:border-pink-500"
//                   : "cursor-default"
//               }
//               ${isPollEnded && !hasVoted ? "opacity-50" : ""}
//               ${isSelectedOption ? "border-pink-500" : "border-gray-700"}`}
//           >
//             {/* Option Fill if Voted */}
//             {hasVoted && (
//               <div
//                 className="absolute top-0 left-0 h-full bg-pink-500/20 transition-all duration-500"
//                 style={{ width: `${option.votes}%` }}
//               />
//             )}

//             {/* Option Text */}
//             <div className="relative flex items-center">
//               {isSelectedOption && (
//                 <span className="text-pink-500 mr-2">✓</span>
//               )}
//               <span className="font-semibold">{option.text}</span>
//             </div>

//             {/* Vote Count (only if voted) */}
//             {hasVoted && (
//               <div className="relative flex items-center">
//                 <span className="text-gray-300 mr-2 font-bold">
//                   {option.votes}%
//                 </span>
//                 <span className="text-gray-500 text-xs">({option.count})</span>
//               </div>
//             )}
//           </div>
//         );
//       })}

//       {/* Footer */}
//       <p className="text-xs text-center text-gray-500 pt-1">
//         {isPollEnded
//           ? pollTimeInfo.displayText
//           : `${post.stats.reactions} ${
//               post.stats.reactions === 1 ? "vote" : "votes"
//             } • ${pollTimeInfo.displayText}`}
//       </p>
//     </div>
//   );
// };

// // const getPollTimeStatus = (timestampMs) => {

// //   if (!timestampMs) return "";

// //   let createdAt = Number(timestampMs); // Ensure it's a number
// //   if (createdAt < 1e12) {
// //     // if it's in seconds, convert to ms
// //     createdAt = createdAt * 1000;
// //   }

// //   const twentyFourHoursInMs = 24 * 60 * 60 * 1000;
// //   const endTime = createdAt + twentyFourHoursInMs;
// //   const now = Date.now();

// //   const remainingMs = endTime - now;

// //   if (remainingMs <= 0) return "ended";

// //   const hours = Math.floor(remainingMs / (1000 * 60 * 60));
// //   return `ends in ${hours}h`;
// // };

// const getPollTimeInfo = (createdAtTimestamp) => {
//   if (!createdAtTimestamp) {
//     return { status: "ended", displayText: "Poll Ended", remainingMs: 0 };
//   }

//   let createdAt = Number(createdAtTimestamp);
//   if (createdAt < 1e12) {
//     createdAt *= 1000;
//   }

//   const POLL_DURATION_MS = 24 * 60 * 60 * 1000;
//   const endTime = createdAt + POLL_DURATION_MS;
//   const now = Date.now();
//   const remainingMs = endTime - now;

//   if (remainingMs <= 0) {
//     return { status: "ended", displayText: "Poll Ended", remainingMs: 0 };
//   }
//   const hours = Math.floor(remainingMs / (1000 * 60 * 60));
//   const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));

//   let displayText = "ends in ";
//   if (hours > 0) {
//     displayText += `${hours}h`;
//     if (minutes > 0) {
//       displayText += ` ${minutes}m`;
//     }
//   } else if (minutes > 0) {
//     displayText += `${minutes}m`;
//   } else {
//     displayText = "ends in <1m";
//   }

//   return { status: "active", displayText, remainingMs };
// };

// export const PostCard = ({ post, profileType: propProfileType }) => {
//   const dispatch = useDispatch();
//   const user = post.user || {};
//   const profileType = propProfileType || user.profileType || "user";
//   const {
//     time,
//     label,
//     content,
//     stats = {},
//     tag,
//     title,
//     imageUrl,
//     createdAt,
//   } = post;

//   const pollTimeInfo =
//     label.toLowerCase() === "poll" ? getPollTimeInfo(createdAt) : null;

//   const navigate = useNavigate();

//   const handleReaction = (reactionType) => {
//     const newReaction = post.userReaction === reactionType ? "" : reactionType;
//     dispatch(reactMix({ mixId: post.id, reaction: newReaction }));
//   };

//   const netScore = stats.upvote - stats.downvote;

//   return (
//     <div className="border-b border-gray-700 py-4">
//       {/* Header */}
//       <div className="px-1">
//         <div className="flex justify-between items-start">
//           <div className="flex items-center gap-3">
//             {user.avatar ? (
//               <img
//                 src={user.avatar}
//                 alt={user.name || "User"}
//                 className="w-10 h-10 rounded-full object-cover"
//               />
//             ) : (
//               <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white">
//                 {user.username?.[0]?.toUpperCase() || "?"}
//               </div>
//             )}

//             <div className="text-sm">
//               {profileType === "user" ? (
//                 <div
//                   className="flex items-center gap-1.5 text-md font-semibold"
//                   onClick={() => navigate(`/user-profile/${user.id}`)}
//                 >
//                   {"<"}
//                   {user.username}
//                   {">"}
//                   <span className="text-[#616161] font-normal">
//                     {user.degree ? (user.degree === "masters" ? "m" : "b") : ""}
//                     {user.college} • {time}
//                   </span>
//                   <span className="ml-1 text-xs px-2 py-0.5 rounded-full border border-gray-700">
//                     {label}
//                   </span>

//                   {label.toLowerCase() === "poll" && (
//                     <span className="text-xs text-gray-400 font-normal ml-1">
//                       • {getPollTimeInfo(createdAt).displayText}
//                     </span>
//                   )}
//                 </div>
//               ) : (
//                 <div
//                   className="flex items-center gap-1.5 text-[#E7E9EA] font-semibold"
//                   onClick={() => navigate(`/communitypage/${user.id}`)}
//                 >
//                   {user.name}
//                   <span className="text-gray-400 font-normal">• {time}</span>
//                   <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-gray-900 border border-gray-700">
//                     {label}
//                   </span>

//                   {label.toLowerCase() === "poll" && (
//                     <span className="text-xs text-gray-400 font-normal ml-1">
//                       • {getPollTimeInfo(createdAt).displayText}
//                     </span>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//           <button className="text-gray-400">•••</button>
//         </div>
//       </div>

//       {/* Post content */}
//       <div className="px-4 ml-0.5 pl-1 mt-3">
//         {tag !== "poll" ? (
//           <>
//             {/* For image posts */}
//             {imageUrl ? (
//               <>
//                 {profileType === "network" && title && (
//                   <h2 className="text-[#E7E9EA] text-lg font-semibold mb-2">
//                     {title}
//                   </h2>
//                 )}
//                 {profileType === "user" && content && (
//                   <p className="text-[#E7E9EA] text-[14px] whitespace-pre-line mb-2">
//                     {content}
//                   </p>
//                 )}
//                 <div className="relative w-full aspect-square mt-2">
//                   <img
//                     src={imageUrl}
//                     alt={title || "Post image"}
//                     className="w-full h-full object-cover"
//                   />
//                 </div>
//               </>
//             ) : (
//               <>
//                 {profileType === "network" && title && (
//                   <h2 className="text-[#E7E9EA] text-lg font-semibold mb-2">
//                     {title}
//                   </h2>
//                 )}

//                 {(profileType === "user" || profileType === "network") &&
//                   content && (
//                     <p className="text-[#E7E9EA] text-[14px] whitespace-pre-line mb-2">
//                       {content}
//                     </p>
//                   )}
//               </>
//             )}
//           </>
//         ) : (
//           <PollComponent post={post} profileType={profileType} />
//         )}

//         {/* Reactions */}
//         <div className="flex justify-between items-center mt-3 text-xs">
//           <span
//             className="text-pink-500 font-medium cursor-pointer"
//             onClick={() => navigate(`/comments/${post.id}`)}
//           >
//             {stats.thoughts} thoughts
//           </span>
//           <div className="flex gap-2">
//             {/* <button className="px-3 py-1 rounded-full border border-gray-700 text-gray-400">
//               {stats.nah} nah
//             </button>
//             <button className="px-3 py-1 rounded-full border border-gray-700 text-gray-400">
//               {stats.hmm} hmm
//             </button>
//             <button className="px-3 py-1 rounded-full border border-gray-700 text-pink-500">
//               {stats.hellYeah} hell yeah
//             </button> */}

//             <div className="flex items-center gap-3">
//               <img
//                 src={
//                   post.userReaction === "like" ? upvoteActive : upvoteInactive
//                 }
//                 alt="upvote reaction"
//                 onClick={() => handleReaction("like")}
//                 className="w-6 h-6 cursor-pointer"
//               />

//               <p className="text-gray-400 text-xl font-semibold w-6 text-center">
//                 {netScore}
//               </p>

//               {/* 5. Downvote image with conditional source */}
//               <img
//                 src={
//                   post.userReaction === "dislike"
//                     ? downvoteActive
//                     : downvoteInactive
//                 }
//                 alt="downvote reaction"
//                 onClick={() => handleReaction("dislike")}
//                 className="w-6 h-6 cursor-pointer"
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = getAuth();
  const { posts, status, hasMore, page, fetchError } = useSelector(
    (state) => state.mixes
  );
  const userId = useSelector((state) => state.user.userId);

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const profileMenuRef = useRef(null);

  const [activeTab, setActiveTab] = useState("mixes");
  const [hasNotification, setHasNotification] = useState(true);

  useEffect(() => {
    if (status === "idle" && posts.length === 0) {
      dispatch(fetchMixes(1));
    }
  }, [status, posts.length, dispatch]);

  const observer = useRef();
  // const loadMoreRef = useCallback(
  //   (node) => {
  //     if (status === "loading") return;
  //     if (observer.current) observer.current.disconnect();

  //     observer.current = new IntersectionObserver((entries) => {
  //       if (entries[0].isIntersecting && hasMore) {
  //         dispatch(fetchMixes(page));
  //       }
  //     });

  //     if (node) observer.current.observe(node);
  //   },
  //   [status, hasMore, page, dispatch]
  // );

  const loadMoreRef = useCallback(
    (node) => {
      if (status === "loading") return;
      if (observer.current) observer.current.disconnect();

      // 1. Define the options for the observer
      const observerOptions = {
        root: null, // This means the viewport is the reference
        rootMargin: "800px", // Trigger when the sentinel is 400px away from the viewport
        threshold: 0,
      };

      // 2. Create the observer with the new options
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          dispatch(fetchMixes(page));
        }
      }, observerOptions); // <-- Pass the options here

      if (node) observer.current.observe(node);
    },
    [status, hasMore, page, dispatch]
  );
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        dispatch(clearUser());
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
    <div className="font-inter min-h-screen bg-black text-brand-off-white flex flex-col pt-[60px]">
      {" "}
      {/* Header banner */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <nav className="fixed top-0 left-0 right-0 flex justify-between items-center w-full h-15 p-3 bg-black border-b border-brand-almost-black z-20">
        {/* Left Side: Menu and Logo */}
        <div className="flex items-center space-x-2">
          <div className="cursor-pointer" onClick={() => setIsSidebarOpen(true)}>
            <img src={HamburgerIcon} alt="menu" className="w-6 h-6" />
          </div>
          <div className="cursor-pointer">
            <img src={LogoIcon} alt="logo" className="w-[35px] h-[35px]" />
          </div>
        </div>

        {/* Right Side: Actions and Profile */}
        {/* Actions and profile in mixes page only */}
        {activeTab==="mixes" && (
          <div className="flex items-center space-x-6">
            <div className="cursor-pointer" onClick={() => navigate('/select-network', { state: { fromHomePage: true } })}>
              <img src={SearchIcon} alt="search" className="w-6 h-6" />
            </div>
            {/* <div className="relative cursor-pointer">
              <img src={BellIcon} alt="notifications" className="w-6 h-6" />
              {hasNotification && (
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-brand-pink"></span>
              )}
            </div> */}

            {/* FIX: The correct profile menu is now integrated here */}
            <div ref={profileMenuRef} className="relative">
              <FiUser
                className="h-6 w-6 cursor-pointer"
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              />
              {isProfileMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-neutral-800 border border-neutral-700 rounded-md shadow-lg z-20">
                  <ul className="py-1 text-brand-off-white">
                    <li>
                      <button
                        onClick={() => {
                          if (userId)
                            navigate(`/user-profile-owner/${userId}`);
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
        )}
        {/* Events page for the "own event" button */}
        {activeTab==="events" && (
          <div className="flex items-center space-x-6">
            <div className="cursor-pointer">
              <img src={SearchIcon} alt="search" className="w-6 h-6" />
            </div>
            <button className="flex border border-brand-charcoal rounded-[25px] px-3 py-1 text-[12px]">
              <span className="text-brand-off-white">publish you own</span>
              <span className="text-brand-pink ml-1">event</span>
            </button>
          </div>
        )}

        {/* MarketPlace */}
        {activeTab === "marketplace" && (
          <div className="flex items-center space-x-6">
            
            {/* Start Selling Now Button */}
            <button
              onClick={() => navigate('/start-selling')} // Replace with actual path
              className="bg-black border-2 border-gray-700 text-white rounded-[25px] px-6 py-2 text-sm"
            >
              Start Selling Now
            </button>

            {/* Search Icon */}
            <div className="cursor-pointer">
              <img src={SearchIcon} alt="search" className="w-6 h-6" />
            </div>

            {/* Profile Menu (Optional for Marketplace) */}
            {/* <div ref={profileMenuRef} className="relative">
              <FiUser
                className="h-6 w-6 cursor-pointer"
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              />
              {isProfileMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-neutral-800 border border-neutral-700 rounded-md shadow-lg z-20">
                  <ul className="py-1 text-brand-off-white">
                    <li>
                      <button
                        onClick={() => {
                          if (userId) navigate(`/user-profile-owner/${userId}`);
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
            </div> */}
          </div>
        )}
      </nav>
      {/* Tabs */}
      <div className="flex justify-around border-b border-brand-almost-black">
        <button
          onClick={() => setActiveTab("mixes")}
          className={`relative w-full py-3 font-semibold text-center ${
            activeTab === "mixes" ? "text-brand-off-white" : "text-brand-medium-gray"
          }`}
        >
          mixes
          {activeTab === "mixes" && (
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-[2px] bg-white rounded"></span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("events")}
          className={`relative w-full py-3 font-semibold text-center ${
            activeTab === "events" ? "text-brand-off-white" : "text-brand-medium-gray"
          }`}
        >
          events
          {activeTab === "events" && (
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-[2px] bg-brand-off-white rounded"></span>
          )}
        </button>
      </div>

      {/* Survived Today Banner - Only show in mixes tab */}
      {activeTab === "mixes" && (
        <div className="px-4 py-3">
          <div className="border border-brand-almost-black rounded-lg px-[10px] py-[6px]" onClick={() => navigate(`/selecttag/${userId}`)}>
            <p className="text-brand-off-white text-[18px] font-semibold flex-1">
              Survived today? Cry, laugh, or rant about it here.
            </p>
            <div className="flex items-end justify-end">
              <button
                onClick={() => navigate(`/selecttag/${userId}`)}
                className="bg-brand-blue text-brand-off-white text-[12px] font-medium px-3 py-[3px] rounded-[10px] hover:bg-[#1a8cd8] transition-colors mb-[4px]"
              >
                post now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FIX: A single, non-duplicated content area */}
      <div className="flex-grow overflow-y-auto pb-20">
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
      {/* {activeTab === "mixes" && (
        <div className="fixed bottom-0 left-0 right-0 px-2 py-1 z-10">
          <div className=" bg-black border border-brand-charcoal rounded-[15px] px-4 py-2 flex justify-between items-center">
            <span className="text-brand-charcoal text-[14px] font-medium">Don’t justttt scroll, leave your mark</span>
            <button
              className="bg-brand-blue text-brand-off-white text-[12px] font-medium px-4 py-1 rounded-[10px]"
              //style={{ color: 'cyan', fontSize: '18px' }}
              onClick={() => navigate(`/selecttag/${userId}`)}
              //to="/selecttag"
            >
              post now
            </button>
          </div>
        </div>
      )} */}

      
      <div className="fixed bottom-0 left-0 right-0 px-2 py-1 z-10">
        <div className="bg-black border border-brand-charcoal rounded-[15px] px-4 py-2 flex justify-between items-center">
            <button
              className="bg-black text-brand-off-white text-[12px] font-medium px-4 py-1 rounded-[10px]"
              onClick={() => navigate('/home')}
            >
              Home
            </button>
            {/* <button
              className="bg-black text-brand-off-white text-[12px] font-medium px-4 py-1 rounded-[10px]"
              onClick={() => navigate('/events')}
              
            >
              Events
            </button> */}
            <button
              className="bg-black text-brand-off-white text-[12px] font-medium px-4 py-1 rounded-[10px]"
              onClick={() => { 
                navigate('/smarket')
              } }
            >
              Marketplace
            </button>
            {/* <button
              className="bg-black text-brand-off-white text-[12px] font-medium px-4 py-1 rounded-[10px]"
              // onClick={() => navigate(`/profile/${userId}`)}
            >
              Profile
            </button> */}
        </div>
      </div>
    </div>
  );
};

export default Home;