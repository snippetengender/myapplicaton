import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, X, Search, Trash2, Paperclip, Plus } from 'lucide-react';
import { useNavigate } from "react-router-dom";

// --- Mock Data ---
const availableTags = [
  'confession', 'question', 'academics',
  'jusssaying', 'polls', 'showoff', 'moments',
];

const availableNetworks = [
  { id: 1, name: 'something', topic: 'Music' },
  { id: 2, name: 'something', topic: 'Music' },
  { id: 3, name: 'something', topic: 'Music' },
  { id: 4, name: 'something', topic: 'Music' },
];

// --- Network Selection Modal Component ---
const NetworkSelectionModal = ({ onClose, onSelectNetwork }) => {
  return (
    <div className="fixed inset-0 bg-black text-[#E7E9EA] z-50 p-4 flex flex-col">
      {/* Modal Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-1">
            <X size={24} />
          </button>
          <h1 className="text-2xl font-bold">Post to</h1>
        </div>
        <button className="text-sm border border-zinc-500 px-3 py-1 rounded-full">
          establish your own network
        </button>
      </div>
      
      {/* Description */}
      <p className="text-sm text-zinc-300 leading-relaxed mb-6">
        Lorem ipsum dolor sit amet consectetur. Pulvinar risus donec aenean
        tristique risus eu vitae felis. Donec lacus accumsan ultricies metus.
      </p>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
        <input 
          type="text"
          placeholder="search for network"
          className="w-full bg-transparent border border-zinc-700 rounded-lg pl-10 pr-4 py-2 text-sm placeholder-zinc-500"
        />
      </div>

      {/* Network List */}
      <div className="flex-1 overflow-y-auto">
        {availableNetworks.map((network) => (
          <div 
            key={network.id} 
            className="flex items-center gap-4 py-3 cursor-pointer"
            onClick={() => onSelectNetwork(network)}
          >
            <div className="w-12 h-12 bg-zinc-300 rounded-full" />
            <div>
              <p className="font-semibold">{network.name}</p>
              <p className="text-sm text-zinc-400">talks about <span className="font-semibold text-[#E7E9EA]">{network.topic}</span></p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Updated Image Upload Text Area Component ---
const ImageUploadTextArea = ({ text, setText, image, setImage, maxLength, placeholder }) => {
    const fileInputRef = useRef(null);
    const textAreaRef = useRef(null); // Ref for the textarea

    // Effect for auto-growing textarea
    useEffect(() => {
        const textarea = textAreaRef.current;
        if (textarea) {
            textarea.style.height = 'auto'; // Reset height to recalculate
            const scrollHeight = textarea.scrollHeight;
            const maxHeight = 96; // Approx 4 lines height

            if (scrollHeight > maxHeight) {
                textarea.style.height = `${maxHeight}px`;
                textarea.style.overflowY = 'auto';
            } else {
                textarea.style.height = `${scrollHeight}px`;
                textarea.style.overflowY = 'hidden';
            }
        }
    }, [text]); // Rerun when text changes

    const handleImageSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImage(URL.createObjectURL(file));
        }
        event.target.value = null; 
    };

    const removeImage = () => {
        setImage(null);
    };

    return (
        <>
            <div className="w-full bg-transparent border border-zinc-700 rounded-lg p-3 flex flex-col">
                {image && (
                    <div className="mb-2">
                        <div className="relative w-28 h-28 flex-shrink-0">
                            <img src={image} className="w-full h-full object-cover rounded-md" alt="upload preview" />
                            <button type="button" onClick={removeImage} className="absolute -top-1 -right-1 bg-[#242426] bg-opacity-70 rounded-full p-0.5 text-[#E7E9EA]">
                                <X size={12} />
                            </button>
                        </div>
                    </div>
                )}
                <div className="flex-grow flex flex-col">
                    <textarea
                        ref={textAreaRef}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder={placeholder}
                        maxLength={maxLength}
                        className="w-full bg-transparent resize-none outline-none text-sm placeholder-zinc-500 flex-grow"
                        rows="2" // Start with one row to allow dynamic growth
                    />
                    <div className="flex justify-end items-center mt-auto pt-1">
                        <button
                            type="button"
                            onClick={() => fileInputRef.current.click()}
                            disabled={image !== null}
                            className="text-zinc-400 disabled:text-zinc-700 disabled:cursor-not-allowed"
                        >
                            <Paperclip size={18} />
                        </button>
                    </div>
                </div>
            </div>
            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageSelect}
                className="hidden"
            />
        </>
    );
};


// --- Main Page Component ---
export default function TagSelectorPage() {
  const [selectedTag, setSelectedTag] = useState(null);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState(null);
  
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [newOption, setNewOption] = useState('');

  const navigate = useNavigate();

  const addPollOption = () => {
    setPollOptions([...pollOptions, newOption]);
    setNewOption('');
  };

  const removePollOption = (indexToRemove) => {
    if (pollOptions.length <= 2) return;
    setPollOptions(pollOptions.filter((_, index) => index !== indexToRemove));
  };

  const updatePollOption = (value, indexToUpdate) => {
    const newOptions = pollOptions.map((option, index) => {
      if (index === indexToUpdate) return value;
      return option;
    });
    setPollOptions(newOptions);
  };

  let canPost = false;
  if (selectedTag === 'polls') {
    const hasTwoOptions = pollOptions.filter(opt => opt.trim() !== '').length >= 2;
    if (selectedNetwork) {
      canPost = selectedTag && selectedNetwork && title.trim().length > 0 && hasTwoOptions;
    } else {
      canPost = selectedTag && (text.trim().length > 0 || image) && hasTwoOptions;
    }
  } else {
    if (selectedNetwork) {
      canPost = selectedTag && selectedNetwork && title.trim().length > 0;
    } else {
       canPost = selectedTag && (text.trim().length > 0 || image);
    }
  }

  const handleSelectNetwork = (network) => {
    setSelectedNetwork(network);
    setIsModalOpen(false);
  };
  
  const renderInputs = () => {
    const maxLength = selectedNetwork ? 1000 : 200;

    if (selectedTag === 'polls') {
      return (
        <div className="space-y-4">
          {selectedNetwork && (
            <div className="relative">
              <input
                type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                placeholder="Title" maxLength={100}
                className="w-full bg-transparent border-b border-zinc-700 focus:outline-none text-2xl font-bold placeholder-zinc-600 pb-1"
              />
              <span className="absolute -bottom-5 right-0 text-xs text-zinc-500">{title.length}/100</span>
            </div>
          )}
          <div className="relative pt-4">
             <ImageUploadTextArea 
                text={text} setText={setText}
                image={image} setImage={setImage}
                maxLength={maxLength}
                placeholder="Add a description to your poll..."
            />
            <p className="text-xs text-zinc-500 mt-1 pl-1">{text.length}/{maxLength}</p>
          </div>
          <div className="space-y-2">
            {pollOptions.map((option, index) => (
              <div key={index} className="relative">
                <input
                  type="text" value={option} onChange={(e) => updatePollOption(e.target.value, index)}
                  placeholder={`Option ${index + 1}`} maxLength={50}
                  className="w-full bg-transparent border border-zinc-700 rounded-lg p-3 pr-10 text-sm placeholder-zinc-500"
                />
                <button 
                  onClick={() => removePollOption(index)} 
                  disabled={pollOptions.length <= 2}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-[#E7E9EA] disabled:text-zinc-700 disabled:cursor-not-allowed"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
             <div className="relative">
              <input
                type="text" value={newOption} onChange={(e) => setNewOption(e.target.value)}
                placeholder="Add Option" maxLength={50}
                className="w-full bg-transparent border border-zinc-700 rounded-lg p-3 pr-16 text-sm placeholder-zinc-500"
              />
              <button onClick={addPollOption} className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#E7E9EA] bg-zinc-700 px-2 py-0.5 rounded hover:bg-zinc-600">add</button>
            </div>
          </div>
        </div>
      );
    }

    if (!selectedNetwork) {
      return (
        <div>
          <ImageUploadTextArea 
            text={text} setText={setText}
            image={image} setImage={setImage}
            maxLength={200}
            placeholder="Open up here now..."
          />
          <p className="text-xs text-zinc-500 mt-1 pl-1">{text.length}/{200}</p>
          <p className="text-xs text-zinc-400 mt-2">
            Note : You will get more character count when you select a network
          </p>
        </div>
      );
    } else {
      return (
        <div className="space-y-4">
          <p className="text-sm text-zinc-400">give your thought a</p>
          <div className="relative">
            <input
              type="text" value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder="Title" maxLength={100}
              className="w-full bg-transparent border-b border-zinc-700 focus:outline-none text-2xl font-bold placeholder-zinc-600 pb-1"
            />
            <span className="absolute -bottom-5 right-0 text-xs text-zinc-500">{title.length}/100</span>
          </div>
          <div className="relative pt-4">
            <ImageUploadTextArea 
                text={text} setText={setText}
                image={image} setImage={setImage}
                maxLength={1000}
                placeholder="Open up here now..."
            />
            <p className="text-xs text-zinc-500 mt-1 pl-1">{text.length}/{1000}</p>
          </div>
        </div>
      );
    }
  };

  return (
    <>
      {isModalOpen && <NetworkSelectionModal onClose={() => setIsModalOpen(false)} onSelectNetwork={handleSelectNetwork} />}
      
      <div className="min-h-screen bg-black text-[#E7E9EA] p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <button onClick={() => navigate("/home")}>
              <ArrowLeft className="text-[#E7E9EA]" size={24} />
            </button>
            <button
              disabled={!canPost}
              className={`px-4 py-1 rounded-full text-sm transition ${
                canPost ? 'bg-white text-black' : 'bg-[#2e2e2e] text-zinc-500 cursor-not-allowed'
              }`}
              onClick={() => {
                if (canPost) {
                  console.log('Post Submitted!', { title, text, image, selectedNetwork, selectedTag });
                  navigate("/home");
                }
              }}
            >
              Post
            </button>
          </div>

          <h1 className="text-2xl font-bold mt-6 mb-2">Select a Tag</h1>
          <p className="text-sm text-zinc-300 leading-relaxed mb-6">
            Lorem ipsum dolor sit amet consectetur. Pulvinar risus donec aenean
            tristique risus eu vitae felis. Donec lacus accumsan ultricies metus.
          </p>

          {!selectedNetwork ? (
            <div 
              className="bg-[#2e2e2e] text-zinc-400 px-4 py-3 rounded-xl mb-4 flex items-center gap-3 border border-dashed border-zinc-500 cursor-pointer"
              onClick={() => setIsModalOpen(true)}
            >
              <div className="w-5 h-5 rounded-full border border-dashed border-zinc-400" />
              <span className="text-sm">Select a Network</span>
            </div>
          ) : (
            <div className="bg-[#2e2e2e] text-[#E7E9EA] px-4 py-3 rounded-xl mb-4 flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-zinc-300" />
              <span className="text-sm font-semibold">{selectedNetwork.name}</span>
            </div>
          )}

          <div className="flex flex-wrap gap-2 mb-6">
            {availableTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-4 py-1 rounded-full border text-sm transition ${
                  selectedTag === tag ? 'border-zinc-300 text-[#E7E9EA]' : 'border-zinc-700 text-zinc-400'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {renderInputs()}

        </div>

        <p className="text-xs text-zinc-500 text-center mt-8">
          Know Lorem ipsum dolor sit amet consectetur. Pulvinar risus donec aenean
          tristique risus eu vitae felis. Donec lacus acc
        </p>
      </div>
    </>
  );
}

