import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ditchNetworkById,
  fetchNetworkById,
  clearCurrentNetwork
} from "../../../features/networkCreate/networkSlice"; // Adjust path if needed

const DitchNetworkPageMobile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  // Local state for the user's input
  const [inputName, setInputName] = useState("");

  // Get the current network's data and the ditch status from Redux
  const { data: networkData } = useSelector(
    (state) => state.network.currentNetwork
  );
  const { status, error } = useSelector((state) => state.network.ditchStatus);

  useEffect(() => {
    if (id) {
      dispatch(
        fetchNetworkById({
          networkId: id,
          networkMembership: true,
          totalMixes: true,
        })
      );
    }
    return () => dispatch(clearCurrentNetwork());
  }, [id, dispatch]);

  const handleDitchNetwork = async () => {
    if (status === "loading") return;

    const resultAction = await dispatch(ditchNetworkById(id));

    if (ditchNetworkById.fulfilled.match(resultAction)) {
      alert("Network deleted successfully!");
      navigate("/home"); // Navigate to a safe page like home
    }
  };

  // The button is only enabled if the input exactly matches the network's name
  const isButtonDisabled =
    !networkData || inputName.trim() !== networkData.name;

  return (
    <div className="min-h-screen bg-black text-[#E7E9EA] p-4 font-sans flex flex-col">
      {/* Header Section */}
      <div className="flex items-center mb-6">
        <button onClick={() => navigate("/home")} className="p-1">
          <ArrowLeft size={24} />
        </button>
      </div>

      <div className="max-w-md">
        <h1 className="text-2xl font-bold mb-4">Ditch Network</h1>

        <p className="text-sm text-gray-400 leading-relaxed mb-8">
          This action is irreversible. To confirm, please type the full name of
          the network:
          <span className="font-bold text-gray-200"> {networkData?.name}</span>
        </p>

        {/* Network Name Input */}
        <div className="mb-4">
          <input
            type="text"
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            placeholder="type your network name"
            className="w-full bg-transparent border border-gray-700 rounded-lg px-4 py-3 text-sm placeholder-gray-500 focus:outline-none focus:border-red-500"
          />
        </div>

        {/* Ditch Network Button */}
        <button
          onClick={handleDitchNetwork}
          className="w-full bg-red-800/80 text-[#E7E9EA] px-6 py-3 rounded-lg text-sm font-semibold hover:bg-red-700 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed"
          disabled={isButtonDisabled || status === "loading"}
        >
          {status === "loading" ? "Ditching..." : "Ditch Network"}
        </button>

        {/* Error Message */}
        {status === "failed" && (
          <p className="mt-6 text-red-500 font-mono text-sm">
            &gt;&gt;&gt; Error: {error?.detail || "Could not delete network."}
          </p>
        )}
      </div>
    </div>
  );
};

export default DitchNetworkPageMobile;
