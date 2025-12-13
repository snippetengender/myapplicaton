import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../providers/api";
import { getComments } from "./commentSlice";

// const transformMixToPost = (mix, { showUserInNetworkPost = false } = {}) => {
//   const userData = mix.user_details || mix.user_id || {};
//   const isNetworkPost = mix.network_id && mix.network_id.reference_id;
//   const showNetworkAsAuthor = isNetworkPost && !showUserInNetworkPost;
//   const pollVotes = mix.poll_votes || {};
//   const totalVotes = Object.values(pollVotes).reduce(
//     (sum, count) => sum + count,
//     0
//   );
//   const user = showNetworkAsAuthor
//     ? {
//         name: mix.network_id.name,
//         avatar: mix.network_id.image_url,
//         profileType: "network",
//         id: mix.network_id.reference_id,
//       }
//     : {
//         id: userData.user_id,
//         name: userData.name,
//         avatar: userData.profile,
//         profileType: "user",
//         username: userData.username,
//         degree: userData.education_status?.degree || null,
//         college: userData.college_show,
//       };

//   const timeAgo = (timestamp) => {
//     if (!timestamp) return "";
//     const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
//     if (seconds < 60) return `${seconds}s`;
//     const minutes = Math.floor(seconds / 60);
//     if (minutes < 60) return `${minutes}m`;
//     const hours = Math.floor(minutes / 60);
//     if (hours < 24) return `${hours}h`;
//     const days = Math.floor(hours / 24);
//     return `${days}d`;
//   };

//   return {
//     id: mix.id,
//     user,
//     time: timeAgo(mix.sent_at),
//     createdAt: mix.sent_at,
//     label: mix.mix_type,
//     title: mix.title,
//     content: mix.description,
//     imageUrl: mix.image,
//     tag: mix.mix_type?.toLowerCase(),
//     options: mix.poll_options
//       ? mix.poll_options.map((opt) => {
//           const voteCount = pollVotes[opt.reference_id] || 0;
//           const percentage =
//             totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;
//           return {
//             id: opt.reference_id,
//             text: opt.name,
//             votes: percentage,
//             count: voteCount,
//           };
//         })
//       : [],
//     userVote: mix.poll_vote_for,
//     pollVotes: pollVotes,

//     stats: {
//       thoughts: mix.comments_count || 0,
//       reactions: totalVotes,
//       upvote: mix.likes || 0,
//       downvote: mix.dislikes || 0,
//     },
//     userReaction: mix.user_reaction,
//   };
// };

// This function should be in the same file or imported correctly

const transformMixToPost = (mix, { showUserInNetworkPost = false } = {}) => {
  const userDetails = mix.user_details;
  const isNetworkPost = mix.network_id && mix.network_id.reference_id;
  const showNetworkAsAuthor = isNetworkPost && !showUserInNetworkPost;
  const pollVotes = mix.poll_votes || {};
  const totalVotes = Object.values(pollVotes).reduce(
    (sum, count) => sum + count,
    0
  );

  if (!userDetails) {
    console.warn("Mix object is missing user_details:", mix.id);
    return null;
  }

  const user = showNetworkAsAuthor
    ? {
        name: mix.network_id.name,
        avatar: mix.network_id.image_url,
        profileType: "network",
        id: mix.network_id.reference_id,
      }
    : {
        id: userDetails.user_id || userDetails.firebase_id,

        avatar: userDetails.profile || userDetails.profile_image,

        name: userDetails.name,
        username: userDetails.username,
        profileType: mix.user_mode === "lowkey" ? "lowkey" : "user",
        degree: userDetails.education_status?.degree || null,
        college: userDetails.college_show,
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
    createdAt: mix.sent_at,
    label: mix.mix_type,
    title: mix.title,
    content: mix.description,
    imageUrl: mix.image,
    tag: mix.mix_type?.toLowerCase(),
    options: mix.poll_options
      ? mix.poll_options.map((opt) => {
          const voteCount = pollVotes[opt.reference_id] || 0;
          const percentage =
            totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;
          return {
            id: opt.reference_id,
            text: opt.name,
            votes: percentage,
            count: voteCount,
          };
        })
      : [],
    userVote: mix.poll_vote_for,
    pollVotes: pollVotes,
    userMode: mix.user_mode,
    stats: {
      thoughts: mix.comments_count || 0,
      reactions: totalVotes,
      upvote: mix.likes || 0,
      downvote: mix.dislikes || 0,
    },
    userReaction: mix.user_reaction,
  };
};

export const fetchMixes = createAsyncThunk(
  "mixes/fetchMixes",
  async (page, { rejectWithValue }) => {
    try {
      const response = await api.get(`/mixes/?page=${page}&limit=10`);
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

export const fetchParticularMix = createAsyncThunk(
  "mixes/fetchParticularMix",
  async (mixId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/mixes/${mixId}`);
      return response.data;
    } catch (err) {
      console.error("Failed to fetch particular mix:", err);
      return rejectWithValue(err.response.data.detail);
    }
  }
);

export const deleteMix = createAsyncThunk(
  "mixes/delete",
  async (mixId, { rejectWithValue }) => {
    try {
      await api.delete(`/mixes/${mixId}`);
      return mixId;
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

// export const fetchMixesByNetwork = createAsyncThunk(
//   "mixes/fetchMixesByNetwork",
//   async ({ networkId, page }, { rejectWithValue }) => {
//     if (!networkId) {
//       return rejectWithValue("A network ID is required.");
//     }
//     try {
//       const response = await api.get(
//         `/mixes?network_id=${networkId}&page=${page}&limit=10`
//       );

//       const mixes = response.data.data || [];

//       const transformedPosts = mixes.map((mix) =>
//         transformMixToPost(mix, { showUserInNetworkPost: true })
//       );

//       const { total, page: currentPage, limit } = response.data.pagination;
//       const totalPages = Math.ceil(total / limit);

//       return {
//         posts: transformedPosts,
//         hasMore: currentPage < totalPages,
//       };
//     } catch (err) {
//       console.error("Failed to fetch network mixes:", err);
//       const errorMsg =
//         err.response?.data?.detail || "Could not load the network feed.";
//       return rejectWithValue(errorMsg);
//     }
//   }
// );

// In your mixes/mixSlice.js file

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
      useLowkey,
    } = mixData;

    const formData = new FormData();

    const finalTitle = title.trim() ? title : text.slice(0, 100);

    formData.append("title", finalTitle);
    formData.append("description", text);

    let mixTypeFormatted =
      selectedTag.charAt(0).toUpperCase() + selectedTag.slice(1);

    if (mixTypeFormatted === "Polls") {
      mixTypeFormatted = "Poll";
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
    if (useLowkey) {
      formData.append("is_lowkey", "true");
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

export const voteInPoll = createAsyncThunk(
  "mixes/voteInPoll",
  async ({ mixId, optionId }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("mix_id", mixId);
      formData.append("poll_vote_for", optionId);
      const response = await api.post("/mixes/comments/", formData);

      const wasUnvote = response.data.message === "Unvoted successfully";

      return {
        mixId,
        pollVotes: response.data.poll_votes,
        newUserVote: wasUnvote ? null : optionId,
      };
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail || "Failed to vote.");
    }
  }
);



// export const fetchParticularUserMix = createAsyncThunk(
//   "mix/userId",
//   async ({ userId }, { rejectWithValue }) => {
//     try {
//       const response = await api.get(`mixes/user/${userId}`);
//       console.log(response.data);
//       if (!response.data) {
//         return rejectWithValue("Invalid API response structure.");
//       }

//       const mixes = response.data.data || [];
//       const transformedPosts = mixes.map((mix) =>
//         transformFullMixToPost(mix)
//       );

//       const { total, page: currentPage, limit } = response.data.pagination;
//       const totalPages = Math.ceil(total / limit);

//       return {
//         posts: transformedPosts,
//         hasMore: currentPage < totalPages,
//       };
//     } catch (err) {
//       console.error("Failed to fetch user mixes:", err);
//       const errorMsg =
//         err.response?.data?.detail || "Could not load the user's mixes.";
//       return rejectWithValue(errorMsg);
//     }
//   }
// );

export const fetchParticularUserMix = createAsyncThunk(
  "mixes/fetchParticularUserMix",
  async ({ userId, page }, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `mixes/user/${userId}?page=${page}&limit=10`
      );

      const mixes = response.data.data || [];
      const transformedPosts = mixes
        .map(transformFullMixToPost)
        .filter(Boolean);

      const { total, page: currentPage, limit } = response.data.pagination;
      const totalPages = Math.ceil(total / limit);

      return {
        posts: transformedPosts,
        hasMore: currentPage < totalPages,
      };
    } catch (err) {
      console.error("Failed to fetch user mixes:", err);
      const errorMsg =
        err.response?.data?.detail || "Could not load the user's mixes.";
      return rejectWithValue(errorMsg);
    }
  }
);

export const transformParticularMixToPost = (mix) => {
  const userDetails = mix.user_details;
  const pollVotes = mix.poll_votes || {};
  const totalVotes = Object.values(pollVotes).reduce(
    (sum, count) => sum + count,
    0
  );

  if (!userDetails) {
    console.warn("Mix object is missing user_details:", mix.id);
    return null;
  }

  const user = {
    id: userDetails.user_id || userDetails.firebase_id,
    avatar: userDetails.profile || userDetails.profile_image,
    name: userDetails.name,
    username: userDetails.username,
    profileType: mix.user_mode === "lowkey" ? "lowkey" : "user",
    degree: userDetails.education_status?.degree || null,
    college: userDetails.college_show,
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
    createdAt: mix.sent_at,
    label: mix.mix_type,
    title: mix.title,
    content: mix.description,
    imageUrl: mix.image,
    tag: mix.mix_type?.toLowerCase(),
    options: mix.poll_options
      ? mix.poll_options.map((opt) => {
          const voteCount = pollVotes[opt.reference_id] || 0;
          const percentage =
            totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;
          return {
            id: opt.reference_id,
            text: opt.name,
            votes: percentage,
            count: voteCount,
          };
        })
      : [],
    userVote: mix.poll_vote_for,
    pollVotes: pollVotes,
    userMode: mix.user_mode,
    stats: {
      thoughts: mix.comments_count || 0,
      reactions: totalVotes,
      upvote: mix.likes || 0,
      downvote: mix.dislikes || 0,
    },
    userReaction: mix.user_reaction,
    network_id: mix.network_id || null,
    network_members_count: mix.network_members_count || null,
  };
};

const transformFullMixToPost = (
  mix,
  { showUserInNetworkPost = false } = {}
) => {
  const userData = mix.user_details || mix.user_id || {};
  const isNetworkPost = mix.network_id && mix.network_id.reference_id;
  const showNetworkAsAuthor = isNetworkPost && !showUserInNetworkPost;
  const pollVotes = mix.poll_votes || {};
  const totalVotes = Object.values(pollVotes).reduce(
    (sum, count) => sum + count,
    0
  );

  let userDetails = userData;
  if (mix.user_mode === "lowkey" && mix.lowkey_user_details) {
    userDetails = {
      user_id: mix.lowkey_user_details.user_id,
      name: mix.lowkey_user_details.name,
      profile: mix.lowkey_user_details.profile_image,
      username: mix.lowkey_user_details.username,
      education_status: mix.lowkey_user_details.education_status,
      college_show: mix.lowkey_user_details.education_status?.course || "",
    };
  }

  const user = showNetworkAsAuthor
    ? {
        name: mix.network_id.name,
        avatar: mix.network_id.image_url,
        profileType: "network",
        id: mix.network_id.reference_id,
      }
    : {
        id: userDetails.user_id,
        name: userDetails.name,
        avatar: userDetails.profile,
        profileType: mix.user_mode === "lowkey" ? "lowkey" : "user",
        username: userDetails.username,
        degree: userDetails.education_status?.degree || null,
        college: userDetails.college_show,
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
    createdAt: mix.sent_at,
    label: mix.mix_type,
    title: mix.title,
    content: mix.description,
    imageUrl: mix.image,
    tag: mix.mix_type?.toLowerCase(),
    options: mix.poll_options
      ? mix.poll_options.map((opt) => {
          const voteCount = pollVotes[opt.reference_id] || 0;
          const percentage =
            totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;
          return {
            id: opt.reference_id,
            text: opt.name,
            votes: percentage,
            count: voteCount,
          };
        })
      : [],
    userVote: mix.poll_vote_for,
    pollVotes,
    userMode: mix.user_mode,
    stats: {
      thoughts: mix.comments_count || 0,
      reactions: totalVotes,
      upvote: mix.likes || 0,
      downvote: mix.dislikes || 0,
      neutral: mix.neutral || 0,
    },
    userReaction: mix.user_reaction,
    visibility: mix.visibility,
    rawUserDetails: mix.user_details || null,
    rawUserId: mix.user_id || null,
    lowkeyUserDetails: mix.lowkey_user_details || null,
    network: mix.network_id || null,
    prompt: mix.prompt || null,
    extra: {
      accountStatus: mix.user_details?.account_status,
      clubs: mix.user_details?.clubs,
      interests: mix.user_details?.interests,
    },
    network_members_count: mix.network_members_count || null,
  };
};

const initialState = {
  // posts: [],
  // status: "idle",
  // fetchError: null,
  // page: 1,
  // hasMore: true,
  // isSubmitting: false,
  // submitError: null,
  // networkPosts: [],
  // networkStatus: "idle",
  // networkFetchError: null,
  // networkPage: 1,
  // networkHasMore: true,
  // optimisticUpdatePost: null,
  // optimisticPollData: null,
  // selectedMix: null,
  posts: [],
  status: "idle",
  fetchError: null,
  page: 1,
  hasMore: true,

  networkPosts: [],
  networkStatus: "idle",
  networkFetchError: null,
  networkPage: 1,
  networkHasMore: true,

  userPosts: [],
  userPostsStatus: "idle",
  userPostsPage: 1,
  userPostsHasMore: true,
  userPostsError: null,
  selectedMix: null,
  isSubmitting: false,
  submitError: null,
  optimisticUpdatePost: null,
  optimisticPollData: null,
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
    resetNetworkMixes: (state) => {
      state.networkPosts = [];
      state.networkStatus = "idle";
      state.networkFetchError = null;
      state.networkPage = 1;
      state.networkHasMore = true;
    },
    resetUserMixes: (state) => {
      state.userPosts = [];
      state.userPostsStatus = "idle";
      state.userPostsError = null;
      state.userPostsPage = 1;
      state.userPostsHasMore = true;
    },
  },
  extraReducers: (builder) => {
    builder
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
      .addCase(createMix.pending, (state) => {
        state.isSubmitting = true;
        state.submitError = null;
      })
      .addCase(createMix.fulfilled, (state, action) => {
        state.isSubmitting = false;
        const newPost = transformMixToPost(action.payload.data);
        state.posts.unshift(newPost);
      })
      .addCase(createMix.rejected, (state, action) => {
        state.isSubmitting = false;
        state.submitError = action.payload;
      })
      .addCase(fetchMixesByNetwork.pending, (state) => {
        state.networkStatus = "loading";
      })
      .addCase(fetchMixesByNetwork.fulfilled, (state, action) => {
        state.networkStatus = "succeeded";
        const existingIds = new Set(state.networkPosts.map((p) => p.id));
        const newPosts = action.payload.posts.filter(
          (p) => !existingIds.has(p.id)
        );
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
        // Thunk returns the deleted id; fallback to meta.arg if not
        const deletedMixId = action.payload ?? action.meta?.arg;
        if (!deletedMixId) return;

        // Remove from ALL lists
        state.posts = state.posts.filter((post) => post.id !== deletedMixId);
        state.networkPosts = state.networkPosts.filter((post) => post.id !== deletedMixId);
        state.userPosts = state.userPosts.filter((post) => post.id !== deletedMixId);

        // Clear selectedMix if it’s the one being deleted
        if (state.selectedMix && state.selectedMix.id === deletedMixId) {
          state.selectedMix = null;
        }
      })

      .addCase(deleteMix.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(reactMix.pending, (state, action) => {
        const { mixId, reaction: newReaction } = action.meta.arg;

        // This helper function now ONLY contains the update logic
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

        // Find and update in the main 'posts' list
        const postIndex = state.posts.findIndex((p) => p.id === mixId);
        if (postIndex !== -1) {
          state.optimisticUpdatePost = JSON.parse(
            JSON.stringify(state.posts[postIndex])
          );
          applyOptimisticUpdate(state.posts[postIndex]);
        }

        // Find and update in the 'networkPosts' list
        const networkPostIndex = state.networkPosts.findIndex(
          (p) => p.id === mixId
        );
        if (networkPostIndex !== -1) {
          if (!state.optimisticUpdatePost) {
            state.optimisticUpdatePost = JSON.parse(
              JSON.stringify(state.networkPosts[networkPostIndex])
            );
          }
          applyOptimisticUpdate(state.networkPosts[networkPostIndex]);
        }

        // FIX: The logic for userPosts is now here, outside the helper, preventing the loop
        const userPostIndex = state.userPosts.findIndex((p) => p.id === mixId);
        if (userPostIndex !== -1) {
          if (!state.optimisticUpdatePost) {
            state.optimisticUpdatePost = JSON.parse(
              JSON.stringify(state.userPosts[userPostIndex])
            );
          }
          applyOptimisticUpdate(state.userPosts[userPostIndex]);
        }

        // Update the selected mix if it's the one being reacted to
        if (state.selectedMix && state.selectedMix.id === mixId) {
          if (!state.optimisticUpdatePost) {
            state.optimisticUpdatePost = JSON.parse(
              JSON.stringify(state.selectedMix)
            );
          }
          applyOptimisticUpdate(state.selectedMix);
        }
      })
      .addCase(reactMix.fulfilled, (state, action) => {
        const { mixId, data } = action.payload;
        const { reaction_counts, reaction: currentUserReaction } = data;
        const applyFulfilledUpdate = (post) => {
          if (!post) return;
          if (!post.stats) post.stats = {};
          post.stats.upvote = reaction_counts.like;
          post.stats.downvote = reaction_counts.dislike;
          post.userReaction = currentUserReaction;
        };

        const postIndex = state.posts.findIndex((p) => p.id === mixId);
        if (postIndex !== -1) {
          applyFulfilledUpdate(state.posts[postIndex]);
        }

        const networkPostIndex = state.networkPosts.findIndex(
          (p) => p.id === mixId
        );
        if (networkPostIndex !== -1) {
          applyFulfilledUpdate(state.networkPosts[networkPostIndex]);
        }
        if (state.selectedMix && state.selectedMix.id === mixId) {
          applyFulfilledUpdate(state.selectedMix);
        }
        const postInUser = state.userPosts.find((p) => p.id === mixId);
        if (postInUser) applyFulfilledUpdate(postInUser);

        if (state.selectedMix && state.selectedMix.id === mixId) {
          applyFulfilledUpdate(state.selectedMix);
        }
        state.optimisticUpdatePost = null;
      })
      .addCase(reactMix.rejected, (state, action) => {
        if (state.optimisticUpdatePost) {
          const originalPost = state.optimisticUpdatePost;
          const postIndex = state.posts.findIndex(
            (p) => p.id === originalPost.id
          );
          if (postIndex !== -1) {
            state.posts[postIndex] = originalPost;
          }
          const networkPostIndex = state.networkPosts.findIndex(
            (p) => p.id === originalPost.id
          );
          if (networkPostIndex !== -1) {
            state.networkPosts[networkPostIndex] = originalPost;
          }
          const userPostIndex = state.userPosts.findIndex(
            (p) => p.id === originalPost.id
          );
          if (userPostIndex !== -1) {
            state.userPosts[userPostIndex] = originalPost;
          }
          if (state.selectedMix && state.selectedMix.id === originalPost.id) {
            state.selectedMix = originalPost;
          }
        }
        state.optimisticUpdatePost = null;
        state.submitError = action.payload;
      })
      .addCase(getComments.fulfilled, (state, action) => {
        const { pagination, mixId } = action.payload;
        const postInMainFeed = state.posts.find((post) => post.id === mixId);
        if (postInMainFeed && pagination?.total !== undefined) {
          postInMainFeed.stats.thoughts = pagination.total;
        }
        const postInNetworkFeed = state.networkPosts.find(
          (post) => post.id === mixId
        );
        if (postInNetworkFeed && pagination?.total !== undefined) {
          postInNetworkFeed.stats.thoughts = pagination.total;
        }
      })
      .addCase(voteInPoll.pending, (state, action) => {
        const { mixId, optionId } = action.meta.arg;
        const postInFeed = state.posts.find((p) => p.id === mixId);
        const postInNetwork = state.networkPosts.find((p) => p.id === mixId);
        const postInUser = state.userPosts.find((p) => p.id === mixId); // NEW

        const primaryPost = postInUser || postInNetwork || postInFeed;
        if (!primaryPost) return;
        state.optimisticPollData = {
          mixId,
          options: JSON.parse(JSON.stringify(primaryPost.options)),
          userVote: primaryPost.userVote,
          pollVotes: JSON.parse(JSON.stringify(primaryPost.pollVotes)),
        };
        const applyOptimisticUpdate = (post) => {
          const oldVote = post.userVote;
          const newVote = oldVote === optionId ? null : optionId;
          post.userVote = newVote;

          if (!post.pollVotes) post.pollVotes = {};
          if (oldVote)
            post.pollVotes[oldVote] = Math.max(
              0,
              (post.pollVotes[oldVote] || 1) - 1
            );
          if (newVote)
            post.pollVotes[newVote] = (post.pollVotes[newVote] || 0) + 1;

          const totalVotes = Object.values(post.pollVotes).reduce(
            (a, b) => a + b,
            0
          );
          post.options = post.options.map((opt) => {
            const count = post.pollVotes[opt.id] || 0;
            return {
              ...opt,
              votes:
                totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0,
              count,
            };
          });
        };
        if (postInFeed) applyOptimisticUpdate(postInFeed);
        if (postInNetwork) applyOptimisticUpdate(postInNetwork);
        if (postInUser) applyOptimisticUpdate(postInUser);
        if (state.selectedMix && state.selectedMix.id === mixId) {
          applyOptimisticUpdate(state.selectedMix);
        }
      })
      .addCase(voteInPoll.fulfilled, (state, action) => {
        const { mixId, pollVotes, newUserVote } = action.payload;

        // Create a function to sync a post with server data
        const syncWithServer = (post) => {
          post.userVote = newUserVote;
          post.pollVotes = pollVotes;
          const totalVotes = Object.values(pollVotes).reduce(
            (a, b) => a + b,
            0
          );
          post.options = post.options.map((opt) => {
            const count = pollVotes[opt.id] || 0;
            return {
              ...opt,
              votes:
                totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0,
              count,
            };
          });
        };

        // Find and sync in both lists
        const postInFeed = state.posts.find((p) => p.id === mixId);
        const postInNetwork = state.networkPosts.find((p) => p.id === mixId);
        const postInUser = state.userPosts.find((p) => p.id === mixId);
        if (postInFeed) syncWithServer(postInFeed);
        if (postInNetwork) syncWithServer(postInNetwork);
        if (postInUser) syncWithServer(postInUser);
        if (state.selectedMix && state.selectedMix.id === mixId) {
          syncWithServer(state.selectedMix);
        }
        state.optimisticPollData = null; // Clear rollback data
      })
      .addCase(voteInPoll.rejected, (state, action) => {
        if (!state.optimisticPollData) return;

        const { mixId, options, userVote, pollVotes } =
          state.optimisticPollData;

        const postInFeed = state.posts.find((p) => p.id === mixId);
        const postInNetwork = state.networkPosts.find((p) => p.id === mixId);
        const postInUser = state.userPosts.find((p) => p.id === mixId);
        const rollback = (post) => {
          post.options = options;
          post.userVote = userVote;
          post.pollVotes = pollVotes;
        };
        if (postInFeed) rollback(postInFeed);
        if (postInNetwork) rollback(postInNetwork);
        if (postInUser) rollback(postInUser);
        // if (postInFeed) {
        //   postInFeed.options = options;
        //   postInFeed.userVote = userVote;
        //   postInFeed.pollVotes = pollVotes;
        // }
        // if (postInNetwork) {
        //   postInNetwork.options = options;
        //   postInNetwork.userVote = userVote;
        //   postInNetwork.pollVotes = pollVotes;
        // }
        // if (state.selectedMix && state.selectedMix.id === mixId) {
        //   rollback(state.selectedMix);
        // }

        state.optimisticPollData = null; // Clear rollback data
      })
      .addCase(fetchParticularMix.fulfilled, (state, action) => {
        state.status = "succeeded";
        const mix = transformParticularMixToPost(action.payload.data);
        state.selectedMix = mix;
      })
      .addCase(fetchParticularMix.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch mix";
      })
      .addCase(fetchParticularMix.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchParticularUserMix.pending, (state) => {
        state.userPostsStatus = "loading";
      })
      .addCase(fetchParticularUserMix.fulfilled, (state, action) => {
        state.userPostsStatus = "succeeded";
        state.userPosts.push(...action.payload.posts); // Correct: updates userPosts
        state.userPostsHasMore = action.payload.hasMore; // Correct: updates userPostsHasMore
        if (action.payload.posts.length > 0) {
          state.userPostsPage += 1; // Correct: updates userPostsPage
        }
      })
      .addCase(fetchParticularUserMix.rejected, (state, action) => {
        state.userPostsStatus = "failed";
        state.userPostsError = action.payload;
      });
  },
});

export const { resetMixes, resetNetworkMixes, resetUserMixes } =
  mixesSlice.actions;
export default mixesSlice.reducer;
