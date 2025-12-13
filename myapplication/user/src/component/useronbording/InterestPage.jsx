import React, { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../providers/api";
import { useDispatch, useSelector } from "react-redux";
import { updateOnboardingData, updateOnboardingStep } from "../../features/userSlice/onboardingSlice";
import searchImg from "../assets/search.svg";
import nextArrow from "../assets/next.svg";

export default function InterestPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { interests: selectedInterests = [] } = useSelector(
    (state) => state.onboarding.profileData
  );

  const [allInterests, setAllInterests] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

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

  const toggleInterest = (interest) => {
    const isSelected = selectedInterests.some(
      (i) => i.reference_id === interest.id
    );

    let newInterests;

    if (isSelected) {
      newInterests = selectedInterests.filter(
        (i) => i.reference_id !== interest.id
      );
    } else if (selectedInterests.length < 3) {
      newInterests = [
        ...selectedInterests,
        {
          reference_id: interest.id,
          name: interest.name,
        },
      ];
    } else {
      return;
    }
    dispatch(updateOnboardingData({ interests: newInterests }));
  };

   const handleNext = () => {
    dispatch(updateOnboardingStep({ interests: selectedInterests }));
    
    navigate("/useronboarding/prompt");
  };
  const filteredInterests = allInterests.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-brand-off-white px-4 py-6 flex flex-col justify-between">
      <div>
        {/* Back Arrow */}
        <button className="mb-4" onClick={() => navigate(-1)}>
          <ArrowLeft className="text-brand-off-white" size={24} />
        </button>

        {/* Headings */}
        <h1 className="text-[20px] font-bold leading-tight">
          What you're into 
        </h1>
        <p className="text-[12px] mt-3 mb-4 leading-relaxed">
          Choose up to 3 interests that describe you best.
        </p>

        {/* Search Box */}
        <div className="flex items-center gap-2 border border-brand-charcoal rounded-md px-3 py-2">
          <img src={searchImg} alt="Search" className="mr-2" />
          <input
            type="text"
            placeholder="Search for interests"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-[28px] bg-transparent outline-none w-full text-sm text-brand-off-white placeholder-brand-charcoal"
          />
        </div>

        {/* Selected Interests */}
        <div className="flex flex-wrap gap-2 mt-4">
          {selectedInterests.map((item) => (
            <span
              key={item.reference_id}
              className="px-3 py-1 border border-brand-pink rounded-full text-sm text-brand-off-white"
            >
              {item.name}
            </span>
          ))}
        </div>

        {/* Suggestion Heading */}
        <p className="text-sm font-semibold mt-6 mb-2">Pick any 3 from here (sorry Beta version)</p>

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
                    selectedInterests.some(
                      (i) => i.reference_id === interest.id
                    )
                      ? "border-brand-pink text-brand-off-white"
                      : "border-brand-charcoal text-brand-off-white"
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
      <div className="flex mt-6 items-end justify-end">
        {/* <p className="text-sm text-zinc-400">
          Can’t find your Interest?{" "}
          <span className="text-brand-pink cursor-pointer">Add one</span>
        </p> */}
        <button
          onClick={handleNext}
          disabled={selectedInterests.length < 3}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-200 ${
            selectedInterests.length < 3
              ? "bg-brand-medium-gray cursor-not-allowed opacity-50"
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
