import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getPollTimeInfo } from "./GetPollTimeInfo";
import { reactMix } from "../../features/mixes/mixSlice";
import { deleteMix } from "../../features/mixes/mixSlice";
import upvoteInactive from "../assets/Upvote.svg";
import downvoteInactive from "../assets/Downvote.svg";
import upvoteActive from "../assets/upvoteActive.svg";
import downvoteActive from "../assets/downvoteActive.svg";
import { PollComponent } from "./PollComponent";
import { useEffect, useState } from "react";
import reportFlag from "../assets/flag.svg";
import trashIcon from "../assets/trash.svg";
export const PostCard = ({
  post,
  profileType: propProfileType,
  isCommentPage = false,
  userId=null,
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
    userMode,
    network_id
  } = post;
  //console.log(post.id)
  const navigate = useNavigate();

    // Truncate helper for "…" continuation
  const FEED_CLAMP = 160;
  // const COMMENT_CLAMP = 200;
  const truncateText = (text, limit) => {
    if (!text) return "";
    const s = String(text).trim();
    if (s.length <= limit) return s;
    const cut = s.slice(0, limit);
    const lastSpace = cut.lastIndexOf(" ");
    const safe = lastSpace > 0 ? cut.slice(0, lastSpace) : cut;
    return `${safe}…`;
  };
  const contentFeed = truncateText(content, FEED_CLAMP);
  // const contentComment = truncateText(content, COMMENT_CLAMP);

  // Track whether the post image is portrait (height > width)
  const [isPortrait, setIsPortrait] = useState(false);
  const handleImageLoad = (e) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    if (naturalWidth && naturalHeight) {
      setIsPortrait(naturalHeight > naturalWidth);
    }
  };

  const handleReaction = (reactionType) => {
    const newReaction = post.userReaction === reactionType ? "" : reactionType;
    dispatch(reactMix({ mixId: post.id, reaction: newReaction }));
  };

  const handleDelete = (mixId) => {
    if (window.confirm("Are you sure you want to delete this mix?")) {
      dispatch(deleteMix(mixId));
    }
  };

  const netScore = stats.upvote - stats.downvote;


  return (
    <div className="border-b border-brand-almost-black py-[15px] px-[15px]">
      {/* Header Section */}
      {!isCommentPage ? (
        <>
          <div className="px-1">
            <div className="flex justify-between items-start">
              {/* Conditional Header Rendering */}

              <div className="flex items-center gap-3">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name || "User"}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-brand-off-white">
                    {user.username?.[0]?.toUpperCase() || "?"}
                  </div>
                )}
                <div className="flex text-[10px] items-center justify-center">
                  {profileType === "user" ? (
                    <div
                      className="flex items-center gap-1.5 text-[10px] font-bold cursor-pointer"
                      onClick={() => navigate(`/user-profile/${user.id}`)}
                    >
                      {"<"}
                      {user.username}
                      {">"}
                      <span className="text-brand-dark-gray font-normal">
                        {user.degree
                          ? user.degree === "masters"
                            ? "m"
                            : "b"
                          : ""}
                        {user.college} • {time}
                      </span>
                      <span className="ml-1 text-[9px] px-2 py-0.5 rounded-full border border-brand-charcoal">
                        {label}
                      </span>
                      {label.toLowerCase() === "poll" && (
                        <span className="justify-center items-center ml-[5px] text-brand-dark-gray">
                          {getPollTimeInfo(createdAt).displayText}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div
                      className="flex items-center gap-1.5 text-brand-off-white font-semibold cursor-pointer"
                      onClick={() => navigate(`/communitypage/${user.id}`)}
                    >
                      {user.name}
                      <span className="text-brand-dark-gray font-normal">
                        • {time}
                      </span>
                      <span className="ml-1 text-[9px] px-2 py-0.5 rounded-full border border-brand-charcoal">
                        {label}
                      </span>
                      {label.toLowerCase() === "poll" && (
                        <span className="justify-center items-center ml-[5px] text-brand-dark-gray">
                          {getPollTimeInfo(createdAt).displayText}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              {/* <button className="">
                <img src={trashIcon} alt="Report post" />
              </button> */}
              {userId ? 
              (
                  <button onClick={() => handleDelete(post.id)}>
                    <img
                      style={{ width: "18px", height: "18px" }}
                      src={trashIcon}
                      alt="Delete post"
                    />
                  </button>
              ) : (
                  <button>
                    <img src={reportFlag} alt="Report post" />
                  </button>
            )}
            </div>
          </div>
          <div className="px-4 ml-0.5 pl-1 mt-3">
            {tag !== "poll" ? (
              <>
                {imageUrl ? (
                  <div onClick={() => navigate(`/comments/${post.id}`)}>
                    {profileType === "network" && title && (
                      <h2 className="text-brand-off-white text-lg font-semibold mb-2">
                        {title}
                      </h2>
                    )}
                    {profileType === "user" && content && (
                      <p className="text-brand-off-white text-[18px] whitespace-pre-line mb-2">
                        {content}
                      </p>
                    )}
                    {isPortrait ? (
                      <div className="relative mt-2 w-full h-[300px] rounded-lg overflow-hidden flex items-center justify-center">
                        {/* Blurry background using the same image */}
                        <div
                          className="absolute inset-0 bg-center bg-cover filter blur-2xl scale-110"
                          style={{ backgroundImage: `url(${imageUrl})` }}
                        />
                        {/* Optional dark overlay for contrast */}
                        <div className="absolute inset-0 bg-black/30" />
                        {/* Foreground image */}
                        <img
                          src={imageUrl}
                          alt={title || "Post image"}
                          onLoad={handleImageLoad}
                          className="relative z-10 max-h-full max-w-full object-contain"
                        />
                      </div>
                    ) : (
                      <img
                        src={imageUrl}
                        alt={title || "Post image"}
                        onLoad={handleImageLoad}
                        className="mt-2 w-full h-auto rounded-lg object-cover"
                      />
                    )}
                  </div>
                ) : (
                  <div onClick={() => navigate(`/comments/${post.id}`)}>
                    {profileType === "network" && title && (
                      <h2 className="text-brand-off-white text-lg font-semibold mb-2">
                        {title}
                      </h2>
                    )}
                    {(profileType === "user") &&
                      content && (
                        <p className="text-brand-off-white text-[18px] whitespace-pre-line mb-2">
                          {contentFeed}
                        </p>
                    )}
                    {(profileType === "network") &&
                      content && (
                        <p className="text-brand-off-white text-[12px] whitespace-pre-line mb-2">
                          {contentFeed}
                        </p>
                    )}
                  </div>
                )}
              </>
            ) : (
              <PollComponent post={post} profileType={profileType} />
            )}

            {/* Reactions */}
            <div className="flex justify-between items-center mt-3 text-xs">
              {isCommentPage ? (
                <span></span>
              ) : (
                <span
                  className="text-brand-pink font-medium cursor-pointer"
                  onClick={() => navigate(`/comments/${post.id}`)}
                >
                  {stats.thoughts} thoughts
                </span>
              )}

              <div className="flex gap-2">
                <div className="flex items-center gap-3">
                  <img
                    src={
                      post.userReaction === "like"
                        ? upvoteActive
                        : upvoteInactive
                    }
                    alt="upvote reaction"
                    onClick={() => handleReaction("like")}
                    className="w-6 h-6 cursor-pointer"
                  />
                  <p className="text-brand-pink text-xl font-semibold w-6 text-center">
                    {netScore}
                  </p>
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
        </>
      ) : (
        <>
          {/* Header */}
          <div className="px-1 text-[10px]">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <div>by</div>
                <div className="">
                  {userMode === "lowkey" ? (
                    <div
                      className="flex items-center gap-1.5 font-semibold cursor-pointer"
                      onClick={() => navigate(`/user-profile/${user.id}`)}
                    >
                      {"{"}
                      {user.username}
                      {"}"}
                      <span className="text-brand-dark-gray font-normal">
                        {user.degree
                          ? user.degree === "masters"
                            ? "m"
                            : "b"
                          : ""}
                        {user.college} • {time}
                      </span>
                      <span className="ml-1 text-[9px] px-2 py-0.5 rounded-full border border-gray-700">
                        {label}
                      </span>
                      {label.toLowerCase() === "poll" && (
                        <span className=" text-gray-400 font-normal ml-1">
                          • {getPollTimeInfo(createdAt).displayText}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div
                      className="flex items-center gap-1.5 font-semibold cursor-pointer"
                      onClick={() => navigate(`/user-profile/${user.id}`)}
                    >
                      {"<"}
                      {user.username}
                      {">"}
                      <span className="text-brand-dark-gray font-normal">
                        {user.degree
                          ? user.degree === "masters"
                            ? "m"
                            : "b"
                          : ""}
                        {user.college} • {time}
                      </span>
                      <span className="ml-1 text-[9px] px-2 py-0.5 rounded-full border border-brand-charcoal">
                        {label}
                      </span>
                      {label.toLowerCase() === "poll" && (
                        <span className="text-brand-dark-gray font-normal ml-1">
                          • {getPollTimeInfo(createdAt).displayText}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
              {/* <button className="text-gray-400">•••</button> */}
            </div>
          </div>

          {/* Content */}
          <div className="px-4 ml-0.5 pl-1 mt-3">
            {tag !== "poll" ? (
              <>
                {imageUrl ? (
                  <>
                    {network_id !== null && title && (
                      <h2 className="text-brand-off-white text-[18px] font-semibold mb-2">
                        {title}
                      </h2>
                    )}
                    {content && (
                      <p className="text-brand-off-white text-[12px] whitespace-pre-line mb-2">
                        {content}
                      </p>
                    )}
                    {isPortrait ? (
                      <div className="relative mt-2 w-full h-[300px] rounded-lg overflow-hidden flex items-center justify-center">
                        {/* Blurry background using the same image */}
                        <div
                          className="absolute inset-0 bg-center bg-cover filter blur-2xl scale-110"
                          style={{ backgroundImage: `url(${imageUrl})` }}
                        />
                        {/* Optional dark overlay for contrast */}
                        <div className="absolute inset-0 bg-black/30" />
                        {/* Foreground image */}
                        <img
                          src={imageUrl}
                          alt={title || "Post image"}
                          onLoad={handleImageLoad}
                          className="relative z-10 max-h-full max-w-full object-contain"
                        />
                      </div>
                    ) : (
                      <div className="relative w-full mt-2 justify-center items-center">
                        <img
                          src={imageUrl}
                          alt={title || "Post image"}
                          onLoad={handleImageLoad}
                          className="w-full h-auto object-cover rounded-lg"
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    { network_id !== null && title && (
                      <h2 className="text-brand-off-white text-[18px] font-semibold mb-2">
                        {title}
                      </h2>
                    )}
                    {content && (
                      <p className="text-brand-off-white text-[12px] whitespace-pre-line mb-2">
                        {content}
                      </p>
                    )}
                  </>
                )}
              </>
            ) : (
              <PollComponent post={post} profileType={profileType} isCommentPage={isCommentPage} />
            )}

            {/* Reactions */}
            <div className="flex justify-between items-center mt-3 text-[10px]">
              {isCommentPage ? (
                <span
                  className="text-brand-dark-gray font-medium cursor-pointer"
                >
                  {stats.thoughts} thoughts
                </span>
              ) : (
                <span
                  className="text-brand-pink font-medium cursor-pointer"
                  onClick={() => navigate(`/comments/${post.id}`)}
                >
                  {stats.thoughts} thoughts
                </span>
              )}

              <div className="flex gap-2">
                <div className="flex items-center gap-3">
                  <img
                    src={
                      post.userReaction === "like"
                        ? upvoteActive
                        : upvoteInactive
                    }
                    alt="upvote reaction"
                    onClick={() => handleReaction("like")}
                    className="w-6 h-6 cursor-pointer"
                  />
                  <p className="text-brand-pink text-[18px] font-semibold w-6 text-center">
                    {netScore}
                  </p>
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
        </>
      )}

      {/* Post Content Section - This was moved to its correct location */}
    </div>
  );
};
