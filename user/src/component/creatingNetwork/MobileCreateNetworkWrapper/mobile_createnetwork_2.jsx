import React, { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, UploadCloud, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  setBannerFile,
  setLogoFile,
} from "../../../features/networkCreate/networkSlice";
import imageCompression from "browser-image-compression";

export default function MobileCreateNetwork2() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logoInputRef = useRef(null);
  const bannerInputRef = useRef(null);

  // Get data from Redux for the preview
  const { name, description, logo, banner } = useSelector(
    (state) => state.network.formData
  );

  // Local state for image previews
  const [logoPreview, setLogoPreview] = useState(
    logo ? URL.createObjectURL(logo) : null
  );
  const [bannerPreview, setBannerPreview] = useState(
    banner ? URL.createObjectURL(banner) : null
  );

  const handleFileChange = async (event, type) => {
    const file = event.target.files[0];
    if (!file) return;

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1024,
      useWebWorker: true,
    };

    try {
      const compressedFile = await imageCompression(file, options);

      if (type === "logo") {
        dispatch(setLogoFile(compressedFile));
        setLogoPreview(URL.createObjectURL(compressedFile));
      } else {
        dispatch(setBannerFile(compressedFile));
        setBannerPreview(URL.createObjectURL(compressedFile));
      }
    } catch (error) {
      console.error("Error compressing image:", error);
    }
  };

  // NEW: Function to handle removing an image
  const handleRemoveImage = (e, type) => {
    e.stopPropagation(); // Prevent the file dialog from opening
    if (type === "logo") {
      dispatch(setLogoFile(null));
      setLogoPreview(null);
    } else {
      dispatch(setBannerFile(null));
      setBannerPreview(null);
    }
  };

  const handleNext = () => navigate("/mobile_createnetwork_3");
  const handleBack = () => navigate("/mobile_createnetwork_1");

  // A check to see if we can proceed to the next step
  const canProceed = logoPreview && bannerPreview;

  return (
    <div className="bg-black text-[#E7E9EA] min-h-screen flex flex-col p-6 pb-28">
      {/* Hidden file inputs */}
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

      <header className="flex items-center justify-between w-full mb-6">
        <button
          onClick={handleBack}
          className="p-2 -ml-2 text-neutral-300 hover:text-[#E7E9EA] transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="bg-neutral-800 text-xs rounded-full px-3 py-1.5">
          2/3
        </div>
      </header>

      <main className="w-full">
        <h1 className="text-2xl font-semibold text-[#E7E9EA] mb-2">
          Style your Network
        </h1>
        <p className="text-xs text-neutral-400 leading-relaxed mb-8">
          Give your network a unique look with a logo and a banner. This helps
          members recognize your community.
        </p>

        {/* Profile Preview Card */}
        <div className="bg-black border border-neutral-800 rounded-2xl p-4 space-y-4">
          <div
            className="h-24 bg-neutral-900 rounded-lg flex items-center justify-center cursor-pointer relative"
            onClick={() => bannerInputRef.current.click()}
            style={{
              backgroundImage: `url(${bannerPreview})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {!bannerPreview && (
              <button className="text-xs border border-neutral-600 rounded-md px-3 py-1.5 pointer-events-none">
                add banner
              </button>
            )}
            {bannerPreview && (
              <button
                onClick={(e) => handleRemoveImage(e, "banner")}
                className="absolute top-2 right-2 bg-black/60 rounded-full p-1 hover:bg-black/80"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex items-center space-x-3 -mt-10">
            {/* FIX: Logo upload is now enabled */}
            <div
              className="w-16 h-16 rounded-full flex-shrink-0 bg-neutral-800 border-4 border-black flex items-center justify-center cursor-pointer relative"
              onClick={() => logoInputRef.current.click()}
              style={{
                backgroundImage: `url(${logoPreview})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {!logoPreview && (
                <UploadCloud size={20} className="text-neutral-500" />
              )}
              {logoPreview && (
                <button
                  onClick={(e) => handleRemoveImage(e, "logo")}
                  className="absolute top-0 right-0 bg-black/60 rounded-full p-0.5 hover:bg-black/80"
                >
                  <X size={10} />
                </button>
              )}
            </div>

            <div>
              <span className="font-semibold text-lg text-[#E7E9EA]">
                {name || "Network Name"}
              </span>
            </div>
          </div>
          <p className="text-sm text-neutral-400 pt-2">
            {description || "Your network description will appear here."}
          </p>
        </div>
      </main>

      <footer className="fixed bottom-6 right-6">
        <button
          onClick={handleNext}
          disabled={!canProceed}
          className="w-14 h-14 rounded-full bg-neutral-800 flex items-center justify-center transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowRight size={24} className="text-[#E7E9EA]" />
        </button>
      </footer>
    </div>
  );
}
