import React, { useState } from "react";
import Header from "../desktop_components/Header";
import LeftSidebar from "../desktop_components/LeftSidebar";
import RightSidebar from "../desktop_components/RightSidebar";
import { FiChevronUp, FiChevronDown } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";
import { FaRegFlag } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

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
            "https://i.pinimg.com/736x/c0/74/9b/c0749b7cc401421662ae901ec8f9f660.jpg",
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
                    "https://i.pinimg.com/736x/c0/74/9b/c0749b7cc401421662ae901ec8f9f660.jpg",
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
                        "https://i.pinimg.com/736x/c0/74/9b/c0749b7cc401421662ae901ec8f9f660.jpg",
                    },
                    time: "2h",
                    content:
                      "This is level 4 (max logic depth). Reply button is now hidden.",
                    votes: 1,
                    isFlagged: false,
                    replies: [],
                  },
                  {
                    id: "reply1_1_1_1_1",
                    feelLike: "community",
                    user: {
                      name: "community_member_3",
                      id: "c2@iimb",
                      avatar:
                        "https://i.pinimg.com/736x/c0/74/9b/c0749b7cc401421662ae901ec8f9f660.jpg",
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
  content:
    "While walking near my college canteen, I saw a beautiful girl... and I couldn't help but wonder about the complexities of human connection.",
  stats: { nah: 14, hmm: 287, hellYeah: 78, thoughts: 49 },
};

// --- Constants ---
const MAX_DEPTH = 5;
const INDENT_WIDTH = 20;
const MAX_VISUAL_INDENT_LEVEL = 3;

// --- Comment Component ---
const Comment = ({ comment, indentLevel = 0, onAddReply, activeReplyId, onToggleReply }) => {
  const { user, time, content, replies, feelLike } = comment;
  const [currentVotes, setCurrentVotes] = useState(comment.votes);
  const [replyText, setReplyText] = useState("");
  const isReplyBoxOpen = activeReplyId === comment.id;

  const handleUpvote = () => setCurrentVotes((prev) => prev + 1);
  const handleDownvote = () => setCurrentVotes((prev) => prev - 1);

  const handleSendReply = () => {
    if (replyText.trim()) {
      onAddReply(comment.id, replyText.trim());
      setReplyText("");
    }
  };

  const marginLeft = indentLevel > 0
    ? Math.min(indentLevel, MAX_VISUAL_INDENT_LEVEL) * INDENT_WIDTH
    : 5;

  return (
    <div className="relative flex mt-4 w-full">
      {indentLevel > 0 && (
        <div
          className="absolute top-0 w-px bg-gray-700 h-full"
          style={{ left: `${marginLeft - (INDENT_WIDTH / 2)}px` }}
        />
      )}
      <div className="flex-grow min-w-0" style={{ marginLeft: `${marginLeft}px` }}>
        <div className="flex items-center text-sm min-w-0 pr-10 gap-1">
          <div className="flex-shrink-0 w-8 h-8 mr-2">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <div className="flex min-w-0 items-center gap-1 flex-grow">
            <span className="font-semibold text-[#E7E9EA] truncate">
              {feelLike === "user" ? `<${user.name}>` : user.name}
            </span>
            <span className="text-gray-400 text-xs flex-shrink-0">• {time}</span>
            <FaRegFlag className="ml-2 h-4 w-3 text-gray-500 hover:text-[#E7E9EA] cursor-pointer flex-shrink-0" />
          </div>
        </div>
        <p className="text-[#E7E9EA] text-[13px] mt-1 break-words pr-10">{content}</p>
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

// --- Dashboard Component ---
export default function Dashboard() {
  const navigate = useNavigate();
  const [allComments, setAllComments] = useState(initialComments);
  const [isInputExpanded, setIsInputExpanded] = useState(false);
  const [mainReplyText, setMainReplyText] = useState("");
  const [activeReplyId, setActiveReplyId] = useState(null);

  const handleToggleReply = (commentId) => {
    setActiveReplyId((prevId) => (prevId === commentId ? null : commentId));
    if (isInputExpanded) {
      setIsInputExpanded(false);
      setMainReplyText("");
    }
  };

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
    setActiveReplyId(null);
  };

  return (
    <div className="min-h-screen bg-black text-[#E7E9EA] font-sans">
      <Header />
      <div className="flex">
        <LeftSidebar />
        <main className="flex-1 px-10 py-6 overflow-y-auto">
          
          <div className="flex items-center mb-6 w-full">
            <RxCross2
              className="h-6 w-6 text-[#E7E9EA] cursor-pointer mr-4"
              onClick={() => navigate(-1)}
            />
            <h1 className="text-xl font-bold">Snippet Slays Right</h1>
          </div>

          <div className="border-b border-gray-800 pb-4 mb-4 w-full">
            <div className="flex items-center gap-2 text-sm flex-wrap">
              <span className="font-semibold text-[#E7E9EA]">&lt;{mainPost.user.name}&gt;</span>
              <span className="text-[#616161]">@{mainPost.user.id} • {mainPost.time}</span>
              <span className="ml-2 text-xs px-2 py-0.5 rounded-full border border-gray-700">
                {mainPost.label}
              </span>
            </div>
            <p className="text-[#E7E9EA] text-[15px] mt-2 break-words">{mainPost.content}</p>
            <div className="flex justify-between items-center mt-3 text-xs text-gray-400">
              <span>{mainPost.stats.nah} nah, {mainPost.stats.hmm} hmm, {mainPost.stats.hellYeah} hell yeah</span>
              <div className="flex items-center">
                <span className="text-gray-400 font-medium cursor-pointer mr-4">
                  {mainPost.stats.thoughts} thoughts
                </span>
                <button className="text-gray-400 text-xl">•••</button>
              </div>
            </div>
          </div>

          <div className="flex-grow overflow-y-auto pb-24 w-full">

            <div className="p-1 w-full bg-black">
  <div className="max-w-2xl mx-auto flex items-center border border-gray-700 rounded-full px-3 py-2 bg-transparent">
    <textarea
      value={mainReplyText}
      onChange={(e) => setMainReplyText(e.target.value)}
      placeholder="Comment your thought"
      rows={1}
      className="flex-grow bg-transparent text-[#E7E9EA] text-sm resize-none outline-none overflow-hidden"
      style={{
        maxHeight: '150px',
      }}
      onInput={(e) => {
        e.target.style.height = 'auto';
        e.target.style.height = `${e.target.scrollHeight}px`;
      }}
    />
    <button
      className={`ml-2 px-3 py-1 text-sm rounded-full ${
        mainReplyText.trim()
          ? "bg-white text-black"
          : "border border-gray-700 text-gray-400 cursor-not-allowed"
      }`}
      disabled={!mainReplyText.trim()}
      onClick={() => {
        handlePostReply(mainReplyText);
        setMainReplyText("");
      }}
    >
      add
    </button>
  </div>
</div>

            {allComments.map((comment) => (
              <Comment
                key={comment.id}
                comment={comment}
                indentLevel={0}
                onAddReply={handleAddReply}
                activeReplyId={activeReplyId}
                onToggleReply={handleToggleReply}
              />
            ))}
          </div>

         
        </main>
        <RightSidebar />
      </div>
    </div>
  );
}
