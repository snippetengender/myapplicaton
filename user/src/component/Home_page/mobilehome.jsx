import React, { useState, useRef, useEffect } from "react";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate, useParams } from "react-router-dom";
import { FiSearch, FiSend, FiUser } from "react-icons/fi";
import PostCardSkeleton from "./postSkeleton";
import { useMixes } from "../../shared/useMixes";
import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "../../features/userSlice/userSlice";

const PostCard = ({ post }) => {
  const { user, time, label, content, stats } = post;
  return (
    <div className="border-b border-gray-800 p-2">
      <div className="flex justify-between">
        <div className="flex items-center gap-3">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="text-sm">
            {user.profileType === "user" ? (
              <div className="flex items-center flex-wrap gap-1 text-md font-semibold">
                {"<"}
                {user.id}
                {">"}{" "}
                <span className="text-gray-500 font-normal">
                  {user.eduTag} • {time}
                </span>
                <span className="ml-2 text-xs px-2 py-0.5 rounded-full border border-gray-700 text-gray-300">
                  {label}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-white font-semibold">
                {user.name}{" "}
                <span className="text-gray-400 font-normal">• {time}</span>
                <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-gray-900 border border-gray-700">
                  {label}
                </span>
              </div>
            )}
          </div>
        </div>
        <button className="text-gray-400">•••</button>
      </div>

      <p className="text-white text-[14px] mt-3 whitespace-pre-line">
        {content}
      </p>

      <div className="flex justify-between items-center mt-3 text-xs">
        <span className="text-pink-500 font-medium cursor-pointer">
          {stats.thoughts} thoughts
        </span>
        <div className="flex gap-2">
          <button className="px-3 py-1 rounded-full  border border-gray-700 text-gray-400">
            {stats.nah} nah
          </button>
          <button className="px-3 py-1 rounded-full  border border-gray-700 text-gray-400">
            {stats.hmm} hmm
          </button>
          <button className="px-3 py-1 rounded-full  border border-gray-700 text-pink-500">
            {stats.hellYeah} hell yeah
          </button>
        </div>
      </div>
    </div>
  );
};

const Home = () => {
  const userId = useSelector((state) => state.user.userId);
  const dispatch = useDispatch()
  const { posts, loading, error, hasMore, loadMoreRef, isInitialLoad } =
    useMixes();

  const navigate = useNavigate();
  const auth = getAuth();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  const [hasNotification, setHasNotification] = useState(true);
  const [showLogout, setShowLogout] = useState(false);
  // 2. Enhance handleLogout to clear Redux state
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        dispatch(clearUser()); // Clear user data from Redux and localStorage
        console.log("User signed out");
        navigate("/lobby", { replace: true });
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

  // 3. Add useEffect to handle clicks outside the menu to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileMenuRef]);

  return (
    <div className="min-h-screen bg-black text-white p-0 flex flex-col">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-6 px-2">
        <h1 className="text-2xl font-bold">the snippet</h1>
        <div className="flex items-center space-x-6">
          <FiSearch className="h-6 w-6 cursor-pointer" />
          <div className="relative">
            <FiSend className="h-6 w-6 cursor-pointer" />
            {hasNotification && (
              <span
                className="absolute top-0 left-6 block h-2 w-2 rounded-full"
                style={{ backgroundColor: "#F06CB7" }}
              ></span>
            )}
          </div>
          <div ref={profileMenuRef} className="relative">
            <FiUser
              className="h-6 w-6 cursor-pointer"
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} // Toggle menu
            />

            {isProfileMenuOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-neutral-800 border border-neutral-700 rounded-md shadow-lg z-20">
                <ul className="py-1 text-white">
                  <li>
                    <button
                      onClick={() => {
                        if (userId) navigate(`/useronboarding/user-profile/${userId}`);
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-neutral-700"
                    >
                      Profile
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-neutral-700"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Description */}
      <p className="text-gray-400 mb-2 cursor-pointer px-2 ">
        UK's history, finance, and influence stand strong. send stealth{" "}
        <span
          style={{ color: "#F06CB7" }}
          className="font-semibold"
          onClick={() => navigate("/myscreen")}
        >
          bouquet
        </span>{" "}
        and check yours
      </p>

      {/* Tabs */}
      <div className="flex justify-between border-b border-gray-700 mb-2 px-10">
        <div className="px-4 py-2 text-white font-semibold border-b-2 border-white">
          mixes
        </div>
        <div className="px-4 py-2 text-gray-400">events</div>
      </div>

      {/* Feed UI */}
      <div className="flex-grow overflow-y-auto">
        {/* Skeletons for initial load */}
        {isInitialLoad &&
          Array.from({ length: 5 }).map((_, i) => <PostCardSkeleton key={i} />)}

        {/* Render the list of posts */}
        {posts.map((post, index) => (
          <PostCard key={index} post={post} />
        ))}

        {/* Sentinel element to trigger loading more */}
        <div ref={loadMoreRef} />

        {/* Loading indicator for subsequent pages */}
        {loading && !isInitialLoad && <PostCardSkeleton />}

        {error && <p className="text-center text-red-500 p-4">{error}</p>}
        {!hasMore && !isInitialLoad && (
          <p className="text-center text-gray-500 py-4">
            You've reached the end!
          </p>
        )}
      </div>

      {/* Open up now bar */}
      <div className="fixed bottom-0 left-0 right-0 px-2 py-1 z-10">
        <div className="backdrop-blur-md bg-white/1 border border-[#2F3336] rounded-3xl px-4 py-2 flex justify-between items-center">
          <span className="text-white">Open up now</span>
          <button
            className="bg-white/1 border border-[#2F3336] text-white px-4 py-1 rounded-xl hover:bg-white/30"
            onClick={() => navigate("/selecttag")}
          >
            mix
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
