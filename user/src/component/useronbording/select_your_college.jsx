import { useState, useEffect, useMemo } from "react";
import { ChevronLeft, Search, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../providers/api";
import debounce from "lodash.debounce";

export default function CollegeSelect() {
  const [colleges, setColleges] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const selectedCity = localStorage.getItem("snippet_region");

  useEffect(() => {
    if (!selectedCity) {
      console.warn("No region selected. Redirecting to select-region.");
      navigate("/useronboarding/select-region", { replace: true });
    }
  }, [navigate, selectedCity]);

  const debouncedFetchColleges = useMemo(
    () =>
      debounce(async (query = "") => {
        if (query.trim().length < 3) {
          setColleges([]);
          return;
        }
        setLoading(true);
        try {
          const res = await api.get(
            `/college?name=${query}&city=${selectedCity}`
          );
          setColleges(res.data.data);
        } catch (err) {
          console.error("Error fetching colleges:", err);
          setColleges([]);
        } finally {
          setLoading(false);
        }
      }, 500),
    [selectedCity]
  );

  useEffect(() => {
    debouncedFetchColleges(search);
    return () => debouncedFetchColleges.cancel();
  }, [search, debouncedFetchColleges]);

  const handleCollegeSelect = (college) => {
    setSelectedCollege(college);
    localStorage.setItem("selected_college", JSON.stringify(college));
  };

  const handleNext = () => {
    if (!selectedCollege) {
      alert("Please select a college");
      return;
    }
    navigate("/useronboarding/verify-email");
  };

  return (
    <div className="min-h-screen bg-black text-[#E7E9EA] px-4 py-6 flex flex-col justify-between">
      {/* Top Section */}
      <div>
        <button className="text-[#E7E9EA] mb-4" onClick={() => navigate(-1)}>
          <ChevronLeft size={24} />
        </button>

        <h1 className="text-2xl font-semibold mb-2">Select your College</h1>
        <p className="text-sm text-gray-300 mb-4">
          Showing colleges in{" "}
          <span className="text-[#F06CB7]">{selectedCity}</span>.
        </p>

        {/* Search Box */}
        <div className="flex items-center gap-2 border border-gray-600 rounded-md px-3 py-2 mb-4">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search for college"
            className="bg-transparent outline-none text-sm w-full placeholder:text-gray-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Selected College */}
        {selectedCollege && (
          <div className="mb-6">
            <button
              className="border px-4 py-1 rounded-full text-sm"
              style={{ borderColor: "#F06CB7" }}
            >
              {selectedCollege.name}
            </button>
          </div>
        )}

        {/* College List */}
        <div>
          <p className="font-semibold text-base mb-3">
            Colleges in {selectedCity}
          </p>
          {loading ? (
            <p className="text-gray-400">Loading colleges...</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {colleges.map((college) => (
                <button
                  key={college._id}
                  className={`border text-sm px-4 py-1 rounded-full ${
                    selectedCollege?._id === college._id
                      ? "border-pink-500"
                      : "border-white"
                  }`}
                  onClick={() => handleCollegeSelect(college)}
                >
                  {college.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="flex justify-between items-center mt-10 mb-4">
        <p className="text-sm text-[#E7E9EA]">
          Can’t find your College?{" "}
          <span className="text-[#F06CB7] underline cursor-pointer">
            Add it
          </span>
        </p>
        <button
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-200 ${
            selectedCollege
              ? "bg-[#F06CB7] hover:bg-[#e05ca3]"
              : "bg-[#2e2e2e] cursor-not-allowed opacity-50"
          }`}
          onClick={handleNext}
          disabled={!selectedCollege}
        >
          <ArrowRight size={22} className="text-[#E7E9EA]" />
        </button>
      </div>
    </div>
  );
}
