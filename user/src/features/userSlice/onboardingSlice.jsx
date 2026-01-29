import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../providers/api";
import { fetchUserProfile } from "../userSlice/userSlice";

/* =======================
   UPDATE STEP
======================= */
export const updateOnboardingStep = createAsyncThunk(
  "onboarding/updateStep",
  async (stepData, { getState, dispatch, rejectWithValue }) => {
    dispatch(updateOnboardingData(stepData));

    try {
      const { userId } = getState().user;
      if (!userId) {
        throw new Error("User ID not found. Cannot update profile.");
      }

      const response = await api.patch(`/user/${userId}`, stepData);

      // ✅ CRITICAL FIX: sync user profile after edit
      dispatch(fetchUserProfile(userId));

      return response.data;
    } catch (err) {
      console.error("Onboarding step failed:", err);
      return rejectWithValue(err.response?.data?.detail || "Update failed");
    }
  }
);

export const uploadOnboardingProfileImage = createAsyncThunk(
  "onboarding/uploadImage",
  async (profileImageFile, { getState, rejectWithValue }) => {
    try {
      const { userId } = getState().user;
      if (!userId) {
        throw new Error("User ID not found. Cannot upload image.");
      }

      const formData = new FormData();
      formData.append("file", profileImageFile);

      await api.post(`/user/${userId}/profile`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // ✅ OPTIONAL BUT GOOD: refresh profile image
      dispatch(fetchUserProfile(userId));

      return { success: true };
    } catch (err) {
      console.error("Profile image upload failed:", err);
      return rejectWithValue(err.response?.data?.message || "Upload failed");
    }
  }
);

/* =======================
   INITIAL STATE
======================= */
const initialState = {
  status: "idle",
  error: null,
  profileData: {
    name: "",
    birthday: { month: 0, day: 0 },
    gender: "",
    education_status: { degree: "", year: 0, course: "" },
    interests: [],
    prompt: { reference_id: "", name: "" },
    relationship_status: "",
    username: "",
    email: "",
    college_id: "",
    college_show: "",
    firebase_id: "",
  },
};

const onboardingSlice = createSlice({
  name: "onboarding",
  initialState,
  reducers: {
    initializeOnboarding: (state, action) => {
      state.status = "building";
      state.profileData = { ...state.profileData, ...action.payload };
    },
    updateOnboardingData: (state, action) => {
      state.profileData = { ...state.profileData, ...action.payload };
    },
    resetOnboardingState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateOnboardingStep.pending, (state) => {
        state.status = "submitting";
      })
      .addCase(updateOnboardingStep.fulfilled, (state) => {
        state.status = "building";
      })
      .addCase(updateOnboardingStep.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(uploadOnboardingProfileImage.pending, (state) => {
        state.status = "submitting";
      })
      .addCase(uploadOnboardingProfileImage.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(uploadOnboardingProfileImage.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const {
  initializeOnboarding,
  updateOnboardingData,
  resetOnboardingState,
} = onboardingSlice.actions;

export default onboardingSlice.reducer;
