import React from "react";
import Header from "../desktop_components/Header";
import LeftSidebar from "../desktop_components/LeftSidebar";
import RightSidebar from "../desktop_components/RightSidebar";


const posts = [
  {
    tag: "question",
    user: {
      profileType: "user",
      name: "karthikraja",
      id: "m@cit",
      avatar: "https://i.pinimg.com/736x/c0/74/9b/c0749b7cc401421662ae901ec8f9f660.jpg",
    },
    time: "6h",
    label: "confession",
    content:
      "While walking near my college canteen, I happened to see a beautiful girl. Her elegance and charm instantly caught my attention, making me pause for a moment.",
    stats: { nah: 14, hmm: 0, hellYeah: 78, thoughts: 29 },
  },
  {
    tag: "question",
    user: {
      profileType: "community",
      name: "something",
      avatar: "https://i.pinimg.com/736x/c0/74/9b/c0749b7cc401421662ae901ec8f9f660.jpg",
    },
    time: "1d",
    label: "question",
    content:
      "Karikada bai Irukarangla ?\n\nOver the past year, I’ve been diving into software development and product management. Most of my projects have been ambitious and complex.",
    stats: { nah: 14, hmm: 14, hellYeah: 78, thoughts: 49 },
  },
  {
    tag: "question",
    user: {
      profileType: "user",
      name: "tj",
      id: "m@iimb",
      avatar: "https://i.pinimg.com/736x/c0/74/9b/c0749b7cc401421662ae901ec8f9f660.jpg",
    },
    time: "6h",
    label: "question",
    content:
      "What should I do when I get my girl friend pregnant? I am really confused, please help me people",
    stats: { nah: 14, hmm: 14, hellYeah: 78, thoughts: 49 },
  },
];

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
                  {user.name}
                  {">"}{" "}
                  <span className="text-gray-500 font-normal">
                    @{user.id} • {time}
                  </span>
                  <span className="ml-2 text-xs px-2 py-0.5 rounded-full border border-gray-700 text-gray-300">
                    {label}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-white font-semibold">
                  {user.name}{" "}
                  <span className="text-gray-400 font-normal">• {time}</span>
                  <span className="ml-2 text-xs px-2 py-0.5 rounded-full border border-gray-700 bg-gray-900">
                    {label}
                  </span>
                </div>
              )}
            </div>
            <p className="text-white text-sm mt-2 whitespace-pre-line">{content}</p>
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
  return (
    <div className="min-h-screen bg-black text-white font-sans">
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
                    className="bg-transparent text-white text-lg font-semibold placeholder-gray-500 w-full"
                    placeholder="Open up now pal"
                  />
                </div>
                <p className="text-gray-300 text-base">There is no one whos gonna judge you</p>
                <p className="text-gray-300 text-base">Rely on us</p>
              </div>

              {posts.map((post, index) => (
                <PostCard key={index} post={post} />
              ))}
            </section>

            <RightSidebar />
          </div>
        </main>
      </div>
    </div>
  );
}
