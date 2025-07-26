import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiChevronUp, FiChevronDown } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";
import { FaRegFlag } from "react-icons/fa";

// Sample Comments Data (with nested replies)
const initialComments = [
  {
    id: "comment1",
    feelLike: "user",
    user: {
      name: "tj",
      id: "m@iimb",
      avatar:
        "https://i.pinimg.com/736x/c0/74/9b/c0749b7cc401421662ae901ec8f9f660.jpg",
    },
    time: "6h",
    content:
      "Over the past year, I’ve been diving into software development and product management.",
    votes: 47,
    isFlagged: false,
    replies: [
      {
        id: "reply1_1",
        feelLike: "community",
        user: {
          name: "tj",
          id: "m@iimb",
          avatar:
            "https://i.pinimg.com/736x/c0/74/9b/c0749b7cc401421662ae901ec8f9f660.jpg",
        },
        time: "6h",
        content: "This is a reply at level 1.",
        votes: 30,
        isFlagged: false,
        replies: [
          {
            id: "reply1_1_1",
            feelLike: "user",
            user: {
              name: "tj",
              id: "m@iimb",
              avatar:
                "https://i.pinimg.com/736x/c0/74/9b/c0749b7cc401421662ae901ec8f9f660.jpg",
            },
            time: "6h",
            content: "This is a reply at level 2.",
            votes: 12,
            isFlagged: false,
            replies: [
              {
                id: "reply1_1_1_1",
                feelLike: "user",
                user: {
                  name: "tj",
                  id: "m@iimb",
                  avatar:
                    "https://i.pinimg.com/736x/c0/74/9b/c0749b7cc401421662ae901ec8f9f660.jpg",
                },
                time: "6h",
                content: "This is a reply at level 3 (max visual indent).",
                votes: 5,
                isFlagged: false,
                replies: [
                  {
                    id: "reply1_1_1_1_1",
                    feelLike: "community",
                    user: {
                      name: "tj",
                      id: "m@iimb",
                      avatar:
                        "https://i.pinimg.com/736x/c0/74/9b/c0749b7cc401421662ae901ec8f9f660.jpg",
                    },
                    time: "6h",
                    content:
                      "This is level 4 (max logic depth). Reply button is now hidden.",
                    votes: 1,
                    isFlagged: false,
                    replies: [],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];

// Main Post Data
const mainPost = {
  tag: "question",
  feelLike: "user",
  user: {
    name: "karthikraja",
    id: "m@iimb",
    avatar:
      "https://i.pinimg.com/736x/c0/74/9b/c0749b7cc401421662ae901ec8f9f660.jpg",
  },
  time: "6h",
  label: "confession",
  content: "While walking near my college canteen, I saw a beautiful girl...",
  stats: { nah: 14, hmm: 287, hellYeah: 78, thoughts: 49 },
};

// --- Comment Component ---
const MAX_DEPTH = 5;
const INDENT_WIDTH = 10;
const MAX_VISUAL_INDENT_LEVEL = 3;

const Comment = ({ comment, indentLevel = 0, onAddReply }) => {
  const { user, time, content, replies, feelLike } = comment;
  const [currentVotes, setCurrentVotes] = useState(comment.votes);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState("");

  const handleUpvote = () => setCurrentVotes((prev) => prev + 1);
  const handleDownvote = () => setCurrentVotes((prev) => prev - 1);

  const handleReplyClick = () => {
    setShowReplyInput(!showReplyInput);
    setReplyText("");
  };

  const handleSendReply = () => {
    if (replyText.trim()) {
      onAddReply(comment.id, replyText.trim());
      setReplyText("");
      setShowReplyInput(false);
    }
  };

  const currentVisualIndentLevel = Math.min(
    indentLevel,
    MAX_VISUAL_INDENT_LEVEL
  );
  const marginLeft =
  indentLevel === 0
    ? 5 // level 0 comments have 5px margin
    : Math.min(indentLevel, MAX_VISUAL_INDENT_LEVEL) + INDENT_WIDTH;


  return (
    <div className="relative flex mt-4 w-full">
      {indentLevel > 0 && (
        <div
          className="absolute top-0 w-px bg-gray-700 h-full"
          style={{ left: `${marginLeft - INDENT_WIDTH / 2}px` }}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-grow min-w-0" style={{ marginLeft: `${marginLeft}px` }}>
       <div className="flex items-center text-sm min-w-0 pr-10 gap-1">
  <div className="flex-shrink-0 w-8 h-8 mr-2">
    <img
      src={user.avatar}
      alt={user.name}
      className="w-full h-full rounded-full object-cover"
    />
  </div>

  {/* Username + ID + Time */}
  <div className="flex min-w-0 items-center gap-1 flex-grow">
    <span
      className={`font-semibold text-white truncate`}
      style={{
        fontSize: user.name.length > 12 ? "0.75rem" : "0.875rem", // Shrink if too long
      }}
    >
      {feelLike === "user" ? `<${user.name}>` : user.name}
    </span>
    {feelLike === "user" && (
      <span className="text-gray-400 truncate text-xs flex-shrink-0">
        @{user.id}
      </span>
    )}
    <span className="text-gray-400 text-xs flex-shrink-0">• {time}</span>
    <FaRegFlag className="ml-2 h-4 w-2 text-white flex-shrink-0" />
  </div>

  {/* Flag icon always visible */}
  
</div>



        <p className="text-white text-[12px] mt-1 break-words pr-10">{content}</p>

        <div className="flex items-center text-xs mt-2 pr-10">
          {indentLevel < MAX_DEPTH - 1 && (
            <span
              className="text-pink-500 font-medium mr-4 cursor-pointer"
              onClick={handleReplyClick}
            >
              Reply
            </span>
          )}
        </div>

        {showReplyInput && (
  <div className="mt-4 border border-gray-500 p-3 rounded-lg">
    <textarea
      value={replyText}
      onChange={(e) => {
        setReplyText(e.target.value);
      }}
      maxLength={1000}
      rows={3}
      className="w-full bg-black text-white border-none resize-none outline-none"
      placeholder="Write a reply..."
    />
    <div className="flex justify-between items-center mt-2">
      <span className="text-gray-500 text-xs">{replyText.length}/1000</span>
      <button
        className={`${
          replyText.trim()
            ? "bg-white text-black"
            : "bg-gray-700 text-gray-400 cursor-not-allowed"
        } text-sm font-semibold px-3 py-1 rounded-full`}
        onClick={() => {
          if (replyText.trim()) handleSendReply();
        }}
      >
        add
      </button>
    </div>
  </div>
)}


        <div className="w-full">
          {replies.map((reply) => (
            <Comment
              key={reply.id}
              comment={reply}
              indentLevel={indentLevel + 1}
              onAddReply={onAddReply}
            />
          ))}
        </div>
      </div>

      {/* Voting */}
      <div className="absolute right-0 top-0 flex flex-col items-center flex-shrink-0 z-10">
        <FiChevronUp
          className="h-6 w-6 text-gray-400 cursor-pointer hover:text-white"
          onClick={handleUpvote}
        />
        <span className="text-pink-500 text-base font-semibold">
          {currentVotes}
        </span>
        <FiChevronDown
          className="h-6 w-6 text-gray-400 cursor-pointer hover:text-white"
          onClick={handleDownvote}
        />
      </div>
    </div>
  );
};

// --- Main Page Component ---
const PostDetailsPage = () => {
  const navigate = useNavigate();
  const [allComments, setAllComments] = useState(initialComments);
  const [isInputExpanded, setIsInputExpanded] = useState(false);
const [mainReplyText, setMainReplyText] = useState("");


  const handlePostReply = (text) => {
  const newComment = {
    id: `comment_${Date.now()}`,
    feelLike: "user",
    user: {
      name: "Current User",
      id: "m@app",
      avatar: "https://i.pinimg.com/736x/c0/74/9b/c0749b7cc401421662ae901ec8f9f660.jpg",
    },
    time: "now",
    content: text,
    votes: 0,
    isFlagged: false,
    replies: [],
  };

  setAllComments((prev) => [...prev, newComment]);
};
   
  const addReplyToComment = (commentsArray, parentId, newReply) => {
    return commentsArray.map((comment) => {
      if (comment.id === parentId) {
        return { ...comment, replies: [...comment.replies, newReply] };
      }
      if (comment.replies?.length > 0) {
        return {
          ...comment,
          replies: addReplyToComment(comment.replies, parentId, newReply),
        };
      }
      return comment;
    });
  };

  const handleAddReply = (parentId, content) => {
    const newReply = {
      id: `reply_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      feelLike: "user",
      user: {
        name: "Current User",
        id: "m@app",
        avatar:
          "https://i.pinimg.com/736x/c0/74/9b/c0749b7cc401421662ae901ec8f9f660.jpg",
      },
      time: "now",
      content,
      votes: 0,
      isFlagged: false,
      replies: [],
    };

    setAllComments((prev) => addReplyToComment(prev, parentId, newReply));
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 flex flex-col w-full overflow-hidden">
      {/* Top Bar */}
      <div className="flex items-center mb-6 w-full flex-shrink-0">
        <RxCross2
          className="h-6 w-6 text-white cursor-pointer mr-4"
          onClick={() => navigate(-1)}
        />
        <h1 className="text-xl font-bold text-nowrap overflow-hidden text-ellipsis">
          Snippet Slays Right
        </h1>
      </div>

      {/* Main Post */}
      <div className="border-b border-gray-800 pb-4 mb-4 w-full flex-shrink-0">
        <div className="flex items-center gap-2 text-sm flex-wrap">
          {mainPost.feelLike === "user" ? (
            <>
              <span className="font-semibold text-white text-nowrap">
                &lt;{mainPost.user.name}&gt;
              </span>
              <span className="text-[#616161] text-nowrap">
                @{mainPost.user.id} • {mainPost.time}
              </span>
            </>
          ) : (
            <>
              <span className="font-semibold text-white text-nowrap">
                {mainPost.user.name}
              </span>
              <span className="text-[#616161] text-nowrap">
                • {mainPost.time}
              </span>
            </>
          )}
          <span className="ml-2 text-xs px-2 py-0.5 rounded-full border border-gray-700 flex-shrink-0 text-nowrap">
            {mainPost.label}
          </span>
        </div>
        <p className="text-white text-[15px] mt-2 break-words">
          {mainPost.content}
        </p>
        <div className="flex justify-between items-center mt-3 text-xs text-gray-400 flex-wrap">
          <span className="text-nowrap">
            {mainPost.stats.nah} nah, {mainPost.stats.hmm} hmm and{" "}
            <span className="text-gray-400">
              {mainPost.stats.hellYeah} hell yeah
            </span>
            
          </span>
          
          <div className="flex items-center flex-shrink-0">
            <span className="text-gray-400 font-medium cursor-pointer mr-4 text-nowrap">
              {mainPost.stats.thoughts} thoughts
            </span>
            <button className="text-gray-400 text-xl">•••</button>
          </div>
        </div>
      </div>

      {/* Comments */}
      <div className="flex-grow overflow-y-auto pb-20 w-full">
        <h2 className="text-lg font-semibold mb-4 flex-shrink-0">thoughts</h2>
        {allComments.map((comment) => (
          <Comment
            key={comment.id}
            comment={comment}
            indentLevel={0}
            onAddReply={handleAddReply}
          />
        ))}
      </div>

      {/* Reply Input */}
      <div className="fixed bottom-0 left-0 right-0 p-4 w-full flex-shrink-0 z-10 bg-black border-t border-gray-800">
          {isInputExpanded ? (
          <div className="w-full border border-gray-600 rounded-lg p-3 bg-[#1A1A1A]">
               <textarea
               value={mainReplyText}
               onChange={(e) => setMainReplyText(e.target.value)}
               placeholder="Open up here now"
               maxLength={200}
               rows={3}
               className="w-full bg-transparent text-white text-sm resize-none outline-none"
               />
               <div className="flex justify-between items-center mt-2">
               <span className="text-xs text-gray-400">{mainReplyText.length}/200</span>
               <button
                    className={`${
                    mainReplyText.trim()
                    ? "bg-white text-black"
                    : "bg-gray-700 text-gray-400 cursor-not-allowed"
                    } text-sm font-semibold px-4 py-1 rounded-full`}
                    disabled={!mainReplyText.trim()}
                    onClick={() => {
                    handlePostReply(mainReplyText);
                    setMainReplyText("");
                    setIsInputExpanded(false);
                    }}
               >
                    mix
               </button>
               </div>
          </div>
          ) : (
          <input
               type="text"
               placeholder="Open up here now"
               className="w-full bg-[#1A1A1A] border border-gray-700 text-white text-sm rounded-lg py-3 px-4 focus:outline-none focus:border-pink-500"
               onFocus={() => setIsInputExpanded(true)}
          />
          )}
          </div>

    </div>
  );
};

export default PostDetailsPage;
