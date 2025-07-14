import React, { useState } from 'react';
import { ArrowLeft, MoreVertical, Heart, MessageCircle,Info } from 'lucide-react';



export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('mixes');

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-6">
        <button>
          <ArrowLeft className="text-white" size={24} />
        </button>
        <button>
          <MoreVertical className="text-white" size={24} />
        </button>
      </div>

      {/* Profile Section */}
      <div className="px-4">
        {/* Profile Image and Actions */}
        <div className="flex items-center gap-4 mb-4 ">
          <div className="w-20 h-20 rounded-full overflow-hidden mr-6">
            <img 
              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex gap-2">
            <button className="px-2 py-1 bg-transparent border border-zinc-600 rounded-full text-sm ml-12">
              send <span className="text-[#F06CB7]">bouquet</span>
            </button>
            <button className="px-2 py-1 bg-transparent border border-zinc-600 rounded-full text-sm">
              pal up
            </button>
          </div>
        </div>

        {/* Profile Info */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Thanajayan</h1>
          <p className="text-sm text-zinc-400 mb-2">
           &lt;tj&gt; • b@jitm
          </p>
          <p className="text-sm text-zinc-300 mb-2">Into Bikes, Music, Travel</p>
          <p className="text-sm text-zinc-300 mb-2">3rd Year  Mechanical Engineering  Single</p>
          <p className="text-sm text-zinc-400 mb-3">Cake me on 19th Aug</p>
          
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg font-semibold">45K</span>
            <span className="text-sm text-zinc-400">Clout</span>
            <Info size={14} className="text-zinc-500" />

          </div>
          
          <p className="text-sm text-zinc-400 mb-4">
            member of <span className="text-[#F06CB7]">hyperloop</span>
          </p>
          
          <div className="mb-6">
            <p className="text-sm text-zinc-400 mb-1">I want</p>
            <h2 className="text-3xl font-bold">to be a great mann</h2>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-zinc-800 mb-6">
          <button
            onClick={() => setActiveTab('mixes')}
            className={`flex-1 py-3 text-sm font-medium ${
              activeTab === 'mixes'
                ? 'text-white border-b-2 border-white'
                : 'text-zinc-400'
            }`}
          >
            mixes
          </button>
          <button
            onClick={() => setActiveTab('stuffs')}
            className={`flex-1 py-3 text-sm font-medium ${
              activeTab === 'stuffs'
                ? 'text-white border-b-2 border-white'
                : 'text-zinc-400'
            }`}
          >
            stuffs
          </button>
        </div>

        {/* Content */}
        <div className="space-y-2">
          {/* Post Item */}
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
              <img 
                src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm text-[#F06CB7]">&lt;tj&gt;</span>
                <span className="text-sm text-zinc-400">• m@jitm</span>
                <span className="text-sm text-zinc-400">• 6h</span>
                <span className="text-sm text-zinc-400">question</span>
                <button className="ml-auto">
                  <MoreVertical className="text-zinc-400" size={16} />
                </button>
              </div>
              <p className="text-sm text-white mb-3 leading-relaxed">
                What should I do when I get my girl friend pregnant? I am really confused, please help me people
              </p>
              <div className="flex  gap-1 text-xs text-zinc-400 mb-10">
                <span className="px-2 py-1 bg-zinc-800 rounded-full">14 nah</span>
                <span className="px-2 py-1 bg-zinc-800 rounded-full">287 hmm</span>
                <span className="px-2 py-1 bg-zinc-800 rounded-full">78 hell yeah</span>
                <span className="px-2 py-1 bg-zinc-800 rounded-full">49 thoughts</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}