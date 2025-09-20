import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../providers/api'; // Adjust the path to your api instance

const initialState = {
  userId: localStorage.getItem('user_id') || null, 
  profile: {
    data: null,
    status: 'idle',
    error: null,
  },
};

export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/user/${userId}`);
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUser: (state) => {
      state.userId = null;
      state.profile = initialState.profile;
      localStorage.removeItem('user_id');
    },
    setUserId: (state, action) => {
        state.userId = action.payload;
        localStorage.setItem('user_id', action.payload);
    },
    clearUserProfile: (state) => {
      state.profile = initialState.profile;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.profile.status = 'loading';
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.profile.status = 'succeeded';
        state.profile.data = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.profile.status = 'failed';
        state.profile.error = action.payload;
      });
  },
});

export const { clearUser, setUserId, clearUserProfile } = userSlice.actions;
export default userSlice.reducer;