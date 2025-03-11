import { create } from "zustand";
import axios from "../lib/axios";
import { useUserStore } from "./useUserStore";

export const useChatStore = create((set, get) => ({
  conversation: null,
  messages: [],
  conversations: [],
  loading: false,
  error: null,
  typing: false,
  sseConnection: null,
  hasFetched: false,

  // Conectar ao SSE
  connectSSE: (conversationId) => {
    const sseConnection = new EventSource(
      `${import.meta.env.VITE_API_BASE_URL}/conversations/sse?conversationId=${conversationId}`
    );

    sseConnection.onmessage = (event) => {
      const newMessage = JSON.parse(event.data);
      set((state) => ({ messages: [...state.messages, newMessage] }));
    };

    sseConnection.onerror = () => {
      console.error("Erro na conexão SSE.");
      sseConnection.close();
    };

    set({ sseConnection });
  },

  // Desconectar do SSE
  disconnectSSE: () => {
    const { sseConnection } = get();
    if (sseConnection) {
      sseConnection.close();
      set({ sseConnection: null });
    }
  },

  // Buscar todas as conversas do usuário
  fetchConversations: async () => {
    const { hasFetched, loading } = get();

    if (hasFetched || loading) {
      console.log("Conversas já carregadas ou carregamento em andamento.");
      return;
    }

    try {
      set({ loading: true, error: null });

      const { data } = await axios.get("/conversations/chats");
      set({ conversations: data, loading: false, hasFetched: true });
    } catch (error) {
      console.error("Erro ao obter conversas:", error);
      set({ error: "Erro ao obter conversas.", loading: false });
    }
  },

  // Resetar o estado de fetch
  resetFetchState: () => {
    set({ hasFetched: false });
  },

  // Criar um novo chat
  createChat: async (cardId) => {
    try {
      const user = useUserStore.getState().user;
      if (!user || !user._id) throw new Error("Usuário não autenticado.");

      if (!cardId) {
        throw new Error("ID do card é obrigatório.");
      }

      const response = await axios.post("/conversations/chat", {
        participant: cardId,
      });

      console.log("Chat criado:", response.data);
      return response.data;
    } catch (error) {
      console.error("Erro ao criar chat:", error);

      let errorMessage = "Erro ao criar chat.";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      set({ error: errorMessage });
      throw error;
    }
  },

  // Obter mensagens de uma conversa
  getMessages: async (conversationId) => {
    try {
      set({ loading: true, error: null });

      const { data } = await axios.get(`/messages/${conversationId}`); // Usando a rota /messages/:id
      set({ messages: data, loading: false });
    } catch (error) {
      console.error("Erro ao obter mensagens:", error);
      set({ error: "Erro ao obter mensagens.", loading: false });
    }
  },

  // Buscar dados do chat (conversa + mensagens)
  fetchChatData: async (conversationId) => {
    try {
      set({ loading: true, error: null });

      // Busca a conversa
      const conversationResponse = await axios.get(`/messages/${conversationId}`);
      set({ conversation: conversationResponse.data });

      // Busca as mensagens
      const messagesResponse = await axios.get(`/messages/${conversationId}`); // Usando a rota /messages/:id
      set({ messages: messagesResponse.data });

      set({ loading: false });
    } catch (error) {
      console.error("Erro ao buscar dados do chat:", error);
      set({ error: "Erro ao buscar dados do chat.", loading: false });
    }
  },

  // Enviar uma mensagem
  sendMessage: async (conversationId, userId, text) => {
    try {
      set({ loading: true, error: null });

      const { data } = await axios.post(`/conversations/messages`, { // Usando a rota /messages
        conversationId,
        userId,
        text,
      });

      set((state) => ({ messages: [...state.messages, data], loading: false }));
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      set({ error: "Erro ao enviar mensagem.", loading: false });
    }
  },
}));