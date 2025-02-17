import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.mode === "development" ? "http://api-dubber.onrender.com/api" : "/api",
  withCredentials: true,
});

export default axiosInstance;
