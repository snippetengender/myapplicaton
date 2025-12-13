import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, MoreVertical } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNetworkById,
  clearCurrentNetwork,
  joinNetwork,
  leaveNetwork,
} from "../../../features/networkCreate/networkSlice";
import {
  fetchMixesByNetwork,
  resetNetworkMixes,
  reactMix,
  voteInPoll,
} from "../../../features/mixes/mixSlice";
import upvoteInactive from "../../assets/Upvote.svg";
import downvoteInactive from "../../assets/Downvote.svg";
import upvoteActive from "../../assets/upvoteActive.svg";
import downvoteActive from "../../assets/downvoteActive.svg";
import backArrow from "../../assets/BackArrow.svg";
import reportFlag from "../../assets/flag.svg"
import Lottie from "lottie-react";
import loadingAnimation from "../../assets/1 second Loop.json"; // Update this path to your actual JSON file

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
    <div className="mt-3 space-y-2">
      {/* Content */}

      <>
        <p className="text-brand-off-white text-lg font-bold leading-[22px]">
          {post.title}
        </p>
        <p className="text-brand-off-white text-[12px] whitespace-pre-line mb-3">
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
                  ? "cursor-pointer hover:border-brand-pink"
                  : "cursor-default"
              }
              ${isPollEnded && !hasVoted ? "opacity-50" : ""}
              ${isSelectedOption ? "border-brand-pink" : "border-gray-700"}`}
          >
            {/* Option Fill if Voted */}
            {hasVoted && (
              <div
                className="absolute top-0 left-0 h-full bg-brand-pinborder-brand-pink/20 transition-all duration-500"
                style={{ width: `${option.votes}%` }}
              />
            )}

            {/* Option Text */}
            <div className="relative flex items-center">
              {isSelectedOption && (
                <span className="text-brand-pinborder-brand-pink mr-2">✓</span>
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

      {/* Footer
      <p className="text-xs text-center text-gray-500 pt-1 border border-yellow-500">
        {isPollEnded
          ? pollTimeInfo.displayText
          : `${post.stats.reactions} ${
              post.stats.reactions === 1 ? "vote" : "votes"
            } • ${pollTimeInfo.displayText}`}
      </p> */}
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
    userMode,
  } = post;

  const pollTimeInfo =
    label.toLowerCase() === "poll" ? getPollTimeInfo(createdAt) : null;

  const navigate = useNavigate();

  const handleReaction = (reactionType) => {
    const newReaction = post.userReaction === reactionType ? "" : reactionType;
    dispatch(reactMix({ mixId: post.id, reaction: newReaction }));
  };

  const netScore = stats.upvote - stats.downvote;

  return (
    <div className="border-b border-brand-almost-black py-[9px] px-[14px] pb-[15px]">
      {/* Header */}
      <div className="">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name || "User"}
                className="w-[24px] h-[23px] rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-brand-off-white">
                {user.username?.[0]?.toUpperCase() || "?"}
              </div>
            )}

            <div className="text-[10px]">
              <div
                className="flex items-center gap-1.5 text-md font-semibold cursor-pointer"
                onClick={() =>
                  navigate(
                    post.userMode === "general"
                      ? `/user-profile/${user.id}`
                      : `/lowkey-profile/${user.id}`
                  )
                }
              >
                {post.userMode === "general"
                  ? `<${user.username}>`
                  : `{${user.username}}`}

                <span className="text-brand-dark-gray font-normal">
                  {user.degree ? (user.degree === "masters" ? "m" : "b") : ""}
                  {user.college} • {time}
                </span>
                <span className="ml-1 text-[9px] px-2 py-0.5 rounded-full border border-brand-charcoal">
                  {label}
                </span>

                {label.toLowerCase() === "poll" && (
                  <span className="text-[9px] text-brand-dark-gray font-normal ml-1">
                    • {getPollTimeInfo(createdAt).displayText}
                  </span>
                )}
              </div>
            </div>
          </div>
          <button>
            <img src={reportFlag} alt="Report Post" />
          </button>
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
                <h2 className="text-brand-off-white text-lg font-semibold mb-2">
                  {title}
                </h2>
                {/* {profileType === "user" && content && (
                  <p className="text-brand-off-white text-[14px] whitespace-pre-line mb-2">
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
                <h2 className="text-brand-off-white text-lg font-semibold mb-2">
                  {title}
                </h2>
                <p className="text-brand-off-white text-[14px] whitespace-pre-line mb-2">
                  {content}
                </p>
              </>
            )}
          </>
        ) : (
          <PollComponent post={post} />
        )}

        {/* Reactions */}
        <div className="flex justify-between items-center mt-3 text-[10px]">
          <span
            className="text-brand-pink font-semibold cursor-pointer"
            onClick={() => navigate(`/comments/${post.id}`)}
          >
            {stats.thoughts} thoughts
          </span>
            {/* <button className="px-3 py-1 rounded-full border border-gray-700 text-gray-400">
              {stats.nah} nah
            </button>
            <button className="px-3 py-1 rounded-full border border-gray-700 text-gray-400">
              {stats.hmm} hmm
            </button>
            <button className="px-3 py-1 rounded-full border border-gray-700 text-brand-pinborder-brand-pink">
              {stats.hellYeah} hell yeah
            </button> */}

            <div className="flex items-center gap-3">
              <img
                src={
                  post.userReaction === "like" ? upvoteActive : upvoteInactive
                }
                alt="upvote reaction"
                onClick={() => handleReaction("like")}
                className="w-6 h-6 cursor-pointer"
              />

              <p className="text-brand-pink text-[18px] font-semibold w-6 text-center">
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
  );
};

export default function MobileNetworkPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const userId = useSelector((state) => state.user.userId);

  const {
    networkPosts: networkMixes,
    networkStatus: mixesStatus,
    networkHasMore: hasMore,
    networkPage: page,
  } = useSelector((state) => state.mixes);
  const loadMoreRef = useRef(null);

  useEffect(() => {
    if (!hasMore) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        dispatch(fetchMixesByNetwork({ networkId: id, page }));
      }
    });
    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }
    return () => observer.disconnect();
  }, [hasMore, page, id, dispatch]);

  const { data: networkData, status } = useSelector(
    (state) => state.network.currentNetwork
  );

  const { status: joinLeaveStatus, error: joinLeaveError } = useSelector(
    (state) => state.network.joinLeaveStatus
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

  const handleJoin = () => {
    if (id) {
      dispatch(joinNetwork(id));
    }
  };

  const handleLeave = () => {
    if (id) {
      dispatch(leaveNetwork(id));
    }
  };

  const getButtonConfig = () => {
    if (networkData?.network_membership?.role === "Owner") {
      return {
        text: "Owner",
        onClick: null,
        disabled: true,
        className:
          "bg-gray-700 text-gray-400 text-sm px-3 py-1 rounded-full cursor-not-allowed",
      };
    }

    if (networkData?.network_membership?.id) {
      return {
        text: joinLeaveStatus === "loading" ? "leaving..." : "got in",
        onClick: handleLeave,
        disabled: joinLeaveStatus === "loading",
        className:
          "flex h-[30px] w-[61px] bg-black border border-brand-charcoal text-brand-off-white text-[11px]  rounded-full disabled:opacity-50 justify-center items-center",
      };
    }

    return {
      text: joinLeaveStatus === "loading" ? "getting in..." : "get in",
      onClick: handleJoin,
      disabled: joinLeaveStatus === "loading",
      className:
        "bg-black border border-[#7E8389] text-brand-off-white text-sm px-3 py-1 rounded-full disabled:opacity-50",
    };
  };

  const buttonConfig = getButtonConfig();

  return (
    <div className="min-h-screen bg-black text-brand-off-white font-inter">
      <div className="relative w-full h-[95px] rounded-lg">
        <img
          src={networkData.banner || "default_banner_url.jpg"}
          alt="Banner"
          className="w-full h-full object-cover"
        />

        {/* back button */}
        <div className="absolute bottom-[17px] left-[17px] w-[38px] h-[38px] flex">
          <button
            onClick={() => navigate(-1)}
            className="bg-black bg-opacity-70 rounded-full w-full h-full justify-center items-center"
          >
            <img src={backArrow} alt="Back Button" className="ml-[10px] w-[12px] h-[20px] justify-center items-center"/>
          </button>
        </div>

        {/* {isOwner() && (
          <div
            ref={menuRef}
            className="absolute top-3/4 right-2 -translate-y-1/2"
          >
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="bg-black bg-opacity-70 p-2 rounded-full"
            >
              <MoreVertical className="text-brand-off-white" size={20} />
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
        )} */}
      </div>

      {/* Profile section */}
      <div className="py-[7px] px-[17px] pr-[12px] border-b border-brand-almost-black pb-[14px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={networkData.image}
              alt="Logo"
              className="w-12 h-12 bg-gray-600 rounded-full object-cover"
            />
            <div>
              <h2 className="text-[15px] text-brand-off-white font-bold">
                {networkData.name}
              </h2>

              <p className="text-[11px] font-bold text-brand-off-white mt-[5px]">
                {networkData.members_count}{" "}
                <span className="text-brand-dark-gray font-normal">members</span>
                <span className="mx-2">•</span>
                {networkData.total_mixes ?? 0}{" "}
                <span className="text-brand-dark-gray font-normal">mixes</span>
              </p>
            </div>
          </div>
          <div>
            <button
              className={buttonConfig.className}
              onClick={buttonConfig.onClick}
              disabled={buttonConfig.disabled}
            >
              {buttonConfig.text}
            </button>
          </div>
        </div>
        <p className="text-[10px] text-brand-off-white mt-[9px]">{networkData.description}</p>
        <p className="text-[11px] text-brand-dark-gray mt-[7px]">Network created by</p>
        <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-[9px]">
          <img
            src={networkData.created_by.image_url || "default_avatar.png"}
            alt="Creator"
            className="w-[23px] h-[22px] bg-gray-500 rounded-full object-cover"
          />
          <span className="text-brand-off-white">{networkData.created_by.name}</span>
        </div>
      </div>
      <div className="">
        {mixesStatus === "loading" && (
          <div className="flex justify-center items-center py-6">
            <Lottie 
              animationData={loadingAnimation} 
              loop={true}
              style={{ width: 120, height: 120 }} // Adjust size as needed
            />
          </div>
        )}

        {networkMixes.length > 0
          ? networkMixes.map((mix) => (
              <NetworkPostCard key={mix.id} post={mix} />
            ))
          : mixesStatus === "succeeded" && (
              <p className="text-gray-400 text-center mt-4">No posts yet.</p>
            )}

        {hasMore && <div ref={loadMoreRef} className="h-10"></div>}
      </div>

      {joinLeaveError && (
        <div className="px-4 py-2 bg-red-900/20 border border-red-600/20">
          <p className="text-red-400 text-sm">{joinLeaveError}</p>
        </div>
      )}

      <div className="fixed bottom-1 left-0 right-0 px-2 py-1 z-10">
        <div className="backdrop-blur-md bg-white/10 border border-brand-charcoal rounded-3xl px-4 py-2 flex justify-between items-center">
          <span className="text-sm text-brand-off-white">Open up now</span>
          <button
            className="bg-white/10 border border-brand-charcoal text-brand-off-white px-4 py-1 rounded-xl hover:bg-white/30"
            onClick={() => navigate(`/selecttag/${userId}`)}
          >
            mix
          </button>
        </div>
      </div>
    </div>
  );
}
