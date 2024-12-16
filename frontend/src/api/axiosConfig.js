import axios from "axios";

// Axios instance for API calls
const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api", // Backend API base URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include the token (if available)
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
