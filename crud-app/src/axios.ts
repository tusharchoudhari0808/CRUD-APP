// ================= Axios Instance =================
import axios from "axios";

// Create a pre-configured axios instance
const api = axios.create({
  baseURL: "http://localhost:3000/api", // Base URL for all requests
  headers: { "Content-Type": "application/json" }, // JSON by default
  withCredentials: true, // Send/receive cookies automatically (for sessions/JWT)
});

export default api;
