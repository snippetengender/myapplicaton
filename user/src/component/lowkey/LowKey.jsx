import { useState, useEffect, useRef } from "react";
import { ArrowLeft, ArrowRight, Check, X, Loader2, Camera } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  checkUsername,
  createLowkeyProfile,
  resetUsernameStatus,
} from "../../features/userSlice/lowkeySlice";
import imageCompression from "browser-image-compression";
import Avatar from "react-avatar";
import { resetProfileStatus } from "../../features/userSlice/userSlice";
import snippyPeek from "../assets/Snippy_peeking.png";

export default function LowkeyProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const [useAvatar, setUseAvatar] = useState(true);
  const [avatarColor, setAvatarColor] = useState("");
  const { usernameStatus, creationStatus, creationError } = useSelector(
    (state) => state.lowkeyProfile
  );
  const isChecking = usernameStatus === "loading";
  const isTaken = usernameStatus === "taken";
  const isAvailable = usernameStatus === "available";
  const isSubmitting = creationStatus === "loading";

  const avatarColors = [
    "#FEADB9",
    "#9CCDFF",
    "#FEB370",
    "#CBA3FF",
    "#AA6F73",
    "#F9E1E0",
    "#F6E0B5",
    "#EEA1CD",
    "#5A96CB",
    "#ABA1C1",
    "#FEADB9",
    "#D8C3E7",
    "#FF5555",
    "#C6F8AE",
    "#FFEF90",
  ];
  const getRandomColor = () => {
    return avatarColors[Math.floor(Math.random() * avatarColors.length)];
  };

  useEffect(() => {
    if (!avatarColor) {
      setAvatarColor(getRandomColor());
    }
  }, [avatarColor]);

  const handleImageSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    try {
      const compressedFile = await imageCompression(file, options);
      setImageFile(compressedFile);
      setImagePreview(URL.createObjectURL(compressedFile));
      setUseAvatar(false);
    } catch (err) {
      console.error("Image compression error:", err);
      alert("Failed to compress image.");
    }
  };

  useEffect(() => {
    if (username.length < 3) {
      dispatch(resetUsernameStatus());
      return;
    }
    const timerId = setTimeout(() => {
      dispatch(checkUsername(username));
    }, 500);
    return () => clearTimeout(timerId);
  }, [username, dispatch]);

  const handleProfileClick = () => {
    if (useAvatar) {
      // If using the avatar, cycle to a new random color
      setAvatarColor(getRandomColor());
    } else {
      // If showing an image preview, clicking it could allow changing the image
      fileInputRef.current.click();
    }
  };

  const convertAvatarToBlob = () => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const size = 200;

      canvas.width = size;
      canvas.height = size;

      ctx.fillStyle = avatarColor;
      ctx.fillRect(0, 0, size, size);

      const initials = username ? username.charAt(0).toUpperCase() : "u";
      ctx.fillStyle = "#FFFFFF";
      ctx.font = `bold ${size * 0.5}px Arial`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(initials, size / 2, size / 2);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const file = new File([blob], `avatar-${username || "user"}.png`, {
              type: "image/png",
            });
            resolve(file);
          } else {
            resolve(null);
          }
        },
        "image/png",
        1.0
      );
    });
  };

  const handleSubmit = async () => {
    if (!isAvailable || isSubmitting) return;

    let finalImageFile = imageFile;

    if (useAvatar) {
      const avatarFile = await convertAvatarToBlob();
      if (!avatarFile) {
        alert("Could not generate avatar. Please try again.");
        return;
      }
      finalImageFile = avatarFile;
    }

    if (!finalImageFile) {
      alert("Please select a profile image or use the generated avatar.");
      return;
    }

    const profileData = {
      username,
      name: username,
      bio: "",
      imageFile: finalImageFile,
    };

    dispatch(createLowkeyProfile(profileData)).then((result) => {
      if (createLowkeyProfile.fulfilled.match(result)) {
        dispatch(resetProfileStatus());
        navigate(-1);
      }
    });
  };

  return (
    <div className="min-h-screen bg-black text-brand-off-white flex flex-col p-6 relative">
      <button onClick={() => navigate(-1)} className="top-6 left-6 mb-2">
        <ArrowLeft className="w-6 h-6" />
      </button>

      <div className="flex flex-col max-w-md mx-auto space-y-8">
        <div>
          <h1 className="text-[20px] font-bold">about</h1>
          <h2 className="text-[20px] font-bold">lowkey profile</h2>
          <p className="text-sm mt-2">
            Create an anonymous profile to interact without revealing your main
            identity. DISCLAIMER : Once created this can't be changed
          </p>
        </div>

        {/* NEW: Updated profile image section */}
        <div className="flex items-center">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageSelect}
            className="hidden"
          />
          <div
            role="button"
            aria-label="Change profile picture"
            onClick={handleProfileClick}
            className="relative w-[100px] h-[100px] rounded-full bg-zinc-800 flex items-center justify-center cursor-pointer overflow-hidden"
          >
            {!useAvatar && imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <Avatar
                name={username || "u"} // Show "U" if username is empty
                size="96"
                color={avatarColor}
                round={true}
                fgColor="black"
                textSizeRatio={2}
              />
            )}
          </div>
          {/* <button
            onClick={() => fileInputRef.current.click()}
            className="ml-5 w-10 h-10 rounded-full bg-zinc-700 hover:bg-zinc-600 transition-colors flex items-center justify-center"
            aria-label="Upload image"
          >
            <Camera size={20} />
          </button> */}
        </div>

        <div className="space-y-2">
          <label className="block text-brand-off-white text-sm">
            Give your lowkey profile a
          </label>
          <div className="relative">
            <input
              type="text"
              value={username}
              maxLength={15}
              onChange={(e) =>
                setUsername(e.target.value.toLowerCase().replace(/\s/g, ""))
              }
              placeholder="{username}"
              className="w-full bg-transparent text-[28px] font-bold placeholder-brand-medium-gray pr-8"
            />
            <div className="absolute right-0 top-1/2 -translate-y-1/2">
              {isChecking && (
                <Loader2 size={16} className="animate-spin text-zinc-500" />
              )}
              {isAvailable && <Check size={16} className="text-green-500" />}
              {isTaken && <X size={16} className="text-red-500" />}
            </div>
          </div>
          <div className="flex justify-between items-center text-brand-charcoal text-xs">
            <span>{username.length}/15</span>
            {isTaken && (
              <p className="text-red-500">Sorry, username already taken</p>
            )}
            {isAvailable && (
              <p className="text-green-500">Username is available!</p>
            )}
          </div>
        </div>
      </div>

      <div className="w-full flex mt-24 justify-center items-center">
        <img
          src={snippyPeek}
          alt="Snippy Peeking"
          className="w-20 h-auto absolute -left-2"
        />
        <p className="text-[8px] font-medium text-brand-dark-gray">
          Read the <span className="text-brand-blue">terms and conditions</span>{" "}
          before you start
        </p>
      </div>

      {creationError && (
        <p className="text-center text-red-500 text-sm">{creationError}</p>
      )}

      <button
        onClick={handleSubmit}
        disabled={!isAvailable || isSubmitting}
        className="absolute bottom-6 right-6 bg-brand-off-white text-black rounded-full p-4 hover:bg-zinc-200 transition disabled:bg-zinc-700 disabled:text-zinc-500"
      >
        {isSubmitting ? (
          <Loader2 className="animate-spin" />
        ) : (
          <ArrowRight className="w-5 h-5" />
        )}
      </button>
    </div>
  );
}
