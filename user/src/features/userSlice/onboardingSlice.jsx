import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../providers/api";

// export const submitOnboardingProfile = createAsyncThunk(
//   "onboarding/submitProfile",
//   async ({ profileImageFile }, { getState, dispatch, rejectWithValue }) => {
//     try {
//       const { onboarding } = getState();
//       const finalProfileData = onboarding.profileData;

//       console.log("Step 1: Creating user with data:", finalProfileData);
//       const createUserResponse = await api.post("/user/", finalProfileData);
//       console.log("Raw:", JSON.stringify(createUserResponse.data, null, 2));
//       const newUser = createUserResponse.data.user;
//       const userId = newUser.firebase_id;

//       if (!userId) {
//         throw new Error("Backend did not return a user ID after creation.");
//       }

//       if (profileImageFile) {
//         console.log(`Step 2: Uploading profile image for user ${userId}...`);
//         const formData = new FormData();
//         formData.append("file", profileImageFile);
//         await api.post(`/user/${userId}/profile`, formData, {
//           headers: { "Content-Type": "multipart/form-data" },
//         });
//       }

//       console.log("Onboarding complete. Setting final user profile in Redux.");
//       dispatch(setUserId(userId));
//       dispatch(setProfile(newUser));

//       return newUser;
//     } catch (err) {
//       console.error("Onboarding submission failed:", err);
//       return rejectWithValue(
//         err.response?.data?.message || "Onboarding submission failed"
//       );
//     }
//   }
// );

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

      return { success: true };
    } catch (err) {
      console.error("Profile image upload failed:", err);
      return rejectWithValue(err.response?.data?.message || "Upload failed");
    }
  }
);

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
      // .addCase(submitOnboardingProfile.pending, (state) => {
      //   state.status = "submitting";
      // })
      // .addCase(submitOnboardingProfile.fulfilled, (state) => {
      //   state.status = "succeeded";
      // })
      // .addCase(submitOnboardingProfile.rejected, (state, action) => {
      //   state.status = "failed";
      //   state.error = action.payload;
      // });

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
