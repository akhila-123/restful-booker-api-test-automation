import { apiRequest } from "./apiClient.js";
import dotenv from "dotenv";

dotenv.config(); // Load .env variables

let cachedToken;

export async function getAuthToken() {
  if (cachedToken) return cachedToken;
  try {
    const response = await apiRequest.post("/auth", {
      username: process.env.BOOKER_USERNAME,
      password: process.env.BOOKER_PASSWORD,
    });

    if (response.status === 200 && response.data.token) {
      cachedToken = response.data.token;
      return response.data.token; // Return only the token string
    } else {
      throw new Error(`Failed to get auth token. Status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error while fetching auth token:", error.message);
    throw error;
  }
}
