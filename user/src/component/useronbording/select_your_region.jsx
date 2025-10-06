import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, Search, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../providers/api";
import debounce from "lodash.debounce";

export default function RegionSelect() {
  const [regions, setRegions] = useState([]);
  const [selected, setSelected] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchRegions = useCallback(
    debounce(async (query = "") => {
      if (query.trim().length < 2) {
        setRegions([]);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const res = await api.get(
          `/college/city?name=${encodeURIComponent(query)}`
        );
        setRegions(res.data.data || []);
      } catch (err) {
        console.error("Detailed error information:");
        console.error("Error message:", err.message);
        console.error("Error code:", err.code);
        console.error("Error config:", err.config);
        console.error("Error request:", err.request);
        console.error("Error response:", err.response);

        if (err.response) {
          console.error("Response status:", err.response.status);
          console.error("Response data:", err.response.data);
          console.error("Response headers:", err.response.headers);
          setError(
            `Server error: ${err.response.status} - ${
              err.response.data?.detail || err.response.statusText
            }`
          );
        } else if (err.request) {
          console.error("Request made but no response received");
          setError(
            "No response from server. Please check your internet connection."
          );
        } else {
          console.error("Error setting up request:", err.message);
          setError(`Request error: ${err.message}`);
        }

        setRegions([]);
      } finally {
        setLoading(false);
      }
    }, 500),
    []
  );

  useEffect(() => {
    if (search.trim() !== "") {
      fetchRegions(search);
    } else {
      setRegions([]);
      setError("");
    }
  }, [search, fetchRegions]);

  const handleNext = () => {
    if (!selected) {
      alert("Please select a region");
      return;
    }
    localStorage.setItem("snippet_region", selected);
    navigate("/useronboarding/select-college");
  };

  return (
    <div className="min-h-screen bg-black text-[#E7E9EA] px-4 py-6 flex flex-col justify-between">
      <div>
        <button className="text-[#E7E9EA] mb-4" onClick={() => navigate(-1)}>
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-2xl font-semibold mb-2">Select your Region</h1>
        <p className="text-sm text-gray-300 mb-4">
          Search your college region below.{" "}
          <span className="underline">Learn more</span>
        </p>
        <div className="flex items-center gap-2 border border-gray-600 rounded-md px-3 py-2 mb-4">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search for region"
            className="bg-transparent outline-none text-sm w-full placeholder:text-gray-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-900 border border-red-600 rounded-md">
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        )}

        {selected && (
          <div className="mb-6">
            <button
              className="border px-4 py-1 rounded-full text-sm"
              style={{ borderColor: "#F06CB7" }}
            >
              {selected}
            </button>
          </div>
        )}
        <div>
          <p className="font-semibold text-base mb-3">Your college is in</p>
          {loading ? (
            <p className="text-gray-400">Loading regions...</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {regions.map((region, index) => (
                <button
                  key={index}
                  className={`border text-sm px-4 py-1 rounded-full ${
                    selected === region.city
                      ? "border-pink-500"
                      : "border-white"
                  }`}
                  onClick={() => setSelected(region.city)}
                >
                  {region.city}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-between items-center mt-10 mb-4">
        <p className="text-sm text-[#E7E9EA]">
          Can't find your Region?{" "}
          <span className="text-[#F06CB7] underline cursor-pointer">
            Add em
          </span>
        </p>
        <button
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-200 ${
            selected
              ? "bg-[#F06CB7] hover:bg-[#e05ca3]"
              : "bg-[#2e2e2e] cursor-not-allowed opacity-50"
          }`}
          onClick={handleNext}
          disabled={!selected}
        >
          <ArrowRight size={22} className="text-[#E7E9EA]" />
        </button>
      </div>
    </div>
  );
}
