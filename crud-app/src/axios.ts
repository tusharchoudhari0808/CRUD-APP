import axios, { AxiosError } from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // send/receive cookies automatically
});

// Request interceptor
api.interceptors.request.use(
  (config) => config,
  (error: AxiosError) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Only redirect if not already on /login
    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      window.location.pathname !== "/login"
    ) {
      console.log("Session expired. Redirecting to login...");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
