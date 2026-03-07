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
//   // Sort main comments by likes in descending order
//   commentTree.sort((a, b) => (b.likes_count || 0) - (a.likes_count || 0));
//   // Sort replies by likes in descending order
//   commentTree.forEach((comment) => {
//     if (comment.replies && comment.replies.length > 0) {
//       comment.replies.sort((a, b) => (b.likes_count || 0) - (a.likes_count || 0));
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
//         className="w-full bg-transparent text-brand-off-white text-sm resize-none outline-none"
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
//             <span className="font-semibold text-brand-off-white truncate">
//               {user_details.name}
//             </span>
//             <span className="text-gray-400 truncate text-xs flex-shrink-0">
//               @{user_details.username}
//             </span>
//             <span className="text-gray-400 text-xs flex-shrink-0">
//               • {new Date(created_at).toLocaleDateString()}
//             </span>
//             <FaRegFlag className="ml-2 h-4 w-3 text-gray-500 hover:text-brand-off-white cursor-pointer flex-shrink-0" />
//           </div>

//           <p className="text-brand-off-white text-sm mt-1 break-words pr-10">
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
//                 className="w-full bg-transparent text-brand-off-white border-none resize-none outline-none"
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
//             className="h-6 w-6 text-gray-400 cursor-pointer hover:text-brand-off-white"
//             onClick={handleUpvote}
//           />
//           <span className="text-pink-500 text-base font-semibold">
//             {currentVotes}
//           </span>
//           {/* FIXED a typo here: hover:text- not hover-text- */}
//           <FiChevronDown
//             className="h-6 w-6 text-gray-400 cursor-pointer hover:text-brand-off-white"
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
//     <div className="min-h-screen bg-black text-brand-off-white p-4 flex flex-col w-full max-w-2xl mx-auto overflow-hidden">
//       <div className="flex items-center mb-6 w-full flex-shrink-0">
//         <RxCross2
//           className="h-6 w-6 text-brand-off-white cursor-pointer mr-4"
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

// import React, {
//   useState,
//   useEffect,
//   useMemo,
//   useRef,
//   useCallback,
// } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate, useParams } from "react-router-dom";
// import {
//   getComments,
//   createComment,
//   resetComments,
// } from "../../features/mixes/commentSlice";
// import { FiChevronUp, FiChevronDown, FiImage, FiX } from "react-icons/fi";
// import { RxCross2 } from "react-icons/rx";
// import imageCompression from "browser-image-compression";
// import ProfileSelector from "./ProfileSelector";
// import { fetchUserProfile } from "../../features/userSlice/userSlice";
// import { fetchParticularMix } from "../../features/mixes/mixSlice";
// import CommentsPageSkeleton from "./CommentsPageSkeleton ";
// import { PostCard } from "./PostCard";
// import CommentSkeleton from "./CommentsSkeleton";

// const formatTimeAgo = (timestampMs) => {
//   if (!timestampMs) return "";

//   const now = new Date().getTime();
//   const secondsPast = Math.floor((now - timestampMs) / 1000);

//   if (secondsPast < 60) {
//     return `${secondsPast}s`;
//   }
//   if (secondsPast < 3600) {
//     return `${Math.floor(secondsPast / 60)}m`;
//   }
//   if (secondsPast < 86400) {
//     return `${Math.floor(secondsPast / 3600)}h`;
//   }
//   if (secondsPast < 2592000) {
//     return `${Math.floor(secondsPast / 86400)}d`;
//   }

//   const date = new Date(timestampMs);
//   return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
// };

// const buildCommentTree = (comments = []) => {
//   const commentsMap = {};
//   comments.forEach((c) => {
//     commentsMap[c.id] = { ...c, replies: [] };
//   });
//   const tree = [];
//   comments.forEach((c) => {
//     const parentId = c.parent_comment_id?.reference_id;
//     if (parentId && commentsMap[parentId]) {
//       commentsMap[parentId].replies.push(commentsMap[c.id]);
//     } else {
//       tree.push(commentsMap[c.id]);
//     }
//   });
//   return tree;
// };

// const NewCommentInput = ({
//   placeholder,
//   onSubmit,
//   isSubmitting = false,
//   userId,
// }) => {
//   // 1. State for text and image is now self-contained here
//   const [text, setText] = useState("");
//   const [imageFile, setImageFile] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);
//   const fileInputRef = useRef(null);
//   const [useLowkey, setUseLowkey] = useState(false);
//   const dispatch = useDispatch();
//   const { data: userDetails, status } = useSelector(
//     (state) => state.user.profile
//   );
//   const navigate = useNavigate();
//   useEffect(() => {
//     const currentUserId = userId;

//     if (status === "idle") {
//       dispatch(fetchUserProfile(currentUserId));
//     }
//   }, [dispatch, status]);

//   useEffect(() => {
//     if (userDetails) {
//       console.log("User Details from Component:", userDetails);
//     }
//   }, [userDetails]);

//   const hasLowkeyProfile = userDetails && userDetails.lowkey_profile;

//   const handleFileChange = async (event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     const options = {
//       maxSizeMB: 1,
//       maxWidthOrHeight: 1920,
//       useWebWorker: true,
//     };

//     try {
//       // console.log(
//       //   `Original file size: ${(file.size / 1024 / 1024).toFixed(2)} MB`
//       // );
//       const compressedFile = await imageCompression(file, options);
//       // console.log(
//       //   `Compressed file size: ${(compressedFile.size / 1024 / 1024).toFixed(
//       //     2
//       //   )} MB`
//       // );

//       // Set the component's internal state
//       setImageFile(compressedFile);
//       setImagePreview(URL.createObjectURL(compressedFile));
//     } catch (err) {
//       console.error("Image compression error:", err);
//       alert("Failed to compress image.");
//     }
//   };

//   const removeImage = () => {
//     setImageFile(null);
//     setImagePreview(null);
//     if (fileInputRef.current) fileInputRef.current.value = "";
//   };

//   const handleSubmit = () => {
//     if (text.trim() || imageFile) {
//       const dataToSubmit = { comment: text, imageFile, is_lowkey: useLowkey };

//       // ADD THIS LOG:
//       console.log("1. Data being sent from NewCommentInput:", dataToSubmit);

//       onSubmit(dataToSubmit);
//       setText("");
//       removeImage();
//     }
//   };

//   return (
//     <div className="w-full border border-gray-700 rounded-lg p-3 bg-[#1A1A1A]">
//       {imagePreview && (
//         <div className="relative mb-2 w-24 h-24">
//           <img
//             src={imagePreview}
//             alt="Preview"
//             className="w-full h-full object-cover rounded-lg" // Changed to object-cover
//           />
//           <button
//             onClick={removeImage}
//             className="absolute top-1 right-1 bg-black bg-opacity-50 rounded-full p-1 text-white"
//           >
//             <FiX size={16} />
//           </button>
//         </div>
//       )}
//       <textarea
//         value={text}
//         onChange={(e) => setText(e.target.value)}
//         placeholder={placeholder}
//         maxLength={1000}
//         rows={2}
//         className="w-full bg-transparent text-brand-off-white text-sm resize-none outline-none"
//       />
//       <div className="flex justify-between items-center mt-2">
//         <input
//           type="file"
//           accept="image/*"
//           ref={fileInputRef}
//           onChange={handleFileChange}
//           className="hidden"
//         />
//         <button
//           onClick={() => fileInputRef.current.click()}
//           className="text-gray-400 hover:text-white"
//           disabled={!!imageFile}
//         >
//           <FiImage size={20} />
//         </button>

//         <div className="flex items-center gap-4">
//           {hasLowkeyProfile ? (
//             <ProfileSelector
//               userDetails={userDetails}
//               useLowkey={useLowkey}
//               setUseLowkey={setUseLowkey}
//             />
//           ) : (
//             <>
//               {/* <div className="flex items-center gap-2">
//                 <img
//                   src={userDetails.profile}
//                   alt={userDetails.name}
//                   className="w-10 h-10 rounded-full object-cover"
//                 />
//                 <div className="text-gray-400 text-md">
//                   {`<${userDetails.username}>`}
//                 </div>
//               </div> */}
//               <div
//                 onClick={() => navigate("/lowkey")}
//                 className="text-sm text-pink-500 cursor-pointer whitespace-nowrap"
//               >
//                 Create lowkey profile
//               </div>
//             </>
//           )}
//         </div>

//         <button
//           className={`text-sm font-semibold px-4 py-1 rounded-full ${
//             (!text.trim() && !imageFile) || isSubmitting
//               ? "bg-gray-700 text-gray-400 cursor-not-allowed"
//               : "bg-white text-black"
//           }`}
//           disabled={(!text.trim() && !imageFile) || isSubmitting}
//           onClick={handleSubmit}
//         >
//           {isSubmitting ? "Posting..." : "Post"}
//         </button>
//       </div>
//     </div>
//   );
// };

// const Comment = (props) => {
//   const {
//     comment,
//     indentLevel = 0,
//     activeReplyId,
//     onToggleReply,
//     dispatch,
//     mixId,
//     loggedInUserId,
//   } = props;
//   const {
//     user_id,
//     user_details,
//     created_at,
//     comment: content,
//     image,
//     replies = [],
//     likes_count,
//     comment_type,
//   } = comment;

//   useEffect(() => {
//     console.log(comment);
//   }, [comment]);
//   const [currentVotes, setCurrentVotes] = useState(likes_count);
//   const postStatus = useSelector((state) => state.comments.postStatus);

//   const canReply = indentLevel < 1;
//   const isReplyBoxOpen = activeReplyId === comment.id;
//   const isLowkeyComment = comment_type === "lowkey";

//   const hasValidUserDetails =
//     user_details && Object.keys(user_details).length > 0;

//   const handleAddReply = ({
//     comment: replyText,
//     imageFile,
//     is_lowkey: is_lowkey,
//   }) => {
//     dispatch(
//       createComment({
//         mixId,
//         comment: replyText,
//         parentCommentId: comment.id,
//         imageFile,
//         is_lowkey: is_lowkey,
//       })
//     );
//     onToggleReply(null);
//   };

//   if (!hasValidUserDetails) {
//     return (
//       <div
//         className="relative w-full"
//         style={{ marginLeft: `${indentLevel * 14}px` }}
//       >
//         {indentLevel > 0 && (
//           <div
//             className="absolute top-0 w-px bg-gray-700 h-full"
//             style={{ left: "-7px" }}
//           ></div>
//         )}
//         <div className="flex items-start mt-4">
//           <div className="flex-shrink-0 w-8 h-8 mr-3 rounded-full bg-gray-600"></div>
//           <div className="flex-grow min-w-0">
//             <div className="flex items-center text-sm gap-1 flex-wrap">
//               <span className="font-semibold text-gray-500">
//                 {isLowkeyComment ? `{${user_id.name}}` : `<${user_id.name}>`} •{" "}
//               </span>
//               <span>{formatTimeAgo(created_at)}</span>
//             </div>
//             {image && (
//               <img
//                 src={image}
//                 alt="Comment attachment"
//                 className="mt-2 rounded-lg max-w-full h-auto"
//               />
//             )}
//             {content && (
//               <p className="text-brand-off-white text-sm mt-1 break-words">
//                 {content}
//               </p>
//             )}
//             <div className="flex items-center text-xs mt-2">
//               {canReply && (
//                 <span
//                   className="text-pink-500 font-medium cursor-pointer"
//                   onClick={() => onToggleReply(comment.id)}
//                 >
//                   Reply
//                 </span>
//               )}
//             </div>
//             {isReplyBoxOpen && (
//               <div className="mt-2">
//                 <NewCommentInput
//                   placeholder="Write a reply..."
//                   onSubmit={handleAddReply}
//                   isSubmitting={postStatus === "loading"}
//                   userId={loggedInUserId}
//                 />
//               </div>
//             )}
//             <div className="w-full">
//               {replies.map((reply) => (
//                 <Comment
//                   key={reply.id}
//                   {...props}
//                   comment={reply}
//                   indentLevel={indentLevel + 1}
//                 />
//               ))}
//             </div>
//           </div>
//           <div className="absolute right-0 top-4 flex flex-col items-center">
//             <FiChevronUp className="h-6 w-6 text-gray-400 cursor-pointer hover:text-brand-off-white" />
//             <span className="text-pink-500 font-semibold">{currentVotes}</span>
//             <FiChevronDown className="h-6 w-6 text-gray-400 cursor-pointer hover:text-brand-off-white" />
//           </div>
//         </div>
//       </div>
//     );
//   }
//   const navigate = useNavigate();

//   const handleClickProfile = () => {
//     if (isLowkeyComment) {
//       navigate(`/lowkey-profile/${user_details.user_id}`);
//     } else {
//       navigate(`/user-profile/${user_details.firebase_id}`);
//     }
//   };
//   return (
//     <div
//       className="relative w-full"
//       style={{ marginLeft: `${indentLevel * 14}px` }}
//     >
//       {indentLevel > 0 && (
//         <div
//           className="absolute top-0 w-px bg-gray-700 h-full"
//           style={{ left: "-7px" }}
//         ></div>
//       )}
//       <div className="flex items-start mt-4">
//         {comment_type === "lowkey" ? (
//           <img
//             src={user_details.profile_image}
//             alt={user_details.name}
//             className="flex-shrink-0 w-8 h-8 mr-3 rounded-full object-cover"
//           />
//         ) : (
//           <img
//             src={user_details.profile}
//             alt={user_details.name}
//             className="flex-shrink-0 w-8 h-8 mr-3 rounded-full object-cover"
//           />
//         )}

//         <div className="flex-grow min-w-0">
//           <div className="flex items-center text-sm gap-1 flex-wrap">
//             <span
//               className="font-semibold text-brand-off-white"
//               onClick={handleClickProfile}
//             >
//               {isLowkeyComment
//                 ? `{${user_details.username}}`
//                 : `<${user_details.username}>`}{" "}
//               •{" "}
//             </span>
//             <span>
//               {user_details.education_status?.degree?.charAt(0)}
//               {user_details.college_show}
//             </span>
//             <span className="mx-1">•</span>
//             <span>{formatTimeAgo(created_at)}</span>
//           </div>
//           {image && (
//             <img
//               src={image}
//               alt="Comment attachment"
//               className="mt-2 rounded-lg max-w-full h-auto"
//             />
//           )}
//           {content && (
//             <p className="text-brand-off-white text-sm mt-1 break-words">{content}</p>
//           )}
//           <div className="flex items-center text-xs mt-2">
//             {canReply && (
//               <span
//                 className="text-pink-500 font-medium cursor-pointer"
//                 onClick={() => onToggleReply(comment.id)}
//               >
//                 Reply
//               </span>
//             )}
//           </div>
//           {isReplyBoxOpen && (
//             <div className="mt-2">
//               <NewCommentInput
//                 placeholder="Write a reply..."
//                 onSubmit={handleAddReply}
//                 isSubmitting={postStatus === "loading"}
//                 userId={loggedInUserId}
//               />
//             </div>
//           )}
//           <div className="w-full">
//             {replies.map((reply) => (
//               <Comment
//                 key={reply.id}
//                 {...props}
//                 comment={reply}
//                 indentLevel={indentLevel + 1}
//               />
//             ))}
//           </div>
//         </div>
//         <div className="absolute right-0 top-4 flex flex-col items-center">
//           <FiChevronUp className="h-6 w-6 text-gray-400 cursor-pointer hover:text-brand-off-white" />
//           <span className="text-pink-500 font-semibold">{currentVotes}</span>
//           <FiChevronDown className="h-6 w-6 text-gray-400 cursor-pointer hover:text-brand-off-white" />
//         </div>
//       </div>
//     </div>
//   );
// };

// const CommentsPage = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { mixId } = useParams();
//   const observer = useRef();
//   const [activeReplyId, setActiveReplyId] = useState(null);

//   const { selectedMix, status: mixStatus } = useSelector(
//     (state) => state.mixes
//   );

//   const {
//     comments: flatComments,
//     status: commentsStatus,
//     page,
//     hasMore,
//     loadingInitial,
//     loadingMore,
//   } = useSelector((state) => state.comments);

//   const loggedInUserId = useSelector((state) => state.user.userId);

//   const isSubmitting = useSelector(
//     (state) => state.comments.postStatus === "loading"
//   );

//   const nestedComments = useMemo(
//     () => buildCommentTree(flatComments),
//     [flatComments]
//   );

//   const loadMoreRef = useCallback(
//     (node) => {
//       if (commentsStatus === "loading") return;
//       if (observer.current) observer.current.disconnect();
//       observer.current = new IntersectionObserver((entries) => {
//         if (entries[0].isIntersecting && hasMore) {
//           dispatch(getComments({ mixId, page }));
//         }
//       });
//       if (node) observer.current.observe(node);
//     },
//     [commentsStatus, hasMore, page, mixId, dispatch]
//   );

//   useEffect(() => {
//     if (mixId) {
//       dispatch(resetComments());
//       dispatch(fetchParticularMix(mixId));
//       console.log("Imported data:", selectedMix);
//       dispatch(getComments({ mixId, page: 1 }));
//     }
//     return () => {
//       dispatch(resetComments());
//     };
//   }, [dispatch, mixId]);

//   const isLoading = mixStatus === "loading" || mixStatus === "idle";
//   if (isLoading) {
//     return <CommentsPageSkeleton />;
//   }

//   if (mixStatus === "failed" || !selectedMix) {
//     return <div className="min-h-screen ...">Error loading post.</div>;
//   }

//   const handleToggleReply = (commentId) => {
//     setActiveReplyId((prevId) => (prevId === commentId ? null : commentId));
//   };

//   const handlePostTopLevelComment = ({ comment, imageFile, is_lowkey }) => {
//     dispatch(createComment({ mixId, comment, imageFile, is_lowkey }));
//   };

//   return (
//     <div className="min-h-screen bg-black text-brand-off-white p-4 flex flex-col w-full max-w-2xl mx-auto">
//       {/* Page Header */}
//       <div className="flex items-center mb-6">
//         <RxCross2
//           className="h-6 w-6 cursor-pointer mr-4"
//           onClick={() => navigate(-1)}
//         />
//         <h1 className="text-xl font-bold"></h1>
//       </div>

//       {/* Main Post */}
//       <div className="border-b border-gray-700 pb-4">
//         <PostCard post={selectedMix} isPartial={true} isCommentPage={true} />
//       </div>

//       {/* Comments Section */}
//       <div className="flex-grow overflow-y-auto pt-4 pb-24">
//         <div className="mb-6">
//           <NewCommentInput
//             placeholder="Join the conversation..."
//             onSubmit={handlePostTopLevelComment}
//             isSubmitting={isSubmitting}
//             userId={loggedInUserId}
//           />
//         </div>

//         {/* Initial Comments Loading Skeletons */}
//         {commentsStatus === "loading" &&
//           flatComments.length === 0 &&
//           Array.from({ length: 3 }).map((_, i) => <CommentSkeleton key={i} />)}

//         {/* Rendered Comments */}
//         {nestedComments.map((comment) => (
//           <Comment
//             key={comment.id}
//             comment={comment}
//             dispatch={dispatch}
//             mixId={mixId}
//             indentLevel={0}
//             activeReplyId={activeReplyId}
//             onToggleReply={handleToggleReply}
//             loggedInUserId={loggedInUserId}
//           />
//         ))}

//         {/* Infinite Scroll Sentinel and Loader */}
//         {loadingInitial && <CommentSkeleton />}
//         <div ref={loadMoreRef}>
//           {loadingMore && <span>Loading more...</span>}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CommentsPage;

import React, {
  useState,

  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { useDispatch, useSelector } from "react-redux";

import { useNavigate, useParams } from "react-router-dom";
import {
  getComments,
  createComment,
  resetComments,
} from "../../features/mixes/commentSlice";
import { FiChevronUp, FiChevronDown, FiImage, FiX } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";
import imageCompression from "browser-image-compression";
import ProfileSelector from "./ProfileSelector";
import { fetchUserProfile } from "../../features/userSlice/userSlice";
import { fetchParticularMix } from "../../features/mixes/mixSlice";
import CommentsPageSkeleton from "./CommentsPageSkeleton ";
import { PostCard } from "./PostCard";
import CommentSkeleton from "./CommentsSkeleton";
import {

  deleteComment
} from "../../features/mixes/commentSlice";
import reportFlag from "../assets/flag.svg";
import addImages from "../assets/gallery-add.svg"
import Lottie from "lottie-react";
import loadingAnimation from "../assets/1 second Loop.json";
import trashIcon from "../assets/trash.svg";
import { updateCommentReaction } from "../../features/mixes/commentSlice";

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

const NewCommentInput = ({
  placeholder,
  onSubmit,
  isSubmitting = false,
  userId,
}) => {
  // 1. State for text and image is now self-contained here
  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const [useLowkey, setUseLowkey] = useState(false);
  const dispatch = useDispatch();
  const { data: userDetails, status } = useSelector(
    (state) => state.user.profile
  );
  const navigate = useNavigate();

  useEffect(() => {
    const currentUserId = userId;
    // Note: status might be succeeded, but userDetails could belong to someone else
    // if we just visited another profile. We need to fetch our own profile back.
    if (status === "idle" || (userDetails && userDetails.user_id !== currentUserId)) {
      dispatch(fetchUserProfile(currentUserId));
    }
  }, [dispatch, status, userId, userDetails?.user_id]);

  useEffect(() => {
    if (userDetails) {
    }
  }, [userDetails]);

  const hasLowkeyProfile = userDetails && userDetails.lowkey_profile;

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };

    try {
      const compressedFile = await imageCompression(file, options);

      // Set the component's internal state
      setImageFile(compressedFile);
      setImagePreview(URL.createObjectURL(compressedFile));
    } catch (err) {
      console.error("Image compression error:", err);
      alert("Failed to compress image.");
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = () => {
    if (text.trim() || imageFile) {
      const dataToSubmit = { comment: text, imageFile, is_lowkey: useLowkey };

      onSubmit(dataToSubmit);
      setText("");
      removeImage();
    }
  };

  return (
    <div className="w-full border border-brand-almost-black rounded-lg pt-[11px] pl-[15px]">
      {imagePreview && (
        <div className="relative mb-2 w-24 h-24">
          <img
            src={imagePreview}
            alt="Preview"
            className="w-full h-full object-cover rounded-lg"
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
        className="w-full bg-transparent text-brand-off-white font-medium font-inter text-[14px] resize-none outline-none placeholder:text-brand-dark-gray"
      />
      <div className="flex mt-2 justify-between mr-[10px] mb-[3px]">
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />

        {/* User and lowkey dropdown */}
        <div className="flex items-center gap-4">
          {hasLowkeyProfile ? (
            <ProfileSelector
              userDetails={userDetails}
              useLowkey={useLowkey}
              setUseLowkey={setUseLowkey}
            />
          ) : (
            <>
              <div
                onClick={() => navigate("/lowkey")}
                className="text-[12px] text-brand-pink cursor-pointer whitespace-nowrap"
              >
                Create lowkey profile
              </div>
            </>
          )}
        </div>

        {/* Posting options */}
        <div className="flex gap-[15px] items-center">
          <button
            onClick={() => fileInputRef.current.click()}
            disabled={!!imageFile}
          >
            <img src={addImages} alt="Add images" />
          </button>

          <button
            className={`text-sm font-medium px-3 pt-1 pb-[6px] rounded-[10px] leading-[17px] ${(!text.trim() && !imageFile) || isSubmitting
              ? "text-brand-off-white cursor-not-allowed border border-brand-almost-black"
              : "bg-brand-off-white text-brand-almost-black"
              }`}
            disabled={(!text.trim() && !imageFile) || isSubmitting}
            onClick={handleSubmit}
          >
            {isSubmitting ? "adding..." : "add"}
          </button>
        </div>
      </div>
    </div>
  );
};



const Comment = ({ commment, ...props }) => {
  const {
    postOwnerId = null,
    comment,
    indentLevel = 0,
    activeReplyId,
    onToggleReply,
    dispatch,
    mixId,
    loggedInUserId,
  } = props;

  const {
    id,
    user_id,
    user_details,
    created_at,
    comment: content,
    image,
    replies = [],
    likes,
    dislikes,
    neutral,
    user_reaction = null,
    comment_type,
  } = comment;

  const postStatus = useSelector((state) => state.comments.postStatus);
  const netScore = (likes || 0) - (dislikes || 0);

  const canReply = indentLevel < 1;
  const isReplyBoxOpen = activeReplyId === comment.id;
  const isLowkeyComment = comment_type === "lowkey";

  const hasValidUserDetails =
    user_details && Object.keys(user_details).length > 0;

  const commentAuthorId = user_id?.reference_id;
  const isPostOwner =
    loggedInUserId && postOwnerId && loggedInUserId === postOwnerId;
  const isCommentAuthor =
    loggedInUserId && commentAuthorId && loggedInUserId === commentAuthorId;

  const canDeleteComment = isPostOwner || isCommentAuthor;

  const navigate = useNavigate();

  /* =====================
     DELETE MODAL STATE
  ===================== */
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleAddReply = ({ comment: replyText, imageFile, is_lowkey }) => {
    dispatch(
      createComment({
        mixId,
        comment: replyText,
        parentCommentId: comment.id,
        imageFile,
        is_lowkey,
      })
    );
    onToggleReply(null);
  };

  const handleReaction = (reactionType) => {
    dispatch(
      updateCommentReaction({
        commentId: id,
        reaction: user_reaction === reactionType ? null : reactionType,
      })
    );
  };

  /* =====================
     DELETE HANDLERS
  ===================== */
  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    dispatch(deleteComment({ commentId: comment.id }));
    setShowDeleteModal(false);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  if (!hasValidUserDetails) {
    return null;
  }

  const handleClickProfile = () => {
    if (isLowkeyComment) {
      navigate(`/lowkey-profile/${user_details.user_id}`);
    } else {
      navigate(`/user-profile/${user_details.firebase_id}`);
    }
  };

  return (
    <div
      className={`relative w-full font-inter ${indentLevel > 0 ? "border-l border-brand-almost-black pl-2" : ""
        }`}
      style={{
        marginLeft: `${indentLevel > 0 ? (indentLevel - 1) * 14 + 2 : 0}px`,
      }}
    >
      <div className="flex-col items-start mt-2">
        {/* Header */}
        <div className="flex text-[10px]">
          <img
            src={
              comment_type === "lowkey"
                ? user_details.profile_image
                : user_details.profile
            }
            alt={user_details.name}
            className="flex-shrink-0 w-6 h-6 mr-[5px] rounded-full object-cover"
          />

          <div className="flex items-center gap-1 flex-wrap text-brand-dark-gray mr-auto">
            <span
              className="font-bold text-brand-off-white cursor-pointer"
              onClick={handleClickProfile}
            >
              {isLowkeyComment
                ? `{${user_details.username}}`
                : `<${user_details.username}>`}
            </span>
            <span>•</span>
            <span>
              {user_details.education_status?.degree?.charAt(0)}
              {user_details.college_show}
            </span>
            <span className="mx-1">•</span>
            <span>{formatTimeAgo(created_at)}</span>
          </div>

          {canDeleteComment && (
            <button onClick={handleDelete}>
              <img
                style={{ width: "18px", height: "18px" }}
                src={trashIcon}
                className="button-icon"
                alt="Delete comment"
              />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="flex-grow min-w-0 text-[10px]">
          {image && (
            <img
              src={image}
              alt="Comment attachment"
              className="mt-2 rounded-lg max-w-44 h-auto"
            />
          )}

          {content && (
            <p className="text-brand-off-white text-[14px] mt-1 break-words">
              {content}
            </p>
          )}

          <div className="flex items-center mt-2">
            {canReply && (
              <span
                className="text-brand-off-white font-bold cursor-pointer"
                onClick={() => onToggleReply(comment.id)}
              >
                Reply
              </span>
            )}

            <div className="flex gap-2 ml-auto">
              <div className="flex items-center gap-3 h-6">
                {/* Upvote */}
                <div
                  className={`flex items-center gap-1 cursor-pointer ${user_reaction === "like"
                    ? "text-pink-500"
                    : "text-gray-400"
                    }`}
                  onClick={() => handleReaction("like")}
                >
                  <FiChevronUp size={22} />
                </div>

                {/* Downvote + Net Score */}
                <div
                  className={`flex items-center gap-1 cursor-pointer ${user_reaction === "dislike"
                    ? "text-pink-500"
                    : "text-gray-400"
                    }`}
                  onClick={() => handleReaction("dislike")}
                >
                  {netScore && (
                    <span className="text-xs text-pink-500 font-semibold">
                      {netScore}
                    </span>
                  )}
                  <FiChevronDown size={22} />
                </div>
              </div>
            </div>
          </div>

          {isReplyBoxOpen && (
            <div className="mt-2">
              <NewCommentInput
                placeholder="Write a reply..."
                onSubmit={handleAddReply}
                isSubmitting={postStatus === "loading"}
                userId={loggedInUserId}
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
      </div>

      {/* DELETE CONFIRM POPUP */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="w-[90%] max-w-sm rounded-xl border border-white/20 bg-[#050505] p-5 text-center">
            <h2 className="text-brand-off-white text-lg font-semibold mb-2">
              Delete Comment?
            </h2>

            <p className="text-brand-dark-gray text-sm mb-5">
              This action can’t be undone.
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 rounded-full border border-white text-brand-off-white text-sm hover:bg-white/5 transition"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-full border border-brand-pink text-brand-pink text-sm hover:bg-brand-pink/5 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { Comment };


const CommentsPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { mixId } = useParams();
  const observer = useRef();
  const [activeReplyId, setActiveReplyId] = useState(null);

  const { selectedMix, status: mixStatus } = useSelector(

    (state) => state.mixes
  );

  const {
    comments: flatComments,
    status: commentsStatus,
    page,
    hasMore,
    loadingInitial,
    loadingMore,
  } = useSelector((state) => state.comments);

  const loggedInUserId = useSelector((state) => state.user.userId);

  const isSubmitting = useSelector(
    (state) => state.comments.postStatus === "loading"
  );

  const nestedComments = useMemo(
    () => buildCommentTree(flatComments),
    [flatComments]
  );

  const loadMoreRef = useCallback(
    (node) => {
      if (loadingMore || loadingInitial) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          dispatch(getComments({ mixId, page: page + 1 })); // 👈 increment page
        }
      });

      if (node) observer.current.observe(node);
    },
    [loadingMore, loadingInitial, hasMore, page, mixId, dispatch]
  );

  useEffect(() => {
    if (mixId) {
      dispatch(resetComments());
      dispatch(fetchParticularMix(mixId));
      dispatch(getComments({ mixId, page: 1 }));
    }
    return () => {
      dispatch(resetComments());
    };
  }, [dispatch, mixId]);


  // Instead of skeleton UI, show simple loading text
  const isLoading = mixStatus === "loading" || mixStatus === "idle";
  if (isLoading) {
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

  if (mixStatus === "failed" || !selectedMix) {
    return <div className="min-h-screen ...">Error loading post.</div>;
  }

  const handleToggleReply = (commentId) => {
    setActiveReplyId((prevId) => (prevId === commentId ? null : commentId));
  };

  const handlePostTopLevelComment = ({ comment, imageFile, is_lowkey }) => {
    dispatch(createComment({ mixId, comment, imageFile, is_lowkey }));
  };

  return (
    <div className="min-h-screen bg-black text-brand-off-white flex flex-col w-full mx-auto">
      {/* Page Header */}
      <div className="flex items-center py-5 border-b border-brand-almost-black">
        {/* Cross Button */}
        <RxCross2
          className="h-6 w-6 cursor-pointer mr-[12px] ml-[15px]"
          onClick={() => navigate(-1)}
        />

        {selectedMix.network_id === null ? (
          <h1 className="text-[12px] font-bold">Snippet slays right</h1>
        ) : (
          <div className="flex items-center">
            {/* Profile Image */}
            <img
              src={selectedMix.network_id.image_url}
              alt={selectedMix.network_id.name}
              className="h-6 w-6 rounded-full object-cover mr-3"
            />

            {/* Name + Members */}
            <div>
              <h1 className="text-[10px] font-bold">
                {selectedMix.network_id.name}
              </h1>
              <p className="text-[8px] text-brand-off-white font-bold">
                {selectedMix.network_members_count}
                <span className="text-brand-dark-gray ml-1 font-normal">members</span>
              </p>

            </div>
          </div>
        )}
      </div>

      {/* Main Post */}
      <div className="">
        <PostCard post={selectedMix} isPartial={true} isCommentPage={true} />
      </div>

      <div className="px-[16px] py-[10px] font-bold text-[16px] border-b border-brand-almost-black">
        <h1>thoughts</h1>
      </div>
      {/* Comments Section */}
      <div className="flex-grow overflow-y-auto pb-24 pt-[13px] pl-[14px] pr-[19px]">
        <div className="mb-6">
          <NewCommentInput
            placeholder="Join the conversation..."
            onSubmit={handlePostTopLevelComment}
            isSubmitting={isSubmitting}
            userId={loggedInUserId}
          />
        </div>

        {/* Initial Comments Loading (replaced skeletons) */}
        {commentsStatus === "loading" && flatComments.length === 0 && (
          <div className="text-center text-gray-400 py-6">
            Loading comments...
          </div>
        )}

        {/* Empty State - no comments */}
        {commentsStatus !== "loading" && !loadingInitial && nestedComments.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <img
              src="/snippy-assets/Snippy_hifi.png"
              alt="No comments yet"
              className="w-[150px] h-[150px] object-contain"
            />
            <p className="text-brand-off-white font-semibold text-[13px] mt-3">Be the first to comment.</p>
          </div>
        )}

        {/* Rendered Comments */}
        {nestedComments.map((comment) => (
          <Comment


            postOwnerId={selectedMix?.user_details?.firebase_id ?? null}
            key={comment.id}

            comment={comment}
            dispatch={dispatch}
            mixId={mixId}
            indentLevel={0}
            activeReplyId={activeReplyId}
            onToggleReply={handleToggleReply}
            loggedInUserId={loggedInUserId}
          />
        ))}


        {/* Infinite Scroll Sentinel and Loader (replaced skeleton) */}
        {loadingInitial && (
          <div className="flex justify-center items-center py-6 bg-black min-h-screen">
            <Lottie
              animationData={loadingAnimation}
              loop={true}
              style={{ width: 120, height: 120 }} // Adjust size as needed
            />
          </div>
        )}
        <div ref={loadMoreRef}>
          {loadingMore && <span>Loading more...</span>}
        </div>
      </div>
    </div>
  );
};

export default CommentsPage;
