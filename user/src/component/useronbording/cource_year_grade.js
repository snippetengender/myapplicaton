import React, { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function GradeInfoPage() {
  const [course, setCourse] = useState('');
  const [year, setYear] = useState('');
  const [grade, setGrade] = useState('');

  const years = ['1st', '2nd', '3rd', '4th', '5th'];
  const grades = ['Bachelors', 'Masters'];

  return (
    <div className="min-h-screen bg-black text-white px-4 py-6 flex flex-col justify-between">
      <div>
        {/* Back Button */}
        <button className="mb-6">
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
          onChange={(e) => setCourse(e.target.value)}
          className="w-full bg-transparent  text-2xl font-bold outline-none placeholder:text-zinc-500"
        />
        <p className="text-xs text-zinc-400 mt-1">{course.length}/150</p>

        {/* Year Selection */}
        <p className="text-sm mt-6 mb-2">so, you're in which year</p>
        <div className="flex gap-2">
          {years.map((yr) => (
            <button
              key={yr}
              onClick={() => setYear(yr)}
              className={`px-4 py-1 rounded-md border ${
                year === yr ? 'border-[#F06CB7] text-white' : 'border-zinc-500 text-zinc-300'
              }`}
            >
              {yr}
            </button>
          ))}
        </div>

        {/* Grade of Study */}
        <p className="text-sm mt-6 mb-2">grade of study</p>
        <div className="flex flex-col gap-4">
          {grades.map((g) => (
            <label
              key={g}
              className={`flex items-center justify-between text-2xl font-bold ${
                grade === g ? 'text-white' : 'text-zinc-500'
              }`}
            >
              {g}
              <input
                type="radio"
                name="grade"
                value={g}
                checked={grade === g}
                onChange={() => setGrade(g)}
                className="accent-white w-5 h-5"
              />
            </label>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="flex justify-end mt-10 mb-4">
        <button className="w-12 h-12 rounded-full bg-[#2e2e2e] flex items-center justify-center">
          <ArrowRight className="text-white" size={22} />
        </button>
      </div>
    </div>
  );
}
