import React, { useEffect } from "react";
import { Search, ArrowRight, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  setFormData,
  createNetwork,
  resetForm,
  fetchInterests,
} from "../../../features/networkCreate/networkSlice";
import nextArrow from "../../assets/next.svg";

export default function MobileCreateNetwork3() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get data for the form itself
  const { interest: selectedInterest } = useSelector(
    (state) => state.network.formData
  );
  const { status: creationStatus, error: creationError } = useSelector(
    (state) => state.network.creation
  );

  // Get data for the dynamic interests list
  const { items, status, error, currentPage, canLoadMore } = useSelector(
    (state) => state.network.interests
  );

  // Fetch initial interests when the component loads
  useEffect(() => {
    // Only fetch if the list is empty
    if (items.length === 0) {
      dispatch(fetchInterests(1));
    }
  }, [dispatch, items.length]);

  // Handle selecting an interest. We now pass the whole object.
  const handleSelectInterest = (item) => {
    const isSelected = selectedInterest && selectedInterest.id === item.id;
    const newInterest = isSelected ? null : item; // Store the whole object or null
    dispatch(setFormData({ field: "interest", value: newInterest }));
  };

  const handleLoadMore = () => {
    dispatch(fetchInterests(currentPage + 1));
  };

  // src/components/MobileCreateNetwork3.jsx

  const handleSubmit = async () => {
    if (creationStatus === "loading") return;

    const resultAction = await dispatch(createNetwork());

    if (createNetwork.fulfilled.match(resultAction)) {
      // Get the networkId from the action's payload
      const networkId = resultAction.payload.networkId;
      dispatch(resetForm());

      // Use the ID to navigate to the new page
      if (networkId) {
        navigate(`/communitypage/${networkId}`);
      } else {
        // Fallback if ID is missing for some reason
        navigate("/");
      }
    }
  };
  return (
    <div className="min-h-screen bg-black text-brand-off-white px-4 pt-6 pb-28">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        {/* CORRECTED: Back button now navigates to page 2 */}
        <button
          onClick={() => navigate("/mobile_createnetwork_2")}
          className="p-2 -ml-2"
        >
          <ArrowLeft className="w-6 h-6 text-neutral-300" />
        </button>
        <div className="bg-brand-charcoal w-[65px] h-[32px] text-[15px] rounded-full px-3 py-1.5 text-black justify-center items-center flex">
          3/3
        </div>
      </div>
      <h2 className="text-[20px] font-bold">Network interest</h2>
      <p className="text-brand-off-white text-[12px] mb-4">
        Pick one interest that best describes your network. This helps others
        discover it.
      </p>

      {/* Display interests fetched from API */}
      <div className="flex flex-wrap gap-2">
        {items.map((item) => {
          const isSelected =
            selectedInterest && selectedInterest.id === item.id;
          return (
            <button
              key={item.id} // Use the unique ID from the API
              onClick={() => handleSelectInterest(item)}
              className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                isSelected
                  ? "border-brand-pink text-brand-pink "
                  : "border-brand-charcoal text-brand-off-white"
              }`}
            >
              {item.name}
            </button>
          );
        })}
      </div>

      {/* Show loading spinner or "Load More" button */}
      <div className="mt-4">
        {status === "loading" && <p>Loading interests...</p>}
        {status !== "loading" && canLoadMore && (
          <button
            onClick={handleLoadMore}
            className="text-brand-pink hover:underline"
          >
            Load More
          </button>
        )}
        {status === "failed" && (
          <p className="text-red-500">Could not load interests.</p>
        )}
      </div>

      {creationStatus === "failed" && (
        <p className="text-red-500 text-sm mt-4">
          Creation Failed: {creationError}
        </p>
      )}

      <footer className="fixed bottom-6 right-6 flex items-center justify-between bg-black px-6 py-4">
        {/* <p className="text-md">Can’t find your Interest?</p> */}
        <button
          onClick={handleSubmit}
          disabled={!selectedInterest || creationStatus === "loading"}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300
    ${
      !selectedInterest || creationStatus === "loading"
        ? "bg-[#2e2e2e] opacity-50 cursor-not-allowed" // 🔒 Disabled
        : "bg-[#E7E9EA] hover:bg-[#dfe1e2]" // ✅ Enabled + hover
    }`}
        >
          <img
            src={nextArrow}
            alt="Next arrow"
            className={`${
              !selectedInterest || creationStatus === "loading"
                ? "opacity-50"
                : ""
            }`}
          />
        </button>
      </footer>
    </div>
  );
}
