import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../../../../providers/api";
import { LISTING_STATUS } from "../constants/listingStatus";

export default function Completed_listing({ listingId, status }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  if (status === LISTING_STATUS.SOLD) {
    // returns a disabled button
    return <button
      className="w-full py-3 bg-gray-600 text-gray-300 text-base font-bold rounded-lg cursor-not-allowed"
      disabled={true}
    >
      Listing Ended
    </button>
  }

  const handleCompleteListing = async () => {
    try {
      setLoading(true);

      await api.patch(
        `/marketplace/${listingId}/listing_completed`,
        {}
      );

      navigate("/smarket", {
        state: { activeTab: "your_listing" },
      });
    } catch (error) {
      console.error("Error completing listing:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className="w-full py-3 bg-gray-200 text-black text-base font-bold rounded-lg hover:bg-white transition-colors"
      onClick={handleCompleteListing}
      disabled={loading}
    >
      {loading ? "Ending..." : "End Listing"}
    </button>
  );
}
