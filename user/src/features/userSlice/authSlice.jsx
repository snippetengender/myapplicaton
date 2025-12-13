import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../providers/api";
import { setUserId } from "./userSlice";

export const verifyGoogleLogin = createAsyncThunk(
  "auth/verifyGoogleLogin",
  async ({ firebaseToken, mode, navigate }, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post("/auth/google-login", {
        token: firebaseToken,
      });
      const { user_onboarded, user } = response.data;

      if (!user_onboarded && user?.firebase_id) {
        dispatch(setUserId(user.firebase_id));
      }

      if (mode === "getStarted") {
        if (user_onboarded) {
          navigate("/auth/already-registered");
        } else {
          navigate("/useronboarding/name-dob-gender");
        }
      } else if (mode === "login") {
        if (user_onboarded) {
          localStorage.setItem("user_id", user.firebase_id);
          navigate("/home");
        } else {
          navigate("/useronboarding/name-dob-gender");
        }
      }

      return response.data;
    } catch (err) {
      const errorDetail = err.response?.data?.detail || "Login failed";
      if (errorDetail === "403: Email domain not allowed") {
        navigate("/domain-not-allowed");
      }
      return rejectWithValue(errorDetail);
    }
  }
);

const initialState = {
  status: "idle",
  error: null,
  userOnboarded: null,
  collegeDetails: null,
  partialUser: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetAuthState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(verifyGoogleLogin.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(verifyGoogleLogin.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.userOnboarded = action.payload.user_onboarded;
        if (!action.payload.user_onboarded) {
          state.collegeDetails = action.payload.college_details;
          state.partialUser = action.payload.user;
        }
      })
      .addCase(verifyGoogleLogin.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { resetAuthState } = authSlice.actions;

export default authSlice.reducer;
