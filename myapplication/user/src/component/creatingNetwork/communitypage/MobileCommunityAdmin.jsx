import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, MoreVertical } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNetworkById,
  clearCurrentNetwork,
} from "../../../features/networkCreate/networkSlice";
import {
  fetchMixesByNetwork,
  resetNetworkMixes,
  deleteMix,
  reactMix,
  voteInPoll,
} from "../../../features/mixes/mixSlice";
import upvoteInactive from "../../assets/Upvote.svg";
import downvoteInactive from "../../assets/Downvote.svg";
import upvoteActive from "../../assets/upvoteActive.svg";
import downvoteActive from "../../assets/downvoteActive.svg";
import Lottie from "lottie-react";
import loadingAnimation from "../../assets/1 second Loop.json";

// export const PollComponent = ({ post }) => {
//   const [selectedOption, setSelectedOption] = useState(null);
//   return (
//     <div className="mt-3 space-y-2">
//       {post.options.map((option, index) => (
//         <div
//           key={index}
//           onClick={() => setSelectedOption(index)}
//           className={`border rounded-lg p-3 flex justify-between items-center cursor-pointer transition-all duration-200 ${
//             selectedOption === index ? "border-pink-500" : "border-gray-700"
//           }`}
//         >
//           <span className="font-semibold">{option.text}</span>
//           <span className="text-gray-400">{option.votes}%</span>
//         </div>
//       ))}
//     </div>
//   );
// };

// const NetworkPostCard = ({ post }) => {

//   const navigate = useNavigate();
//   const { user = {}, time, label, title, content, imageUrl, stats = {} } = post;
//   const profileType = user.profileType || "user";

//   return (
//     <div className="border-b border-gray-700 py-4">
//       <div className="px-1">
//         <div className="flex justify-between items-start">
//           <div className="flex items-center gap-3">
//             {user.avatar ? (
//               <img
//                 src={user.avatar}
//                 alt={user.name || "Network"}
//                 className="w-10 h-10 rounded-full object-cover"
//               />
//             ) : (
//               <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white">
//                 {user.name?.[0]?.toUpperCase() || "?"}
//               </div>
//             )}
//             <div className="text-sm">
//               <div
//                 className="flex items-center gap-1.5 text-md font-semibold cursor-pointer"
//                 onClick={() =>
//                   navigate(`/useronboarding/user-profile/${user.id}`)
//                 }
//               >
//                 {"<"}
//                 {user.username}
//                 {">"}
//                 <span className="text-[#616161] font-normal">
//                   {user.degree ? (user.degree === "masters" ? "m" : "b") : ""}
//                   {user.college} • {time}
//                 </span>
//                 <span className="ml-1 text-xs px-2 py-0.5 rounded-full border border-gray-700">
//                   {label}
//                 </span>
//               </div>
//             </div>
//           </div>
//           <button className="text-gray-400">•••</button>
//         </div>
//       </div>

//       <div className="px-4 ml-0.5 pl-1 mt-3">
//         {title && (
//           <h2 className="text-[#E7E9EA] text-lg font-semibold mb-2">{title}</h2>
//         )}
//         {content && (
//           <p className="text-[#E7E9EA] text-[14px] whitespace-pre-line mb-2">
//             {content}
//           </p>
//         )}

//         {imageUrl && (
//           <div className="relative w-full aspect-square mt-2">
//             <img
//               src={imageUrl}
//               alt={title || "Post image"}
//               className="w-full h-full object-cover"
//             />
//           </div>
//         )}

//         {label === "Poll" && (
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

//             <button className="px-3 py-1 rounded-full border border-gray-700 text-gray-400">
//               {stats.nah} nah
//             </button>
//             <button className="px-3 py-1 rounded-full border border-gray-700 text-gray-400">
//               {stats.hmm} hmm
//             </button>
//             <button className="px-3 py-1 rounded-full border border-gray-700 text-pink-500">
//               {stats.hellYeah} hell yeah
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

const PollComponent = ({ post }) => {
  const dispatch = useDispatch();

  const hasVoted = !!post.userVote;
  const pollTimeInfo = getPollTimeInfo(post.createdAt);

  const isPollEnded = pollTimeInfo.status === "ended";

  const handleVote = (optionId) => {
    if (isPollEnded) return;
    if (post.userVote === optionId) return;
    dispatch(voteInPoll({ mixId: post.id, optionId }));
  };

  return (
    <div className="mt-3 space-y-3">
      {/* Content */}

      <>
        <p className="text-[#E7E9EA] text-[14px] whitespace-pre-line mb-3">
          {post.title}
        </p>
        <p className="text-[#E7E9EA] text-[14px] whitespace-pre-line mb-3">
          {post.content}
        </p>
      </>

      {/* Poll Options */}
      {post.options.map((option) => {
        const isSelectedOption = post.userVote === option.id;

        return (
          <div
            key={option.id}
            onClick={() => handleVote(option.id)}
            className={`relative border rounded-xl p-3 flex justify-between items-center transition-all duration-200 overflow-hidden 
              ${
                !isPollEnded
                  ? "cursor-pointer hover:border-pink-500"
                  : "cursor-default"
              }
              ${isPollEnded && !hasVoted ? "opacity-50" : ""}
              ${isSelectedOption ? "border-pink-500" : "border-gray-700"}`}
          >
            {/* Option Fill if Voted */}
            {hasVoted && (
              <div
                className="absolute top-0 left-0 h-full bg-pink-500/20 transition-all duration-500"
                style={{ width: `${option.votes}%` }}
              />
            )}

            {/* Option Text */}
            <div className="relative flex items-center">
              {isSelectedOption && (
                <span className="text-pink-500 mr-2">✓</span>
              )}
              <span className="font-semibold">{option.text}</span>
            </div>

            {/* Vote Count (only if voted) */}
            {hasVoted && (
              <div className="relative flex items-center">
                <span className="text-gray-300 mr-2 font-bold">
                  {option.votes}%
                </span>
                <span className="text-gray-500 text-xs">({option.count})</span>
              </div>
            )}
          </div>
        );
      })}

      {/* Footer */}
      <p className="text-xs text-center text-gray-500 pt-1">
        {isPollEnded
          ? pollTimeInfo.displayText
          : `${post.stats.reactions} ${
              post.stats.reactions === 1 ? "vote" : "votes"
            } • ${pollTimeInfo.displayText}`}
      </p>
    </div>
  );
};

const getPollTimeInfo = (createdAtTimestamp) => {
  if (!createdAtTimestamp) {
    return { status: "ended", displayText: "Poll Ended", remainingMs: 0 };
  }

  let createdAt = Number(createdAtTimestamp);
  if (createdAt < 1e12) {
    createdAt *= 1000;
  }

  const POLL_DURATION_MS = 24 * 60 * 60 * 1000;
  const endTime = createdAt + POLL_DURATION_MS;
  const now = Date.now();
  const remainingMs = endTime - now;

  if (remainingMs <= 0) {
    return { status: "ended", displayText: "Poll Ended", remainingMs: 0 };
  }
  const hours = Math.floor(remainingMs / (1000 * 60 * 60));
  const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));

  let displayText = "ends in ";
  if (hours > 0) {
    displayText += `${hours}h`;
    if (minutes > 0) {
      displayText += ` ${minutes}m`;
    }
  } else if (minutes > 0) {
    displayText += `${minutes}m`;
  } else {
    displayText = "ends in <1m";
  }

  return { status: "active", displayText, remainingMs };
};

// const getPollTimeStatus = (timestampMs) => {
//   if (!timestampMs) return "";

//   const twentyFourHoursInMs = 24 * 60 * 60 * 1000;
//   const endTime = timestampMs + twentyFourHoursInMs;
//   const now = new Date().getTime();
//   const remainingMs = endTime - now;

//   if (remainingMs <= 0) {
//     return "ended";
//   }

//   const hours = Math.floor(remainingMs / (1000 * 60 * 60));

//   return `ends in ${hours}h`;
// };

export const NetworkPostCard = ({ post }) => {
  const dispatch = useDispatch();
  const user = post.user || {};
  const {
    time,
    label,
    content,
    stats = {},
    tag,
    title,
    imageUrl,
    createdAt,
  } = post;

  const pollTimeInfo =
    label.toLowerCase() === "poll" ? getPollTimeInfo(createdAt) : null;

  const navigate = useNavigate();

  const handleDelete = () => {
    dispatch(deleteMix(post.id));
    alert("Mix deleted successfully");
    window.location.reload();
  };

  const handleReaction = (reactionType) => {
    const newReaction = post.userReaction === reactionType ? "" : reactionType;
    dispatch(reactMix({ mixId: post.id, reaction: newReaction }));
  };

  const netScore = stats.upvote - stats.downvote;

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
              <div
                className="flex items-center gap-1.5 text-md font-semibold"
                onClick={() =>
                  navigate(`/user-profile/${user.id}`)
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

                {label.toLowerCase() === "poll" && (
                  <span className="text-xs text-gray-400 font-normal ml-1">
                    • {getPollTimeInfo(createdAt).displayText}
                  </span>
                )}
              </div>
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
                {" "}
                <h2 className="text-[#E7E9EA] text-lg font-semibold mb-2">
                  {title}
                </h2>
                {/* {profileType === "user" && content && (
                  <p className="text-[#E7E9EA] text-[14px] whitespace-pre-line mb-2">
                    {content}
                  </p>
                )} */}
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
                {" "}
                <h2 className="text-[#E7E9EA] text-lg font-semibold mb-2">
                  {title}
                </h2>
                <p className="text-[#E7E9EA] text-[14px] whitespace-pre-line mb-2">
                  {content}
                </p>
              </>
            )}
          </>
        ) : (
          <PollComponent post={post} />
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
              <button
                className="px-3 py-1 rounded-full border border-gray-700 text-gray-400"
                onClick={handleDelete}
              >
                X
              </button>

              <img
                src={
                  post.userReaction === "like" ? upvoteActive : upvoteInactive
                }
                alt="upvote reaction"
                onClick={() => handleReaction("like")}
                className="w-6 h-6 cursor-pointer"
              />

              <p className="text-gray-400 text-xl font-semibold w-6 text-center">
                {netScore}
              </p>

              {/* 5. Downvote image with conditional source */}
              <img
                src={
                  post.userReaction === "dislike"
                    ? downvoteActive
                    : downvoteInactive
                }
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

export default function MobileNetworkAdmin() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const {
    networkPosts: networkMixes,
    networkStatus: mixesStatus,
    networkHasMore: hasMore,
    networkPage: page,
  } = useSelector((state) => state.mixes);

  const { data: networkData, status } = useSelector(
    (state) => state.network.currentNetwork
  );

  useEffect(() => {
    if (id) {
      dispatch(resetNetworkMixes());
      dispatch(
        fetchNetworkById({
          networkId: id,
          networkMembership: true,
          totalMixes: true,
        })
      );
      dispatch(fetchMixesByNetwork({ networkId: id, page: 1 }));
    }

    return () => {
      dispatch(clearCurrentNetwork());
    };
  }, [id, dispatch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center py-6 bg-black min-h-screen">
        <Lottie 
          animationData={loadingAnimation} 
          loop={true}
          style={{ width: 120, height: 120 }} // Adjust size as needed
        />
      </div>
    );
  }
  if (status === "failed" || !networkData) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Error: Network not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-[#E7E9EA] font-sans">
      <div className="relative w-full h-25 rounded-lg">
        <img
          src={networkData.banner || "default_banner_url.jpg"}
          alt="Banner"
          className="w-full h-full object-cover"
        />

        <div className="absolute top-3/4 left-2 -translate-y-1/2">
          <button
            onClick={() => navigate("/home")}
            className="bg-black bg-opacity-70 p-2 rounded-full"
          >
            <ChevronLeft className="text-[#E7E9EA]" size={20} />
          </button>
        </div>

        <div
          ref={menuRef}
          className="absolute top-3/4 right-2 -translate-y-1/2"
        >
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="bg-black bg-opacity-70 p-2 rounded-full"
          >
            <MoreVertical className="text-[#E7E9EA]" size={20} />
          </button>

          {isMenuOpen && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-neutral-800 border border-neutral-700 rounded-md shadow-lg z-20">
              <ul className="py-1 text-white">
                <li>
                  <button
                    onClick={() => {
                      navigate(`/communitypage/${id}/editnetwork`);
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-neutral-700"
                  >
                    Edit
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      navigate(`/communitypage/${id}/finalpage`);
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-neutral-700"
                  >
                    Introduce Rules
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      navigate(`/communitypage/${id}/ditchnetwork`);
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-neutral-700"
                  >
                    Ditch Network
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 space-y-2 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={networkData.image}
              alt="Logo"
              className="w-12 h-12 bg-gray-600 rounded-full object-cover"
            />
            <div>
              <h2 className="text-lg text-[#D8D7DC] font-semibold">
                {networkData.name}
              </h2>
              <p className="text-sm text-[#D8D7DC]">
                {networkData.members_count}{" "}
                <span className="text-[#616161]">members</span>
                <span className="mx-2">•</span>
                {networkData.total_mixes ?? 0}{" "}
                <span className="text-[#616161]">mixes</span>
              </p>
            </div>
          </div>
          <div>
            <button
              className="bg-gray-700 text-gray-400 text-sm px-3 py-1 rounded-full cursor-not-allowed"
              disabled
            >
              Owner
            </button>
          </div>
        </div>
        <p className="text-sm text-gray-300 mt-1">{networkData.description}</p>
        <p className="text-xs text-gray-500 mt-2">Network created by</p>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <img
            src={networkData.created_by.image_url || "default_avatar.png"}
            alt="Creator"
            className="w-6 h-6 bg-gray-500 rounded-full object-cover"
          />
          <span className="text-[#D8D7DC]">{networkData.created_by.name}</span>
        </div>
      </div>

      <div className="px-2">
        {mixesStatus === "loading" && (
          <p className="text-gray-400">Loading posts...</p>
        )}

        {networkMixes.length > 0
          ? networkMixes.map((mix) => (
              <NetworkPostCard key={mix.id} post={mix} />
            ))
          : mixesStatus === "succeeded" && (
              <p className="text-gray-400 text-center mt-4">No posts yet.</p>
            )}
      </div>
    </div>
  );
}
