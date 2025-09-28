import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../providers/api";

const initialState = {
  comments: [],
  status: "idle",
  loadingInitial: false,
  loadingMore: false,
  postStatus: "idle",
  page: 1,
  hasMore: true,
  error: null,
};

export const getComments = createAsyncThunk(
  "comments/getComments",
  async ({ mixId, page = 1, limit = 10 }) => {
    const response = await api.get(
      `mixes/${mixId}/comments?page=${page}&limit=${limit}`
    );

    const { data, pagination } = response.data;

    return {
      data,
      page: pagination.page,
      total: pagination.total,
      limit: pagination.limit,
    };
  }
);

export const createComment = createAsyncThunk(
  "comments/createComment",
  async (
    {
      mixId,
      comment,
      parentCommentId = null,
      imageFile = null,
      is_lowkey = false,
    },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const formData = new FormData();

      formData.append("mix_id", mixId);
      formData.append("comment", comment);

      if (parentCommentId) {
        formData.append("parent_comment_id", parentCommentId);
      }
      if (imageFile) {
        formData.append("file", imageFile);
      }
      if (is_lowkey) {
        formData.append("is_lowkey", "true");
      }

      await api.post("/mixes/comments/", formData);

      dispatch(getComments({ mixId, page: 1 }));
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
  reducers: {
    resetComments: (state) => {
      state.comments = [];
      state.status = "idle";
      state.page = 1;
      state.hasMore = true;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getComments.pending, (state, action) => {
        const requestedPage = action.meta.arg?.page ?? 1;
        if (requestedPage === 1) {
          state.loadingInitial = true;
        } else {
          state.loadingMore = true;
        }
      })
      .addCase(getComments.fulfilled, (state, action) => {
        const { data, page, total, limit } = action.payload;

        if (page === 1) {
          state.comments = data;
          state.loadingInitial = false;
        } else {
          state.comments.push(...data);
          state.loadingMore = false;
        }

        state.page = page;
        state.hasMore = state.comments.length < total;
        state.status = "succeeded";
      })

      .addCase(getComments.rejected, (state, action) => {
        state.loadingInitial = false;
        state.loadingMore = false;
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

export const { resetComments } = commentsSlice.actions;

export default commentsSlice.reducer;
