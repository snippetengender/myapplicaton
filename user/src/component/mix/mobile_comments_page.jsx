import React, { useState } from "react";
// react-router-dom is not available in this environment, so we'll mock useNavigate
// import { useNavigate } from "react-router-dom";
import { FiChevronUp, FiChevronDown } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";
import { FaRegFlag } from "react-icons/fa";

// Mock useNavigate hook
const useNavigate = () => (path) => {
  console.log(`Navigating to: ${path}`);
  // In a real app, this would change the URL.
  // Here, we'll just log it. If path is -1, it's like hitting the back button.
  if (path === -1) {
    console.log("Navigating back.");
  }
};


// --- Sample Data ---

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
          name: "community_member",
          id: "c@iimb",
          avatar:
            "https://i.pinimg.com/736x/8e/15/3a/8e153a858a7f05f24290a36a28535492.jpg",
        },
        time: "5h",
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
            time: "4h",
            content: "This is a reply at level 2.",
            votes: 12,
            isFlagged: false,
            replies: [
              {
                id: "reply1_1_1_1",
                feelLike: "user",
                user: {
                  name: "another_user",
                  id: "a@iimb",
                  avatar:
                    "https://i.pinimg.com/736x/9d/3b/a1/9d3ba1b3a393d18ba4b38b809bf8283a.jpg",
                },
                time: "3h",
                content: "This is a reply at level 3 (max visual indent).",
                votes: 5,
                isFlagged: false,
                replies: [
                  {
                    id: "reply1_1_1_1_1",
                    feelLike: "community",
                    user: {
                      name: "community_member_2",
                      id: "c2@iimb",
                      avatar:
                        "https://i.pinimg.com/736x/4a/3c/7b/4a3c7b79e5a2a2e9b9b43b40e7a3e3f1.jpg",
                    },
                    time: "2h",
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
  content: "While walking near my college canteen, I saw a beautiful girl... and I couldn't help but wonder about the complexities of human connection. It made me think about how fleeting moments can leave such a lasting impression. Has anyone else experienced something similar?",
  stats: { nah: 14, hmm: 287, hellYeah: 78, thoughts: 49 },
};


// --- Constants ---
const MAX_DEPTH = 5;
const INDENT_WIDTH = 20; // Increased for better visibility
const MAX_VISUAL_INDENT_LEVEL = 3;


// --- Comment Component ---
const Comment = ({ comment, indentLevel = 0, onAddReply, activeReplyId, onToggleReply }) => {
  const { user, time, content, replies, feelLike } = comment;
  const [currentVotes, setCurrentVotes] = useState(comment.votes);
  
  // State for the reply text is still local to each comment
  const [replyText, setReplyText] = useState("");

  // Determine if this specific component's reply box should be open
  const isReplyBoxOpen = activeReplyId === comment.id;

  const handleUpvote = () => setCurrentVotes((prev) => prev + 1);
  const handleDownvote = () => setCurrentVotes((prev) => prev - 1);

  const handleSendReply = () => {
    if (replyText.trim()) {
      onAddReply(comment.id, replyText.trim());
      setReplyText("");
      // The parent component will handle closing the input box
    }
  };
  
  // --- FIXED INDENTATION LOGIC ---
  // The ternary operator was removed to make the indentation consistent.
  // Now, the margin is a direct multiple of the indent level,
  // ensuring each level indents by the same amount from its parent.
  const marginLeft = Math.min(indentLevel, MAX_VISUAL_INDENT_LEVEL) + INDENT_WIDTH;


  return (
    // CHANGE: Added `items-start` to align the content block and voting block to the top.
    <div className="relative flex items-start mt-4 w-full">
      {/* Vertical connector line for indented replies */}
      {indentLevel > 0 && (
        <div
          className="absolute top-0 w-px bg-gray-700 h-full"
          style={{ left: `${marginLeft - (INDENT_WIDTH / 2)}px` }}
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
              onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/40x40/222/fff?text=U'; }}
            />
          </div>

          {/* Username + ID + Time */}
          <div className="flex min-w-0 items-center gap-1 flex-grow">
            <span
              className={`font-semibold text-[#E7E9EA] truncate`}
              style={{ fontSize: user.name.length > 12 ? "0.75rem" : "0.875rem" }}
            >
              {feelLike === "user" ? `<${user.name}>` : user.name}
            </span>
            {feelLike === "user" && (
              <span className="text-gray-400 truncate text-xs flex-shrink-0">
                @{user.id}
              </span>
            )}
            <span className="text-gray-400 text-xs flex-shrink-0">• {time}</span>
            <FaRegFlag className="ml-2 h-4 w-3 text-gray-500 hover:text-[#E7E9EA] cursor-pointer flex-shrink-0" />
          </div>
        </div>

        <p className="text-[#E7E9EA] text-[12px] mt-1 break-words pr-10">{content}</p>

        <div className="flex items-center text-xs mt-2 pr-10">
          {indentLevel < MAX_DEPTH - 1 && (
            <span
              className="text-pink-500 font-medium mr-4 cursor-pointer"
              onClick={() => onToggleReply(comment.id)}
            >
              Reply
            </span>
          )}
        </div>

        {/* Reply input box, shown based on prop from parent */}
        {isReplyBoxOpen && (
          <div className="mt-4 border border-gray-500 p-3 rounded-lg bg-[#1C1C1C]">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              maxLength={1000}
              rows={3}
              className="w-full bg-transparent text-[#E7E9EA] border-none resize-none outline-none"
              placeholder="Write a reply..."
              autoFocus
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-gray-500 text-xs">{replyText.length}/1000</span>
              <button
                className={`text-sm font-semibold px-3 py-1 rounded-full ${
                  replyText.trim()
                    ? "bg-white text-black"
                    : "bg-gray-700 text-gray-400 cursor-not-allowed"
                }`}
                onClick={handleSendReply}
                disabled={!replyText.trim()}
              >
                add
              </button>
            </div>
          </div>
        )}

        {/* Recursively render replies */}
        <div className="w-full">
          {replies.map((reply) => (
            <Comment
              key={reply.id}
              comment={reply}
              indentLevel={indentLevel + 1}
              onAddReply={onAddReply}
              activeReplyId={activeReplyId}
              onToggleReply={onToggleReply}
            />
          ))}
        </div>
      </div>

      {/* Voting */}
      <div className="absolute right-0 top-0 flex flex-col items-center flex-shrink-0 z-10">
        <FiChevronUp
          className="h-6 w-6 text-gray-400 cursor-pointer hover:text-[#E7E9EA]"
          onClick={handleUpvote}
        />
        <span className="text-pink-500 text-base font-semibold">
          {currentVotes}
        </span>
        <FiChevronDown
          className="h-6 w-6 text-gray-400 cursor-pointer hover:text-[#E7E9EA]"
          onClick={handleDownvote}
        />
      </div>
    </div>
  );
};


// --- Main Page Component ---
const App = () => {
  const navigate = useNavigate();
  const [allComments, setAllComments] = useState(initialComments);
  const [isInputExpanded, setIsInputExpanded] = useState(false);
  const [mainReplyText, setMainReplyText] = useState("");
  
  // STATE LIFT: This state now controls which comment's reply box is open.
  // `null` means no reply box is open.
  const [activeReplyId, setActiveReplyId] = useState(null);

  // STATE LIFT: Handler to open/close a specific comment's reply box.
  const handleToggleReply = (commentId) => {
    // If the clicked reply is already open, close it. Otherwise, open it.
    setActiveReplyId(prevId => (prevId === commentId ? null : commentId));
    // When opening a comment reply, ensure the main post reply is closed.
    if (isInputExpanded) {
        setIsInputExpanded(false);
        setMainReplyText("");
    }
  };

  // Handler for adding a top-level comment to the main post
  const handlePostReply = (text) => {
    const newComment = {
      id: `comment_${Date.now()}`,
      feelLike: "user",
      user: {
        name: "CurrentUser",
        id: "me@app",
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
   
  // Recursive function to find and add a reply to a nested comment
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

  // Handler for adding a reply to a specific comment
  const handleAddReply = (parentId, content) => {
    const newReply = {
      id: `reply_${Date.now()}`,
      feelLike: "user",
      user: {
        name: "CurrentUser",
        id: "me@app",
        avatar: "https://i.pinimg.com/736x/c0/74/9b/c0749b7cc401421662ae901ec8f9f660.jpg",
      },
      time: "now",
      content,
      votes: 0,
      isFlagged: false,
      replies: [],
    };

    setAllComments((prev) => addReplyToComment(prev, parentId, newReply));
    // STATE LIFT: After successfully adding a reply, close the input box.
    setActiveReplyId(null);
  };

  return (
    <div className="min-h-screen bg-black text-[#E7E9EA] p-4 flex flex-col w-full max-w-2xl mx-auto overflow-hidden">
      {/* Top Bar */}
      <div className="flex items-center mb-6 w-full flex-shrink-0">
        <RxCross2
          className="h-6 w-6 text-[#E7E9EA] cursor-pointer mr-4"
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
              <span className="font-semibold text-[#E7E9EA] text-nowrap">
                &lt;{mainPost.user.name}&gt;
              </span>
              <span className="text-[#616161] text-nowrap">
                @{mainPost.user.id} • {mainPost.time}
              </span>
            </>
          ) : (
            <>
              <span className="font-semibold text-[#E7E9EA] text-nowrap">
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
        <p className="text-[#E7E9EA] text-[15px] mt-2 break-words">
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

      {/* Comments Section */}
      <div className="flex-grow overflow-y-auto pb-24 w-full">
        <h2 className="text-lg font-semibold mb-4 flex-shrink-0">thoughts</h2>
        {allComments.map((comment) => (
          <Comment
            key={comment.id}
            comment={comment}
            indentLevel={0}
            onAddReply={handleAddReply}
            // Pass down the state and handler to each comment
            activeReplyId={activeReplyId}
            onToggleReply={handleToggleReply}
          />
        ))}
      </div>

      {/* Main Reply Input - Conditionally rendered */}
      {/* This entire block is now hidden if a comment's reply box is open */}
      {activeReplyId === null && (
        <div className="fixed bottom-0 left-0 right-0 p-4 w-full flex-shrink-0 z-20 bg-black border-t border-gray-800">
            <div className="max-w-2xl mx-auto">
                {isInputExpanded ? (
                <div className="w-full border border-gray-600 rounded-lg p-3 bg-[#1A1A1A]">
                    <textarea
                        value={mainReplyText}
                        onChange={(e) => setMainReplyText(e.target.value)}
                        placeholder="Open up here now"
                        maxLength={200}
                        rows={3}
                        className="w-full bg-transparent text-[#E7E9EA] text-sm resize-none outline-none"
                        autoFocus
                    />
                    <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-400">{mainReplyText.length}/200</span>
                        <button
                            className={`text-sm font-semibold px-4 py-1 rounded-full ${
                                mainReplyText.trim()
                                ? "bg-white text-black"
                                : "bg-gray-700 text-gray-400 cursor-not-allowed"
                            }`}
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
                    className="w-full bg-[#1A1A1A] border border-gray-700 text-[#E7E9EA] text-sm rounded-lg py-3 px-4 focus:outline-none focus:border-pink-500"
                    onFocus={() => setIsInputExpanded(true)}
                    value={mainReplyText} // Keep value to prevent loss on blur
                    readOnly // Prevent typing in collapsed state
                />
                )}
            </div>
        </div>
      )}
    </div>
  );
};

export default App;
