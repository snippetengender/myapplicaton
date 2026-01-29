import React, { useEffect } from "react";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateOnboardingData, updateOnboardingStep } from "../../features/userSlice/onboardingSlice";
import nextArrow from "../assets/next.svg";

export default function EditDobPage() {
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
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const handleBirthdayChange = (part, value) => {
    dispatch(
      updateOnboardingData({
        birthday: { ...profileData.birthday, [part]: value },
      })
    );
  };

  const handleSave = () => {
    dispatch(updateOnboardingStep({ birthday: profileData.birthday }));
    navigate(isEditMode ? "/useronboarding/edit-profile" : -1);
  };

  const handleBack = () => {
    navigate(isEditMode ? "/useronboarding/edit-profile" : -1);
  };

  const isFormValid =
    profileData.birthday?.day && profileData.birthday?.month;

  const getMonthName = (monthNumber) =>
    monthNumber ? months[monthNumber - 1] : "";

  return (
    <div className="min-h-screen bg-black text-brand-off-white px-4 py-6 flex flex-col justify-between">
      <div>
        {/* Back */}
        <button className="mb-6" onClick={handleBack}>
          <ArrowLeft size={24} />
        </button>

        {/* Title */}
        <h1 className="text-[20px] font-bold mb-6">
          when should we cake you 🎂
        </h1>

        {/* DOB */}
        <div className="flex gap-4 items-center">
          {/* Day */}
          <div className="relative">
            <select
              value={profileData.birthday?.day || ""}
              onChange={(e) =>
                handleBirthdayChange("day", Number(e.target.value))
              }
              className="appearance-none bg-transparent text-[28px] font-bold pr-8"
            >
              <option value="">Day</option>
              {days.map((d) => (
                <option key={d} value={d} className="text-black">
                  {d}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-0 top-1/2 -translate-y-1/2"
              size={16}
            />
          </div>

          {/* Month */}
          <div className="relative">
            <select
              value={getMonthName(profileData.birthday?.month)}
              onChange={(e) =>
                handleBirthdayChange(
                  "month",
                  months.indexOf(e.target.value) + 1
                )
              }
              className="appearance-none bg-transparent text-[28px] font-bold pr-8"
            >
              <option value="">Month</option>
              {months.map((m) => (
                <option key={m} value={m} className="text-black">
                  {m}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-0 top-1/2 -translate-y-1/2"
              size={16}
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={handleSave}
          disabled={!isFormValid}
          className={`w-12 h-12 rounded-full flex items-center justify-center ${!isFormValid
              ? "bg-brand-charcoal opacity-50"
              : "bg-brand-off-white"
            }`}
        >
          <img src={nextArrow} alt="Save DOB" />
        </button>
      </div>
    </div>
  );
}
