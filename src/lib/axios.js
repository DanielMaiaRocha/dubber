import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" 
    ? "http://localhost:8800/api"  // Se rodando localmente, usa o localhost
    : "https://api-dubber.onrender.com/api", // Se rodando no Vercel, usa a API no Render
  withCredentials: true,
});
export default axiosInstance;
