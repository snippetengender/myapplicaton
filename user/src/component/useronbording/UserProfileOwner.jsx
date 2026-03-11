import React, { useState, useEffect, useRef, useCallback } from "react";
import { ArrowLeft, MoreVertical, Info } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserProfile,
  clearUserProfile,
} from "../../features/userSlice/userSlice";
import { getAuth, signOut } from "firebase/auth";
import { clearUser } from "../../features/userSlice/userSlice";
import { fetchParticularUserMix, resetUserMixes } from "../../features/mixes/mixSlice";
import { PostCard } from "../mix/PostCard";
import { MixCardSkeleton } from "../lowkey/LowKeyProfile";
import profileBanner from "../assets/banner.png";
import backArrow from "../assets/BackArrow.svg";
import wip from "../assets/Snippy_with_Sign.png";
import BottomTabs from "../shared/BottomTabs";

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

export default function ProfileOwner() {
  const [activeTab, setActiveTab] = useState("mixes");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userId } = useParams();

  const { data: profile, status } =
    useSelector((state) => state.user.profile) || {};

  const { posts, mixesStatus, mixesError, page, hasMore } = useSelector(
    (state) => ({
      posts: state.mixes.userPosts,
      mixesStatus: state.mixes.userPostsStatus,
      mixesError: state.mixes.userPostsError,
      page: state.mixes.userPostsPage,
      hasMore: state.mixes.userPostsHasMore,
    })
  );

  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const auth = getAuth();

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        dispatch(clearUser());
        navigate("/lobby", { replace: true });
      })
      .catch((error) => console.error("Error signing out:", error));
  };

  const handleMockDeleteConfirm = () => {
    // Requirements stated: Note : Delete Account is a mock up
    // "When they click confirm let us logout them"
    handleLogout();
  };

  const observer = useRef();
  const loadMoreRef = useCallback(
    (node) => {
      if (mixesStatus === "loading" || !userId) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && userId) {
          dispatch(fetchParticularUserMix({ userId, page }));
        }
      });

      if (node) observer.current.observe(node);
    },
    [mixesStatus, hasMore, page, userId, dispatch]
  );

  const isInitialLoad = mixesStatus === "loading" && posts.length === 0;

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserProfile(userId));

    }
    return () => {
      dispatch(resetUserMixes());
    };
  }, [userId, dispatch]);

  useEffect(() => {
    if (userId && posts.length === 0) {
      dispatch(fetchParticularUserMix({ userId, page: 1 }));
    }
  }, [userId, posts.length, dispatch]);



  if (status === "loading" || status === "idle") {
    return (
      <div className="relative min-h-screen">
        <ProfileSkeleton />
        <BottomTabs userId={userId} />
      </div>
    );
  }
  if (status === "failed" || !profile) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center relative">
        <div>Error: Could not load profile.</div>
        <BottomTabs userId={userId} />
      </div>
    );
  }

  const handleLowKeyClick = () => {
    if (profile && profile.lowkey_profile) {
      navigate(`/lowkey-profile/${profile.lowkey_profile.user_id}`);
    } else {
      navigate('/lowkey');
    }
  };


  return (
    <div className="min-h-screen bg-black text-[#E7E9EA]">
      {/* Profile banner */}
      <div className="relative">
        <img
          src={profileBanner}
          alt="Profile banner"
          className="w-full h-full"
        />
        <div className="absolute bottom-[17px] left-[16px] flex items-center justify-center bg-white/30 rounded-full w-[39px] h-[38px] ">
          <button onClick={() => navigate(-1)} className="-left-1">
            <img
              src={backArrow}
              alt="Back to Home page"
            />
          </button>
        </div>
      </div>

      {/* Profile Section */}
      <div className="">
        <div className="py-[14px] px-[16px]">
          <div className="flex items-start justify-between mb-3">
            {/* Profile Image */}
            <div className="w-[85px] h-[85px] rounded-full overflow-hidden">
              <img
                src={profile.profile || "..."}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Buttons */}
            <div className="flex text-[13px] font-normal gap-2">
              <button
                onClick={handleLowKeyClick}
                className="bg-transparent border border-zinc-600 rounded-full hover:bg-zinc-800 px-[10px] pt-[4px] pb-[6px]"
              >
                lowkey
              </button>
              <button
                onClick={() => setShowSettingsModal(true)}
                className="bg-transparent border border-zinc-600 rounded-full hover:bg-zinc-800 px-[10px] pt-[4px] pb-[6px]"
              >
                logout or delete account
              </button>
              {/* <button
                onClick={() => navigate("/managenetwork")}
                className="bg-transparent border border-zinc-600 rounded-full hover:bg-zinc-800 px-[10px] pt-[4px] pb-[6px]"
              >
                manage <span className="text-brand-pink">network</span>
              </button> */}
            </div>
          </div>
          <div className="space-y-1 text-sm">
            <h1 className="text-[20px] font-bold capitalize">{profile.name}</h1>
            <p className="text-brand-dark-gray">
              &lt;{profile.username}&gt; •{" "}
              {formatCollegeTag(
                profile.education_status?.degree,
                profile.college_show
              )}
            </p>
            <p className="text-zinc-300">
              Into {profile.interests?.map((i) => i.name).join(", ")}
            </p>
            <p className="text-zinc-300 capitalize">
              {formatYear(profile.education_status?.year)} Year •{" "}
              {profile.education_status?.course} • {profile.relationship_status}
            </p>
            <p className="text-brand-dark-gray">
              Cake me on{" "}
              {formatBirthday(profile.birthday?.day, profile.birthday?.month)}
            </p>
            <div className="flex items-center gap-1 pt-1">
              <span className="text-[14px] font-bold">
                {profile.clouts || "0"}
              </span>
              <span className="text-brand-dark-gray">Clout</span>
              <Info size={14} className="text-brand-dark-gray" />
            </div>
            {profile.clubs?.length > 0 && (
              <p className="text-zinc-300">
                member of{" "}
                <span className="text-brand-pink">
                  {profile.clubs.map((c) => c.name).join(", ")}
                </span>
              </p>
            )}
            <div className="flex gap-1">
              {/* <p className="text-brand-dark-gray text-sm">I want</p> */}
              <p className="text-sm font-normal">{profile.prompt?.name}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700">
          <button
            className={`relative flex-1 py-3 text-center text-[14px] font-semibold ${activeTab === "mixes"
              ? "text-brand-off-white"
              : "text-brand-dark-gray"
              }`}
            onClick={() => setActiveTab("mixes")}
          >
            mixes
            {activeTab === "mixes" && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-[2px] bg-white rounded"></span>
            )}
          </button>
          <button
            className={`relative flex-1 py-3 text-center text-[14px] font-semibold ${activeTab === "stuffs"
              ? "text-brand-off-white"
              : "text-brand-dark-gray"
              }`}
            onClick={() => setActiveTab("stuffs")}
          >
            stuffs
            {activeTab === "stuffs" && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-[2px] bg-white rounded"></span>
            )}
          </button>
        </div>

        {/* Content Area */}
        <div className="">
          {activeTab === "mixes" && (
            <>
              {isInitialLoad && <MixCardSkeleton />}

              {posts.map((post) => (
                <PostCard key={post.id} post={post} userId={userId} />
              ))}

              {/* Sentinel element to trigger loading more */}
              <div ref={loadMoreRef} />

              {/* Loading indicator for subsequent pages */}
              {mixesStatus === "loading" && !isInitialLoad && (
                <MixCardSkeleton />
              )}

              {mixesError && (
                <p className="text-center text-red-500">{mixesError}</p>
              )}

              {!hasMore && posts.length > 0 && (
                <p className="text-center text-gray-500 py-4">
                  You've reached the end!
                </p>
              )}
            </>
          )}

          {activeTab === "stuffs" && (
            <div className="flex w-full h-full justify-center items-center p-5">
              <img
                src={wip}
                alt="Work in progress"
                className="w-[117px]"
              />
            </div>
          )}
        </div>
      </div>
      <BottomTabs userId={userId} />

      {/* Settings Modal (Logout / Delete Account) */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/70 px-4 pb-8 sm:pb-0">
          <div className="w-full max-w-sm rounded-[24px] bg-[#1a1a1a] p-6 shadow-xl border border-white/10 animate-slide-up sm:animate-none">
            <h2 className="text-brand-off-white text-xl font-bold mb-6 text-center">
              Account Settings
            </h2>
            
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  setShowSettingsModal(false);
                  handleLogout();
                }}
                className="w-full py-4 rounded-xl border border-white/20 text-brand-off-white text-sm font-semibold hover:bg-white/5 transition-colors"
              >
                Logout
              </button>
              
              <button
                onClick={() => {
                  setShowSettingsModal(false);
                  setShowDeleteConfirmModal(true);
                }}
                className="w-full py-4 rounded-xl border border-brand-pink/50 text-brand-pink text-sm font-semibold hover:bg-brand-pink/10 transition-colors"
              >
                Delete Account
              </button>
              
              <button
                onClick={() => setShowSettingsModal(false)}
                className="w-full py-3 mt-2 text-brand-dark-gray text-sm font-medium hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-sm rounded-[24px] bg-[#1a1a1a] p-6 shadow-xl border border-red-500/20">
            <h2 className="text-brand-off-white text-xl font-bold mb-4">
              Delete Account?
            </h2>
            
            <p className="text-brand-dark-gray text-sm mb-6 leading-relaxed">
              Okay, your account will be deleted but make sure that you dont login in 30 days and if you login again account will not be deleted.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirmModal(false)}
                className="flex-1 py-3 rounded-xl border border-white/20 text-brand-off-white text-sm font-semibold hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleMockDeleteConfirm}
                className="flex-1 py-3 rounded-xl bg-red-600/90 text-white text-sm font-semibold hover:bg-red-500 transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
