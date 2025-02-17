import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

let refreshPromise = null;

// Interceptor para incluir o token nas requisições
axios.interceptors.request.use(
  (config) => {
    const token = useUserStore.getState().user?.token;
    if (token) config.headers["Authorization"] = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Estado global com Zustand
export const useUserStore = create((set, get) => ({
  user: null,
  loading: false,
  checkingAuth: true,

  setUser: (userData) => set({ user: userData }),

  signup: async ({ name, email, password, confirmPassword, country, lang, isSeller }) => {
    if (password !== confirmPassword) return toast.error("Passwords do not match");

    set({ loading: true });

    try {
      const res = await axios.post("/auth/register", { name, email, password, country, lang, isSeller });
      set({ user: res.data, loading: false });
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
    } catch {
      set({ checkingAuth: false, user: null });
    }
  },

  refreshToken: async () => {
    if (get().checkingAuth) return;
    
    set({ checkingAuth: true });

    try {
      const response = await axios.post("/auth/refresh-token", {}, { withCredentials: true });
      set({ user: { ...get().user, token: response.data.acessToken }, checkingAuth: false });
      return response.data;
    } catch {
      set({ user: null, checkingAuth: false });
      throw new Error("Token refresh failed");
    }
  },
}));

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

        originalRequest.headers["Authorization"] = `Bearer ${refreshData.acessToken}`;
        return axios(originalRequest);
      } catch {
        useUserStore.getState().logout();
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);
