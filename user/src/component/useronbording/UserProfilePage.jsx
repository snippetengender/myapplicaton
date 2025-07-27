import React, { useState, useEffect } from "react";
import { ArrowLeft, MoreVertical, Info } from "lucide-react";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("mixes");
  const [profile, setProfile] = useState({
    name: "",
    username: "",
    email: "",
    region: "",
    relationshipStatus: "",
    birthday: "",
    gender: "",
    education: "",
    college: "",
    clout: "0",
    promptText: "",
    promptValue: "",
    interests: [],
    profileImage: "",
  });

  useEffect(() => {
  localStorage.clear();
  console.log("LocalStorage cleared after full registration");
}, []);

  // Helper: Format day as 1st, 2nd, 3rd, etc.
  const formatBirthday = (day, month) => {
    const suffix =
      day === 1 || day === 21 || day === 31 ? "st" :
      day === 2 || day === 22 ? "nd" :
      day === 3 || day === 23 ? "rd" : "th";

    const months = [
      "", "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    return `${day}${suffix} ${months[month]}`;
  };

  useEffect(() => {
    // Get data from localStorage
    const userInfo = JSON.parse(localStorage.getItem("snippet_user_info") || "{}");
    const userEducation = JSON.parse(localStorage.getItem("snippet_user_education") || "{}");
    const userInterests = JSON.parse(localStorage.getItem("snippet_user_interests") || "[]");
    const college = JSON.parse(localStorage.getItem("selected_college") || "{}");
    const userPrompt = JSON.parse(localStorage.getItem("snippet_user_prompt") || "{}");

    setProfile({
      name: userInfo.name || "No Name",
      username: localStorage.getItem("snippet_username") || "unknown",
      email: localStorage.getItem("snippet_email") || "No Email",
      region: localStorage.getItem("snippet_region") || "Unknown",
      relationshipStatus: localStorage.getItem("snippet_relationship_status") || "Single",
      birthday: userInfo.birthday
        ? formatBirthday(userInfo.birthday.day, userInfo.birthday.month)
        : "Not set",
      gender: userInfo.gender || "Unknown",
      education: userEducation.course
        ? `${userEducation.degree} ${userEducation.course}, Year ${userEducation.year}`
        : "Not set",
      college: college.name || "Unknown College",
      clout: localStorage.getItem("snippet_clout") || "0",
      promptText: userPrompt.text || "Prompt",
      promptValue: userPrompt.name || "No prompt",
      interests: userInterests.map((i) => i.name),
      profileImage:
        localStorage.getItem("snippet_profile_image") ||
        "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
    });
  }, []);

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
        <div className="flex items-center gap-4 mb-4">
          <div className="w-20 h-20 rounded-full overflow-hidden mr-6">
            <img
              src={profile.profileImage}
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
          <h1 className="text-2xl font-bold capitalize">{profile.name}</h1>
          <p className="text-sm text-zinc-400 mb-2">
            &lt;{profile.username}&gt; • {profile.college}
          </p>
          <div className="mb-2 flex gap-2">
            <p className="text-sm">Into</p>
            <p className="text-sm">
              {profile.interests.length > 0
                ? profile.interests.join(", ")
                : "No interests yet"}
            </p>
          </div>
          <p className="text-sm text-zinc-300 mb-2">
            {profile.education} • {profile.region}
          </p>
          
          <p className="text-sm text-zinc-300 mb-2 capitalize">
            {profile.relationshipStatus}
          </p>
          <p className="text-sm text-zinc-400 mb-3">
            Cake me on {profile.birthday}
          </p>

          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg font-semibold">{profile.clout}</span>
            <span className="text-sm text-zinc-400">Clout</span>
            <Info size={14} className="text-zinc-500" />
          </div>

          <p className="text-sm text-zinc-400 mb-4">
            {profile.promptText}: <span className="text-[#F06CB7]">{profile.promptValue}</span>
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-zinc-800 mb-6">
          <button
            onClick={() => setActiveTab("mixes")}
            className={`flex-1 py-3 text-sm font-medium ${
              activeTab === "mixes"
                ? "text-white border-b-2 border-white"
                : "text-zinc-400"
            }`}
          >
            mixes
          </button>
          <button
            onClick={() => setActiveTab("stuffs")}
            className={`flex-1 py-3 text-sm font-medium ${
              activeTab === "stuffs"
                ? "text-white border-b-2 border-white"
                : "text-zinc-400"
            }`}
          >
            stuffs
          </button>
        </div>
      </div>
    </div>
  );
}
