import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../providers/api";
import { getComments } from "./commentSlice";


const transformMixToPost = (mix, { showUserInNetworkPost = false } = {}) => {
  const userData = mix.user_details || mix.user_id || {};
  const isNetworkPost = mix.network_id && mix.network_id.reference_id;

  const showNetworkAsAuthor = isNetworkPost && !showUserInNetworkPost;

  const user = showNetworkAsAuthor
    ? {
        // This branch is for the main feed, showing the Network's info
        name: mix.network_id.name,
        avatar: mix.network_id.image_url,
        profileType: "network",
        id: mix.network_id.reference_id,
      }
    : {
        id: userData.user_id,
        name: userData.name,
        avatar: userData.profile,
        profileType: "user",
        username: userData.username,
        degree: userData.education_status?.degree || null,
        college: userData.college_show,
      };

  const timeAgo = (timestamp) => {
    if (!timestamp) return "";
    const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    return `${days}d`;
  };

  return {
    id: mix.id,
    user,
    time: timeAgo(mix.sent_at),
    label: mix.mix_type,
    title: mix.title,
    content: mix.description,
    imageUrl: mix.image,
    tag: mix.mix_type?.toLowerCase(),
    options: mix.poll_options
      ? mix.poll_options.map((opt) => ({ text: opt.name, votes: 0 }))
      : [],
    stats: {
      thoughts: mix.comments_count || 0,
      reactions: mix.likes - mix.dislikes || 0,
      upvote: mix.likes || 0,
      downvote: mix.dislikes || 0,
    },
  };
};

export const fetchMixes = createAsyncThunk(
  "mixes/fetchMixes",
  async (page, { rejectWithValue }) => {
    try {
      const response = await api.get(`/mixes?page=${page}&limit=10`);
      const mixes = response.data.data || [];
      const transformedPosts = mixes.map(transformMixToPost);
      const { total, page: currentPage, limit } = response.data.pagination;
      const totalPages = Math.ceil(total / limit);

      return {
        posts: transformedPosts,
        hasMore: currentPage < totalPages,
      };
    } catch (err) {
      console.error("Failed to fetch mixes:", err);
      const errorMsg = err.response?.data?.detail || "Could not load the feed.";
      return rejectWithValue(errorMsg);
    }
  }
);

export const deleteMix = createAsyncThunk(
  "mixes/delete",
  async (mixId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/mixes/${mixId}`);
      return response.data;
    } catch (err) {
      console.error(err);
      return rejectWithValue(err.response.data.detail);
    }
  }
);

export const reactMix = createAsyncThunk(
  "mixes/reactMix",
  async ({ mixId, reaction }, { rejectWithValue }) => {
    try {
      const body = { reaction };
      const response = await api.patch(`/mixes/${mixId}/reaction`, body);
      return { mixId, data: response.data };
    } catch (err) {
      const errorMsg =
        err.response?.data?.detail || "Could not submit reaction.";
      return rejectWithValue(errorMsg);
    }
  }
);

export const fetchMixesByNetwork = createAsyncThunk(
  "mixes/fetchMixesByNetwork",
  async ({ networkId, page }, { rejectWithValue }) => {
    if (!networkId) {
      return rejectWithValue("A network ID is required.");
    }
    try {
      const response = await api.get(
        `/mixes?network_id=${networkId}&page=${page}&limit=10`
      );

      const mixes = response.data.data || [];

      const transformedPosts = mixes.map((mix) =>
        transformMixToPost(mix, { showUserInNetworkPost: true })
      );

      const { total, page: currentPage, limit } = response.data.pagination;
      const totalPages = Math.ceil(total / limit);

      return {
        posts: transformedPosts,
        hasMore: currentPage < totalPages,
      };
    } catch (err) {
      console.error("Failed to fetch network mixes:", err);
      const errorMsg =
        err.response?.data?.detail || "Could not load the network feed.";
      return rejectWithValue(errorMsg);
    }
  }
);

export const createMix = createAsyncThunk(
  "mixes/create",
  async (mixData, { rejectWithValue }) => {
    // ... (Your createMix logic is fine, no changes needed here)
    const {
      title,
      selectedTag,
      text,
      selectedNetwork,
      imageFile,
      pollOptions,
    } = mixData;

    const formData = new FormData();

    const finalTitle = title.trim() ? title : text.slice(0, 100);

    formData.append("title", finalTitle);
    formData.append("description", text);

    let mixTypeFormatted =
      selectedTag.charAt(0).toUpperCase() + selectedTag.slice(1);
    if (mixTypeFormatted.endsWith("s")) {
      mixTypeFormatted = mixTypeFormatted.slice(0, -1);
    }
    formData.append("mix_type", mixTypeFormatted);

    if (selectedNetwork) {
      formData.append("network_id", selectedNetwork.id);
    }
    if (imageFile) {
      formData.append("file", imageFile);
    }
    if (selectedTag === "polls") {
      const formattedPollOptions = pollOptions
        .filter((opt) => opt.trim() !== "")
        .map((optionName) => ({
          reference_id: optionName.toLowerCase().replace(/\s+/g, "_"),
          name: optionName,
        }));
      formData.append("poll_options", JSON.stringify(formattedPollOptions));
    }

    try {
      const response = await api.post("/mixes/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Upload failed:", error.response || error);
      if (error.response && error.response.data) {
        return rejectWithValue(
          error.response.data.detail || "An error occurred."
        );
      }
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  // State for the main feed
  posts: [],
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  fetchError: null,
  page: 1,
  hasMore: true,

  // State for creating a new post
  isSubmitting: false,
  submitError: null,

  // NEW: State for the network-specific feed
  networkPosts: [],
  networkStatus: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  networkFetchError: null,
  networkPage: 1,
  networkHasMore: true,
  optimisticUpdatePost: null,
};

const mixesSlice = createSlice({
  name: "mixes",
  initialState,
  reducers: {
    resetMixes: (state) => {
      state.posts = [];
      state.status = "idle";
      (state.fetchError = null), (state.page = 1);
      state.hasMore = true;
    },
    // NEW: Reducer to reset the network-specific state
    resetNetworkMixes: (state) => {
      state.networkPosts = [];
      state.networkStatus = "idle";
      state.networkFetchError = null;
      state.networkPage = 1;
      state.networkHasMore = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // Cases for the main feed (fetchMixes)
      .addCase(fetchMixes.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMixes.fulfilled, (state, action) => {
        state.status = "succeeded";
        const existingIds = new Set(state.posts.map((p) => p.id));
        const newPosts = action.payload.posts.filter(
          (p) => !existingIds.has(p.id)
        );
        state.posts.push(...newPosts);
        state.hasMore = action.payload.hasMore;
        if (action.payload.posts.length > 0) {
          state.page += 1;
        }
      })
      .addCase(fetchMixes.rejected, (state, action) => {
        state.status = "failed";
        state.fetchError = action.payload;
      })
      // Cases for creating a post (createMix)
      .addCase(createMix.pending, (state) => {
        state.isSubmitting = true;
        state.submitError = null;
      })
      .addCase(createMix.fulfilled, (state, action) => {
        state.isSubmitting = false;
        // When a new post is created, add it to the top of the main feed.
        const newPost = transformMixToPost(action.payload.data);
        state.posts.unshift(newPost);
      })
      .addCase(createMix.rejected, (state, action) => {
        state.isSubmitting = false;
        state.submitError = action.payload;
      })
      // NEW: Cases for the network-specific feed (fetchMixesByNetwork)
      .addCase(fetchMixesByNetwork.pending, (state) => {
        state.networkStatus = "loading";
      })
      .addCase(fetchMixesByNetwork.fulfilled, (state, action) => {
        state.networkStatus = "succeeded";
        const existingIds = new Set(state.networkPosts.map((p) => p.id));
        const newPosts = action.payload.posts.filter(
          (p) => !existingIds.has(p.id)
        );
        // We push the new, untransformed posts into the networkPosts array.
        state.networkPosts.push(...newPosts);
        state.networkHasMore = action.payload.hasMore;
        if (action.payload.posts.length > 0) {
          state.networkPage += 1;
        }
      })
      .addCase(fetchMixesByNetwork.rejected, (state, action) => {
        state.networkStatus = "failed";
        state.networkFetchError = action.payload;
      })
      .addCase(deleteMix.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteMix.fulfilled, (state, action) => {
        state.status = "succeeded";
        const deletedMixId = action.payload;
        state.posts = state.posts.filter((post) => post.id !== deletedMixId);
      })
      .addCase(deleteMix.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(reactMix.pending, (state, action) => {
      const { mixId, reaction: newReaction } = action.meta.arg;

      // Helper function to apply the optimistic update
      const applyOptimisticUpdate = (post) => {
        if (!post) return;
        const oldReaction = post.userReaction;
        post.userReaction = oldReaction === newReaction ? null : newReaction;

        if (!post.stats) post.stats = { upvote: 0, downvote: 0 };
        if (oldReaction) {
          if (oldReaction === "like") post.stats.upvote--;
          if (oldReaction === "dislike") post.stats.downvote--;
        }
        if (post.userReaction) {
          if (post.userReaction === "like") post.stats.upvote++;
          if (post.userReaction === "dislike") post.stats.downvote++;
        }
      };
      
      // Find and update the post in the main 'posts' array
      const postIndex = state.posts.findIndex((p) => p.id === mixId);
      if (postIndex !== -1) {
        // Save the original post for potential rollback (only need to do this once)
        state.optimisticUpdatePost = JSON.parse(
          JSON.stringify(state.posts[postIndex])
        );
        applyOptimisticUpdate(state.posts[postIndex]);
      }
      
      // Find and update the post in the 'networkPosts' array
      const networkPostIndex = state.networkPosts.findIndex((p) => p.id === mixId);
      if (networkPostIndex !== -1) {
        if (!state.optimisticUpdatePost) {
           // If the post was only in the network feed, save it for rollback
           state.optimisticUpdatePost = JSON.parse(
            JSON.stringify(state.networkPosts[networkPostIndex])
          );
        }
        applyOptimisticUpdate(state.networkPosts[networkPostIndex]);
      }
    })
    .addCase(reactMix.fulfilled, (state, action) => {
      const { mixId, data } = action.payload;
      const { reaction_counts, reaction: currentUserReaction } = data;
      
      // Helper function to sync with the server's final data
      const applyFulfilledUpdate = (post) => {
         if (!post) return;
         if (!post.stats) post.stats = {};
         post.stats.upvote = reaction_counts.like;
         post.stats.downvote = reaction_counts.dislike;
         post.userReaction = currentUserReaction;
      };

      // Find and update in 'posts'
      const postIndex = state.posts.findIndex((p) => p.id === mixId);
      if (postIndex !== -1) {
        applyFulfilledUpdate(state.posts[postIndex]);
      }

      // Find and update in 'networkPosts'
      const networkPostIndex = state.networkPosts.findIndex((p) => p.id === mixId);
      if (networkPostIndex !== -1) {
        applyFulfilledUpdate(state.networkPosts[networkPostIndex]);
      }

      // Clear the stored original post
      state.optimisticUpdatePost = null;
    })
    .addCase(reactMix.rejected, (state, action) => {
      // If the API call fails, revert the change in both arrays
      if (state.optimisticUpdatePost) {
        const originalPost = state.optimisticUpdatePost;
        
        const postIndex = state.posts.findIndex((p) => p.id === originalPost.id);
        if (postIndex !== -1) {
          state.posts[postIndex] = originalPost;
        }

        const networkPostIndex = state.networkPosts.findIndex((p) => p.id === originalPost.id);
        if (networkPostIndex !== -1) {
          state.networkPosts[networkPostIndex] = originalPost;
        }
      }

      // Clear rollback state and set error
      state.optimisticUpdatePost = null;
      state.status = "failed";
      state.error = action.payload;
    })
     .addCase(getComments.fulfilled, (state, action) => {
        // The payload from getComments now contains: { data, pagination, mixId }
        const { pagination, mixId } = action.payload;
         const postInMainFeed = state.posts.find(post => post.id === mixId);
        
        // If we found it, update its count with the actual total from the API
        if (postInMainFeed && pagination?.total !== undefined) {
          // Use the correct property path based on your transformMixToPost function
          postInMainFeed.stats.thoughts = pagination.total;
        }

        // 2. ALSO, find the specific post in the 'networkPosts' array
        const postInNetworkFeed = state.networkPosts.find(post => post.id === mixId);

        // If we found it there, update its count too
        if (postInNetworkFeed && pagination?.total !== undefined) {
          postInNetworkFeed.stats.thoughts = pagination.total;
        }
      });
  },
});

export const { resetMixes, resetNetworkMixes } = mixesSlice.actions;
export default mixesSlice.reducer;
