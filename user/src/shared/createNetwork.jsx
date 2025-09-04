import { useState, useEffect } from "react";
import api from "../providers/api";

const STORAGE_KEY = "network_draft";

export const useCreateNetwork = () => {
  const [networkData, setNetworkData] = useState(() => {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved
    ? JSON.parse(saved)
    : { name: "", description: "", interests: { reference_id: "", name: "" }, image: "", banner: "" };
});


  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setNetworkData(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage whenever networkData changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(networkData));
  }, [networkData]);

  // Update specific field
  const updateField = (field, value) => {
    setNetworkData((prev) => ({ ...prev, [field]: value }));
  };

  // Reset all
  const reset = () => {
  setNetworkData({
    name: "",
    description: "",
    interests: { reference_id: "", name: "" },
    image: "",
    banner: "",  
  });
  localStorage.removeItem(STORAGE_KEY);
};


  // Final submit (call backend)
  const submit = async () => {
    try {
      const res = await api.post("/networks", networkData);
      reset();
      return res.data;
    } catch (err) {
      throw err.response?.data?.detail || "Failed to create network";
    }
  };

  return {
    networkData,
    updateField,
    submit,
    reset,
  };
};
