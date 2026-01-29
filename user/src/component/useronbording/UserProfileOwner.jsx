import React, { useState, useEffect, useRef, useCallback } from "react";
import { ArrowLeft, MoreVertical, Info } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserProfile,
  clearUserProfile,
} from "../../features/userSlice/userSlice";
import { fetchParticularUserMix, resetUserMixes } from "../../features/mixes/mixSlice";
import { PostCard } from "../mix/PostCard";
import { MixCardSkeleton } from "../lowkey/LowKeyProfile";
import profileBanner from "../assets/banner.png";
import backArrow from "../assets/BackArrow.svg";
import wip from "../assets/Snippy_with_Sign.png";
import renameIcon from "../assets/edit.svg"

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
    return <ProfileSkeleton />;
  }
  if (status === "failed" || !profile) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Error: Could not load profile.
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
                onClick={() => navigate("/managenetwork")}
                className="bg-transparent border border-zinc-600 rounded-full hover:bg-zinc-800 px-[10px] pt-[4px] pb-[6px]"
              >
                manage <span className="text-brand-pink">network</span>
              </button>
              <div className="w-[28px] h-[28px] ">
                <button onClick={() => navigate("/useronboarding/edit-profile")}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="28px" height="28px" viewBox="0 -0.5 25 25" fill="none">
                    <path fillRule="evenodd" clipRule="evenodd" d="M17.7 5.12758L19.266 6.37458C19.4172 6.51691 19.5025 6.71571 19.5013 6.92339C19.5002 7.13106 19.4128 7.32892 19.26 7.46958L18.07 8.89358L14.021 13.7226C13.9501 13.8037 13.8558 13.8607 13.751 13.8856L11.651 14.3616C11.3755 14.3754 11.1356 14.1751 11.1 13.9016V11.7436C11.1071 11.6395 11.149 11.5409 11.219 11.4636L15.193 6.97058L16.557 5.34158C16.8268 4.98786 17.3204 4.89545 17.7 5.12758Z" stroke="#E7E9EA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12.033 7.61865C12.4472 7.61865 12.783 7.28287 12.783 6.86865C12.783 6.45444 12.4472 6.11865 12.033 6.11865V7.61865ZM9.23301 6.86865V6.11865L9.23121 6.11865L9.23301 6.86865ZM5.50001 10.6187H6.25001L6.25001 10.617L5.50001 10.6187ZM5.50001 16.2437L6.25001 16.2453V16.2437H5.50001ZM9.23301 19.9937L9.23121 20.7437H9.23301V19.9937ZM14.833 19.9937V20.7437L14.8348 20.7437L14.833 19.9937ZM18.566 16.2437H17.816L17.816 16.2453L18.566 16.2437ZM19.316 12.4937C19.316 12.0794 18.9802 11.7437 18.566 11.7437C18.1518 11.7437 17.816 12.0794 17.816 12.4937H19.316ZM15.8863 6.68446C15.7282 6.30159 15.2897 6.11934 14.9068 6.2774C14.5239 6.43546 14.3417 6.87397 14.4998 7.25684L15.8863 6.68446ZM18.2319 9.62197C18.6363 9.53257 18.8917 9.13222 18.8023 8.72777C18.7129 8.32332 18.3126 8.06792 17.9081 8.15733L18.2319 9.62197ZM8.30001 16.4317C7.8858 16.4317 7.55001 16.7674 7.55001 17.1817C7.55001 17.5959 7.8858 17.9317 8.30001 17.9317V16.4317ZM15.767 17.9317C16.1812 17.9317 16.517 17.5959 16.517 17.1817C16.517 16.7674 16.1812 16.4317 15.767 16.4317V17.9317ZM12.033 6.11865H9.23301V7.61865H12.033V6.11865ZM9.23121 6.11865C6.75081 6.12461 4.7447 8.13986 4.75001 10.6203L6.25001 10.617C6.24647 8.96492 7.58269 7.62262 9.23481 7.61865L9.23121 6.11865ZM4.75001 10.6187V16.2437H6.25001V10.6187H4.75001ZM4.75001 16.242C4.7447 18.7224 6.75081 20.7377 9.23121 20.7437L9.23481 19.2437C7.58269 19.2397 6.24647 17.8974 6.25001 16.2453L4.75001 16.242ZM9.23301 20.7437H14.833V19.2437H9.23301V20.7437ZM14.8348 20.7437C17.3152 20.7377 19.3213 18.7224 19.316 16.242L17.816 16.2453C17.8195 17.8974 16.4833 19.2397 14.8312 19.2437L14.8348 20.7437ZM19.316 16.2437V12.4937H17.816V16.2437H19.316ZM14.4998 7.25684C14.6947 7.72897 15.0923 8.39815 15.6866 8.91521C16.2944 9.44412 17.1679 9.85718 18.2319 9.62197L17.9081 8.15733C17.4431 8.26012 17.0391 8.10369 16.6712 7.7836C16.2897 7.45165 16.0134 6.99233 15.8863 6.68446L14.4998 7.25684ZM8.30001 17.9317H15.767V16.4317H8.30001V17.9317Z" fill="#E7E9EA" />
                  </svg>
                </button>
              </div>
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
            {profile.interests && profile.interests.length > 0 && profile.education_status && profile.birthday ? (
              <>
                <p className="text-zinc-300">
                  Into {profile.interests.map((i) => i.name).join(", ")}
                </p>
                <p className="text-zinc-300 capitalize">
                  {formatYear(profile.education_status.year)} Year • {profile.education_status.course} • {profile.relationship_status}
                </p>
                <p className="text-brand-dark-gray">
                  Cake me on {formatBirthday(profile.birthday.day, profile.birthday.month)}
                </p>
              </>
            ) : null}
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
    </div>
  );
}
