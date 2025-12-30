const formatTimeAgo = (timestamp) => {
  const now = new Date();
  const secondsPast = (now.getTime() - timestamp) / 1000;

  if (secondsPast < 60) {
    return `${Math.round(secondsPast)}s`;
  }
  if (secondsPast < 3600) {
    return `${Math.round(secondsPast / 60)}m`;
  }
  if (secondsPast < 86400) {
    return `${Math.round(secondsPast / 3600)}h`;
  }
  const days = Math.floor(secondsPast / 86400);
  if (days < 7) {
    return `${days}d`;
  }
  const weeks = Math.floor(days / 7);
  return `${weeks}w`;
};

export const transformMixToPost = (mix) => {
  const degree = mix.user_details?.education_status?.degree || "";
  const prefix = degree.toLowerCase().includes("master") ? "m" : "b"; 
  const eduTag = `${prefix}${mix.user_details.college_show || ""}`;

  return {
    id: mix.id,
    user: {
      avatar: mix.user_details.profile,
      name: mix.user_details.name,
      profileType: "user",
      id: mix.user_details.username,
      eduTag,
    },
    time: formatTimeAgo(mix.sent_at),
    label: mix.mix_type,
    content: mix.title,
    stats: {
      thoughts: mix.comments_count,
      nah: mix.dislikes,
      hmm: mix.neutral,
      hellYeah: mix.likes,
    },
  };
};
