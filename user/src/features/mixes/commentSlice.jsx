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
    
    console.log(data)
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

export const updateCommentReaction = createAsyncThunk(
  "comments/updateCommentReaction",
  async (
    { commentId, reaction }, // reaction = "like" | "dislike" | "neutral" | null
    { rejectWithValue }
  ) => {
    try {
      const response = await api.patch(
        `mixes/comments/${commentId}/reaction`,
        { reaction }
      );
      const data=response.data;
      console.log(data)
      return {
        commentId,
        reaction: response.data.reaction,
        reactionCounts: response.data.reaction_counts,
      };
    } catch (err) {
      if (!err.response) throw err;
      return rejectWithValue(err.response.data);
    }
  }
);

export const deleteComment = createAsyncThunk(
  "comments/deleteComment",
  async ({ commentId }, { rejectWithValue }) => {
    try {
      // Your backend route: DELETE /comments/{comment_id}/
      await api.delete(`/mixes/comments/${commentId}/`);
      return commentId; // return id so reducer can remove it
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
      state.postStatus = "idle";
      state.deleteStatus = "idle";
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
      })

      .addCase(deleteComment.pending, (state) => {
        state.deleteStatus = "loading";
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        const deletedId = action.payload;

        // remove the deleted comment
        // and also any replies whose parent_comment_id points to it
        state.comments = state.comments.filter((comment) => {
          const isDeleted = comment.id === deletedId;
          const isReplyOfDeleted =
            comment.parent_comment_id?.reference_id === deletedId ||
            comment.parent_comment_id === deletedId; // in case it's just an id

          return !isDeleted && !isReplyOfDeleted;
        });

        state.deleteStatus = "succeeded";
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.deleteStatus = "failed";
        state.error = action.payload?.detail || action.error.message;
      })
          .addCase(updateCommentReaction.fulfilled, (state, action) => {
      const { commentId, reactionCounts, reaction } = action.payload;

      const comment = state.comments.find(
        (c) => c.id === commentId
      );

      if (comment) {
        comment.likes = reactionCounts.like;
        comment.dislikes = reactionCounts.dislike;
        comment.neutral = reactionCounts.neutral;
        comment.user_reaction = reaction;
      }
    })

      
  },
});

export const { resetComments } = commentsSlice.actions;


export default commentsSlice.reducer;
