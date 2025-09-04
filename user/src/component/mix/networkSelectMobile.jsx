import React from "react";
import { X, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useNetworks } from "../../shared/useNetworks";

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

  const {
    networks,
    loading,
    error,
    lastNetworkElementRef,
    searchTerm,
    handleSearchChange,
  } = useNetworks();

  const handleSelectNetwork = (network) => {
    localStorage.setItem("selectedNetwork", JSON.stringify(network));
    navigate(-1); // go back to post page
  };

  return (
    <div className="fixed inset-0 bg-black text-white z-50 p-4 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-1">
            <X size={24} />
          </button>
          <h1 className="text-2xl font-bold">Post to</h1>
        </div>
        <button
          className="text-sm border border-zinc-500 px-3 py-1 rounded-full"
          onClick={() => navigate("/mobile_createnetwork_1")}
        >
          establish your own network
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
          size={20}
        />
        <input
          type="text"
          placeholder="search for network"
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full bg-transparent border border-zinc-700 rounded-lg pl-10 pr-4 py-2 text-sm placeholder-zinc-500"
        />
      </div>

      {/* Networks */}
      <div className="flex-1 overflow-y-auto">
        {/* Show skeletons when loading initial page */}
        {loading && networks.length === 0 && (
          <>
            <NetworkSkeleton />
            <NetworkSkeleton />
            <NetworkSkeleton />
            <NetworkSkeleton />
            <NetworkSkeleton />
            <NetworkSkeleton />
            <NetworkSkeleton />
          </>
        )}

        {/* Real networks */}
        {networks.map((network, index) => {
          const isLastElement = networks.length === index + 1;
          return (
            <div
              key={network.id}
              ref={isLastElement ? lastNetworkElementRef : null}
              className="flex items-center gap-4 py-3 cursor-pointer hover:bg-zinc-900 rounded-lg px-2"
              onClick={() => handleSelectNetwork(network)}
            >
              <div className="w-12 h-12 bg-zinc-300 rounded-full flex-shrink-0" />
              <div>
                <p className="font-semibold">{network.name}</p>
                <p className="text-sm text-zinc-400">
                  talks about{" "}
                  <span className="font-semibold text-white">
                    {network.interests?.name}
                  </span>
                </p>
              </div>
            </div>
          );
        })}

        {/* Skeletons while fetching more pages */}
        {loading && networks.length > 5 && (
          <>
            <NetworkSkeleton />
            <NetworkSkeleton />
          </>
        )}

        {error && <p className="text-center text-red-500 py-4">{error}</p>}

        {!loading && networks.length === 0 && (
          <p className="text-center text-zinc-500 py-4">No networks found.</p>
        )}
      </div>
    </div>
  );
}
