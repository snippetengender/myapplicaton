import React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  updateOnboardingData,
  updateOnboardingStep,
} from "../../features/userSlice/onboardingSlice";

export default function GradeInfoPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { profileData } = useSelector((state) => state.onboarding);

  const years = ["1st", "2nd", "3rd", "4th", "5th"];
  const degrees = ["Bachelors", "Masters"];

  const { education_status } = useSelector(
    (state) => state.onboarding.profileData
  );
  const handleEducationChange = (field, value) => {
    const updatedEducationStatus = {
      ...education_status,
      [field]: value,
    };
    dispatch(
      updateOnboardingData({ education_status: updatedEducationStatus })
    );
  };

  const handleNext = () => {
    dispatch(updateOnboardingStep({ education_status }));
    navigate("/useronboarding/interests");
  };

  const isFormValid =
    education_status?.course?.trim() &&
    education_status?.year &&
    education_status?.degree;

  return (
    <div className="min-h-screen bg-black text-[#E7E9EA] px-4 py-6 flex flex-col justify-between">
      <div>
        {/* Back Button */}
        <button className="mb-6" onClick={() => navigate(-1)}>
          <ArrowLeft className="text-[#E7E9EA]" size={24} />
        </button>

        {/* Heading */}
        <h1 className="text-2xl font-bold mb-2 leading-tight">
          So we need your <br /> Grade
        </h1>
        <p className="text-sm mb-3">we need your</p>

        {/* Course Input - Reads from and updates Redux */}
        <input
          type="text"
          placeholder="Course"
          maxLength={150}
          value={education_status?.course || ""}
          onChange={(e) => handleEducationChange("course", e.target.value)}
          className="w-full bg-transparent text-2xl font-bold outline-none placeholder:text-zinc-500"
        />
        <p className="text-xs text-zinc-400 mt-1">
          {education_status?.course?.length || 0}/150
        </p>

        {/* Year Selection - Reads from and updates Redux */}
        <p className="text-sm mt-6 mb-2">so, you're in which year</p>
        <div className="flex gap-2">
          {years.map((yr, index) => {
            const yearNumber = index + 1;
            return (
              <button
                key={yr}
                onClick={() => handleEducationChange("year", yearNumber)}
                className={`px-4 py-1 rounded-md border ${
                  education_status?.year === yearNumber
                    ? "border-[#F06CB7] text-[#E7E9EA]"
                    : "border-zinc-500 text-zinc-300"
                }`}
              >
                {yr}
              </button>
            );
          })}
        </div>

        {/* Degree Selection - Reads from and updates Redux */}
        <p className="text-sm mt-6 mb-2">degree of study</p>
        <div className="flex flex-col gap-4">
          {degrees.map((d) => (
            <label
              key={d}
              className={`flex items-center justify-between text-2xl font-bold ${
                education_status?.degree === d
                  ? "text-[#E7E9EA]"
                  : "text-zinc-500"
              }`}
            >
              {d}
              <input
                type="radio"
                name="degree"
                value={d}
                checked={education_status?.degree === d}
                onChange={() => handleEducationChange("degree", d)}
                className="accent-white w-5 h-5"
              />
            </label>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="flex justify-end mt-10 mb-4">
        <button
          onClick={handleNext}
          disabled={!isFormValid}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-200 ${
            !isFormValid
              ? "bg-gray-600 cursor-not-allowed opacity-50"
              : "bg-[#2e2e2e]"
          }`}
        >
          <ArrowRight className="text-[#E7E9EA]" size={22} />
        </button>
      </div>
    </div>
  );
}
