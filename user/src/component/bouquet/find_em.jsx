import React, { useEffect, useState } from "react";
import { ChevronLeft, Search, ArrowRight, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../providers/api";

export default function App() {
  const [username, setUsername] = useState("");
  const [institutionSearch, setInstitutionSearch] = useState("");
  const [debouncedInstitution, setDebouncedInstitution] = useState("");
  const [collegeResults, setCollegeResults] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState(null);

  const [selectedGrade, setSelectedGrade] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedGender, setSelectedGender] = useState(null);

  const navigate = useNavigate();

  // Debounce logic
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedInstitution(institutionSearch.trim());
    }, 400);
    return () => clearTimeout(timeout);
  }, [institutionSearch]);

  useEffect(() => {
    const fetchColleges = async () => {
      if (debouncedInstitution.length < 3) {
        setCollegeResults([]);
        return;
      }

      try {
        const res = await api.get("/college", {
          params: { name: debouncedInstitution },
        });
        setCollegeResults(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch colleges:", err);
        setCollegeResults([]);
      }
    };

    fetchColleges();
  }, [debouncedInstitution]);

  const isFormValid =
    username.trim() !== "" ||
    (selectedCollege && selectedGrade && selectedYear && selectedGender);

  const handleNext = async () => {
    let query = {};

    if (username.trim()) {
      query.username = username.trim(); 
    } else {
      if (!selectedCollege) {
        alert("Please select a valid institution from suggestions.");
        return;
      }

      query.college_id = selectedCollege._id;
      query.degree = selectedGrade;
      query.study_year = { "1st": 1, "2nd": 2, "3rd": 3, "4th": 4, "5th": 5 }[
        selectedYear
      ];
      query.gender = selectedGender;
    }

    try {
      const res = await api.get("user/search", { params: query });
      localStorage.setItem("searchResult", JSON.stringify(res.data));
      navigate("/bouquet/emresult");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.detail || "Search failed.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-[#E7E9EA] px-3 py-6 flex flex-col justify-between font-sans relative">
      <div>
        <ArrowLeft
          className="w-6 h-6 mb-4"
          onClick={() => navigate("/bouquet/myscreen")}
        />

        <h1 className="text-2xl font-semibold mb-2">Find em</h1>
        <p className="text-sm text-gray-300 mb-4">
          Lorem ipsum dolor sit amet consectetur. Pulvinar risus donec aenean
          tristique risus eu vitae felis. Donec lacus accumsan ultricies metus.
        </p>

        <div className="flex items-center gap-2 border border-gray-600 rounded-md px-3 py-2 mb-6">
          <input
            type="text"
            placeholder="<username> here"
            className="bg-transparent outline-none text-sm w-full placeholder:text-gray-600"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              if (e.target.value.trim() !== "") {
                setInstitutionSearch("");
                setSelectedCollege(null);
                setSelectedGrade(null);
                setSelectedYear(null);
                setSelectedGender(null);
              }
            }}
          />
        </div>

        <p className="text-base font-semibold mb-4">or find em with filters</p>

        <div className="relative">
          <div className="flex items-center gap-2 border border-gray-600 rounded-md px-3 py-2 mb-2">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="search for institution"
              className="bg-transparent outline-none text-sm w-full placeholder:text-gray-600"
              value={institutionSearch}
              onChange={(e) => {
                setInstitutionSearch(e.target.value);
                if (e.target.value.trim() !== "") {
                  setUsername("");
                }
              }}
            />
          </div>

          {collegeResults.length > 0 && !selectedCollege && (
            <div className="absolute z-10 bg-black border border-gray-700 rounded-md mt-1 w-full max-h-40 overflow-auto">
              {collegeResults.map((college) => (
                <div
                  key={college._id}
                  onClick={() => {
                    setInstitutionSearch(college.name);
                    setSelectedCollege(college);
                    setCollegeResults([]);
                  }}
                  className="px-3 py-2 hover:bg-neutral-800 cursor-pointer text-sm"
                >
                  {college.name} {college.city && `(${college.city})`}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mb-6"></div>

        <p className="font-semibold text-xl mb-3">grade of study</p>
        <div className="flex flex-wrap gap-2 mb-6">
          {["bachelors", "masters"].map((grade) => (
            <button
              key={grade}
              className={`border text-sm px-4 py-1 rounded-full ${
                selectedGrade === grade
                  ? "border-pink-500"
                  : "border-gray-600 text-gray-300"
              } ${!selectedCollege ? "opacity-40 cursor-not-allowed" : ""}`}
              disabled={!selectedCollege}
              onClick={() => selectedCollege && setSelectedGrade(grade)}
            >
              {grade}
            </button>
          ))}
        </div>

        <p className="font-semibold text-xl mb-3">year of study</p>
        <div className="flex flex-wrap gap-2 mb-6">
          {["1st", "2nd", "3rd", "4th", "5th"].map((year) => (
            <button
              key={year}
              className={`border text-sm px-4 py-1 rounded-full ${
                selectedYear === year
                  ? "border-pink-500"
                  : "border-gray-600 text-gray-300"
              } ${!selectedGrade ? "opacity-40 cursor-not-allowed" : ""}`}
              disabled={!selectedGrade}
              onClick={() => selectedGrade && setSelectedYear(year)}
            >
              {year}
            </button>
          ))}
        </div>

        <p className="font-semibold text-xl mb-3">gender</p>
        <div className="flex flex-wrap gap-2 mb-6">
          {["male", "female", "nonbinary"].map((gender) => (
            <button
              key={gender}
              className={`border text-sm px-4 py-1 rounded-full ${
                selectedGender === gender
                  ? "border-pink-500"
                  : "border-gray-600 text-gray-300"
              } ${!selectedYear ? "opacity-40 cursor-not-allowed" : ""}`}
              disabled={!selectedYear}
              onClick={() => selectedYear && setSelectedGender(gender)}
            >
              {gender}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end items-center mt-10 mb-4">
        <button
          className={`w-12 h-12 rounded-full flex items-center justify-center ${
            isFormValid ? "bg-[#2e2e2e]" : "bg-gray-800 cursor-not-allowed"
          }`}
          onClick={handleNext}
          disabled={!isFormValid}
        >
          <ArrowRight size={22} className="text-[#E7E9EA]" />
        </button>
      </div>
    </div>
  );
}
