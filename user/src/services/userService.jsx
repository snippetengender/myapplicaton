import api from "../providers/api";

export async function getUser(userId) {
  try {
    if (!userId) {
      throw new Error("User ID is required to fetch user data.");
    }
    const response = await api.get(`/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching regions:", error);
    throw error;
  }
}