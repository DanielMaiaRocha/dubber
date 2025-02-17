import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

let refreshPromise = null;

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
      const response = await axios.get("/auth/profile");

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
      const response = await axios.post("/auth/refresh-token", {}, { withCredentials: true }); //  Garante que os cookies sejam enviados
  
      console.log("Token refresh response:", response.data);
  
      // Se a API retorna novos dados do usuário, atualizamos na store
      if (response.data?.user) {
        set({ user: response.data.user });
      }
  
      set({ checkingAuth: false });
      return response.data;
    } catch (error) {
      console.error("Token refresh error:", error.response?.data || error.message);
  
      // Se falhar, desloga o usuário
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
        await refreshPromise;
        refreshPromise = null;

        return axios({
          ...originalRequest,
          method: "post", // Garante que a requisição será POST após o refresh
        });
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError.message);
        useUserStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

