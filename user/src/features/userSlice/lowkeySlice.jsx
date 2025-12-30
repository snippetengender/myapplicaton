import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../providers/api";

const initialState = {
  usernameStatus: "idle",
  usernameError: null,

  creationStatus: "idle",
  creationError: null,
};

export const checkUsername = createAsyncThunk(
  "lowkey/checkUsername",
  async (username, { rejectWithValue }) => {
    try {
      const response = await api.post("/lowkey/check-username", {
        username,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.detail);
    }
  }
);

export const createLowkeyProfile = createAsyncThunk(
  "lowkey/createProfile",
  async ({ username, name, bio, imageFile }, { dispatch, rejectWithValue }) => {
    try {
      const profileResponse = await api.post("/lowkey/", {
        username,
        name,
        bio,
      });
      const newProfile = profileResponse.data;

      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);

        await api.post(
          `/lowkey/${newProfile.user_id}/profile`,
          formData
        );
      }

      return newProfile;
    } catch (error) {
      return rejectWithValue(error.response.data.detail);
    }
  }
);

const lowkeyProfileSlice = createSlice({
  name: "lowkeyProfile",
  initialState,
  reducers: {
    resetUsernameStatus: (state) => {
      state.usernameStatus = "idle";
      state.usernameError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkUsername.pending, (state) => {
        state.usernameStatus = "loading";
      })
      .addCase(checkUsername.fulfilled, (state, action) => {
        state.usernameStatus = action.payload.available ? "available" : "taken";
      })
      .addCase(checkUsername.rejected, (state, action) => {
        state.usernameStatus = "failed";
        state.usernameError = action.payload;
      })
      .addCase(createLowkeyProfile.pending, (state) => {
        state.creationStatus = "loading";
      })
      .addCase(createLowkeyProfile.fulfilled, (state) => {
        state.creationStatus = "succeeded";
      })
      .addCase(createLowkeyProfile.rejected, (state, action) => {
        state.creationStatus = "failed";
        state.creationError = action.payload;
      });
  },
});

export const { resetUsernameStatus } = lowkeyProfileSlice.actions;
export default lowkeyProfileSlice.reducer;
