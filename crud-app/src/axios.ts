import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: { "Content-Type": "application/json" },
});

// Request interceptor: attach token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = config.headers || {};
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response interceptor: handle 401
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login"; // redirect user to login
    }
    return Promise.reject(error);
  }
);

export default api;
