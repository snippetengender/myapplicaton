import React, { useEffect, useRef, useState } from "react";
import { ArrowLeft, Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import imageCompression from "browser-image-compression";
import { getAuth, signOut } from "firebase/auth";
import api from "../../providers/api";
import { fetchUserProfile, clearUserProfile, clearUser } from "../../features/userSlice/userSlice";
import { resetUserMixes } from "../../features/mixes/mixSlice";

export default function EditProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userId = useSelector((state) => state.user.userId);
  const { data: profileData, status } = useSelector(
    (state) => state.user.profile
  );

  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [imageHash, setImageHash] = useState(Date.now());

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);

      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(file, options);

      const formData = new FormData();
      formData.append("file", compressedFile);

      await api.post(`/user/${userId}/profile`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Refetch the profile after successful upload
      dispatch(fetchUserProfile(userId));
      dispatch(resetUserMixes()); // Clear cached posts so they pull the fresh S3 URL
      setImageHash(Date.now()); // Bust the URI cache so the browser downloads the new image
    } catch (error) {
      console.error("Failed to upload profile picture:", error);
      alert("Failed to upload profile picture. Please try again.");
    } finally {
      setIsUploading(false);
      if (e.target) e.target.value = null; // Clear input to allow picking the same photo consecutively
    }
  };

  // ✅ Fetch ONLY if profile is missing
  useEffect(() => {
    if (userId) {
      dispatch(fetchUserProfile(userId));
    }
  }, [dispatch, userId]);

  // ✅ Guard UI while loading
  if (status === "loading" || !profileData) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading profile...
      </div>
    );
  }

  const formatDOB = () => {
    if (
      !profileData?.birthday ||
      !profileData.birthday.day ||
      profileData.birthday.day === -1 ||
      !profileData.birthday.month ||
      profileData.birthday.month === -1
    ) {
      return "Not set";
    }
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const day = profileData.birthday.day;
    const month = months[profileData.birthday.month - 1] || "";
    return `${day} ${month}`.trim();
  };

  const editItems = [
    {
      label: "Name",
      value: profileData?.name || "Not set",
      path: "/useronboarding/name-dob-gender",
    },
    {
      label: "Username",
      value: profileData?.username || "Not set",
      path: "/useronboarding/name-dob-gender",
    },
    {
      label: "Gender",
      value: profileData?.gender || "Not set",
      path: "/useronboarding/name-dob-gender",
    },
    {
      label: "DOB",
      value: formatDOB(),
      path: "/useronboarding/birthday-edit",
    },
    {
      label: "Interests",
      value: profileData?.interests?.length
        ? profileData.interests.map((i) => i.name || i).join(", ")
        : "Select interests",
      path: "/useronboarding/interests",
    },
    {
      label: "Bio",
      value: profileData?.prompt?.name || "Not set",
      path: "/useronboarding/prompt",
    },
    {
      label: "Edu Status",
      value: profileData?.education_status
        ? `${profileData.education_status.course || ""} ${profileData.education_status.year || ""
          } ${profileData.education_status.degree || ""}`.trim()
        : "Not set",
      path: "/useronboarding/course-year-branch",
    },
    {
      label: "Relationship Status",
      value: profileData?.relationship_status || "Not set",
      path: "/useronboarding/relationship-status",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-brand-off-white px-4 py-6 flex flex-col justify-between">
      <div>
        {/* Back */}
        <button className="mb-6" onClick={() => navigate(`/user-profile-owner/${userId}`)}>
          <ArrowLeft size={24} />
        </button>

        <h1 className="text-[20px] font-bold mb-2">Edit profile</h1>
        <p className="text-xs text-brand-charcoal mb-6">
          Tap on any field to edit
        </p>

        {/* Profile Picture Upload UI */}
        <div className="flex flex-col items-center mb-8 relative">
          <div
            className="relative w-24 h-24 rounded-full overflow-hidden cursor-pointer border border-zinc-700 bg-zinc-900 group"
            onClick={() => !isUploading && fileInputRef.current?.click()}
          >
            <img
              src={profileData?.profile ? `${profileData.profile}?h=${imageHash}` : `https://ui-avatars.com/api/?name=${profileData?.username || 'user'}&background=random`}
              alt="Profile"
              className={`w-full h-full object-cover transition duration-300 ${isUploading ? 'opacity-50' : 'group-hover:opacity-75'}`}
            />
            {!isUploading && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Camera className="text-white" size={24} />
              </div>
            )}
            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-brand-pink border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
          <p className="text-xs text-brand-dark-gray mt-2">
            {isUploading ? "Uploading..." : "Tap to change picture"}
          </p>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
        </div>

        <div className="space-y-6">
          {editItems.map((item) => (
            <button
              key={item.label}
              onClick={() => navigate(item.path, { state: { fromEditProfile: true, currentData: JSON.parse(JSON.stringify(profileData)) } })}
              className="w-full text-left"
            >
              <p className="text-xs text-brand-medium-gray mb-1">
                {item.label}
              </p>
              <p className="text-sm font-medium truncate">{item.value}</p>
              <div className="border-b border-brand-charcoal mt-2"></div>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8">
        {/* Bottom Button */}
        <button
          onClick={() => navigate(`/user-profile-owner/${userId}`)}
          className="w-full py-3 mb-6 bg-brand-off-white text-black font-bold rounded-lg hover:opacity-90 transition-opacity"
        >
          View Profile
        </button>

        <div className="flex flex-col gap-3 mb-6">
          <button className="text-left font-bold text-[16px] text-brand-dark-gray">Community Guideline</button>
          <button className="text-left font-bold text-[16px] text-brand-dark-gray">Privacy Policy</button>
        </div>

        {/* Bottom Button */}
        <button
          onClick={() => {
            const auth = getAuth();
            signOut(auth)
              .then(() => {
                dispatch(clearUser());
                dispatch(clearUserProfile());
                dispatch(resetUserMixes());
                navigate("/lobby", { replace: true });
              })
              .catch((error) => console.error("Error signing out:", error));
          }}
          className="w-full py-3 bg-[#E0E2E3] text-black text-[16px] font-bold rounded-xl hover:opacity-90 transition-opacity"
        >
          Log out
        </button>
      </div>
    </div>
  );
}
