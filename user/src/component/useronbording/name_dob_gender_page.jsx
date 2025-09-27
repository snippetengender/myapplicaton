import React from "react";
import { ArrowLeft, ArrowRight, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  updateOnboardingData,
  updateOnboardingStep,
} from "../../features/userSlice/onboardingSlice";

export default function UserInfoPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { profileData } = useSelector((state) => state.onboarding);
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
    dispatch(updateOnboardingData({ [field]: value }));
  };

  const handleBirthdayChange = (part, value) => {
    const updatedBirthday = { ...profileData.birthday, [part]: value };
    dispatch(updateOnboardingData({ birthday: updatedBirthday }));
  };

  const handleNext = () => {
  dispatch(updateOnboardingStep({ birthday: profileData.birthday }));
  dispatch(updateOnboardingStep({ 
    name: profileData.name, 
    gender: profileData.gender 
  }));

  navigate("/useronboarding/course-year-branch");
};

  const getMonthName = (monthNumber) => {
    if (monthNumber > 0 && monthNumber <= 12) {
      return months[monthNumber - 1];
    }
    return "";
  };

  const isFormValid =
    profileData.name?.trim() &&
    profileData.gender &&
    profileData.birthday?.day &&
    profileData.birthday?.month;

  return (
    <div className="min-h-screen bg-black text-[#E7E9EA] px-4 py-6 flex flex-col justify-between">
      <div>
        {/* Back Arrow */}
        <button className="mb-6" onClick={() => navigate(-1)}>
          <ArrowLeft size={24} className="text-[#E7E9EA]" />
        </button>

        {/* Title & Subtitle */}
        <h1 className="text-2xl font-bold mb-1 leading-tight">
          BRAVO, let's give a <br /> cool start
        </h1>
        <p className="text-sm mb-4">we need your</p>

        {/* Name Input - Now reads from and updates Redux */}
        <input
          type="text"
          placeholder="Full Name"
          maxLength={50}
          value={profileData.name || ""}
          onChange={(e) => handleChange("name", e.target.value)}
          className="w-full bg-transparent text-3xl font-bold outline-none placeholder:text-zinc-500"
        />
        <p className="text-xs text-zinc-400 mt-1">
          {profileData.name?.length || 0}/50
        </p>

        {/* Birthday Selection - Now reads from and updates Redux */}
        <p className="text-sm mt-6 mb-2">so, when should we cake you</p>
        <div className="flex gap-4 items-center">
          <div className="relative">
            <select
              value={profileData.birthday?.day || ""}
              onChange={(e) =>
                handleBirthdayChange("day", Number(e.target.value))
              }
              className="appearance-none bg-transparent text-2xl font-bold text-zinc-500 pr-8"
            >
              <option value="">Day</option>
              {days.map((d) => (
                <option key={d} value={d} className="text-black">
                  {d}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-0 top-1/2 -translate-y-1/2 text-[#E7E9EA]"
              size={16}
            />
          </div>
          <div className="relative">
            <select
              value={getMonthName(profileData.birthday?.month)}
              onChange={(e) =>
                handleBirthdayChange(
                  "month",
                  months.indexOf(e.target.value) + 1
                )
              }
              className="appearance-none bg-transparent text-2xl font-bold text-zinc-500 pr-6"
            >
              <option value="">Month</option>
              {months.map((m) => (
                <option key={m} value={m} className="text-black">
                  {m}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-0 top-1/2 -translate-y-1/2 text-[#E7E9EA]"
              size={16}
            />
          </div>
        </div>

        {/* Gender Selection - Now reads from and updates Redux */}
        <p className="text-sm mt-8 mb-4">and your gender</p>
        <div className="flex flex-col gap-3">
          {["Male", "Female", "Non Binary"].map((g) => (
            <label
              key={g}
              className="flex items-center justify-between text-2xl text-zinc-500 font-bold"
            >
              {g}
              <input
                type="radio"
                name="gender"
                value={g}
                checked={profileData.gender === g}
                onChange={() => handleChange("gender", g)}
                className="accent-white w-5 h-5"
              />
            </label>
          ))}
        </div>
      </div>

      {/* Bottom Arrow Button */}
      <div className="flex justify-end mt-10 mb-4">
        <button
          onClick={handleNext}
          disabled={!isFormValid}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-200 ${
            !isFormValid
              ? "bg-gray-600 cursor-not-allowed opacity-50"
              : "bg-[#F06CB7] hover:bg-[#e05ca3]"
          }`}
        >
          <ArrowRight className="text-[#E7E9EA]" size={22} />
        </button>
      </div>
    </div>
  );
}
