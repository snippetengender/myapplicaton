import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../../../../providers/api";
import { LISTING_STATUS } from "../constants/listingStatus";

export default function Completed_listing({ listingId, status }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  if (status === LISTING_STATUS.SOLD ) {
    // returns a disabled button
    return <button
      className="bg-gray-400 text-black text-2xl font-normal mt-2 px-2 rounded-md w-full"
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
      className="bg-white text-black text-2xl font-normal mt-2 px-2 rounded-md w-full"
      onClick={handleCompleteListing}
      disabled={loading}
    >
      {loading ? "Ending..." : "End the Listing"}
    </button>
  );
}
