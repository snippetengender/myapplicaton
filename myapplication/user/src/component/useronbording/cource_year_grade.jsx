import React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  updateOnboardingData,
  updateOnboardingStep,
} from "../../features/userSlice/onboardingSlice";
import nextArrow from "../assets/next.svg";
import snippyButler from "../assets/Snippy_butler.png";

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
    <div className="min-h-screen bg-black text-brand-off-white px-4 py-6 flex flex-col justify-between">
      <div>
        {/* Back Button */}
        <button className="mb-6" onClick={() => navigate(-1)}>
          <ArrowLeft className="text-brand-off-white" size={24} />
        </button>

        {/* Heading */}
        <h1 className="text-[20px] font-bold mb-2 leading-tight">
          we need to know <br/>a bit more
        </h1>
        <p className="text-sm mb-3">we need your</p>

        {/* Course Input - Reads from and updates Redux */}
        <input
          type="text"
          placeholder="Course"
          maxLength={150}
          value={education_status?.course || ""}
          onChange={(e) => handleEducationChange("course", e.target.value)}
          className="w-full bg-transparent text-2xl font-bold outline-none placeholder:text-brand-medium-gray"
        />
        <p className="text-xs text-brand-charcoal mt-1">
          {education_status?.course?.length || 0}/150
        </p>

        {/* Year Selection - Reads from and updates Redux */}
        <p className="text-sm mt-2 mb-2">so, you're in which year</p>
        <div className="flex gap-2">
          {years.map((yr, index) => {
            const yearNumber = index + 1;
            return (
              <button
                key={yr}
                onClick={() => handleEducationChange("year", yearNumber)}
                className={`px-3 py-3 rounded-md border ${
                  education_status?.year === yearNumber
                    ? "border-brand-pink text-brand-off-white"
                    : "border-brand-charcoal text-brand-off-white"
                }`}
              >
                {yr}
              </button>
            );
          })}
        </div>

        {/* Degree Selection - Reads from and updates Redux */}
        <p className="text-sm mt-[9px] mb-2">grade of study</p>
        <div className="flex flex-col gap-[6px]">
          {degrees.map((d) => (
            <label
              key={d}
              className={`flex items-center justify-between text-[28px] font-bold ${
                education_status?.degree === d
                  ? "text-brand-off-white"
                  : "text-brand-medium-gray"
              }`}
            >
              {d}
              <div className="relative w-6 h-6 flex items-center justify-center">
                <input
                  type="radio"
                  name="degree"
                  value={d}
                  checked={education_status?.degree === d}
                  onChange={() => handleEducationChange("degree", d)}
                  className="appearance-none w-6 h-6 rounded-full border border-brand-off-white absolute"
                />
                {education_status?.degree === d && (
                  <div className="w-3 h-3 rounded-full bg-brand-off-white absolute pointer-events-none"></div>
                )}
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="flex justify-between items-end mt-10 mb-4 gap-2">
        <img 
          src={snippyButler} 
          alt="Snippy Butler" 
          className="w-[150px] h-auto transform -scale-x-100 mb-1" 
        />
        <button
          onClick={handleNext}
          disabled={!isFormValid}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-200 ${
            !isFormValid
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
