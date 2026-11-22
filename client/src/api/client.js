import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
  timeout: 15000
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message
      || error.response?.data?.error
      || (error.code === "ECONNABORTED"
        ? "The request timed out. Please try again."
        : "Unable to connect to the Library API. Check that the backend is running.");
    return Promise.reject(new Error(message));
  }
);

export default api;