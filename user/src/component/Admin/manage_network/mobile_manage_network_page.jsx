import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserNetworks } from "../../../features/networkCreate/networkSlice"; // Adjust path
// Import icons for the UI
import { ArrowLeft, ChevronRight } from "lucide-react";

const NetworkItem = ({ title, onClick }) => (
  <div
    onClick={onClick}
    className="flex justify-between items-center py-4 border-b border-gray-800 cursor-pointer hover:bg-gray-900/50"
  >
    <span className="text-[#E7E9EA] text-base">{title}</span>
    <ChevronRight className="text-[#E7E9EA] h-5 w-5" />
  </div>
);

// A simple loading skeleton component to improve user experience
const NetworkItemSkeleton = () => (
  <div className="flex justify-between items-center py-4 border-b border-gray-800 animate-pulse">
    <div className="h-6 bg-gray-700 rounded w-1/3"></div>
    <div className="h-5 w-5 bg-gray-700 rounded-full"></div>
  </div>
);

export default function ManageNetworkScreen() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userId = useSelector((state) => state.user.userId);
  const {
    items: userNetworks,
    status,
    error,
  } = useSelector((state) => state.network.userNetworks);

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserNetworks(userId));
    }
  }, [userId, dispatch]);

  return (
    <div className="min-h-screen bg-black text-[#E7E9EA] p-5">
      {/* Header Section */}
      <div className="flex items-center mb-6">
        <button onClick={() => navigate(-1)} className="p-1 mr-4">
          <ArrowLeft size={24} />
        </button>
      </div>

      <h1 className="text-2xl font-bold mb-2">Manage Network</h1>

      <p className="text-sm text-gray-400 leading-relaxed mb-8">
        Here you can manage the networks you've created or establish a new one.
      </p>

      {/* Conditional Rendering based on the fetch status from Redux */}
      {status === "loading" && (
        <>
          <NetworkItemSkeleton />
          <NetworkItemSkeleton />
        </>
      )}

      {status === "failed" && (
        <p className="text-center text-red-500">
          {error || "Failed to load your networks."}
        </p>
      )}

      {status === "succeeded" && (
        <>
          {/* Section for existing networks */}
          {userNetworks.length > 0 ? (
            <div>
              <h2 className="text-sm uppercase text-gray-500 font-semibold tracking-wider pb-3 border-b border-gray-800">
                Your Network
              </h2>
              {userNetworks.map((network) => (
                <NetworkItem
                  key={network.id}
                  title={network.name}
                  onClick={() => navigate(`/networkadmin/${network.id}`)}
                />
              ))}
            </div>
          ) : null}

          {/* FIX: Conditionally render the "Create" section */}
          {userNetworks.length < 3 && (
            <div className="mt-8">
              <h2 className="text-sm uppercase text-gray-500 font-semibold tracking-wider pb-3 border-b border-gray-800">
                Create
              </h2>
              <NetworkItem
                title="Establish your own network"
                onClick={() => navigate("/mobile_createnetwork_1")}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}