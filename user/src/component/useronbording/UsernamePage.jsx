import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, ArrowRight, Camera } from "lucide-react";
import debounce from "lodash.debounce";
import imageCompression from "browser-image-compression";
import api from "../../providers/api";
import { useNavigate } from "react-router-dom";

export default function UsernamePage() {
  const [username, setUsername] = useState("");
  const [isTaken, setIsTaken] = useState(null);
  const [checking, setChecking] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState(null); // Actual File object
  const [profileImagePreview, setProfileImagePreview] = useState(null); // Blob URL for preview
  const [saving, setSaving] = useState(false);

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const userId = localStorage.getItem("user_id");
  const relationshipStatus = localStorage.getItem("snippet_relationship_status");

  // Redirect if relationship status missing
  useEffect(() => {
    if (!relationshipStatus) {
      console.warn("Relationship status not found. Redirecting...");
      navigate("/useronboarding/relationship-status", { replace: true });
    }
  }, [relationshipStatus, navigate]);

  // Load saved data from localStorage
  useEffect(() => {
    const savedUsername = localStorage.getItem("snippet_username");
    const savedImagePreview = localStorage.getItem("snippet_profile_image_preview");
    if (savedUsername) setUsername(savedUsername);
    if (savedImagePreview) setProfileImagePreview(savedImagePreview);
  }, []);

  // Save username to localStorage
  useEffect(() => {
    if (username) localStorage.setItem("snippet_username", username);
  }, [username]);

  // Save preview URL to localStorage
  useEffect(() => {
    if (profileImagePreview) {
      localStorage.setItem("snippet_profile_image_preview", profileImagePreview);
    }
  }, [profileImagePreview]);

  // Debounced username availability check
  const checkUsername = useRef(
    debounce(async (name) => {
      if (name.trim().length < 3) {
        setIsTaken(null);
        return;
      }
      setChecking(true);
      try {
        const res = await api.post("/user/check-username", { username: name });
        setIsTaken(!res.data.available); // true = taken, false = available
      } catch (err) {
        console.error("Username check failed:", err);
        setIsTaken(null);
      } finally {
        setChecking(false);
      }
    }, 500)
  ).current;

  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setUsername(value);
    checkUsername(value);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      console.log("Original size:", (file.size / 1024 / 1024).toFixed(2), "MB");

      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        alert("Please select a valid image file (JPEG, PNG, or WebP).");
        return;
      }

      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        alert("File too large. Please choose an image smaller than 5MB.");
        return;
      }

      // Compress the image
      const compressedBlob = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
        fileType: file.type, // preserve original type
      });

      console.log("Compressed size:", (compressedBlob.size / 1024 / 1024).toFixed(2), "MB");
      const finalFile = new File([compressedBlob], file.name, {
        type: compressedBlob.type || file.type,
        lastModified: Date.now(),
      });

      setProfileImageFile(finalFile);

      const previewUrl = URL.createObjectURL(finalFile);
      setProfileImagePreview(previewUrl);
    } catch (err) {
      console.error("Image compression failed:", err);
      alert("Failed to process the image. Please try again.");
    }
  };

  const handleNext = async () => {
    if (!username || isTaken) {
      alert("Please choose a valid username.");
      return;
    }

    if (!profileImageFile) {
      alert("Please select a profile image.");
      return;
    }

    if (!userId) {
      console.error("User ID missing in localStorage");
      return;
    }

    try {
      setSaving(true);

      const formData = new FormData();
      formData.append("file", profileImageFile, profileImageFile.name);

      console.log("Uploading profile image...");
      console.log("File details:", {
        name: profileImageFile.name,
        type: profileImageFile.type,
        size: profileImageFile.size,
      });

      await api.post(`/user/${userId}/profile`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 30000,
        // maxContentLength: Infinity,
        // maxBodyLength: Infinity,
        // onUploadProgress: (progressEvent) => {
        //   const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        //   console.log(`Upload progress: ${percent}%`);
        // },
      });

      console.log("Profile image uploaded successfully.");

      await api.patch(`/user/${userId}`, { username });
      console.log("Username updated successfully.");
       localStorage.setItem("snippet_username", username);
      localStorage.removeItem("snippet_profile_image_preview");

      navigate("/useronboarding/user-profile");
    } catch (err) {
      console.error("Error saving profile details:", err);

      if (err.response) {
        console.error("Error response:", err.response.data);
        if (err.response.status === 422) {
          alert("Invalid file format. Please upload a valid image.");
        } else {
          alert(err.response.data?.detail || "An error occurred while saving.");
        }
      } else if (err.request) {
        alert("Network error. Please check your connection.");
      } else {
        alert("Unexpected error: " + err.message);
      }
    } finally {
      setSaving(false);
    }
  };

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (profileImagePreview && profileImagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(profileImagePreview);
      }
    };
  }, [profileImagePreview]);

  return (
    <div className="min-h-screen bg-black text-[#E7E9EA] px-4 py-6 flex flex-col justify-between">
      <div>
        {/* Back Button */}
        <button
          aria-label="Go back"
          className="mb-6"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="text-[#E7E9EA]" size={24} />
        </button>

        {/* Heading */}
        <h1 className="text-2xl font-bold leading-tight mb-6">
          Profile and Username <br /> Setup
        </h1>

        {/* Profile Image Upload */}
        <div
          role="button"
          aria-label="Upload profile image"
          className="relative w-24 h-24 rounded-full bg-zinc-800 overflow-hidden mx-2 mb-5 cursor-pointer border-2 border-white hover:border-zinc-400 transition-colors"
          onClick={() => fileInputRef.current.click()}
        >
          {profileImagePreview ? (
            <img
              src={profileImagePreview}
              alt="Profile preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <Camera className="text-zinc-400 w-8 h-8 mb-1" />
              <span className="text-xs text-zinc-500">Add Photo</span>
            </div>
          )}
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            ref={fileInputRef}
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>

        {/* Username Prompt */}
        <p className="text-sm text-zinc-400 mb-6">Choose a username</p>

        {/* Username Input */}
        <div className="w-full mb-3">
          <input
            type="text"
            placeholder="<username>"
            maxLength={15}
            value={username}
            onChange={handleUsernameChange}
            className="bg-transparent text-xl font-bold outline-none w-full placeholder:text-zinc-600"
          />
        </div>

        {/* Character Count */}
        <p className="text-xs text-zinc-500 mb-2">{username.length}/15</p>

        {/* Username Availability */}
        {checking && <p className="text-sm text-yellow-400 mb-2">Checking availability...</p>}
        {isTaken === true && <p className="text-sm text-red-400 mb-2">Sorry, username already taken</p>}
        {isTaken === false && username && (
          <p className="text-sm text-green-400 mb-2">Great! Username is available</p>
        )}
      </div>

      {/* Next Button */}
      <div className="flex justify-end mt-10 mb-4">
        <button
          onClick={handleNext}
          disabled={checking || !username || !profileImageFile || saving}
          className={`w-12 h-12 rounded-full flex items-center justify-center ${
            checking || !username || !profileImageFile || saving
              ? "bg-zinc-600 cursor-not-allowed"
              : "bg-[#2e2e2e] hover:bg-[#3e3e3e]"
          }`}
        >
          {saving ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <ArrowRight className="text-[#E7E9EA]" size={22} />
          )}
        </button>
      </div>
    </div>
  );
}
