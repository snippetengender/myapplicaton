import React, { useState } from "react";
import { ArrowLeft, ArrowRight, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function UserInfoPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [saving, setSaving] = useState(false);

  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const saveToLocalStorage = (updatedFields) => {
    const userInfo = {
      name,
      gender,
      birthday: {
        day: Number(day),
        month: Number(month),
      },
      ...updatedFields,
    };
    localStorage.setItem("snippet_user_info", JSON.stringify(userInfo));
  };

  const handleNameChange = (e) => {
    const val = e.target.value;
    setName(val);
    saveToLocalStorage({ name: val });
  };

  const handleGenderChange = (val) => {
    setGender(val);
    saveToLocalStorage({ gender: val });
  };

  const handleDayChange = (val) => {
    const dayNumber = Number(val);
    setDay(dayNumber);
    saveToLocalStorage({
      birthday: { day: dayNumber, month: Number(month) },
    });
  };

  const handleMonthChange = (val) => {
    const monthNumber = months.indexOf(val) + 1;
    setMonth(monthNumber);
    saveToLocalStorage({
      birthday: { day: Number(day), month: monthNumber },
    });
  };

  const handleNext = async () => {
    setSaving(true);
    const user_id = localStorage.getItem("snippet_user");
    const userInfo = JSON.parse(localStorage.getItem("snippet_user_info"));
    if (!user_id || !userInfo) {
      console.error("Missing user_id or userInfo in localStorage.");
      setSaving(false);
      return;
    }

    try {
      await api.patch(`/user/${user_id}`, userInfo);
      console.log("User info patched successfully");
      navigate("/useronboarding/course-year-branch");
    } catch (err) {
      console.error("Error saving user info:", err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 py-6 flex flex-col justify-between">
      <div>
        {/* Back Arrow */}
        <button className="mb-6" onClick={() => navigate(-1)}>
          <ArrowLeft size={24} className="text-white" />
        </button>

        {/* Title & Subtitle */}
        <h1 className="text-2xl font-bold mb-1 leading-tight">
          BRAVO, let's give a <br /> cool start
        </h1>
        <p className="text-sm mb-4">we need your</p>

        {/* Name Input */}
        <input
          type="text"
          placeholder="Full Name"
          maxLength={50}
          value={name}
          onChange={handleNameChange}
          className="w-full bg-transparent text-3xl font-bold outline-none placeholder:text-zinc-500"
        />
        <p className="text-xs text-zinc-400 mt-1">{name.length}/50</p>

        {/* Birthday Selection */}
        <p className="text-sm mt-6 mb-2">so, when should we cake you</p>
        <div className="flex gap-4 items-center">
          <div className="relative">
            <select
              value={day}
              onChange={(e) => handleDayChange(e.target.value)}
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
              className="absolute right-0 top-1/2 -translate-y-1/2 text-white"
              size={16}
            />
          </div>

          <div className="relative">
            <select
              value={month}
              onChange={(e) => handleMonthChange(e.target.value)}
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
              className="absolute right-0 top-1/2 -translate-y-1/2 text-white"
              size={16}
            />
          </div>
        </div>

        {/* Gender Selection */}
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
                checked={gender === g}
                onChange={() => handleGenderChange(g)}
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
          disabled={saving}
          className="w-12 h-12 rounded-full bg-[#2e2e2e] flex items-center justify-center"
        >
          <ArrowRight className="text-white" size={22} />
        </button>
      </div>

      {/* Saving Indicator */}
      {saving && (
        <p className="text-sm text-blue-400 mt-2">Saving changes...</p>
      )}
    </div>
  );
}
