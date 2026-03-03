
const profileDataFromBackend = {
    "name": "Siddu",
    "birthday": {
        "month": -1,
        "day": -1
    },
    "education_status": {
        "degree": "unset",
        "year": 0,
        "course": ""
    },
    // ... other fields
    "prompt": {}, // This is empty in the JSON sample
    "username": "siddu"
};

const initialState = {
    profileData: {
        name: "",
        birthday: { month: 0, day: 0 },
        gender: "",
        education_status: { degree: "", year: 0, course: "" },
        interests: [],
        prompt: { reference_id: "", name: "" },
        relationship_status: "",
        username: "",
    },
};

const updateOnboardingData = (state, payload) => {
    return {
        ...state,
        profileData: { ...state.profileData, ...payload }
    };
};

// Simulate the dispatch
const verifyMerge = () => {
    console.log("Initial State Prompt:", initialState.profileData.prompt);

    // Attempt 1: Merge raw backend data
    const newState = updateOnboardingData(initialState, profileDataFromBackend);
    console.log("Merged State Prompt (after backend update):", newState.profileData.prompt);

    // Issue: backend 'prompt' is empty object {}, but initial state has structure.
    // If backend returns {}, it overwrites { reference_id: "", name: "" } with {}.

    // In Prompt.jsx:
    // const { prompt } = useSelector((state) => state.onboarding.profileData);
    // value={prompt?.name || ""}

    // If prompt is {}, prompt?.name is undefined.
}

verifyMerge();
