import api from "../providers/api";


const transformComment = (c) => ({
  id: c.id,
  content: c.comment || "",
  user: {
    name: c.user_details?.name || c.user_id?.name || "Anonymous",
    avatar: c.user_details?.profile || "/default-avatar.png", // A default avatar
    username: c.user_details?.username || c.user_id?.reference_id,
  },
  createdAt: c.created_at,
  replies: [], // Replies always start empty and are loaded on demand
  areRepliesLoaded: false, // A new flag to track if we've fetched replies
  votes: c.likes_count || 0,
  replyCount: c.reply_count || 0,
});

// Fetch initial, top-level comments for a mix
export const fetchComments = async (mixId) => {
  try {
    const response = await api.get(`/mixes/${mixId}/comments`);
    return response.data.data.map(transformComment);
  } catch (err) {
    console.error(`Error fetching comments for mix ${mixId}:`, err);
    // Return empty array on 404, otherwise re-throw
    if (err.response?.status === 404) return [];
    throw err;
  }
};

export const fetchReplies = async (commentId) => {
  try {
    // This endpoint doesn't exist yet, but we're preparing for it.
    const response = await api.get(`/comments/${commentId}/replies`);
    return response.data.data.map(transformComment);
  } catch (err) {
    console.error(`Error fetching replies for comment ${commentId}:`, err);
    if (err.response?.status === 404) return [];
    throw err;
  }
};


// Post a new comment or reply
export const postComment = async ({ mixId, content, parentId = null }) => {
  try {
    const response = await api.post("/comments/", {
      mix_id: mixId,
      comment: content, // The backend expects 'comment'
      parent_comment_id: parentId, // The backend expects 'parent_comment_id'
    });
    // The backend returns the new comment under a 'data' key
    return transformComment(response.data.data);
  } catch (error) {
    console.error("Error posting comment:", error);
    throw error;
  }
};

// Delete a comment
export const deleteComment = async (commentId) => {
  try {
    await api.delete(`/comments/${commentId}/`);
    return true;
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error;
  }
};
