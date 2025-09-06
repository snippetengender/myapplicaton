import React, { useState, useEffect } from "react";
import { ArrowLeft, MoreVertical, Info } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserProfile,
  clearUserProfile,
} from "../../features/userSlice/userSlice";

const ProfileSkeleton = () => (
  <div className="min-h-screen bg-black text-white p-4 animate-pulse">
    {/* Header */}
    <div className="flex items-center justify-between px-4 py-6">
      <ArrowLeft className="text-gray-700" size={24} />
      <MoreVertical className="text-gray-700" size={24} />
    </div>

    {/* Profile Section */}
    <div className="px-4">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-20 h-20 rounded-full bg-gray-800 mr-6"></div>
        <div className="flex gap-2 flex-grow">
          <div className="h-8 w-full bg-gray-800 rounded-full"></div>
          <div className="h-8 w-full bg-gray-800 rounded-full"></div>
        </div>
      </div>

      {/* Info */}
      <div className="mb-6 space-y-3">
        <div className="h-8 w-1/2 bg-gray-800 rounded"></div>
        <div className="h-4 w-3/4 bg-gray-800 rounded"></div>
        <div className="h-4 w-full bg-gray-800 rounded"></div>
        <div className="h-4 w-5/6 bg-gray-800 rounded"></div>
        <div className="h-4 w-1/2 bg-gray-800 rounded mt-4"></div>
      </div>
    </div>
  </div>
);

const formatYear = (year) => {
  if (!year) return "";
  const suffix =
    year === 1 ? "st" : year === 2 ? "nd" : year === 3 ? "rd" : "th";
  return `${year}${suffix}`;
};

const formatCollegeTag = (degree, collegeShow) => {
  if (!degree || !collegeShow) return "";
  const degreeInitial = degree.charAt(0).toLowerCase(); // 'b' for bachelors, 'm' for masters
  return `${degreeInitial}${collegeShow}`;
};

const formatBirthday = (day, month) => {
  if (!day || !month) return "Not Set";
  const suffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
      ? "nd"
      : day % 10 === 3 && day !== 13
      ? "rd"
      : "th";
  // Abbreviated months
  const months = [
    "",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${day}${suffix} ${months[month]}`;
};

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("mixes");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userId } = useParams();

  const { data: profile, status } =
    useSelector((state) => state.user.profile) || {};

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserProfile(userId));
    }
    return () => dispatch(clearUserProfile());
  }, [userId, dispatch]);

  if (status === "loading" || status === "idle") {
    return <ProfileSkeleton />;
  }
  if (status === "failed" || !profile) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Error: Could not load profile.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-6">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft className="text-white" size={24} />
        </button>
        <button>
          <MoreVertical className="text-white" size={24} />
        </button>
      </div>

      {/* Profile Section */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-4">
          {/* Profile Image */}
          <div className="w-20 h-20 rounded-full overflow-hidden">
            <img
              src={profile.profile || "..."}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>

          <button
            onClick={() => navigate("/managenetwork")}
            className="px-4 py-1 bg-transparent border border-zinc-600 rounded-full text-sm font-semibold hover:bg-zinc-800"
          >
            Manage Network
          </button>
        </div>
        <div className="mb-6 space-y-2 text-sm">
          <h1 className="text-2xl font-bold capitalize">{profile.name}</h1>
          <p className="text-zinc-400">
            &lt;{profile.username}&gt; • {formatCollegeTag(profile.education_status?.degree, profile.college_show)}
          </p>
          <p className="text-zinc-300">
            Into {profile.interests?.map(i => i.name).join(", ")}
          </p>
          <p className="text-zinc-300 capitalize">
            {formatYear(profile.education_status?.year)} Year • {profile.education_status?.course} • {profile.relationship_status}
          </p>
          <p className="text-zinc-400">
            Cake me on {formatBirthday(profile.birthday?.day, profile.birthday?.month)}
          </p>
          <div className="flex items-center gap-2 pt-1">
            <span className="text-lg font-semibold">{profile.clout || '0'}K</span>
            <span className="text-zinc-400">Snips</span>
            <Info size={14} className="text-zinc-500" />
          </div>
          {profile.clubs?.length > 0 && (
            <p className="text-zinc-300">
              member of <span className="text-[#F06CB7]">{profile.clubs.map(c => c.name).join(", ")}</span>
            </p>
          )}
          <div className="pt-2">
            <p className="text-zinc-400 text-sm">I want</p>
            <p className="text-2xl font-bold">{profile.prompt?.name}</p>
          </div>
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
