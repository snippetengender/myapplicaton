export const getPollTimeInfo = (createdAtTimestamp) => {
  if (!createdAtTimestamp) {
    return { status: "ended", displayText: "Poll Ended", remainingMs: 0 };
  }

  let createdAt = Number(createdAtTimestamp);
  if (createdAt < 1e12) {
    createdAt *= 1000;
  }

  const POLL_DURATION_MS = 24 * 60 * 60 * 1000;
  const endTime = createdAt + POLL_DURATION_MS;
  const now = Date.now();
  const remainingMs = endTime - now;

  if (remainingMs <= 0) {
    return { status: "ended", displayText: "Poll Ended", remainingMs: 0 };
  }
  const hours = Math.floor(remainingMs / (1000 * 60 * 60));
  const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));

  let displayText = "ends in ";
  if (hours > 0) {
    displayText += `${hours}h`;
    if (minutes > 0) {
      displayText += ` ${minutes}m`;
    }
  } else if (minutes > 0) {
    displayText += `${minutes}m`;
  } else {
    displayText = "ends in <1m";
  }

  return { status: "active", displayText, remainingMs };
};