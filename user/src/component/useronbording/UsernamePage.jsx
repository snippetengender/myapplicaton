import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, ArrowRight, Camera } from "lucide-react";
import debounce from "lodash.debounce";
import imageCompression from "browser-image-compression";
import Avatar from "react-avatar";
import api from "../../providers/api";
import { useNavigate } from "react-router-dom";

export default function UsernamePage() {
  const [username, setUsername] = useState("");
  const [isTaken, setIsTaken] = useState(null);
  const [checking, setChecking] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState(null); // Actual File object
  const [profileImagePreview, setProfileImagePreview] = useState(null); // Blob URL for preview
  const [saving, setSaving] = useState(false);
  const [useReactAvatar, setUseReactAvatar] = useState(true); // Flag to control avatar type
  const [avatarColor, setAvatarColor] = useState(""); // Current avatar color
  const [avatarRef, setAvatarRef] = useState(null); // Reference to avatar component

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const userId = localStorage.getItem("user_id");
  const relationshipStatus = localStorage.getItem(
    "snippet_relationship_status"
  );

  // Avatar color palette
  const avatarColors = ["#22c55e", "#ef4444", "#3b82f6", "#f97316"]; // green, red, blue, orange

  // Get random color from palette
  const getRandomColor = () => {
    return avatarColors[Math.floor(Math.random() * avatarColors.length)];
  };

  // Initialize avatar color on mount or username change
  useEffect(() => {
    if (username && useReactAvatar && !avatarColor) {
      const newColor = getRandomColor();
      setAvatarColor(newColor);
      localStorage.setItem("snippet_avatar_color", newColor);
    }
  }, [username, useReactAvatar, avatarColor]);

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
    const savedImagePreview = localStorage.getItem(
      "snippet_profile_image_preview"
    );
    const savedAvatarColor = localStorage.getItem("snippet_avatar_color");
    const savedUseReactAvatar = localStorage.getItem(
      "snippet_use_react_avatar"
    );

    if (savedUsername) setUsername(savedUsername);
    if (savedImagePreview) {
      setProfileImagePreview(savedImagePreview);
      setUseReactAvatar(false);
    }
    if (savedAvatarColor) setAvatarColor(savedAvatarColor);
    if (savedUseReactAvatar !== null) {
      setUseReactAvatar(savedUseReactAvatar === "true");
    }
  }, []);

  // Save username to localStorage
  useEffect(() => {
    if (username) localStorage.setItem("snippet_username", username);
  }, [username]);

  // Save avatar preferences to localStorage
  useEffect(() => {
    localStorage.setItem("snippet_use_react_avatar", useReactAvatar.toString());
    if (avatarColor) {
      localStorage.setItem("snippet_avatar_color", avatarColor);
    }
  }, [useReactAvatar, avatarColor]);

  // Save preview URL to localStorage
  useEffect(() => {
    if (profileImagePreview) {
      localStorage.setItem(
        "snippet_profile_image_preview",
        profileImagePreview
      );
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

        // Auto-update avatar when username is available and we're using react-avatar
        if (res.data.available && useReactAvatar) {
          if (!avatarColor) {
            const newColor = getRandomColor();
            setAvatarColor(newColor);
          }
        }
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

      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
      ];
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

      console.log(
        "Compressed size:",
        (compressedBlob.size / 1024 / 1024).toFixed(2),
        "MB"
      );
      const finalFile = new File([compressedBlob], file.name, {
        type: compressedBlob.type || file.type,
        lastModified: Date.now(),
      });

      setProfileImageFile(finalFile);

      const previewUrl = URL.createObjectURL(finalFile);
      setProfileImagePreview(previewUrl);
      setUseReactAvatar(false); // Switch to uploaded image
    } catch (err) {
      console.error("Image compression failed:", err);
      alert("Failed to process the image. Please try again.");
    }
  };

  // Handle profile click - either upload image or cycle avatar color
  const handleProfileClick = () => {
    if (useReactAvatar) {
      // Change avatar color
      const newColor = getRandomColor();
      setAvatarColor(newColor);
    } else {
      // If there's an uploaded image, reset to react-avatar, otherwise open file picker
      if (profileImagePreview) {
        // Reset to react-avatar
        setUseReactAvatar(true);
        setProfileImageFile(null);
        setProfileImagePreview(null);
        localStorage.removeItem("snippet_profile_image_preview");
        URL.revokeObjectURL(profileImagePreview);
      } else {
        // Open file picker
        fileInputRef.current.click();
      }
    }
  };

  // Handle camera icon click - always opens file picker
  const handleCameraClick = (e) => {
    e.stopPropagation(); // Prevent profile click handler
    fileInputRef.current.click();
  };

  // Convert react-avatar to image blob
  const convertAvatarToBlob = () => {
    return new Promise((resolve) => {
      if (!avatarRef || !useReactAvatar) {
        resolve(null);
        return;
      }

      // Create a canvas to draw the avatar
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const size = 200; // High resolution for quality

      canvas.width = size;
      canvas.height = size;

      // Draw background circle
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI);
      ctx.fillStyle = avatarColor;
      ctx.fill();

      // Draw text
      // Draw text
      const initials = username ? username.charAt(0).toUpperCase() : "U";
      ctx.fillStyle = "#FFFFFF";
      ctx.font = `bold ${
        size * 0.4
      }px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      ctx.fillText(initials, size / 2, size / 2);

      // Convert to blob
      canvas.toBlob(
        (blob) => {
          const file = new File([blob], `avatar-${username}.png`, {
            type: "image/png",
            lastModified: Date.now(),
          });
          resolve(file);
        },
        "image/png",
        1.0
      );
    });
  };

  const handleNext = async () => {
    if (!username || isTaken) {
      alert("Please choose a valid username.");
      return;
    }

    if (!profileImageFile && !useReactAvatar) {
      alert("Please select a profile image or use the generated avatar.");
      return;
    }

    if (!userId) {
      console.error("User ID missing in localStorage");
      return;
    }

    try {
      setSaving(true);

      let fileToUpload = profileImageFile;

      // If using react-avatar, convert it to image blob
      if (useReactAvatar && username) {
        fileToUpload = await convertAvatarToBlob();
        if (!fileToUpload) {
          alert("Failed to generate avatar image. Please try again.");
          return;
        }
      }

      if (!fileToUpload) {
        alert("No profile image to upload.");
        return;
      }

      const formData = new FormData();
      formData.append("file", fileToUpload, fileToUpload.name);

      console.log("Uploading profile image...");
      console.log("File details:", {
        name: fileToUpload.name,
        type: fileToUpload.type,
        size: fileToUpload.size,
      });

      await api.post(`/user/${userId}/profile`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 30000,
      });

      console.log("Profile image uploaded successfully.");

      await api.patch(`/user/${userId}`, { username });
      console.log("Username updated successfully.");

      localStorage.setItem("snippet_username", username);
      localStorage.removeItem("snippet_profile_image_preview");
      localStorage.removeItem("snippet_avatar_color");
      localStorage.removeItem("snippet_use_react_avatar");

      navigate("/home");
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
    <div className="min-h-screen bg-black text-white px-4 py-6 flex flex-col justify-between">
      <div>
        {/* Back Button */}
        <button
          aria-label="Go back"
          className="mb-6"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="text-white" size={24} />
        </button>

        {/* Heading */}
        <h1 className="text-2xl font-bold leading-tight mb-6">
          Profile and Username <br /> Setup
        </h1>

        {/* Profile Image Upload/Avatar */}
        <div className="relative flex items-center mb-5">
          <div
            role="button"
            aria-label={
              useReactAvatar
                ? "Change avatar color or upload image"
                : "Reset to avatar or upload new image"
            }
            className="relative w-24 h-24 rounded-full overflow-hidden cursor-pointer border-2 border-white hover:border-zinc-400 transition-colors"
            onClick={handleProfileClick}
          >
            {useReactAvatar ? (
              <div className="w-full h-full">
                <Avatar
                  name={username || "u"}
                  size="96"
                  round={true}
                  color={avatarColor}
                  fgColor="#FFFFFF"
                  textSizeRatio={2.5}
                  ref={setAvatarRef}
                />
              </div>
            ) : profileImagePreview ? (
              <img
                src={profileImagePreview}
                alt="Profile preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full bg-zinc-800">
                <Camera className="text-zinc-400 w-8 h-8 mb-1" />
                <span className="text-xs text-zinc-500">Add Photo</span>
              </div>
            )}
          </div>

          {/* Camera Icon */}
          <button
            onClick={handleCameraClick}
            className="ml-3 w-10 h-10 rounded-full bg-zinc-700 hover:bg-zinc-600 transition-colors flex items-center justify-center"
            aria-label="Upload image from device"
          >
            <Camera className="text-white w-5 h-5" />
          </button>

          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            ref={fileInputRef}
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>

        {/* Avatar Instructions */}
        {useReactAvatar && username && (
          <p className="text-xs text-zinc-500 mb-4">
            Tap the avatar to change color • Tap camera icon to upload photo
          </p>
        )}

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
        {checking && (
          <p className="text-sm text-yellow-400 mb-2">
            Checking availability...
          </p>
        )}
        {isTaken === true && (
          <p className="text-sm text-red-400 mb-2">
            Sorry, username already taken
          </p>
        )}
        {isTaken === false && username && (
          <p className="text-sm text-green-400 mb-2">
            Great! Username is available
          </p>
        )}
      </div>

      {/* Next Button */}
      <div className="flex justify-end mt-10 mb-4">
        <button
          onClick={handleNext}
          disabled={
            checking ||
            !username ||
            saving ||
            (!profileImageFile && !useReactAvatar)
          }
          className={`w-12 h-12 rounded-full flex items-center justify-center ${
            checking ||
            !username ||
            saving ||
            (!profileImageFile && !useReactAvatar)
              ? "bg-zinc-600 cursor-not-allowed"
              : "bg-[#2e2e2e] hover:bg-[#3e3e3e]"
          }`}
        >
          {saving ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <ArrowRight className="text-white" size={22} />
          )}
        </button>
      </div>
    </div>
  );
}
