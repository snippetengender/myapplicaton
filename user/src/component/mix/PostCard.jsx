import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getPollTimeInfo } from "./GetPollTimeInfo";
import { reactMix } from "../../features/mixes/mixSlice";
import upvoteInactive from "../assets/Upvote.svg";
import downvoteInactive from "../assets/Downvote.svg";
import upvoteActive from "../assets/upvoteActive.svg";
import downvoteActive from "../assets/downvoteActive.svg";
import { PollComponent } from "./PollComponent";
import { useEffect } from "react";

export const PostCard = ({
  post,
  profileType: propProfileType,
  isPartial = false,
}) => {
  const dispatch = useDispatch();
  const user = post.user || {};
  const profileType = propProfileType || user.profileType || "user";
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

  const particularMix = isPartial;
  const pollTimeInfo =
    label.toLowerCase() === "poll" ? getPollTimeInfo(createdAt) : null;

  const navigate = useNavigate();

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
          {!particularMix ? (
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
                    onClick={() => navigate(`/user-profile/${user.id}`)}
                  >
                    {"<"}
                    {user.username}
                    {">"}
                    <span className="text-[#616161] font-normal">
                      {user.degree
                        ? user.degree === "masters"
                          ? "m"
                          : "b"
                        : ""}
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

                    {label.toLowerCase() === "poll" && (
                      <span className="text-xs text-gray-400 font-normal ml-1">
                        • {getPollTimeInfo(createdAt).displayText}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div>by</div>

              <div className="text-sm">
                <div
                  className="flex items-center gap-1.5 text-md font-semibold"
                  onClick={() => navigate(`/user-profile/${user.id}`)}
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
          )}

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
