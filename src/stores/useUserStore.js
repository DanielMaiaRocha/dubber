import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

let refreshPromise = null;

// Interceptor para incluir o token em todas as requisições automaticamente
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Definição do estado da loja com Zustand
export const useUserStore = create((set, get) => ({
  user: null,
  loading: false,
  checkingAuth: true,

  setUser: (userData) => set({ user: userData }),

  // Método para registrar um novo usuário
  signup: async ({ name, email, password, confirmPassword, country, lang, isSeller }) => {
    set({ loading: true });

    if (password !== confirmPassword) {
      set({ loading: false });
      return toast.error("Passwords do not match");
    }

    try {
      console.log("Sending signup request:", { name, email, password, country, lang, isSeller });
      const res = await axios.post("/auth/register", { name, email, password, country, lang, isSeller });

      console.log("Signup response:", res.data);
      set({ user: res.data, loading: false });
      toast.success("Account created successfully!");

      // Salva o token no localStorage
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }

      // Chama refreshToken após o cadastro
      await get().refreshToken();
    } catch (error) {
      set({ loading: false });
      console.error("Signup error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "An error occurred during signup");
    }
  },

  // Método de login
  login: async (email, password) => {
    set({ loading: true });

    try {
      console.log("Sending login request:", { email, password });
      const res = await axios.post("/auth/login", { email, password });

      console.log("Login response:", res.data);
      set({ user: res.data, loading: false });
      toast.success("Logged in successfully!");

      // Salva o token no localStorage
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }

      // Chama refreshToken após o login
      await get().refreshToken();
    } catch (error) {
      set({ loading: false });
      console.error("Login error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "An error occurred during login");
    }
  },

  // Método de logout
  logout: async () => {
    try {
      console.log("Sending logout request");
      await axios.post("/auth/logout");

      // Remove o token do localStorage
      localStorage.removeItem("token");

      set({ user: null });
      toast.success("Logged out successfully!");
    } catch (error) {
      console.error("Logout error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "An error occurred during logout");
    }
  },

  // Método para verificar a autenticação do usuário
  checkAuth: async () => {
    set({ checkingAuth: true });

    try {
      console.log("Checking user authentication");

      const token = localStorage.getItem("acessToken");
      if (!token) {
        console.error("No token found");
        set({ checkingAuth: false, user: null });
        return;
      }

      const response = await axios.get("/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Auth check response:", response.data);
      set({ user: response.data, checkingAuth: false });
    } catch (error) {
      console.error("Auth check error:", error.response?.data || error.message);
      set({ checkingAuth: false, user: null });
    }
  },

  // Método para renovar o token de autenticação
  refreshToken: async () => {
    if (get().checkingAuth) return;
  
    set({ checkingAuth: true });
  
    try {
      console.log("Refreshing token...");
      
      const response = await axios.post(
        "/auth/refresh-token",
        {},
        { withCredentials: true } // 🔥 Envia cookies junto!
      );
  
      console.log("Token refresh response:", response.data);
  
      if (response.data?.accessToken) {
        localStorage.setItem("accessToken", response.data.accessToken);
      }
  
      set({ checkingAuth: false });
      return response.data;
    } catch (error) {
      console.error("Token refresh error:", error.response?.data || error.message);
      set({ user: null, checkingAuth: false });
      throw error;
    }
  },
  
}));

// Interceptor do Axios para lidar com erros e renovação de token
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        if (refreshPromise) {
          await refreshPromise;
          return axios(originalRequest);
        }

        refreshPromise = useUserStore.getState().refreshToken();
        const refreshData = await refreshPromise;
        refreshPromise = null;

        originalRequest.headers["Authorization"] = `Bearer ${refreshData.token}`;

        return axios(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError.message);
        useUserStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
