import React, { useState } from "react";
import { ArrowLeft, Search, ArrowRight } from "lucide-react"; // ArrowRight is still needed for the next button
import { useNavigate } from "react-router-dom"; 

const categories = [
  {
    id: "attitude",
    title: "their attitude",
    prompts: [
      "Your voice isn’t just a sound – it’s a melody that makes my heart skip a beat. Every time you sing, I find myself falling a little more in love with you.",
      "There’s something magical about the way you sing. It’s like your voice reaches right into my soul and paints the most beautiful emotions I’ve ever felt.",
      "I never knew music could feel so personal until I heard you sing. Your voice is the most beautiful love song I’ve ever heard.",
    ],
  },
  {
    id: "music",
    title: "their music",
    prompts: [
      "Music flows through them like magic, every note telling a story.",
      "Their playlist speaks louder than words; it's the soundtrack to my happiest moments.",
      "I fell for the way they make even silence sound like a melody.",
    ],
  },
  {
    id: "kindness",
    title: "their kindness",
    prompts: [
      "Their kindness lights up even the darkest of days.",
      "Every act of kindness feels like a gentle embrace.",
      "Kindness isn't just what they do; it’s who they are.",
    ],
  },
];

export default function FallingPromptsEditor() {

  // const navigate = useNavigate(); // Removed useNavigate hook
  // Dummy navigate function for standalone component
  const navigate = useNavigate();

  const [targetName, setTargetName] = useState("priya"); // Added targetName state for dynamic name
  const [activeCategory, setActiveCategory] = useState(null);
  const [selectedPrompt, setSelectedPrompt] = useState("");
  const [mainSearchQuery, setMainSearchQuery] = useState(""); // Added state for main search

  const handleCategoryClick = (id) => {
    if (activeCategory === id) {
      setActiveCategory(null);
    } else {
      setActiveCategory(id);
      // When a new category is opened, clear the selected prompt IF it belongs to a different category
      const currentCategoryPrompts = categories.find(cat => cat.id === id)?.prompts || [];
      if (selectedPrompt && !currentCategoryPrompts.includes(selectedPrompt)) {
          setSelectedPrompt("");
      }
    }
  };

  const handlePromptSelect = (prompt) => {
    setSelectedPrompt(prompt);
    // Removed: setActiveCategory(null); // This line caused the category to close automatically
  };

  const handleNext = () => {
    if (!selectedPrompt) return;
    // Save and navigate
    localStorage.setItem(
      "selected_falling_prompt",
      JSON.stringify({ prompt: selectedPrompt })
    );
    navigate("/referalfeature"); // change this to your next route
  };

  // Filter categories based on main search query
  const filteredCategories = categories.filter(category =>
    category.title.toLowerCase().includes(mainSearchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white px-4 py-6 flex flex-col justify-between">
      {/* Top Navigation */}
      <div>
        <button className="mb-5" onClick={() => navigate(-1)}>
          <ArrowLeft className="text-white" size={24} />
        </button>

        {/* Heading */}
        <h1 className="text-xl font-semibold leading-snug">
          what made you to fall with <span className="text-[#F06CB7]">{targetName}</span>
        </h1>
        <p className="text-sm text-gray-400 mt-2 mb-5">
          Lorem ipsum dolor sit amet consectetur. Sit porta blandit montes
          cursus. Tempus accumsan mauris in cras sit.
        </p>

        {/* Display Selected Prompt at the Top */}
        {selectedPrompt && (
          <div className="mb-4">
            <div className="border border-pink-500 rounded-lg p-3 text-sm text-gray-200 bg-neutral-900">
              {selectedPrompt}
            </div>
          </div>
        )}

        {/* Search Box */}
        <div className="flex items-center bg-neutral-900 rounded-lg px-3 py-2 mb-4">
          <Search className="text-gray-400 w-4 h-4 mr-2" />
          <input
            type="text"
            placeholder="search for your minds thought"
            className="bg-neutral-900 flex-1 outline-none text-sm placeholder-gray-500"
            value={mainSearchQuery}
            onChange={(e) => setMainSearchQuery(e.target.value)}
          />
        </div>

        <h2 className="text-sm mb-2 text-gray-300">
          You liked them because of
        </h2>

        {/* Category List */}
        <div>
          {filteredCategories.map((category) => (
            <div key={category.id} className="border-b border-neutral-800 py-3">
              {activeCategory === category.id ? (
                // Expanded Category View (removed transition)
                <div className="transition-all duration-300 ease-in-out transform scale-y-100 origin-top">
                  <div className="border border-gray-600 p-3 rounded-lg space-y-3 ">
                    <label className="block text-white mb-2 text-sm">
                      {category.title}
                    </label>
                    {category.prompts.map((prompt, idx) => (
                      <div
                        key={idx}
                        className={`p-2 rounded-lg text-sm cursor-pointer border ${
                          selectedPrompt === prompt
                            ? "border-pink-400 bg-neutral-800"
                            : "border-transparent hover:bg-neutral-800"
                        }`}
                        onClick={() => handlePromptSelect(prompt)}
                      >
                        {prompt}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                // Collapsed Category View (removed ArrowRight and opacity/pointer-events)
                <div
                  className={`flex justify-between items-center cursor-pointer hover:bg-neutral-800 px-2 py-1 rounded`}
                  onClick={() => handleCategoryClick(category.id)}
                >
                  <p className="text-white text-sm">{category.title}</p>
                  {/* ArrowRight icon removed from here */}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Right Navigation */}
      <div className="flex justify-end mt-8">
        <button
          disabled={!selectedPrompt}
          onClick={handleNext}
          className={`w-12 h-12 rounded-full flex items-center justify-center ${
            !selectedPrompt
              ? "bg-gray-700 cursor-not-allowed"
              : "bg-white text-black" // Changed to white background with black text when enabled
          }`}
        >
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
