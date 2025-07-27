import React, { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../providers/api";

export default function InterestPage() {
  const navigate = useNavigate();
  const [allInterests, setAllInterests] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchInterests = async () => {
      try {
        const res = await api.get("/entities/interests");
        setAllInterests(res.data.data || []);
      } catch (err) {
        console.error(" Error fetching interests:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchInterests();
  }, []);

  const user_edu = JSON.parse(localStorage.getItem("snippet_user_education"));
  useEffect(() => {
    if (!user_edu) {
      console.warn("Fill the previous page");
      navigate("/useronboarding/course-year-branch");
    }
  }, [navigate, user_edu]);

  const toggleInterest = (interest) => {
    const isSelected = selectedInterests.find(
      (i) => i.reference_id === interest.id
    );
    if (isSelected) {
      setSelectedInterests(
        selectedInterests.filter((i) => i.reference_id !== interest.id)
      );
    } else if (selectedInterests.length < 3) {
      setSelectedInterests([
        ...selectedInterests,
        {
          reference_id: interest.id,
          name: interest.name,
        },
      ]);
    }
  };

  const saveToLocalStorage = (interests) => {
    localStorage.setItem("snippet_user_interests", JSON.stringify(interests));
  };

  const handleNext = async () => {
    saveToLocalStorage(selectedInterests);

    const user_id = localStorage.getItem("user_id");
    if (!user_id || selectedInterests.length === 0) {
      console.error(" Missing user_id or no interests selected");
      return;
    }

    setSaving(true);
    try {
      await api.patch(`/user/${user_id}`, { interests: selectedInterests });
      console.log("Interests updated successfully");
      navigate("/useronboarding/prompt");
    } catch (err) {
      console.error("Error saving interests:", err.message);
    } finally {
      setSaving(false);
    }
  };

  const filteredInterests = allInterests.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white px-4 py-6 flex flex-col justify-between">
      <div>
        {/* Back Arrow */}
        <button className="mb-6" onClick={() => navigate(-1)}>
          <ArrowLeft className="text-white" size={24} />
        </button>

        {/* Headings */}
        <h1 className="text-2xl font-bold leading-tight">
          What you're into <br /> Let's start with your Interests
        </h1>
        <p className="text-sm text-zinc-300 mt-3 mb-4 leading-relaxed">
          Choose up to 3 interests that describe you best.
        </p>

        {/* Search Box */}
        <div className="flex items-center gap-2 border border-zinc-600 rounded-md px-3 py-2">
          <Search className="text-zinc-400" size={18} />
          <input
            type="text"
            placeholder="Search for interests"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none w-full text-sm text-white placeholder-zinc-500"
          />
        </div>

        {/* Selected Interests */}
        <div className="flex flex-wrap gap-2 mt-4">
          {selectedInterests.map((item) => (
            <span
              key={item.reference_id}
              className="px-3 py-1 border border-[#F06CB7] rounded-full text-sm text-white"
            >
              {item.name}
            </span>
          ))}
        </div>

        {/* Suggestion Heading */}
        <p className="text-sm font-semibold mt-6 mb-2">Pick any 3 from here</p>

        {/* Tag Suggestions */}
        <div className="border border-dashed border-zinc-700 p-3 rounded-md">
          {loading ? (
            <p className="text-zinc-400 text-sm">Loading interests...</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {filteredInterests.map((interest) => (
                <button
                  key={interest.id}
                  onClick={() => toggleInterest(interest)}
                  className={`px-3 py-1 rounded-full text-sm border transition ${
                    selectedInterests.find(
                      (i) => i.reference_id === interest.id
                    )
                      ? "border-[#F06CB7] text-white"
                      : "border-zinc-500 text-zinc-300"
                  }`}
                >
                  {interest.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex items-center justify-between mt-6">
        <p className="text-sm text-zinc-400">
          Can’t find your Interest?{" "}
          <span className="text-[#F06CB7] cursor-pointer">Add one</span>
        </p>
        <button
          onClick={handleNext}
          disabled={saving || selectedInterests.length < 3}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-200 ${
            saving || selectedInterests.length < 3
              ? "bg-gray-600 cursor-not-allowed opacity-50"
              : "bg-[#F06CB7] hover:bg-[#e05ca3]"
          }`}
        >
          {saving ? (
            <span className="loader w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          ) : (
            <ArrowRight className="text-white" size={22} />
          )}
        </button>
      </div>
    </div>
  );
}
