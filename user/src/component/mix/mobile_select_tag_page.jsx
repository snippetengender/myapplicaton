import React, { useState, useRef, useEffect } from "react";
import { ArrowLeft, Trash2, X, Paperclip, ChevronDown } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchUserProfile,
  clearUserProfile,
} from "../../features/userSlice/userSlice";
import { createMix, resetMixes } from "../../features/mixes/mixSlice";
import imageCompression from "browser-image-compression";
import ProfileSelector from "./ProfileSelector";
import peekingImg from "../assets/Snippy_peeking.png";
import addImages from "../assets/gallery-add.svg";
import Camera from "../assets/camera.svg";
const availableTags = [
  "confession",
  "question",
  "academics",
  "jussaying",
  "polls",
  "showoff",
  "moment",
];

const ImageUploadTextArea = ({
  text,
  setText,
  imagePreview,
  removeImage,
  maxLength,
  placeholder,
  onFileSelect,
  allowImageUpload = true,
}) => {
  const fileInputRef = useRef(null);
  const textAreaRef = useRef(null);

  useEffect(() => {
    const textarea = textAreaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const scrollHeight = textarea.scrollHeight;
      textarea.style.height = `${scrollHeight}px`;
    }
  }, [text]);
  
  return (
    <>
      <div className="w-full bg-transparent border border-brand-charcoal rounded-lg p-3 flex flex-col">
        {imagePreview && (
          <div className="mb-2 relative w-28 h-28">
            <img
              src={imagePreview}
              className="w-full h-full object-cover rounded-md"
              alt="upload preview"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute -top-1 -right-1 bg-[#242426] rounded-full p-0.5"
            >
              <X size={12} />
            </button>
          </div>
        )}
        <div className="flex-grow flex flex-col">
          <textarea
            ref={textAreaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={placeholder}
            maxLength={maxLength}
            className="w-full bg-transparent resize-none outline-none text-[12px] placeholder-brand-medium-gray text-brand-off-white"
            rows="2"
          />
          <div className="flex justify-end mt-auto pt-1">
            {allowImageUpload && (
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                disabled={imagePreview !== null}
                className="text-zinc-400 disabled:text-brand-cborder-brand-charcoal"
              >
                <img src={addImages} alt="Add Images to post" />
              </button>
            )}
          </div>
        </div>
      </div>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={onFileSelect}
        className="hidden"
      />
    </>
  );
};

export default function MobilePostPage() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { data: userDetails } = useSelector((state) => state.user.profile);

  const [useLowkey, setUseLowkey] = useState(false);
  const hasLowkeyProfile = userDetails && userDetails.lowkey_profile;
  useEffect(() => {
    dispatch(clearUserProfile());
  }, [dispatch]);

  const [selectedTag, setSelectedTag] = useState(null);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [selectedNetwork, setSelectedNetwork] = useState(null);
  const [pollOptions, setPollOptions] = useState(["", ""]);
  const [newOption, setNewOption] = useState("");
  const [isPortrait, setIsPortrait] = useState(false);
  const [isTitleFocused, setIsTitleFocused] = useState(false);
  // Persisted network-mode flag; default to true if a selectedNetwork already exists
  const [enableNetworkPost, setEnableNetworkPost] = useState(() => {
    const persisted = localStorage.getItem("enableNetworkPost");
    if (persisted !== null) return persisted === "true";
    return !!localStorage.getItem("selectedNetwork");
  });

  const { isSubmitting } = useSelector((state) => state.mixes);
  const navigate = useNavigate();
  const {
    data: userProfile,
    status,
    error,
  } = useSelector((state) => state.user.profile);

  useEffect(() => {
    const storedNetwork = localStorage.getItem("selectedNetwork");
    if (storedNetwork) {
      setSelectedNetwork(JSON.parse(storedNetwork));
      // Ensure we come back in network-post mode after selecting a network
      setEnableNetworkPost(true);
    }
  }, []);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchUserProfile(id));
    }
  }, [status, dispatch]);

  useEffect(() => {
    if (selectedTag === "polls" && imageFile) {
      removeImage();
    }
  }, [selectedTag]);

  useEffect(() => {
    return () => {
      localStorage.removeItem("selectedNetwork");
    };
  }, []);

  // Keep the flag in storage so it survives navigation
  useEffect(() => {
    localStorage.setItem("enableNetworkPost", String(enableNetworkPost));
  }, [enableNetworkPost]);

  // Focus the textarea when entering
  useEffect(() => {
    if (textAreaRef.current) {
      // For network posts, focus when network is selected
      // For normal posts, focus immediately
      // if (enableNetworkPost || (enableNetworkPost && selectedNetwork)) {
        textAreaRef.current.focus();
      // }
    }
  }, [enableNetworkPost, selectedNetwork]);

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
      const previewUrl = URL.createObjectURL(compressedFile);
      setImagePreview(previewUrl);
      
      // Check if image is portrait
      const img = new Image();
      img.onload = () => {
        setIsPortrait(img.height > img.width);
      };
      img.src = previewUrl;
    } catch (err) {
      console.error("Image compression error:", err);
      alert("Failed to compress image.");
    }
  };

  const handleCameraCapture = async (event) => {
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
      const previewUrl = URL.createObjectURL(compressedFile);
      setImagePreview(previewUrl);
      
      // Check if image is portrait
      const img = new Image();
      img.onload = () => {
        setIsPortrait(img.height > img.width);
      };
      img.src = previewUrl;
    } catch (err) {
      console.error("Image compression error:", err);
      alert("Failed to compress image.");
    }
  };

  const handleTagSelect = (tag) => {
    setSelectedTag(tag);
    // If the user selects 'polls', automatically remove any selected image.
    if (tag === "polls") {
      removeImage();
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setIsPortrait(false);
  };

  const toggleNetworkPost = () => {
    setEnableNetworkPost((prev) => {
      const next = !prev;
      if (!next) {
        // turning OFF network mode clears selected network and title
        setSelectedNetwork(null);
        localStorage.removeItem("selectedNetwork");
        setTitle("");
      }
      return next;
    });
  };

  const addPollOption = () => {
    if (newOption.trim() === "" || pollOptions.length >= 5) return;
    setPollOptions([...pollOptions, newOption]);
    setNewOption("");
  };

  const removePollOption = (indexToRemove) => {
    if (pollOptions.length <= 2) return;
    setPollOptions(pollOptions.filter((_, index) => index !== indexToRemove));
  };

  const updatePollOption = (value, indexToUpdate) => {
    const newOptions = pollOptions.map((option, index) =>
      index === indexToUpdate ? value : option
    );
    setPollOptions(newOptions);
  };

  let canPost = false;
  if (selectedTag) {
    let hasContent = text.trim().length > 0 || imageFile !== null;

    if (selectedTag === "polls") {
      const hasTwoOptions =
        pollOptions.filter((opt) => opt.trim() !== "").length >= 2;
      canPost = text.trim().length > 0 && hasTwoOptions;
    } else {
      canPost = hasContent;
    }

    if (selectedNetwork && title.trim().length === 0) {
      canPost = false;
    }
  }

  const handleSubmit = () => {
    if (!canPost || isSubmitting) return;

    const mixData = {
      title,
      selectedTag,
      text,
      selectedNetwork,
      imageFile,
      pollOptions,
      useLowkey,
    };

    dispatch(createMix(mixData)).then((result) => {
      if (result.type === "mixes/create/fulfilled") {
        dispatch(resetMixes());

        localStorage.removeItem("selectedNetwork");
        navigate("/home");
      }
    });
  };

  // mirror editor refs
  const titleHiddenInputRef = useRef(null);
  const titleEditableRef = useRef(null);
  const textAreaRef = useRef(null);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  // Bottom bar + keyboard handling
  const bottomBarRef = useRef(null);
  const [bottomBarHeight, setBottomBarHeight] = useState(0);
  const [keyboardOffset, setKeyboardOffset] = useState(0);

  // Measure bottom bar height for padding
  useEffect(() => {
    if (!bottomBarRef.current) return;
    const el = bottomBarRef.current;
    const measure = () => setBottomBarHeight(el.offsetHeight || 0);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Use VisualViewport to detect keyboard overlap
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;

    const handleViewport = () => {
      const overlap = Math.max(0, Math.round(window.innerHeight - vv.height - vv.offsetTop));
      setKeyboardOffset(overlap);
    };

    handleViewport();
    vv.addEventListener("resize", handleViewport);
    vv.addEventListener("scroll", handleViewport);
    return () => {
      vv.removeEventListener("resize", handleViewport);
      vv.removeEventListener("scroll", handleViewport);
    };
  }, []);

  const handleTitleEditableInput = (e) => {
    let value = e.currentTarget.textContent || "";
    if (value.length > 100) value = value.slice(0, 100);
    // sync DOM + state
    if (e.currentTarget.textContent !== value) {
      e.currentTarget.textContent = value;
      const sel = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(e.currentTarget);
      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);
    }
    setTitle(value);
    if (titleHiddenInputRef.current) titleHiddenInputRef.current.value = value;
    // keep in view while growing
    e.currentTarget.scrollIntoView({ block: "nearest" });
  };

  const renderInputs = () => {
    const maxLength = enableNetworkPost ? 1000 : 200;

    // If network posting is enabled but no network selected, show nothing
    // if (enableNetworkPost && !selectedNetwork) {
    //   return null;
    // }

    const titleInput = enableNetworkPost &&  (
      <div className="mb-3">
        {/* Hidden input kept for semantics */}
        <input
          ref={titleHiddenInputRef}
          type="text"
          value={title}
          readOnly
          className="sr-only"
          aria-hidden="true"
          tabIndex={-1}
        />

        {/* Visible, wrapping editor */}
        <div
          ref={titleEditableRef}
          contentEditable
          role="textbox"
          aria-multiline="true"
          data-placeholder="Write a catchy headline"
          data-focused={isTitleFocused}
          onInput={handleTitleEditableInput}
          onKeyDown={(e) => {
            if (e.key === "Enter") e.preventDefault();
          }}
          onFocus={() => setIsTitleFocused(true)}
          onBlur={(e) => {
            if (!e.currentTarget.textContent?.trim()) {
              e.currentTarget.textContent = "";
            }
            setIsTitleFocused(false);
          }}
          className="ce-ph w-full bg-transparent outline-none text-xl font-semibold whitespace-pre-wrap break-words min-h-[32px] text-brand-off-white"
        />
        <span className="text-xs text-brand-dark-gray">{title.length}/100</span>
      </div>
    );
    const textArea = enableNetworkPost ? (
      <textarea
            ref={textAreaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={
              enableNetworkPost 
              ? "Add a bit more detail so people can laugh, cry, or actually reply."
                : ""
            }
            maxLength={maxLength}
            className="w-full bg-transparent resize-none outline-none text-[14px] placeholder-brand-medium-gray text-brand-off-white min-h-[120px]"
            rows="5"
          />
    ) : (
      <textarea
            ref={textAreaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Finally, a place where you can overshare your existential crises, failed crush stories, and random 3 a.m. thoughts"
            maxLength={maxLength}
            className="mt-2 w-full bg-transparent resize-none outline-none text-[18px] font-semibold placeholder-brand-medium-gray text-brand-off-white min-h-[120px]"
            rows="5"
          />
    );
    if (selectedTag === "polls") {
      return (
        <div className="space-y-4">
          {titleInput}
          <div className="w-full bg-transparent rounded-lg">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What is your poll question..?"
              maxLength={maxLength}
              className="w-full bg-transparent resize-none outline-none text-[14px] placeholder-brand-medium-gray text-brand-off-white min-h-[60px]"
              rows="3"
            />
          </div>
          <div className="space-y-2 mt-4">
            {pollOptions.map((option, index) => (
              <div key={index} className="relative">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => updatePollOption(e.target.value, index)}
                  placeholder={`Option ${index + 1}`}
                  maxLength={50}
                  className="w-full bg-transparent border border-brand-charcoal rounded-lg px-3 py-2.5 pr-10 text-sm text-brand-off-white placeholder-brand-medium-gray"
                />
                <button
                  onClick={() => removePollOption(index)}
                  disabled={pollOptions.length <= 2}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 disabled:text-brand-charcoal"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            {pollOptions.length < 5 && (
              <div className="relative">
                <input
                  type="text"
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                  placeholder="Add Option"
                  maxLength={50}
                  className="w-full bg-transparent border border-brand-charcoal rounded-lg px-3 py-2.5 pr-16 text-sm text-brand-off-white placeholder-brand-medium-gray"
                />
                <button
                  onClick={addPollOption}
                  disabled={!newOption.trim()}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs bg-brand-charcoal px-2 py-1 rounded disabled:bg-brand-almost-black disabled:text-brand-dark-gray text-brand-off-white"
                >
                  add
                </button>
              </div>
            )}
          </div>
        </div>
      );
    }

    // Default inputs for confession, question, etc.
    return (
      <div className="space-y-3">
        {titleInput}
        <div className="w-full">
          {textArea}
          {imagePreview && (
            <div className="mt-3 relative">
              {isPortrait ? (
                <div className="relative w-full h-[300px] rounded-lg overflow-hidden flex items-center justify-center">
                  {/* Blurry background using the same image */}
                  <div
                    className="absolute inset-0 bg-center bg-cover filter blur-2xl scale-110"
                    style={{ backgroundImage: `url(${imagePreview})` }}
                  />
                  {/* Optional dark overlay for contrast */}
                  <div className="absolute inset-0 bg-black/30" />
                  {/* Foreground image */}
                  <img
                    src={imagePreview}
                    alt="upload preview"
                    className="relative z-10 max-h-full max-w-full object-contain"
                  />
                  {/* Remove button */}
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 z-20 bg-black rounded-full p-1 border border-brand-charcoal"
                  >
                    <X size={16} className="text-brand-off-white" />
                  </button>
                </div>
              ) : (
                <div className="relative inline-block w-full">
                  <img
                    src={imagePreview}
                    className="w-full h-auto object-cover rounded-lg border border-brand-charcoal"
                    alt="upload preview"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 bg-black rounded-full p-1 border border-brand-charcoal"
                  >
                    <X size={16} className="text-brand-off-white" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-[#E7E9EA]" style={{ minHeight: "100dvh" }}>
      {/* Placeholder style for contentEditable */}
      <style>{`
        .ce-ph[contenteditable="true"]:empty:before {
          content: attr(data-placeholder);
          color: #676767; /* placeholder color */
          pointer-events: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Header with X button and network hint */}
      <div className="flex items-center justify-between p-4 pb-2">
        <button onClick={() => navigate("/home")} className="text-brand-off-white">
          <X size={24} />
        </button>
        <button
          onClick={toggleNetworkPost}
          className="text-xs px-3 py-1.5 rounded-full border border-brand-charcoal text-brand-medium-gray hover:border-brand-pink transition-colors"
        >
          {!enableNetworkPost ? (
            <>
              try posting with a <span className="text-brand-pink">network</span>
            </>
          ) : (
            <>
              try posting without a <span className="text-brand-pink">network</span>
            </>
          )}
        </button>
      </div>

      {/* Network Selector - Only shown when enableNetworkPost is true */}
      {enableNetworkPost && (
        <div className="px-4 pb-3 mt-2">
          {!selectedNetwork ? (
            <div
              onClick={() => navigate("/select-network")}
              className="bg-brand-almost-black font-semibold px-4 py-[10px] rounded-xl flex items-center gap-3 text-brand-off-white cursor-pointer border border-dashed border-brand-charcoal"
            >
              <div className="w-6 h-6 rounded-full border border-dashed border-brand-off-white flex items-center justify-center">
                <span className="text-xs"></span>
              </div>
              <span className="text-[14px]">Select a Network and reach more</span>
            </div>
          ) : (
            <div className="bg-brand-almost-black px-4 py-4 rounded-xl flex items-center justify-between border border-brand-charcoal">
              <div className="flex items-center gap-3">
                {selectedNetwork.image ? (
                  <img
                    src={selectedNetwork.image}
                    alt={selectedNetwork.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-brand-medium-gray" />
                )}
                <span className="text-[15px] font-medium text-brand-off-white">
                  {selectedNetwork.name}
                </span>
              </div>
              <button
                onClick={() => {
                  setSelectedNetwork(null);
                  localStorage.removeItem("selectedNetwork");
                }}
                className="text-xs text-brand-medium-gray hover:text-brand-off-white"
              >
                Change
              </button>
            </div>
          )}
        </div>
      )}

      {/* Profile Selector */}
      {enableNetworkPost  && userDetails && (
        <div className="px-4 pb-3">
          {hasLowkeyProfile ? (
            <ProfileSelector
              userDetails={userDetails}
              useLowkey={useLowkey}
              setUseLowkey={setUseLowkey}
            />
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-brand-medium-gray">Post as</span>
                <img
                  src={userDetails.profile}
                  alt={userDetails.name}
                  className="w-6 h-6 rounded-full object-cover"
                />
                <div className="text-brand-off-white text-sm font-medium">
                  {`<${userDetails.username}>`}
                </div>
                <ChevronDown size={16} className="text-brand-medium-gray" />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 px-4 pb-2" style={{ paddingBottom: bottomBarHeight + keyboardOffset }}>
        {error && (
          <p className="text-red-500 text-center my-2 text-sm">{error}</p>
        )}
        
        {renderInputs()}
      </div>

      {/* Bottom Section - Tags and Actions */}
      <div
        ref={bottomBarRef}
        className="bg-black border-t border-brand-charcoal"
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: `calc(env(safe-area-inset-bottom) + ${keyboardOffset}px)`,
          zIndex: 50,
        }}
      >
        {/* Tags Section */}
        <div className="pt-3 pb-2">
          <p className="text-[14px] font-semibold text-brand-off-white mb-2 px-4">Select Tag</p>
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-2 px-4 pb-1">
              {availableTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagSelect(tag)}
                  className={`px-3 py-1.5 rounded-full border text-[12px] transition whitespace-nowrap flex-shrink-0 ${
                    selectedTag === tag
                      ? "border-brand-pink bg-brand-pink/10 text-brand-off-white"
                      : "border-brand-charcoal text-brand-off-white"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => cameraInputRef.current?.click()}
              disabled={selectedTag === "polls" || imagePreview !== null}
              className="text-brand-medium-gray w-6 h-6 disabled:opacity-50"
            >
              <img src={Camera} alt="Open camera" />
            </button>
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={selectedTag === "polls" || imagePreview !== null}
              className="text-brand-medium-gray disabled:opacity-50"
            >
              <img src={addImages} alt="Add Images" className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-brand-off-white">
              {isTitleFocused ? `${100-title.length}` : enableNetworkPost ? `${1000-text.length}` : `${200-text.length}`} 
            </span>
            <button
              disabled={!canPost || isSubmitting || (enableNetworkPost && !selectedNetwork)}
              onClick={handleSubmit}
              className="px-6 py-2 rounded-full text-[14px] font-semibold transition disabled:bg-brand-charcoal disabled:text-black bg-brand-blue text-brand-off-white"
            >
              {isSubmitting ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleImageSelect}
        className="hidden"
      />
      <input
        type="file"
        accept="image/*"
        capture="environment"
        ref={cameraInputRef}
        onChange={handleCameraCapture}
        className="hidden"
      />
    </div>
  );
}
