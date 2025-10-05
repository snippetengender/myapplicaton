import React from "react";
import Header from "../desktop_components/Header";
import LeftSidebar from "../desktop_components/LeftSidebar";
import RightSidebar from "../desktop_components/RightSidebar";
import PostCardSkeleton from "./postSkeleton";
import { useMixes } from "../../shared/useMixes";

const PostCard = ({ post }) => {
  const { user, time, label, content, stats } = post;

  return (
    <div className="border-b border-gray-800 p-4">
      <div className="flex justify-between">
        <div className="flex items-start gap-3">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
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
                <div className="flex items-center gap-1 text-[#E7E9EA] font-semibold">
                  {user.name}{" "}
                  <span className="text-gray-400 font-normal">• {time}</span>
                  <span className="ml-2 text-xs px-2 py-0.5 rounded-full border border-gray-700">
                    {label}
                  </span>
                </div>
              )}
            </div>
            <p className="text-[#E7E9EA] text-sm mt-2 whitespace-pre-line">{content}</p>
          </div>
        </div>
        <button className="text-gray-400 text-xl font-bold">•••</button>
      </div>
      <div className="flex justify-between items-center mt-3 text-xs">
        <span className="text-pink-500 font-medium cursor-pointer">
          {stats.thoughts} thoughts
        </span>
        <div className="flex gap-2">
          <button className="px-3 py-1 rounded-full border border-gray-700 text-gray-400">
            {stats.nah} nah
          </button>
          <button className="px-3 py-1 rounded-full border border-gray-700 text-gray-400">
            {stats.hmm} hmm
          </button>
          <button className="px-3 py-1 rounded-full border border-gray-700 text-pink-500">
            {stats.hellYeah} hell yeah
          </button>
        </div>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const { posts, loading, error, hasMore, loadMoreRef, isInitialLoad } =
    useMixes();

  return (
    <div className="min-h-screen bg-black text-[#E7E9EA] font-sans">
      <Header />
      <div className="flex">
        <LeftSidebar />

        <main className="flex-1 flex flex-col">
          <div className="flex flex-1 overflow-hidden">
            <section className="flex-1 px-10 py-6 space-y-6 overflow-y-auto">
              <div className="bg-black p-4 rounded-2xl bg-black border border-[#2F3336]">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 bg-[#F06CB7F0] rounded-full mr-3"></div>
                  <input
                    type="text"
                    className="bg-transparent text-[#E7E9EA] text-lg font-semibold placeholder-gray-500 w-full"
                    placeholder="Open up now pal"
                  />
                </div>
                <p className="text-gray-300 text-base">
                  There is no one whos gonna judge you
                </p>
                <p className="text-gray-300 text-base">Rely on us</p>
              </div>
              {isInitialLoad &&
                Array.from({ length: 5 }).map((_, i) => (
                  <PostCardSkeleton key={i} />
                ))}
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
              {/* --- Refined Bottom Section --- */}
              {loading && hasMore && <PostCardSkeleton />}
              {error && <p className="text-center text-red-500">{error}</p>}
              {!loading && hasMore && <div ref={loadMoreRef} />}
              {!hasMore && !isInitialLoad && (
                <p className="text-center text-gray-500 py-4">
                  You've reached the end!
                </p>
              )}
            </section>

            <RightSidebar />
          </div>
        </main>
      </div>
    </div>
  );
}
