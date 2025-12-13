import api from "../../services/api"; 

export async function fetchRegions(query = "") {
  try {
    const response = await api.get(`/college/city?name=${query}`);
    return response.data.data; 
  } catch (error) {
    console.error("Error fetching regions:", error);
    throw error;
  }
}
