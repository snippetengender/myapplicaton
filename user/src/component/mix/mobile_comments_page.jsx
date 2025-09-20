// import React, { useState, useEffect, useMemo } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { getComments, createComment } from "../../features/mixes/commentSlice";
// import { FiChevronUp, FiChevronDown } from "react-icons/fi";
// import { RxCross2 } from "react-icons/rx";
// import { FaRegFlag } from "react-icons/fa";
// import { useParams } from "react-router-dom";

// const useNavigate = () => (path) => console.log(`Navigating to: ${path}`);

// const buildCommentTree = (comments = []) => {
//   const commentsMap = {};
//   comments.forEach((comment) => {
//     commentsMap[comment.id] = { ...comment, replies: [] };
//   });
//   const commentTree = [];
//   comments.forEach((comment) => {
//     const parentId = comment.parent_comment_id?.reference_id;
//     if (parentId && commentsMap[parentId]) {
//       commentsMap[parentId].replies.push(commentsMap[comment.id]);
//     } else {
//       commentTree.push(commentsMap[comment.id]);
//     }
//   });
//   return commentTree;
// };

// const NewCommentInput = ({ placeholder, onSubmit, buttonText = "Post" }) => {
//   const [text, setText] = useState("");

//   const handleSubmit = () => {
//     if (text.trim()) {
//       onSubmit(text);
//       setText("");
//     }
//   };

//   return (
//     <div className="w-full border border-gray-700 rounded-lg p-3 bg-[#1A1A1A]">
//       <textarea
//         value={text}
//         onChange={(e) => setText(e.target.value)}
//         placeholder={placeholder}
//         maxLength={1000}
//         rows={3}
//         className="w-full bg-transparent text-[#E7E9EA] text-sm resize-none outline-none"
//         autoFocus
//       />
//       <div className="flex justify-between items-center mt-2">
//         <span className="text-xs text-gray-400">{text.length}/1000</span>
//         <button
//           className={`text-sm font-semibold px-4 py-1 rounded-full ${
//             text.trim()
//               ? "bg-white text-black"
//               : "bg-gray-700 text-gray-400 cursor-not-allowed"
//           }`}
//           disabled={!text.trim()}
//           onClick={handleSubmit}
//         >
//           {buttonText}
//         </button>
//       </div>
//     </div>
//   );
// };

// const Comment = ({
//   comment,
//   indentLevel = 0,
//   onAddReply,
//   activeReplyId,
//   onToggleReply,
//   dispatch,
//   mixId,
// }) => {
//   const {
//     user_details,
//     created_at,
//     comment: content,
//     replies = [],
//     likes_count,
//   } = comment;
//   const [currentVotes, setCurrentVotes] = useState(likes_count);
//   const [replyText, setReplyText] = useState("");
//   const isReplyBoxOpen = activeReplyId === comment.id;

//   const handleUpvote = () => setCurrentVotes((prev) => prev + 1);
//   const handleDownvote = () => setCurrentVotes((prev) => prev - 1);
//   const handleSendReply = () => {
//     if (replyText.trim() && dispatch) {
//       dispatch(
//         createComment({
//           mixId: mixId,
//           comment: replyText.trim(),
//           parentCommentId: comment.id,
//         })
//       );
//       setReplyText("");
//       onToggleReply(null);
//     }
//   };

//   const INDENT_WIDTH = 14;
//   const MAX_VISUAL_INDENT_LEVEL = 3;
//   const MAX_LOGICAL_DEPTH = 5;

//   const marginLeft =
//     Math.min(indentLevel, MAX_VISUAL_INDENT_LEVEL) * INDENT_WIDTH;
//   const shouldDrawLine =
//     indentLevel > 0 && indentLevel <= MAX_VISUAL_INDENT_LEVEL;

//   return (
//     <div className="relative w-full" style={{ marginLeft: `${marginLeft}px` }}>
//       {shouldDrawLine && (
//         <div
//           className="absolute top-0 w-px bg-gray-700 h-full"
//           style={{ left: `-${INDENT_WIDTH / 2}px` }}
//         ></div>
//       )}

//       <div className="flex items-start mt-4">
//         <div className="flex-shrink-0 w-8 h-8 mr-3">
//           <img
//             src={user_details.profile}
//             alt={user_details.name}
//             className="w-full h-full rounded-full object-cover"
//             onError={(e) => {
//               e.target.src = "https://placehold.co/40x40/222/fff?text=U";
//             }}
//           />
//         </div>
//         <div className="flex-grow min-w-0">
//           <div className="flex items-center text-sm min-w-0 pr-10 gap-1 flex-wrap">
//             <span className="font-semibold text-[#E7E9EA] truncate">
//               {user_details.name}
//             </span>
//             <span className="text-gray-400 truncate text-xs flex-shrink-0">
//               @{user_details.username}
//             </span>
//             <span className="text-gray-400 text-xs flex-shrink-0">
//               • {new Date(created_at).toLocaleDateString()}
//             </span>
//             <FaRegFlag className="ml-2 h-4 w-3 text-gray-500 hover:text-[#E7E9EA] cursor-pointer flex-shrink-0" />
//           </div>

//           <p className="text-[#E7E9EA] text-sm mt-1 break-words pr-10">
//             {content}
//           </p>

//           <div className="flex items-center text-xs mt-2 pr-10">
//             {indentLevel < MAX_LOGICAL_DEPTH && (
//               <span
//                 className="text-pink-500 font-medium mr-4 cursor-pointer"
//                 onClick={() => onToggleReply(comment.id)}
//               >
//                 Reply
//               </span>
//             )}
//           </div>

//           {isReplyBoxOpen && (
//             <div className="mt-4 border border-gray-500 p-3 rounded-lg bg-[#1C1C1C]">
//               <textarea
//                 value={replyText}
//                 onChange={(e) => setReplyText(e.target.value)}
//                 maxLength={1000}
//                 rows={3}
//                 className="w-full bg-transparent text-[#E7E9EA] border-none resize-none outline-none"
//                 placeholder="Write a reply..."
//                 autoFocus
//               />
//               <div className="flex justify-between items-center mt-2">
//                 <span className="text-gray-500 text-xs">
//                   {replyText.length}/1000
//                 </span>
//                 <button
//                   className={`text-sm font-semibold px-3 py-1 rounded-full ${
//                     replyText.trim()
//                       ? "bg-white text-black"
//                       : "bg-gray-700 text-gray-400 cursor-not-allowed"
//                   }`}
//                   onClick={handleSendReply}
//                   disabled={!replyText.trim()}
//                 >
//                   add
//                 </button>
//               </div>
//             </div>
//           )}

//           <div className="w-full">
//             {replies.map((reply) => (
//               <Comment
//                 key={reply.id}
//                 comment={reply}
//                 indentLevel={indentLevel + 1}
//                 onAddReply={onAddReply}
//                 activeReplyId={activeReplyId}
//                 onToggleReply={onToggleReply}
//                 dispatch={dispatch}
//                 mixId={mixId}
//               />
//             ))}
//           </div>
//         </div>

//         {/* Voting Block */}
//         <div className="absolute right-0 top-0 flex flex-col items-center flex-shrink-0 z-10">
//           {/* FIXED a typo here: hover:text- not hover-text- */}
//           <FiChevronUp
//             className="h-6 w-6 text-gray-400 cursor-pointer hover:text-[#E7E9EA]"
//             onClick={handleUpvote}
//           />
//           <span className="text-pink-500 text-base font-semibold">
//             {currentVotes}
//           </span>
//           {/* FIXED a typo here: hover:text- not hover-text- */}
//           <FiChevronDown
//             className="h-6 w-6 text-gray-400 cursor-pointer hover:text-[#E7E9EA]"
//             onClick={handleDownvote}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// const CommentsPage = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { mixId } = useParams();
//   console.log(mixId);
//   const {
//     comments: flatComments,
//     status,
//     error,
//   } = useSelector((state) => state.comments);

//   const nestedComments = useMemo(
//     () => buildCommentTree(flatComments),
//     [flatComments]
//   );

//   useEffect(() => {
//     if (mixId) {
//       dispatch(getComments(mixId));
//     }
//   }, [dispatch, mixId]);

//   const [activeReplyId, setActiveReplyId] = useState(null);
//   const handleToggleReply = (commentId) => {
//     setActiveReplyId((prevId) => (prevId === commentId ? null : commentId));
//   };

//   const handleAddReply = (parentId, content) => {
//     console.log("TODO: Dispatch action to post reply to backend", {
//       parentId,
//       content,
//     });
//     setActiveReplyId(null);
//   };

//   return (
//     <div className="min-h-screen bg-black text-[#E7E9EA] p-4 flex flex-col w-full max-w-2xl mx-auto overflow-hidden">
//       <div className="flex items-center mb-6 w-full flex-shrink-0">
//         <RxCross2
//           className="h-6 w-6 text-[#E7E9EA] cursor-pointer mr-4"
//           onClick={() => navigate(-1)}
//         />
//         <h1 className="text-xl font-bold">Comments</h1>
//       </div>
//       {/* You would fetch main post data separately */}
//       {/* <div className="border-b border-gray-800 pb-4 mb-4"> ... Main Post UI ... </div> */}

//       {/* Comments Section */}
//       <div className="flex-grow overflow-y-auto pb-24 w-full">
//         <h2 className="text-lg font-semibold mb-4 flex-shrink-0">Thoughts</h2>

//         {status === "loading" && <div>Loading comments...</div>}

//         {status === "failed" && (
//           <div>Error: {error?.detail || "Could not load comments."}</div>
//         )}
//         {status === "succeeded" ||
//         (status === "loading" && nestedComments.length > 0)
//           ? nestedComments.map((comment) => (
//               <Comment
//                 key={comment.id}
//                 comment={comment}
//                 indentLevel={0}
//                 activeReplyId={activeReplyId}
//                 onToggleReply={handleToggleReply}
//                 dispatch={dispatch}
//                 mixId={mixId}
//               />
//             ))
//           : null}
//       </div>
//     </div>
//   );
// };

// export default CommentsPage;

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getComments, createComment } from "../../features/mixes/commentSlice";
import { FiChevronUp, FiChevronDown, FiImage, FiX } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";

const useNavigate = () => (path) => console.log(`Navigating to: ${path}`);

const formatTimeAgo = (timestampMs) => {
  if (!timestampMs) return "";

  const now = new Date().getTime();
  const secondsPast = Math.floor((now - timestampMs) / 1000);

  if (secondsPast < 60) {
    return `${secondsPast}s`;
  }
  if (secondsPast < 3600) {
    return `${Math.floor(secondsPast / 60)}m`;
  }
  if (secondsPast < 86400) {
    return `${Math.floor(secondsPast / 3600)}h`;
  }
  if (secondsPast < 2592000) {
    return `${Math.floor(secondsPast / 86400)}d`;
  }

  const date = new Date(timestampMs);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const buildCommentTree = (comments = []) => {
  const commentsMap = {};
  comments.forEach((c) => {
    commentsMap[c.id] = { ...c, replies: [] };
  });
  const tree = [];
  comments.forEach((c) => {
    const parentId = c.parent_comment_id?.reference_id;
    if (parentId && commentsMap[parentId]) {
      commentsMap[parentId].replies.push(commentsMap[c.id]);
    } else {
      tree.push(commentsMap[c.id]);
    }
  });
  return tree;
};

const NewCommentInput = ({ placeholder, onSubmit, isSubmitting = false }) => {
  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = () => {
    if (text.trim() || imageFile) {
      onSubmit({ comment: text, imageFile });
      setText("");
      removeImage();
    }
  };

  return (
    <div className="w-full border border-gray-700 rounded-lg p-3 bg-[#1A1A1A]">
      {imagePreview && (
        <div className="relative mb-2 w-24 h-24">
          <img
            src={imagePreview}
            alt="Preview"
            className="w-full h-full object-contain rounded-lg"
          />
          <button
            onClick={removeImage}
            className="absolute top-1 right-1 bg-black bg-opacity-50 rounded-full p-1 text-white"
          >
            <FiX size={16} />
          </button>
        </div>
      )}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        maxLength={1000}
        rows={2}
        className="w-full bg-transparent text-[#E7E9EA] text-sm resize-none outline-none"
      />
      <div className="flex justify-between items-center mt-2">
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current.click()}
          className="text-gray-400 hover:text-white"
        >
          <FiImage size={20} />
        </button>
        <button
          className={`text-sm font-semibold px-4 py-1 rounded-full ${
            (!text.trim() && !imageFile) || isSubmitting
              ? "bg-gray-700 text-gray-400 cursor-not-allowed"
              : "bg-white text-black"
          }`}
          disabled={(!text.trim() && !imageFile) || isSubmitting}
          onClick={handleSubmit}
        >
          {isSubmitting ? "Posting..." : "Post"}
        </button>
      </div>
    </div>
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

export const PostCard = ({ post }) => {
  const user = post.user || {};
  const { time, label, content, stats = {}, tag, title, imageUrl } = post;

  const navigate = useNavigate();

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

        <div className="flex justify-between items-center mt-3 text-xs">
          <span
            className="text-pink-500 font-medium cursor-pointer"
            onClick={() => navigate(`/comments/${post.id}`)}
          >
            {stats.thoughts} thoughts
          </span>
        </div>
      </div>
    </div>
  );
};

const Comment = (props) => {
  const {
    comment,
    indentLevel = 0,
    activeReplyId,
    onToggleReply,
    dispatch,
    mixId,
  } = props;
  const {
    user_details,
    created_at,
    comment: content,
    image,
    replies = [],
    likes_count,
  } = comment;
  const [currentVotes, setCurrentVotes] = useState(likes_count);
  const postStatus = useSelector((state) => state.comments.postStatus);

  const canReply = indentLevel < 1;
  const isReplyBoxOpen = activeReplyId === comment.id;

  const handleAddReply = ({ comment: replyText, imageFile }) => {
    dispatch(
      createComment({
        mixId,
        comment: replyText,
        parentCommentId: comment.id,
        imageFile,
      })
    );
    onToggleReply(null);
  };

  return (
    <div
      className="relative w-full"
      style={{ marginLeft: `${indentLevel * 14}px` }}
    >
      {indentLevel > 0 && (
        <div
          className="absolute top-0 w-px bg-gray-700 h-full"
          style={{ left: "-7px" }}
        ></div>
      )}
      <div className="flex items-start mt-4">
        <img
          src={user_details.profile}
          alt={user_details.name}
          className="flex-shrink-0 w-8 h-8 mr-3 rounded-full object-cover"
        />
        <div className="flex-grow min-w-0">
          <div className="flex items-center text-sm gap-1 flex-wrap">
            <span className="font-semibold text-[#E7E9EA]">
              {`<${user_details.username}>`} •{" "}
            </span>
            <span>
              {user_details.education_status?.degree?.charAt(0)}

              {user_details.college_show}
            </span>

            <span className="mx-1">•</span>

            {/* Formatted "Time Ago" */}
            <span>{formatTimeAgo(created_at)}</span>
          </div>
          {content && (
            <p className="text-[#E7E9EA] text-sm mt-1 break-words">{content}</p>
          )}
          {image && (
            <img
              src={image}
              alt="Comment attachment"
              className="mt-2 rounded-lg max-w-full h-auto"
            />
          )}
          <div className="flex items-center text-xs mt-2">
            {canReply && (
              <span
                className="text-pink-500 font-medium cursor-pointer"
                onClick={() => onToggleReply(comment.id)}
              >
                Reply
              </span>
            )}
          </div>
          {isReplyBoxOpen && (
            <div className="mt-2">
              <NewCommentInput
                placeholder="Write a reply..."
                onSubmit={handleAddReply}
                isSubmitting={postStatus === "loading"}
              />
            </div>
          )}
          <div className="w-full">
            {replies.map((reply) => (
              <Comment
                key={reply.id}
                {...props}
                comment={reply}
                indentLevel={indentLevel + 1}
              />
            ))}
          </div>
        </div>
        <div className="absolute right-0 top-4 flex flex-col items-center">
          <FiChevronUp className="h-6 w-6 text-gray-400 cursor-pointer hover:text-[#E7E9EA]" />
          <span className="text-pink-500 font-semibold">{currentVotes}</span>
          <FiChevronDown className="h-6 w-6 text-gray-400 cursor-pointer hover:text-[#E7E9EA]" />
        </div>
      </div>
    </div>
  );
};

const CommentsPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { mixId } = useParams();
  const {
    comments: flatComments,
    status,
    error,
    postStatus,
  } = useSelector((state) => state.comments);
  const nestedComments = useMemo(
    () => buildCommentTree(flatComments),
    [flatComments]
  );
  const [activeReplyId, setActiveReplyId] = useState(null);

  useEffect(() => {
    if (mixId) dispatch(getComments(mixId));
  }, [dispatch, mixId]);

  const handleToggleReply = (commentId) => {
    setActiveReplyId((prevId) => (prevId === commentId ? null : commentId));
  };

  const handlePostTopLevelComment = ({ comment, imageFile }) => {
    dispatch(
      createComment({ mixId, comment, imageFile, parentCommentId: null })
    );
  };

  return (
    <div className="min-h-screen bg-black text-[#E7E9EA] p-4 flex flex-col w-full max-w-2xl mx-auto">
      <div></div>
      <div className="flex items-center mb-6">
        <RxCross2
          className="h-6 w-6 cursor-pointer mr-4"
          onClick={() => navigate(-1)}
        />
        <h1 className="text-xl font-bold">Comments</h1>
      </div>
      <div className="flex-grow overflow-y-auto pb-24">
        <h2 className="text-lg font-semibold mb-4">Thoughts</h2>
        <div className="mb-6">
          <NewCommentInput
            placeholder="Join the conversation..."
            onSubmit={handlePostTopLevelComment}
            isSubmitting={postStatus === "loading"}
          />
        </div>
        {status === "loading" && nestedComments.length === 0 && (
          <div>Loading...</div>
        )}
        {status === "failed" && (
          <div>Error: {error?.detail || "Could not load."}</div>
        )}
        {(status === "succeeded" ||
          (status === "loading" && nestedComments.length > 0)) &&
          nestedComments.map((comment) => (
            <Comment
              key={comment.id}
              comment={comment}
              dispatch={dispatch}
              mixId={mixId}
              indentLevel={0}
              activeReplyId={activeReplyId}
              onToggleReply={handleToggleReply}
            />
          ))}
      </div>
    </div>
  );
};

export default CommentsPage;
