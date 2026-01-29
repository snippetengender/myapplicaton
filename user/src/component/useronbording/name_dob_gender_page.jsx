import React, { useEffect } from "react";
import { ArrowLeft, ArrowRight, ChevronDown } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  updateOnboardingData,
  updateOnboardingStep,
} from "../../features/userSlice/onboardingSlice";
import nextArrow from "../assets/next.svg";

export default function UserInfoPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { profileData } = useSelector((state) => state.onboarding);

  // Hydrate state from location.state if present
  useEffect(() => {
    if (location.state?.currentData) {
      dispatch(updateOnboardingData(location.state.currentData));
    }
  }, [location.state, dispatch]);


  // Check if coming from edit-profile via state
  const isEditMode = location.state?.fromEditProfile || document.referrer.includes("edit-profile");
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
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

  const handleChange = (field, value) => {
    // if (field === "gender") {
    //   value = value === "Non Binary" ? "others" : value;
    // }
    dispatch(updateOnboardingData({ [field]: value }));
  };

  // const handleBirthdayChange = (part, value) => {
  //   const updatedBirthday = { ...profileData.birthday, [part]: value };
  //   dispatch(updateOnboardingData({ birthday: updatedBirthday }));
  // };

  const handleNext = () => {
    console.log("handle next");
    dispatch(
      updateOnboardingStep({
        name: profileData.name,
        username: profileData.username,
        gender: profileData.gender,
      })
    );
    console.log("reacheed ...........");
    navigate(isEditMode ? "/useronboarding/edit-profile" : "/home");
  };

  const handleBack = () => {
    navigate(isEditMode ? "/useronboarding/edit-profile" : -1);
  };

  const getMonthName = (monthNumber) => {
    if (monthNumber > 0 && monthNumber <= 12) {
      return months[monthNumber - 1];
    }
    return "";
  };

  const isFormValid =
    profileData.name?.trim() &&
    profileData.username?.trim() &&
    profileData.gender

  return (
    <div className="min-h-screen bg-black text-brand-off-white px-4 py-6 flex flex-col justify-between">
      <div>
        {/* Back Arrow */}
        <button className="mb-6" onClick={handleBack}>
          <ArrowLeft size={24} className="text-brand-off-white" />
        </button>

        {/* Title & Subtitle */}
        <h1 className="text-[20px] font-bold mb-1 leading-tight">
          BRAVO, let's give a <br /> cool start
        </h1>
        <p className="text-sm mb-4">we need your</p>

        {/* Name Input - Now reads from and updates Redux */}
        <input
          type="text"
          placeholder="Name"
          maxLength={50}
          value={profileData.name || ""}
          onChange={(e) => handleChange("name", e.target.value)}
          className="w-full bg-transparent text-[28px] font-bold outline-none placeholder:text-brand-medium-gray"
        />
        <p className="text-xs text-brand-charcoal mt-1">
          {profileData.username?.length || 0}/50
        </p>
        <input
          type="text"
          placeholder="<username>"
          maxLength={50}
          value={profileData.username || ""}
          onChange={(e) => handleChange("username", e.target.value)}
          className="w-full bg-transparent text-[28px] font-bold outline-none placeholder:text-brand-medium-gray"
        />



        {/* Gender Selection - Now reads from and updates Redux */}
        <p className="text-sm mt-8 mb-4">your gender</p>
        <div className="flex flex-col gap-3">
          {["Male", "Female", "Non Binary"].map((g) => (
            <label
              key={g}
              className={`flex items-center justify-between text-2xl font-bold ${profileData.gender === g ? "text-brand-off-white" : "text-brand-medium-gray"
                }`}
            >
              {g}
              <div className="relative w-6 h-6 flex items-center justify-center">
                <input
                  type="radio"
                  name="gender"
                  value={g}
                  checked={profileData.gender === g}
                  onChange={() => handleChange("gender", g)}
                  className="appearance-none w-6 h-6 rounded-full border border-brand-off-white absolute"
                />
                {profileData.gender === g && (
                  <div className="w-3 h-3 rounded-full bg-brand-off-white absolute pointer-events-none"></div>
                )}
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Bottom Arrow Button */}
      <div className="flex justify-end mt-10 mb-4">
        <button
          onClick={handleNext}
          disabled={!isFormValid}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-200 ${!isFormValid
              ? "bg-brand-charcoal cursor-not-allowed opacity-50"
              : "bg-brand-off-white"
            }`}
        >
          <img
            src={nextArrow}
            alt="Next arrow"
          />
        </button>
      </div>
    </div>
  );
}
