import React, { useState, useRef, useEffect } from "react";
import { ArrowLeft, Trash2, X, Paperclip } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserProfile } from "../../features/userSlice/userSlice";
import { createMix, resetMixes } from "../../features/mixes/mixSlice";
import imageCompression from "browser-image-compression";

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
      <div className="w-full bg-transparent border border-zinc-700 rounded-lg p-3 flex flex-col">
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
            className="w-full bg-transparent resize-none outline-none text-sm placeholder-zinc-500"
            rows="2"
          />
          <div className="flex justify-end mt-auto pt-1">
            {allowImageUpload && (
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                disabled={imagePreview !== null}
                className="text-zinc-400 disabled:text-zinc-700"
              >
                <Paperclip size={18} />
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
  const { data: userDetails } = useSelector((state) => state.user.profile);
  console.log(userDetails);
  // Component State
  const [selectedTag, setSelectedTag] = useState(null);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [selectedNetwork, setSelectedNetwork] = useState(null);
  const [pollOptions, setPollOptions] = useState(["", ""]);
  const [newOption, setNewOption] = useState("");

  // Redux State
  const dispatch = useDispatch();
  const { isSubmitting } = useSelector((state) => state.mixes);
  const navigate = useNavigate();
  const {
    data: userProfile,
    status,
    error,
  } = useSelector((state) => state.user.profile);

  useEffect(() => {
    console.log("User Profile Data:", userProfile);
  }, [userProfile]);
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

  const handleImageSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    try {
      console.log(
        `Original file size: ${(file.size / 1024 / 1024).toFixed(2)} MB`
      );
      const compressedFile = await imageCompression(file, options);
      console.log(
        `Compressed file size: ${(compressedFile.size / 1024 / 1024).toFixed(
          2
        )} MB`
      );

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

  // `canPost` logic now matches the UI flow
  let canPost = false;
  if (selectedTag) {
    // Common condition for all post types: must have text or an image
    let hasContent = text.trim().length > 0 || imageFile !== null;

    if (selectedTag === "polls") {
      const hasTwoOptions =
        pollOptions.filter((opt) => opt.trim() !== "").length >= 2;
      // A poll must have a question (in the 'text' field) AND at least two options.
      canPost = text.trim().length > 0 && hasTwoOptions;
    } else {
      // For other tags, you just need text or an image.
      canPost = hasContent;
    }

    // Additional requirement if a network is selected: a title is also needed.
    if (selectedNetwork && title.trim().length === 0) {
      canPost = false;
    }
  }

  // FIX: handleSubmit now dispatches the Redux action
  const handleSubmit = () => {
    if (!canPost || isSubmitting) return;

    const mixData = {
      title,
      selectedTag,
      text,
      selectedNetwork,
      imageFile,
      pollOptions,
    };

    dispatch(createMix(mixData)).then((result) => {
      if (result.type === "mixes/create/fulfilled") {
        dispatch(resetMixes());

        localStorage.removeItem("selectedNetwork");
        navigate("/home");
      }
    });
  };

  // FIX: The renderInputs function is completely refactored for the correct logic
  const renderInputs = () => {
    const maxLength = selectedNetwork ? 1000 : 200;
    if (!selectedTag) {
      return (
        <p className="text-center text-zinc-500">
          Please select a tag to start.
        </p>
      );
    }

    const titleInput = selectedNetwork && (
      <div className="relative">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          maxLength={100}
          className="w-full bg-transparent border-b border-zinc-700 focus:outline-none text-2xl font-bold placeholder-zinc-600 pb-1"
        />
        <span className="absolute -bottom-5 right-0 text-xs text-zinc-500">
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
                  className="w-full bg-transparent border border-zinc-700 rounded-lg p-3 pr-10"
                />
                <button
                  onClick={() => removePollOption(index)}
                  disabled={pollOptions.length <= 2}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 disabled:text-zinc-700"
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
                  className="w-full bg-transparent border border-zinc-700 rounded-lg p-3 pr-16"
                />
                <button
                  onClick={addPollOption}
                  disabled={!newOption.trim()}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm bg-zinc-700 px-2 py-0.5 rounded disabled:bg-zinc-800"
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
        <p className="text-xs text-zinc-500 mt-1 pl-1">
          {text.length}/{maxLength}
        </p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-[#E7E9EA] p-4 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between">
          <button onClick={() => navigate("/home")}>
            <ArrowLeft size={24} />
          </button>
          <button
            disabled={!canPost || isSubmitting}
            onClick={handleSubmit}
            className="px-4 py-1 rounded-full text-sm font-semibold transition disabled:bg-[#2e2e2e] disabled:text-zinc-500 bg-white text-black"
          >
            {isSubmitting ? "Posting..." : "Post"}
          </button>
        </div>

        <h1 className="text-2xl font-bold mt-6 mb-2">Select a Tag</h1>
        <p className="text-sm text-zinc-300 mb-6">
          Select a tag and share what's on your mind.
        </p>

        {/* FIX: The "Select a Network" div now navigates instead of opening a modal */}
        {!selectedNetwork ? (
          <div
            onClick={() => navigate("/select-network")}
            className="bg-[#2e2e2e] text-zinc-400 px-4 py-3 rounded-xl mb-4 flex items-center gap-3 border border-dashed border-zinc-500 cursor-pointer"
          >
            <div className="w-5 h-5 rounded-full border border-dashed border-zinc-400" />
            <span className="text-sm">Select a Network</span>
          </div>
        ) : (
          <div className="bg-[#2e2e2e] px-4 py-3 rounded-xl mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {selectedNetwork.image ? (
                <img
                  src={selectedNetwork.image}
                  alt={selectedNetwork.name}
                  className="w-7 h-7 rounded-full object-cover border border-dashed border-zinc-400"
                />
              ) : (
                <div className="w-5 h-5 rounded-full bg-zinc-300" />
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
              className="text-xs text-zinc-400 hover:text-white"
            >
              Reset
            </button>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-6">
          {availableTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-4 py-1 rounded-full border text-sm transition ${
                selectedTag === tag
                  ? "border-zinc-300 text-[#E7E9EA]"
                  : "border-zinc-700 text-zinc-400"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
        {selectedNetwork && selectedTag ? (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <img
                src={selectedNetwork.image}
                alt={selectedNetwork.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="text-gray-400 text-md">
                {`<${userDetails.username}>`}
              </div>
            </div>
            <div onClick={() => navigate("/lowkey")}>or use Lowkey profile</div>
          </div>
        ) : (
          <div></div>
        )}

        {error && (
          <p className="text-red-500 text-center my-2 text-sm">{error}</p>
        )}
        {renderInputs()}
      </div>
      <p className="text-xs text-zinc-500 text-center mt-8 pb-4">
        Know Lorem ipsum dolor sit amet consectetur. Pulvinar risus donec aenean
        tristique risus eu vitae felis. Donec lacus acc
      </p>
    </div>
  );
}
