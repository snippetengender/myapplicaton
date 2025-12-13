// src/components/ProfilePage.jsx
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchLowkeyProfile } from "../../features/userSlice/userSlice";

import {
  fetchParticularUserMix,
  reactMix,
  resetUserMixes,
  voteInPoll,
} from "../../features/mixes/mixSlice";
import { PollComponent } from "../mix/PollComponent";
import { PostCard } from "../mix/PostCard";
import profileBanner from "../assets/banner.png";
import backArrow from "../assets/BackArrow.svg";
import wip from "../assets/Snippy_with_Sign.png";

const ProfileSkeleton = () => (
  <>
    {/* Banner Skeleton */}
    <div className="relative h-48 bg-gray-800 animate-pulse"></div>
    {/* Profile Info & Avatar Skeleton */}
    <div className="relative px-4 -mt-12 z-10">
      <div className="w-24 h-24 rounded-full border-4 border-black bg-gray-700 animate-pulse"></div>
      <div className="h-8 w-48 bg-gray-700 rounded mt-4 animate-pulse"></div>
      <div className="h-4 w-32 bg-gray-700 rounded mt-2 animate-pulse"></div>
      <div className="h-6 w-24 bg-gray-700 rounded mt-4 animate-pulse"></div>
    </div>
  </>
);
export const MixCardSkeleton = () => (
  <div className="border-b border-gray-800 py-4 animate-pulse">
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 rounded-full bg-gray-700"></div>
      <div className="flex-1 space-y-3">
        <div className="h-4 w-3/4 bg-gray-700 rounded"></div>
        <div className="h-4 w-full bg-gray-700 rounded"></div>
        <div className="h-4 w-1/2 bg-gray-700 rounded"></div>
      </div>
    </div>
  </div>
);

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

// const PostCard = ({ post, profileType: propProfileType }) => {
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
//               <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-brand-off-white">
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
//                     <span className="text-xs text-brand-dark-gray font-normal ml-1">
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
//                   <span className="text-brand-dark-gray font-normal">• {time}</span>
//                   <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-gray-900 border border-gray-700">
//                     {label}
//                   </span>

//                   {label.toLowerCase() === "poll" && (
//                     <span className="text-xs text-brand-dark-gray font-normal ml-1">
//                       • {getPollTimeInfo(createdAt).displayText}
//                     </span>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//           <button className="text-brand-dark-gray">•••</button>
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
//                   <p className="text-[#E7E9EA] text-[14px] brand-off-whitetext-brand-off-whitespace-pre-line mb-2">
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
//                     <p className="text-[#E7E9EA] text-[14px] brand-off-whitetext-brand-off-whitespace-pre-line mb-2">
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
//             {stats.stuffs} stuffs
//           </span>
//           <div className="flex gap-2">
//             {/* <button className="px-3 py-1 rounded-full border border-gray-700 text-brand-dark-gray">
//               {stats.nah} nah
//             </button>
//             <button className="px-3 py-1 rounded-full border border-gray-700 text-brand-dark-gray">
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

//               <p className="text-brand-dark-gray text-xl font-semibold w-6 text-center">
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
//         <p className="text-[#E7E9EA] text-[14px] brand-off-whitetext-brand-off-whitespace-pre-line mb-3">
//           {post.content}
//         </p>
//       )}
//       {profileType === "network" && post.content && (
//         <>
//           <p className="text-[#E7E9EA] text-[14px] brand-off-whitetext-brand-off-whitespace-pre-line mb-3">
//             {post.title}
//           </p>
//           <p className="text-[#E7E9EA] text-[14px] brand-off-whitetext-brand-off-whitespace-pre-line mb-3">
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
//                 <span className="text-brand-dark-gray text-xs">({option.count})</span>
//               </div>
//             )}
//           </div>
//         );
//       })}

//       {/* Footer */}
//       <p className="text-xs text-center text-brand-dark-gray pt-1">
//         {isPollEnded
//           ? pollTimeInfo.displayText
//           : `${post.stats.reactions} ${
//               post.stats.reactions === 1 ? "vote" : "votes"
//             } • ${pollTimeInfo.displayText}`}
//       </p>
//     </div>
//   );
// };

const LowKeyProfilePage = () => {
  const [activeTab, setActiveTab] = useState("mixes");
  const { userId } = useParams();
  const dispatch = useDispatch();
    const navigate = useNavigate();

  const { user: profileUser, status: profileStatus } = useSelector(
    (state) => state.user
  );

  const { posts, mixesStatus, mixesError, page, hasMore } = useSelector(
    (state) => ({
      posts: state.mixes.userPosts,
      mixesStatus: state.mixes.userPostsStatus,
      mixesError: state.mixes.userPostsError,
      page: state.mixes.userPostsPage,
      hasMore: state.mixes.userPostsHasMore,
    })
  );

  useEffect(() => {
    if (userId) {
      dispatch(fetchLowkeyProfile(userId));
    }
    // Cleanup for user mixes when the component is left
    return () => {
      dispatch(resetUserMixes());
    };
  }, [userId, dispatch]);

  useEffect(() => {
    // Only run this once when we get a userId and have no posts
    if (userId && posts.length === 0) {
      dispatch(fetchParticularUserMix({ userId, page: 1 }));
    }
  }, [userId, posts.length, dispatch]);

  const formatUserTag = (education, college) => {
    if (!education || !college) return "";
    const degreeChar = education.degree === "masters" ? "m" : "b";
    return `${degreeChar}${college}`;
  };

  const observer = useRef();
  const loadMoreRef = useCallback(
    (node) => {
      if (mixesStatus === "loading" || !userId) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && userId) {
          dispatch(fetchParticularUserMix({ userId, page }));
        }
      });

      if (node) observer.current.observe(node);
    },
    [mixesStatus, hasMore, page, userId, dispatch] // userId is now a dependency
  );

  const isInitialLoad = mixesStatus === "loading" && posts.length === 0;
  if (profileStatus === "loading") {
    return (
      <div className="min-h-screen bg-black text-brand-off-white">
        <ProfileSkeleton />
        <div className="p-4">
          <MixCardSkeleton />
        </div>
      </div>
    );
  }

  if (profileStatus === "failed") {
    return (
      <div className="min-h-screen bg-black text-brand-off-white flex items-center justify-center">
        Failed to load user profile.
      </div>
    );
  }

  if (profileStatus === "succeeded" && profileUser) {
    return (
      <div className="min-h-screen bg-black text-brand-off-white">
        {/* Profile Banner */}
        {/* <div className="relative h-48 bg-gray-800"></div> */}
        <div className="relative">
          <img 
            src={profileBanner} 
            alt="Profile banner" 
            className="w-full h-full"
          />
          <div className="absolute bottom-[17px] left-[16px] flex items-center justify-center bg-brand-off-whitetext-brand-off-white/30 rounded-full w-[39px] h-[38px] ">
            <button onClick={() => navigate(-1)} className="-left-1">
              <img 
                src={backArrow} 
                alt="Back to Home page"   
              />
            </button>
          </div>
        </div>
        {/* Profile Info & Avatar */}
        <div className="relative px-4">
          <h1 className="text-[20px] font-bold mt-4">{"{"}{profileUser.username}{"}"}</h1>
          <p className="text-brand-dark-gray mb-2">
            {formatUserTag(
              profileUser.education_status,
              profileUser.college_show
            )}
          </p>
          <div className="flex items-center text-[14px] font-bold mb-4">
            <span className="mr-1">{profileUser.clouts || "0"}</span>
            <span className="text-brand-dark-gray">Clout</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700">
          <button
            className={`relative flex-1 py-3 text-center text-[14px] font-semibold ${
              activeTab === "mixes"
                ? "text-brand-off-brand-off-whitetext-brand-off-white"
                : "text-brand-dark-gray"
            }`}
            onClick={() => setActiveTab("mixes")}
          >
            mixes
            {activeTab === "mixes" && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-[2px] bg-brand-off-whitetext-brand-off-white rounded"></span>
            )}
          </button>
          <button
            className={`relative flex-1 py-3 text-center text-[14px] font-semibold ${
              activeTab === "stuffs"
                ? "text-brand-off-brand-off-whitetext-brand-off-white"
                : "text-brand-dark-gray"
            }`}
            onClick={() => setActiveTab("stuffs")}
          >
            stuffs
            {activeTab === "stuffs" && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-[2px] bg-brand-off-whitetext-brand-off-white rounded"></span>
            )}
          </button>
        </div>

        {/* Content Area */}
        <div className="">
          {activeTab === "mixes" && (
            <>
              {isInitialLoad && <MixCardSkeleton />}

              {posts.map((post) => (
                <PostCard key={post.id} post={post}  userId={userId}/>
              ))}

              {/* Sentinel element to trigger loading more */}
              <div ref={loadMoreRef} />

              {/* Loading indicator for subsequent pages */}
              {mixesStatus === "loading" && !isInitialLoad && (
                <MixCardSkeleton />
              )}

              {mixesError && (
                <p className="text-center text-red-500">{mixesError}</p>
              )}

              {!hasMore && posts.length > 0 && (
                <p className="text-center text-brand-dark-gray py-4">
                  You've reached the end!
                </p>
              )}
            </>
          )}

          {activeTab === "stuffs" && (
            <div className="flex w-full h-full justify-center items-center p-5">
              <img 
                src={wip} 
                alt="Work in progress" 
                className="w-[117px]"
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
};

export default LowKeyProfilePage;
