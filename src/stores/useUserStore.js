import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

let refreshPromise = null;

// Estado global com Zustand
export const useUserStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem("user")) || null,
  loading: false,
  checkingAuth: true,

  setUser: (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    set({ user: userData });
  },

  signup: async ({ name, email, password, confirmPassword, country, lang, isSeller }) => {
    if (password !== confirmPassword) return toast.error("Passwords do not match");

    set({ loading: true });

    try {
      const res = await axios.post("/auth/register", { name, email, password, country, lang, isSeller });
      set({ user: res.data, loading: false });
      localStorage.setItem("user", JSON.stringify(res.data));
      toast.success("Account created successfully!");
      await get().refreshToken();
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "An error occurred during signup");
    }
  },

  login: async (email, password) => {
    set({ loading: true });

    try {
      const res = await axios.post("/auth/login", { email, password });
      set({ user: res.data, loading: false });
      localStorage.setItem("user", JSON.stringify(res.data));
      toast.success("Logged in successfully!");
      await get().refreshToken();
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "An error occurred during login");
    }
  },

  logout: async () => {
    try {
      await axios.post("/auth/logout");
      localStorage.removeItem("user");
      set({ user: null });
      toast.success("Logged out successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred during logout");
    }
  },

  checkAuth: async () => {
    set({ checkingAuth: true });

    try {
      const response = await axios.get("/auth/profile");
      set({ user: response.data, checkingAuth: false });
      localStorage.setItem("user", JSON.stringify(response.data));
    } catch {
      set({ checkingAuth: false, user: null });
      localStorage.removeItem("user");
    }
  },

  refreshToken: async () => {
    if (get().checkingAuth) return;

    set({ checkingAuth: true });

    try {
      const response = await axios.post("/auth/refresh-token", {}, { withCredentials: true });
      const updatedUser = { ...get().user, token: response.data.accessToken };
      set({ user: updatedUser, checkingAuth: false });
      localStorage.setItem("user", JSON.stringify(updatedUser));
      return response.data;
    } catch {
      set({ user: null, checkingAuth: false });
      localStorage.removeItem("user");
      throw new Error("Token refresh failed");
    }
  },
}));

// Interceptor para incluir o token nas requisições
axios.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.token;
    if (token) config.headers["Authorization"] = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para renovar o token automaticamente
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        if (!refreshPromise) {
          refreshPromise = useUserStore.getState().refreshToken();
        }

        const refreshData = await refreshPromise;
        refreshPromise = null;

        originalRequest.headers["Authorization"] = `Bearer ${refreshData.accessToken}`;
        return axios(originalRequest);
      } catch {
        useUserStore.getState().logout();
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);
