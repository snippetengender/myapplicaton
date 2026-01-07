import React, { useEffect, useState, useRef } from "react";
import { ArrowLeft, Edit2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNetworkById,
  checkNetworkName,
  updateNetwork,
  setEditFormData,
  clearCurrentNetwork,
} from "../../../features/networkCreate/networkSlice";
import imageCompression from "browser-image-compression";

const SkeletonLoader = () => (
  <div className="min-h-screen bg-black text-white p-4 font-sans flex flex-col animate-pulse">
    {/* Header */}
    <div className="flex items-center justify-between mb-6">
      <ArrowLeft size={24} className="text-gray-700" />
      <div className="bg-gray-800 h-10 w-24 rounded-full"></div>
    </div>

    {/* Title */}
    <div className="h-8 bg-gray-800 rounded w-1/2 mb-2"></div>
    <div className="h-4 bg-gray-800 rounded w-full mb-8"></div>
    <div className="h-4 bg-gray-800 rounded w-3/4 mb-8"></div>

    {/* Form Inputs */}
    <div className="space-y-8">
      <div>
        <div className="h-3 bg-gray-800 rounded w-1/4 mb-2"></div>
        <div className="h-5 bg-gray-800 rounded w-full"></div>
      </div>
      <div>
        <div className="h-3 bg-gray-800 rounded w-1/4 mb-2"></div>
        <div className="h-5 bg-gray-800 rounded w-full"></div>
      </div>
    </div>

    {/* Preview */}
    <div className="mt-8">
      <div className="h-5 bg-gray-800 rounded w-1/3 mb-4"></div>
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 h-48"></div>
    </div>
  </div>
);

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = React.useState(value);
  React.useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function EditNetworkPageMobile() {
  const [isCompressing, setIsCompressing] = useState({
    logo: false,
    banner: false,
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const logoInputRef = useRef(null);
  const bannerInputRef = useRef(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);

  const { status: fetchStatus } = useSelector(
    (state) => state.network.currentNetwork
  );
  const { formData, initialData, updateStatus } = useSelector(
    (state) => state.network.editNetwork
  );
  const { isAvailable, status: nameCheckStatus } = useSelector(
    (state) => state.network.nameCheck
  );

  const debouncedName = useDebounce(formData?.name, 500);

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

  useEffect(() => {
    if (initialData) {
      setLogoPreview(initialData.image);
      setBannerPreview(initialData.banner);
    }
  }, [initialData]);

  useEffect(() => {
    if (debouncedName && initialData && debouncedName !== initialData.name) {
      dispatch(checkNetworkName(debouncedName));
    }
  }, [debouncedName, initialData, dispatch]);

  const handleInputChange = (e) => {
    dispatch(setEditFormData({ [e.target.name]: e.target.value }));
  };
  const handleFileChange = async (event, type) => {
    const file = event.target.files[0];
    if (!file) return;

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1024,
      useWebWorker: true,
    };
    setIsCompressing((prev) => ({ ...prev, [type]: true }));
    try {
      const compressedFile = await imageCompression(file, options);
      if (type === "logo") {
        dispatch(setEditFormData({ image: compressedFile }));
        setLogoPreview(URL.createObjectURL(compressedFile));
      } else {
        // banner
        dispatch(setEditFormData({ banner: compressedFile }));
        setBannerPreview(URL.createObjectURL(compressedFile));
      }
    } catch (error) {
      console.error("Error compressing image:", error);
      alert("Failed to process image.");
    } finally {
      setIsCompressing((prev) => ({ ...prev, [type]: false }));
    }
  };

  const handleSave = async () => {
    if (updateStatus === "loading") return;

    const textChanges = {};
    if (formData.name !== initialData.name) textChanges.name = formData.name;
    if (formData.description !== initialData.description)
      textChanges.description = formData.description;

    const isFileOrBlob = (value) =>
      value instanceof File || value instanceof Blob;
    const newLogoFile = isFileOrBlob(formData.image) ? formData.image : null;
    const newBannerFile = isFileOrBlob(formData.banner)
      ? formData.banner
      : null;

    if (
      Object.keys(textChanges).length === 0 &&
      !newLogoFile &&
      !newBannerFile
    ) {
      alert("No changes have been made.");
      return;
    }

    const resultAction = await dispatch(
      updateNetwork({
        networkId: id,
        textChanges,
        newLogoFile,
        newBannerFile,
      })
    );

    if (updateNetwork.fulfilled.match(resultAction)) {
      alert("Network updated successfully!");
      navigate(`/networkadmin/${id}`);
    } else {
      const errorMessage =
        resultAction.payload?.detail || "An error occurred during the update.";
      alert(`Update failed: ${errorMessage}`);
    }
  };

  if (fetchStatus === "loading" || !formData) {
    return <SkeletonLoader />;
  }

  return (
    <div className="min-h-screen bg-black text-[#E7E9EA] p-4 font-sans flex flex-col">
      <input
        type="file"
        accept="image/*"
        ref={logoInputRef}
        onChange={(e) => handleFileChange(e, "logo")}
        style={{ display: "none" }}
      />
      <input
        type="file"
        accept="image/*"
        ref={bannerInputRef}
        onChange={(e) => handleFileChange(e, "banner")}
        style={{ display: "none" }}
      />
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigate(-1)} className="p-1">
          <ArrowLeft size={24} />
        </button>
        <button
          onClick={handleSave}
          disabled={updateStatus === "loading"}
          className="bg-[#2A2A2A] text-gray-300 px-5 py-2 rounded-full text-sm font-semibold disabled:opacity-50"
        >
          {updateStatus === "loading" ? "Saving..." : "Save"}
        </button>
      </div>

      <h1 className="text-2xl font-bold mb-2">Edit network</h1>
      <p className="text-sm text-gray-400 mb-8">
        Update your network's details below.
      </p>

      <div className="space-y-6">
        <div>
          <label
            htmlFor="networkName"
            className="text-xs text-gray-400 mb-2 block"
          >
            Network Name
          </label>
          <input
            type="text"
            id="networkName"
            name="name"
            value={formData.name || ""}
            onChange={handleInputChange}
            maxLength={15}
            autoComplete="off"
            className="w-full bg-transparent border-b border-gray-700 focus:outline-none focus:border-gray-400 pb-1"
          />
          <div className="text-right text-xs text-gray-500 mt-1 flex justify-between">
            <span>
              {/* Only show a status message if the name has been changed from the original */}
              {initialData && debouncedName !== initialData.name && (
                <>
                  {nameCheckStatus === "loading" && "Checking..."}

                  {nameCheckStatus === "succeeded" && !isAvailable && (
                    <span className="text-red-500">Name taken</span>
                  )}

                  {nameCheckStatus === "succeeded" && isAvailable && (
                    <span className="text-green-500">Name available</span>
                  )}
                </>
              )}
            </span>

            <span>{(formData.name || "").length}/15</span>
          </div>
        </div>

        <div>
          <label
            htmlFor="description"
            className="text-xs text-gray-400 mb-2 block"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description || ""}
            onChange={handleInputChange}
            maxLength={500}
            rows={4}
            className="w-full bg-transparent border border-gray-700 rounded-lg p-2 focus:outline-none focus:border-gray-400 resize-none"
          />
          <p className="text-right text-xs text-gray-500 mt-1">
            {(formData.description || "").length}/500
          </p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-base font-semibold mb-4">Preview</h2>
        <div className="bg-black border border-gray-600 rounded-2xl p-4 relative">
          <img
            src={bannerPreview || "default_banner_url.jpg"}
            alt="Banner Preview"
            className="h-24 w-full object-cover rounded-t-lg mb-3"
          />

          {isCompressing.banner ? (
            <div className="absolute top-6 right-6 h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
          ) : (
            <button
              onClick={() => bannerInputRef.current.click()}
              className="absolute top-6 right-6 text-xs bg-black text-[#E7E9EA] px-3 py-1 rounded-full border border-gray-500"
            >
              edit banner
            </button>
          )}

          <div className="flex items-center space-x-3">
            <div
              onClick={() => logoInputRef.current.click()}
              className="relative w-12 h-12 cursor-pointer"
            >
              <img
                src={logoPreview || "default_logo_url.jpg"}
                alt="Logo Preview"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                {isCompressing.logo ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                ) : (
                  <Edit2 size={16} />
                )}
              </div>
            </div>
            <span className="font-bold text-lg">
              {formData.name || "Network Name"}
            </span>
          </div>
          <p className="text-sm text-white mt-3 leading-relaxed">
            Lorem ipsum dolor sit amet consectetur. Pulvinar risus donec aenean
            tristique risus eu vitae felis. Donec lacus accumsan ultricies
            metus.
          </p>
        </div>
      </div>
    </div>
  );
}
