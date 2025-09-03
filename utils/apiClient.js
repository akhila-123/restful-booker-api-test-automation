import axios from "axios"
import https from "https"
import dotenv from 'dotenv'

dotenv.config(); // Load .env variables

const agent = new https.Agent({ rejectUnauthorized: false})

export const apiRequest = axios.create({
  baseURL: process.env.BASE_URL,
  httpsAgent: agent
})

// Simple request/response logging (prints during test runs)
apiRequest.interceptors.request.use((request) => {
  console.log(`[REQ] ${request.method?.toUpperCase()} ${request.baseURL}${request.url} ${JSON.stringify(request.data)}  ${request.headers}`);
  return request;
});
apiRequest.interceptors.response.use((response) => {
  console.log(`[RES] ${response.status} ${response.config.url}`);
  return response;
});


