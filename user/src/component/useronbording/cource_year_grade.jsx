import React, { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function GradeInfoPage() {
  const navigate = useNavigate();
  const [course, setCourse] = useState("");
  const [year, setYear] = useState("");
  const [degree, setDegree] = useState(""); 
  const [saving, setSaving] = useState(false);

  const years = ["1st", "2nd", "3rd", "4th", "5th"];
  const degrees = ["Bachelors", "Masters"]; 

  const handleCourseChange = (e) => {
    const val = e.target.value;
    setCourse(val);
    saveToLocalStorage({ course: val });
  };

  const handleYearChange = (val) => {
    const yearNumber = parseInt(val); 
    setYear(yearNumber);
    saveToLocalStorage({ year: yearNumber });
  };

  const handleDegreeChange = (val) => { 
    setDegree(val);
    saveToLocalStorage({ degree: val });
  };

  const saveToLocalStorage = (updatedFields) => {
    const currentData = {
      course,
      year,
      degree, 
    };
    
    const education_status = {
      ...currentData,
      ...updatedFields,
    };
    
    localStorage.setItem("snippet_user_education", JSON.stringify(education_status));
  };

  const handleNext = async () => {
    setSaving(true);
    const user_id = localStorage.getItem("snippet_user");
    const education_status = JSON.parse(localStorage.getItem("snippet_user_education"));

    if (!user_id || !education_status || !education_status.degree) {
      console.error("Missing user_id or education_status or degree.");
      setSaving(false);
      return;
    }

    try {
      await api.patch(`/user/${user_id}`, { education_status });
      console.log("Education info patched successfully");
      navigate("/useronboarding/interests");
    } catch (err) {
      console.error("Error saving education info:", err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 py-6 flex flex-col justify-between">
      <div>
        {/* Back Button */}
        <button className="mb-6" onClick={() => navigate(-1)}>
          <ArrowLeft className="text-white" size={24} />
        </button>

        {/* Heading */}
        <h1 className="text-2xl font-bold mb-2 leading-tight">
          So we need your <br /> Grade
        </h1>
        <p className="text-sm mb-3">we need your</p>

        {/* Course Input */}
        <input
          type="text"
          placeholder="Course"
          maxLength={150}
          value={course}
          onChange={handleCourseChange}
          className="w-full bg-transparent text-2xl font-bold outline-none placeholder:text-zinc-500"
        />
        <p className="text-xs text-zinc-400 mt-1">{course.length}/150</p>

        {/* Year Selection */}
        <p className="text-sm mt-6 mb-2">so, you're in which year</p>
        <div className="flex gap-2">
          {years.map((yr, index) => {
            const yearNumber = index + 1; // Get actual year number (1, 2, 3, 4, 5)
            return (
              <button
                key={yr}
                onClick={() => handleYearChange(yearNumber.toString())} 
                className={`px-4 py-1 rounded-md border ${
                  year === yearNumber ? "border-[#F06CB7] text-white" : "border-zinc-500 text-zinc-300"
                }`}
              >
                {yr}
              </button>
            );
          })}
        </div>

        {/* Degree Selection */}
        <p className="text-sm mt-6 mb-2">degree of study</p>
        <div className="flex flex-col gap-4">
          {degrees.map((d) => (
            <label
              key={d}
              className={`flex items-center justify-between text-2xl font-bold ${
                degree === d ? "text-white" : "text-zinc-500"
              }`}
            >
              {d}
              <input
                type="radio"
                name="degree"
                value={d}
                checked={degree === d}
                onChange={() => handleDegreeChange(d)}
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
          disabled={saving}
          className="w-12 h-12 rounded-full bg-[#2e2e2e] flex items-center justify-center"
        >
          <ArrowRight className="text-white" size={22} />
        </button>
      </div>

      {/* Saving Indicator */}
      {saving && <p className="text-sm text-blue-400 mt-2">Saving changes...</p>}
    </div>
  );
}