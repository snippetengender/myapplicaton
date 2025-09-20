import React, { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../providers/api";

export default function FallingPromptsEditor() {
  const navigate = useNavigate();

  const [targetName, setTargetName] = useState("");
  const [mainSearchQuery, setMainSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [groupedCategories, setGroupedCategories] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("selectedUser"));
    if (user?.name) setTargetName(user.name);

    fetchPromptHeadingsAndPrompts();
  }, []);

  const fetchPromptHeadingsAndPrompts = async () => {
    try {
      const headingRes = await api.get("entities/prompts", {
        params: { prompt_type: "prompt_heading", limit: 100 },
      });
      const headings = headingRes.data.data || [];

      const promptRes = await api.get("entities/prompts", {
        params: { prompt_type: "prompt", limit: 1000 },
      });
      const prompts = promptRes.data.data || [];

      const grouped = headings.map((heading, index) => {
        const headingId = heading.reference_id || heading.id || heading._id;

        const matchingPrompts = prompts.filter((prompt) => {
          return prompt.parents?.some(
            (parent) =>
              parent.reference_id === headingId ||
              parent.reference_id === heading.id ||
              parent.reference_id === heading._id
          );
        });

        return {
          id: headingId || `heading-${index}`,
          title: heading.name,
          prompts: matchingPrompts,
        };
      });

      setGroupedCategories(grouped);
    } catch (err) {
      console.error("Failed to fetch prompts or headings:", err);
    }
  };

  const handleCategoryClick = (id) => {
    setActiveCategory(activeCategory === id ? null : id);
  };

  const handlePromptSelect = (prompt) => {
    setSelectedPrompt(prompt);
  };

  const handleNext = async () => {
    if (!selectedPrompt) return;

    try {
      const userId = localStorage.getItem("user_id");
      const receiver = JSON.parse(localStorage.getItem("selectedUser"));

      if (!userId || !receiver) {
        console.error(
          "Missing user data - userId:",
          userId,
          "receiver:",
          receiver
        );
        alert("Missing user information. Please try again.");
        navigate("/home")
        return;
      }

      const senderResponse = await api.get(`/user/${userId}`);
      const sender = senderResponse.data;

      if (!sender || !sender.firebase_id) {
        console.error("Failed to fetch sender details from backend");
        alert("Failed to load user information. Please try again.");
        navigate("/home")
        return;
      }

      const bouquetData = {
        sender: {
          reference_id: sender.firebase_id,
          name: sender.name,
        },
        receiver: {
          reference_id:
            receiver.firebase_id || receiver.reference_id || receiver.id,
          name: receiver.name,
        },
        prompt: {
          name: selectedPrompt.name,
          id: selectedPrompt.id || selectedPrompt._id,
        },
      };

      const response = await api.post("bouquet/", bouquetData);

      if (response.status === 201) {
        localStorage.setItem(
          "selected_falling_prompt",
          JSON.stringify({ prompt: selectedPrompt.name })
        );
        alert("Bouquet sent successfully!");
        navigate("/home");
      }
    } catch (error) {
      console.error("Bouquet send failed", error);

      const detail = (error.response?.data?.detail || "").trim();
      if (error.response?.status === 500) {
        if (detail === "400: Cannot send bouquet within 6hrs") {
          navigate("/bouquet/regrets");
          return;
        }
        if (detail === "400: Insufficient snips") {
          navigate("/bouquet/referalfeature");
          return;
        }
      }

      if (error.response?.status === 400) {
        if (detail === "Bouquet already sent") {
          alert("You already sent a bouquet to this person");
          return;
        }

        if (detail === "Sender and receiver cannot be the same") {
          alert("You cannot send a bouquet to yourself");
          return;
        }

        // If error is 400 but not any of the above, show fallback
        alert(detail || "Something went wrong. Try again.");
        return;
      }

      // For all other errors (non-400)
      const fallbackMsg =
        error?.response?.data?.detail || "Something went wrong. Try again.";
      alert(fallbackMsg);
      navigate("/home")
    }
  };

  const filteredCategories = groupedCategories.filter((cat) =>
    cat.title.toLowerCase().includes(mainSearchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-[#E7E9EA] px-4 py-6 flex flex-col justify-between">
      <div>
        <button className="mb-5" onClick={() => navigate(-1)}>
          <ArrowLeft className="text-[#E7E9EA]" size={24} />
        </button>

        <h1 className="text-xl font-semibold leading-snug">
          what made you to fall with{" "}
          <span className="text-[#F06CB7]">{targetName}</span>
        </h1>
        <p className="text-sm text-gray-400 mt-2 mb-5">
          Lorem ipsum dolor sit amet consectetur. Sit porta blandit montes
          cursus. Tempus accumsan mauris in cras sit.
        </p>

        {selectedPrompt && (
          <div className="mb-4">
            <div className="border border-pink-500 rounded-lg p-3 text-sm text-gray-200 bg-neutral-900">
              {selectedPrompt.name}
            </div>
          </div>
        )}

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

        <div>
          {filteredCategories.map((category, index) => {
            return (
              <div
                key={category.id || `category-${index}`}
                className="border-b border-neutral-800 py-3"
              >
                {activeCategory === category.id ? (
                  <div className="transition-all duration-300 transform scale-y-100 origin-top">
                    <div className="border border-gray-600 p-3 rounded-lg space-y-3">
                      <label className="block text-[#E7E9EA] mb-2 text-sm">
                        {category.title}
                      </label>
                      {category.prompts && category.prompts.length > 0 ? (
                        <div className="max-h-[180px] overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-neutral-900">
                          {category.prompts.map((prompt, promptIndex) => {
                            const isSelected =
                              selectedPrompt &&
                              ((prompt.id &&
                                selectedPrompt.id &&
                                prompt.id === selectedPrompt.id) ||
                                (prompt._id &&
                                  selectedPrompt._id &&
                                  prompt._id === selectedPrompt._id) ||
                                (!prompt.id &&
                                  !prompt._id &&
                                  prompt.name === selectedPrompt.name &&
                                  promptIndex === selectedPrompt.index));

                            return (
                              <div
                                key={
                                  prompt.id ||
                                  prompt._id ||
                                  `prompt-${category.id}-${promptIndex}`
                                }
                              >
                                <div
                                  className={`p-2 rounded-lg text-sm cursor-pointer border ${
                                    isSelected
                                      ? "border-pink-400 bg-neutral-800"
                                      : "border-transparent hover:bg-neutral-800"
                                  }`}
                                  onClick={() =>
                                    handlePromptSelect({
                                      ...prompt,
                                      index: promptIndex,
                                    })
                                  }
                                >
                                  {prompt.name}
                                </div>

                                {/* Horizontal Line between prompts */}
                                {promptIndex < category.prompts.length - 1 && (
                                  <div className="border-b border-neutral-700 my-1" />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-gray-400 text-sm">
                          No prompts available for this category
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div
                    className="flex justify-between items-center cursor-pointer hover:bg-neutral-800 px-2 py-1 rounded"
                    onClick={() => handleCategoryClick(category.id)}
                  >
                    <p className="text-[#E7E9EA] text-sm">{category.title}</p>
                    <span className="text-gray-400 text-xs">
                      ({category.prompts ? category.prompts.length : 0} prompts)
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-end mt-8">
        <button
          disabled={!selectedPrompt}
          onClick={handleNext}
          className={`w-12 h-12 rounded-full flex items-center justify-center ${
            !selectedPrompt
              ? "bg-gray-700 cursor-not-allowed"
              : "bg-white text-black"
          }`}
        >
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
