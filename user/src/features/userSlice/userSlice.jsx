import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../providers/api";

/* =======================
   INITIAL STATE
======================= */
const initialState = {
  userId: localStorage.getItem("user_id") || null,

  profile: {
    data: null,
    status: "idle",
    error: null,
  },

  // ✅ ADDED (does NOT break existing code)
  lowkeyProfile: {
    data: null,
    status: "idle",
    error: null,
  },
};

/* =======================
   USER PROFILE API
======================= */
export const fetchUserProfile = createAsyncThunk(
  "user/fetchProfile",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/user/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

/* =======================
   LOWKEY PROFILE API
======================= */
export const fetchLowkeyProfile = createAsyncThunk(
  "userProfile/fetchById",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/lowkey/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

/* =======================
   SLICE
======================= */
const userSlice = createSlice({
  name: "user",
  initialState,

  reducers: {
    /* -------- EXISTING REDUCERS (UNCHANGED) -------- */
    clearUser: (state) => {
      state.userId = null;
      state.profile = initialState.profile;
      state.lowkeyProfile = initialState.lowkeyProfile;
    },

    setUserId: (state, action) => {
      state.userId = action.payload;
      localStorage.setItem("user_id", action.payload);
    },

    clearUserProfile: (state) => {
      state.profile = initialState.profile;
    },

    resetProfileStatus: (state) => {
      state.profile.status = "idle";
    },

    setProfile: (state, action) => {
      state.profile.data = action.payload;
      state.profile.status = "succeeded";
      state.profile.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      /* =======================
         USER PROFILE
      ======================= */
      .addCase(fetchUserProfile.pending, (state) => {
        state.profile.status = "loading";
        // ✅ DO NOT clear profile.data
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.profile.status = "succeeded";
        state.profile.data = action.payload;
        state.profile.error = null;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.profile.status = "failed";
        state.profile.error = action.payload;
      })

      /* =======================
         LOWKEY PROFILE (FIXED)
      ======================= */
      .addCase(fetchLowkeyProfile.pending, (state) => {
        state.lowkeyProfile.status = "loading";
        state.lowkeyProfile.error = null;
      })
      .addCase(fetchLowkeyProfile.fulfilled, (state, action) => {
        state.lowkeyProfile.status = "succeeded";
        state.lowkeyProfile.data = action.payload;
        state.lowkeyProfile.error = null;
      })
      .addCase(fetchLowkeyProfile.rejected, (state, action) => {
        state.lowkeyProfile.status = "failed";
        state.lowkeyProfile.error = action.payload;
      });
  },
});

/* =======================
   EXPORTS
======================= */
export const {
  clearUser,
  setUserId,
  clearUserProfile,
  setProfile,
  resetProfileStatus,
} = userSlice.actions;

export default userSlice.reducer;
