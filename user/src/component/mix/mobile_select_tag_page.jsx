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
    const maxLength = selectedNetwork ? 1000 : 200;
    if (!selectedTag) {
      return (
        <p className="text-center text-[12px] text-brand-medium-gray">
          Please select a tag to start.
        </p>
      );
    }

    const titleInput = selectedNetwork && (
      <div className="relative">
        <span className="text-[13px] text-brand-off-white mb-1 block">
          Give your thought a
        </span>

        {/* Hidden input kept for semantics; still "using input" */}
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
          data-placeholder="Title"
          onInput={handleTitleEditableInput}
          onKeyDown={(e) => {
            if (e.key === "Enter") e.preventDefault();
          }}
          onBlur={(e) => {
            // ensure truly empty so :empty matches
            if (!e.currentTarget.textContent?.trim()) {
              e.currentTarget.textContent = "";
            }
          }}
          className="ce-ph w-full bg-transparent outline-none text-2xl font-semibold whitespace-pre-wrap break-words min-h-[40px] text-brand-off-white"
        />

        <span className="text-xs text-brand-medium-gray">
          {title.length}/100
        </span>
      </div>
    );

    if (selectedTag === "polls") {
      return (
        <div className="space-y-4">
          {titleInput}
          <ImageUploadTextArea
            text={text}
            setText={setText}
            imagePreview={imagePreview}
            removeImage={removeImage}
            maxLength={maxLength}
            placeholder="What is your poll question..?"
            onFileSelect={handleImageSelect}
            allowImageUpload={false}
          />
          <div className="space-y-2">
            {pollOptions.map((option, index) => (
              <div key={index} className="relative">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => updatePollOption(e.target.value, index)}
                  placeholder={`Option ${index + 1}`}
                  maxLength={50}
                  className="w-full bg-transparent border border-brand-charcoal rounded-lg p-3 pr-10"
                />
                <button
                  onClick={() => removePollOption(index)}
                  disabled={pollOptions.length <= 2}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 disabled:text-brand-cborder-brand-charcoal"
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
                  className="w-full bg-transparent border border-brand-charcoal rounded-lg p-3 pr-16"
                />
                <button
                  onClick={addPollOption}
                  disabled={!newOption.trim()}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm bg-brand-cborder-brand-charcoal px-2 py-0.5 rounded disabled:bg-zinc-800"
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
      <div className="space-y-4">
        {titleInput}
        <ImageUploadTextArea
          text={text}
          setText={setText}
          imagePreview={imagePreview}
          removeImage={removeImage}
          maxLength={maxLength}
          placeholder="Open up here now..."
          onFileSelect={handleImageSelect}
        />
        <p className="text-xs text-brand-medium-gray mt-1 pl-1">
          {text.length}/{maxLength}
        </p>
      </div>
    );
  };

  return (
    <div className="flex flex-col justify-between min-h-screen bg-black">
      {/* Placeholder style for contentEditable */}
      <style>{`
        .ce-ph[contenteditable="true"]:empty:before {
          content: attr(data-placeholder);
          color: #6b7280; /* placeholder color */
          pointer-events: none;
        }
      `}</style>
      <div className=" text-[#E7E9EA] p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <button onClick={() => navigate("/home")}>
              <ArrowLeft size={24} />
            </button>
            <button
              disabled={!canPost || isSubmitting}
              onClick={handleSubmit}
              className="px-4 py-[7px] rounded-[20px] text-[15px] transition disabled:bg-brand-charcoal disabled:text-black bg-brand-off-white text-black"
            >
              {isSubmitting ? "Posting..." : "Post"}
            </button>
          </div>

          <h1 className="text-2xl font-bold mt-[8px] mb-2">Select a Tag</h1>
          <p className="text-sm text-brand-medium-gray mb-3">
            Select a tag and share what's on your mind.
          </p>

          {/* FIX: The "Select a Network" div now navigates instead of opening a modal */}
          {!selectedNetwork ? (
            <div
              onClick={() => navigate("/select-network")}
              className="bg-brand-almost-black font-semibold px-4 py-3 rounded-xl mb-3 flex items-center gap-3 text-brand-off-white cursor-pointer"
            >
              <div className="w-5 h-5 rounded-full border border-dashed border-brand-off-white" />
              <span className="text-sm">Select a Network</span>
            </div>
          ) : (
            <div className="bg-[#2e2e2e] px-4 py-3 rounded-xl mb-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {selectedNetwork.image ? (
                  <img
                    src={selectedNetwork.image}
                    alt={selectedNetwork.name}
                    className="w-7 h-7 rounded-full object-cover border border-dashed border-zinc-400"
                  />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-brand-mtext-brand-medium-gray" />
                )}
                <span className="text-sm font-semibold">
                  {selectedNetwork.name}
                </span>
              </div>
              <button
                onClick={() => {
                  setSelectedNetwork(null);
                  localStorage.removeItem("selectedNetwork");
                }}
                className="text-xs text-brand-off-white hover:text-brand-off-white"
              >
                Reset
              </button>
            </div>
          )}

          <div className="flex flex-wrap gap-2 mb-2">
            {availableTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-4 py-1 rounded-full border text-[13px] transition text-brand-off-white ${
                  selectedTag === tag
                    ? "border-brand-pink"
                    : "border-brand-medium-gray"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
          {selectedNetwork && selectedTag && userDetails ? (
            <div className="flex items-center gap-4 max-w-[50vw]">
              {hasLowkeyProfile ? (
                <ProfileSelector
                  userDetails={userDetails}
                  useLowkey={useLowkey}
                  setUseLowkey={setUseLowkey}
                />
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <img
                      src={userDetails.profile}
                      alt={userDetails.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="text-brand-dark-gray text-md">
                      {`<${userDetails.username}>`}
                    </div>
                  </div>
                  <div
                    onClick={() => navigate("/lowkey")}
                    className="text-sm text-brand-pink cursor-pointer whitespace-nowrap"
                  >
                    or use Lowkey profile
                  </div>
                </>
              )}
            </div>
          ) : (
            <div></div>
          )}

          {error && (
            <p className="text-red-500 text-center my-2 text-sm">{error}</p>
          )}
          {renderInputs()}
        </div>
      </div>
      <div className="flex relative">
        <img
          src={peekingImg}
          alt="Peeking you"
          className="w-[104px] h-[95px] -left-3 bottom-5"
        />
        <p className="left-[80px] bottom-2 text-[8px] text-brand-dark-gray  mt-8 pb-4">
          Make sure that the content you're posting is appropriate, or read the{" "}
          <span className="text-brand-blue mr-1">terms and conditions</span>{" "}
          before you post
        </p>
      </div>
    </div>
  );
}
