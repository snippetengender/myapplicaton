import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../providers/api";

const initialState = {
  comments: [],
  status: "idle",
  postStatus: "idle",
  error: null,
};

export const getComments = createAsyncThunk(
  "comments/getComments",
  async (mixId, { rejectWithValue }) => {
    try {
      const url = `/mixes/${mixId}/comments`;
      const response = await api.get(url);
      return { ...response.data, mixId: mixId }; 
    } catch (err) {
      if (!err.response) throw err;
      return rejectWithValue(err.response.data);
    }
  }
);

export const createComment = createAsyncThunk(
  "comments/createComment",
  async ({ mixId, comment, parentCommentId = null }, { dispatch, rejectWithValue }) => {
    try {
      const commentData = {
        mix_id: mixId,
        comment: comment,
        parent_comment_id: parentCommentId,
      };
      
      await api.post("mixes/comments/", commentData);
      dispatch(getComments(mixId));
      return mixId;

    } catch (err) {
      if (!err.response) throw err;
      return rejectWithValue(err.response.data);
    }
  }
);

const commentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getComments.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getComments.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.comments = action.payload.data;
      })
      .addCase(getComments.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.detail || action.error.message;
      })
      .addCase(createComment.pending, (state) => {
        state.postStatus = "loading";
      })
      .addCase(createComment.fulfilled, (state) => {
        state.postStatus = "succeeded";
      })
      .addCase(createComment.rejected, (state, action) => {
        state.postStatus = "failed";
        state.error = action.payload?.detail || action.error.message;
      });
  },
});

export default commentsSlice.reducer;