import React, { useState } from 'react';
import { ChevronLeft, Search, ArrowRight, ArrowLeft } from 'lucide-react';
import { useNavigate } from "react-router-dom"; // Add this import
export default function App() {
  const [username, setUsername] = useState("");
  const [institutionSearch, setInstitutionSearch] = useState("");
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedGender, setSelectedGender] = useState(null);

  const navigate = useNavigate();

  const handleNext = () => {
    console.log("Next button clicked!");
  };

  return (
    <div className="min-h-screen bg-black text-white px-3 py-6 flex flex-col justify-between font-sans">
      <div>
        <ArrowLeft className="w-6 h-6 mb-4"  onClick={() => navigate("/myscreen")}/>

        <h1 className="text-2xl font-semibold mb-2">Find em</h1>
        <p className="text-sm text-gray-300 mb-4">
          Lorem ipsum dolor sit amet consectetur. Pulvinar risus donec aenean tristique risus eu vitae felis. Donec lacus accumsan ultricies metus.
        </p>

        <div className="flex items-center gap-2 border border-gray-600 rounded-md px-3 py-2 mb-6">
          <input
            type="text"
            placeholder="<username> here"
            className="bg-transparent outline-none text-sm w-full placeholder:text-gray-600"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <p className="text-base font-semibold mb-4">or find em with filters</p>

        <div className="flex items-center gap-2 border border-gray-600 rounded-md px-3 py-2 mb-4">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            placeholder="search for institution"
            className="bg-transparent outline-none text-sm w-full placeholder:text-gray-600"
            value={institutionSearch}
            onChange={(e) => setInstitutionSearch(e.target.value)}
          />
        </div>

        <div className="mb-6">
            <button
              className="border px-4 py-1 rounded-full text-sm"
              style={{ borderColor: "#2F3336" }}
            >
              @cit 
            </button>
          </div>

        <p className="font-semibold text-xl mb-3">grade of study</p>
        <div className="flex flex-wrap gap-2 mb-6">
          {['bachelors', 'masters'].map((grade) => (
            <button
              key={grade}
              className={`border text-sm px-4 py-1 rounded-full ${
                selectedGrade === grade
                  ? "border-pink-500"
                  : "border-gray-600 text-gray-300"
              }`}
              onClick={() => setSelectedGrade(grade)}
            >
              {grade}
            </button>
          ))}
        </div>

        <p className="font-semibold text-xl mb-3">year of study</p>
        <div className="flex flex-wrap gap-2 mb-6">
          {['1st', '2nd', '3rd', '4th', '5th'].map((year) => (
            <button
              key={year}
              className={`border text-sm px-4 py-1 rounded-full ${
                selectedYear === year
                  ? "border-pink-500"
                  : "border-gray-600 text-gray-300"
              }`}
              onClick={() => setSelectedYear(year)}
            >
              {year}
            </button>
          ))}
        </div>

        <p className="font-semibold text-xl mb-3">gender</p>
        <div className="flex flex-wrap gap-2 mb-6">
          {['male', 'female', 'nonbinary'].map((gender) => (
            <button
              key={gender}
              className={`border text-sm px-4 py-1 rounded-full ${
                selectedGender === gender
                  ? "border-pink-500"
                  : "border-gray-600 text-gray-300"
              }`}
              onClick={() => setSelectedGender(gender)}
            >
              {gender}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end items-center mt-10 mb-4">
        <button
          className="w-12 h-12 rounded-full bg-[#2e2e2e] flex items-center justify-center"
          onClick={() => navigate("/emresult")}
        >
          <ArrowRight size={22} className="text-white" />
        </button>
      </div>
    </div>
  );
}