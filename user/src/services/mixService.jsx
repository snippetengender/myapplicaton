import api from "../providers/api";

const convertToRelativeTime = (timestamp) => {
  const now = new Date();
  const sent = new Date(timestamp);
  const diffMs = now - sent;

  const seconds = diffMs / 1000;
  const minutes = seconds / 60;
  const hours = minutes / 60;
  const days = hours / 24;
  const weeks = days / 7;

  if (weeks >= 1) return `${Math.floor(weeks)}w`;
  if (days >= 1) return `${Math.floor(days)}d`;
  if (hours >= 1) return `${Math.floor(hours)}h`;
  if (minutes >= 1) return `${Math.floor(minutes)}m`;
  return `${Math.floor(seconds)}s`;
};

//Fetching all mixes
export const fetchFormattedMixes = async () => {
  try {
    const res = await api.get("/mixes");
    const mixes = Array.isArray(res.data.data) ? res.data.data : [];
    return mixes.reverse().map((mix) => ({
      id: mix.id,
      tag: "mix",
      user: {
        profileType: "user",
        name: mix.user_id?.name || "unknown",
        id: mix.user_id?.reference_id || "unknown",
        avatar: mix.user_details?.profile || "https://via.placeholder.com/40",
        college: mix.user_details?.college_show
      },
      time: convertToRelativeTime(new Date(mix.sent_at).toISOString()),
      label: mix.mix_type || "general",
      content: mix.title || "",
      stats: {
        nah: mix.dislikes || 0,
        hmm: mix.neutral || 0,
        hellYeah: mix.likes || 0,
        thoughts: mix.comments_count || 0,
      },
    }));
  } catch (err) {
    console.error("Error fetching mixes:", err);
    return [];
  }
};

//Reaction to mixes
export const patchMixReaction = async (mixId, reaction) => {
  try {
    return await api.patch(`/mixes/${mixId}/reaction`, { reaction });
  } catch (err) {
    console.error("Error patching reaction:", err);
    return null;
  }
};

//Creating a mix
export const createMix = async ({
  title,
  description = "",
  mix_type,
  network_id = null,
  poll_options = [],
}) => {
  const payload = {
    title,
    mix_type,
    description,
  };

  if (network_id) {
    payload.network_id = network_id;
  }

  if (mix_type === "poll" && Array.isArray(poll_options)) {
    payload.poll_options = poll_options.map((option) => ({
      reference_id: option.reference_id,
      name: option.name,
    }));
  }

  try {
    const response = await api.post("/mixes", payload);
    return response.data;
  } catch (error) {
    console.error("Error creating mix:", error);
    throw error;
  }
};

//fetch comments
export const fetchComments = async (mixId, params = {}) => {
  const res = await api.get(`/mixes/${mixId}/comments`, { params });
  return res.data;
};

//create comment
export const postComment = async ({ mix_id, comment }) => {
  return api.post(`mixes/comments/`, {
    mix_id,
    comment,
  });
};

//delete comment
export const deleteComment = async (commentId) => {
  return api.delete(`/comments/${commentId}/`);
};
