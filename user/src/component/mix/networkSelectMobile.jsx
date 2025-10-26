import React, { useState, useEffect, useRef, useCallback } from "react";
import { X, Search } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom"; // Add useLocation
import { useSelector, useDispatch } from "react-redux";
import {
  fetchAllNetworks,
  setSearchTerm,
  resetAllNetworks,
} from "../../features/networkCreate/networkSlice";

function NetworkSkeleton() {
  return (
    <div className="flex items-center gap-4 py-3 px-2 animate-pulse">
      <div className="w-12 h-12 bg-zinc-700 rounded-full flex-shrink-0" />
      <div className="flex flex-col gap-2">
        <div className="w-32 h-4 bg-zinc-700 rounded" />
        <div className="w-48 h-3 bg-zinc-800 rounded" />
      </div>
    </div>
  );
}

export default function NetworkSelectPage() {
  const navigate = useNavigate();
  const location = useLocation(); // Get location to check where we came from
  const dispatch = useDispatch();

  // Check if we came from the home page
  const isFromHomePage = location.state?.fromHomePage === true;

  // 1. Get all state from the Redux store
  const {
    items: networks = [],
    status,
    error,
    currentPage,
    hasMore,
    searchTerm,
  } = useSelector((state) => state.network.allNetworks) || {};
  const loading = status === "loading";

  // Local state for handling the debounced input
  const [localSearch, setLocalSearch] = useState(searchTerm);

  useEffect(() => {
    const timerId = setTimeout(() => {
      dispatch(setSearchTerm(localSearch));
    }, 500);
    return () => clearTimeout(timerId);
  }, [localSearch, dispatch]);

  useEffect(() => {
    dispatch(fetchAllNetworks({ page: 1, searchTerm }));
  }, [searchTerm, dispatch]);

  const observer = useRef(null);

  const lastNetworkElementRef = useCallback(
    (node) => {
      if (loading) return;

      // Disconnect old observer
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          dispatch(fetchAllNetworks({ page: currentPage + 1, searchTerm }));
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, currentPage, searchTerm, dispatch]
  );

  const handleSelectNetwork = (network) => {
    // Store the selected network in localStorage (keeping existing functionality)
    localStorage.setItem("selectedNetwork", JSON.stringify(network));
    localStorage.setItem("enableNetworkPost", "true"); // ensure network mode on return
    // Check if we came from home page
    if (isFromHomePage) {
      // Navigate to the community page for this network
      navigate(`/communitypage/${network.id}`);
    } else {
      // Original behavior - just navigate back
      navigate(-1);
    }
  };

  useEffect(() => {
    return () => {
      dispatch(resetAllNetworks());
    };
  }, [dispatch]);

  useEffect(() => {
    if (networks.length > 0 && !loading) {
      // Wait for list to be rendered, then attach observer
      const lastItem = document.querySelector(".network-item:last-child");
      if (lastItem) {
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting && hasMore) {
            dispatch(fetchAllNetworks({ page: currentPage + 1, searchTerm }));
          }
        });
        observer.current.observe(lastItem);
      }
    }
  }, [networks, loading, hasMore, currentPage, searchTerm, dispatch]);

  return (
    <div className="fixed inset-0 bg-black text-brand-off-white z-50 p-4 flex flex-col">
      {/* Conditional Header */}
      {isFromHomePage ? (
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-1">
            <button onClick={() => navigate(-1)} className="p-1">
              <X size={24} />
            </button>
            <h1 className="text-[18px] font-bold">Search Networks</h1>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-1">
            <button onClick={() => navigate(-1)} className="p-1">
              <X size={24} />
            </button>
            <h1 className="text-[18px] font-bold">Post to</h1>
          </div>
          <button
            className="text-sm border border-brand-charcoal px-3 py-1 rounded-full"
            onClick={() => navigate("/mobile_createnetwork_1")}
          >
            establish your own network
          </button>
        </div>
      )}

      {/* Search */}
      <div className="relative mb-6">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-charcoal"
          size={20}
        />
        <input
          type="text"
          placeholder="search for network"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="w-full bg-transparent border border-zinc-700 rounded-lg pl-10 pr-4 py-2 text-sm"
        />
      </div>

      {/* Networks List */}
      <div className="flex-1 overflow-y-auto">
        {/* Skeletons for the very first load */}
        {loading &&
          networks.length === 0 &&
          Array.from({ length: 7 }).map((_, i) => <NetworkSkeleton key={i} />)}

        {/* Render the list of networks */}
        {networks.map((network, index) => (
          <div
            key={network.id}
            ref={networks.length === index + 1 ? lastNetworkElementRef : null}
            className="flex items-center gap-4 py-3 cursor-pointer hover:bg-zinc-900 rounded-lg px-2"
            onClick={() => handleSelectNetwork(network)}
          >
            {network.image ? (
              <img
                src={network.image}
                alt={`Profile of ${network.name}`}
                className="w-12 h-12 bg-zinc-700 rounded-full object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-12 h-12 bg-zinc-700 rounded-full flex-shrink-0 flex items-center justify-center" />
            )}

            <div>
              <p className="font-semibold">{network.name}</p>
              <p className="text-sm text-zinc-400">
                talks about{" "}
                <span className="font-semibold text-brand-off-white">
                  {network.interests?.name}
                </span>
              </p>
            </div>
          </div>
        ))}

        {/* Skeletons for loading subsequent pages */}
        {loading && networks.length > 0 && (
          <>
            <NetworkSkeleton />
            <NetworkSkeleton />
          </>
        )}

        {error && <p className="text-center text-red-500 py-4">{error}</p>}

        {!loading && networks.length === 0 && (
          <p className="text-center text-brand-charcoal py-4">No networks found.</p>
        )}
      </div>
    </div>
  );
}
