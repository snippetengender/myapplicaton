import React, { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserProfile } from "../../features/userSlice/userSlice";

export default function EditProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userId = useSelector((state) => state.user.userId);
  const { data: profileData, status } = useSelector(
    (state) => state.user.profile
  );
  //console.log(profileData)

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

      {/* Bottom Button */}
      <button
        onClick={() => navigate(`/user-profile-owner/${userId}`)}
        className="w-full py-3 bg-brand-off-white text-black font-bold rounded-lg mt-8 hover:opacity-90 transition-opacity"
      >
        View Profile
      </button>
    </div>
  );
}
