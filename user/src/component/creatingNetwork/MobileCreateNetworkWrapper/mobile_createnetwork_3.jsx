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

      alert("Network created successfully!");
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
    <div className="min-h-screen bg-black text-white px-4 pt-6 pb-28">
      <header className="flex items-center gap-2 mb-4">
        <button
          onClick={() => navigate("/mobile_createnetwork_2")}
          className="p-2 -ml-2"
        >
          <ArrowLeft className="w-6 h-6 text-neutral-300" />
        </button>
        <span className="ml-auto bg-[#2F3336] px-3 py-1 rounded-full text-sm">
          3/3
        </span>
      </header>
      <h2 className="text-lg font-semibold">Network interest</h2>
      <p className="text-gray-400 text-sm mb-4">
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
                  ? "border-pink-500 text-pink-500 bg-pink-900/20"
                  : "border-neutral-700 text-neutral-400"
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
            className="text-pink-500 hover:underline"
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

      <footer className="fixed bottom-0 left-0 right-0 flex items-center justify-between bg-black px-6 py-4">
        <p className="text-md">Can’t find your Interest?</p>
        <button
          onClick={handleSubmit}
          disabled={!selectedInterest || creationStatus === "loading"}
          className="w-12 h-12 rounded-full bg-[#2e2e2e] flex items-center justify-center disabled:opacity-50"
        >
          {creationStatus === "loading" ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <ArrowRight size={22} className="text-white" />
          )}
        </button>
      </footer>
    </div>
  );
}
