import { create } from "zustand";
import axios from "../lib/axios";
import { io } from "socket.io-client";

// Configuração do Socket.io
const socket = io("http://localhost:8800", {
  withCredentials: true,
  autoConnect: false,
});

export const useChatStore = create((set, get) => ({
  conversation: null,
  messages: [],
  conversations: [],
  loading: false,
  error: null,
  typing: false,
  socket: socket,
  hasFetched: false,
  chatDetails: null,

  // --- Conexão WebSocket --- //
  connectSocket: () => {
    const { socket } = get();
    if (!socket.connected) {
      socket.connect();
    }
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket.connected) {
      socket.disconnect();
    }
  },

  joinConversation: (conversationId) => {
    const { socket } = get();
    socket.emit("joinConversation", conversationId);
  },

  leaveConversation: (conversationId) => {
    const { socket } = get();
    socket.emit("leaveConversation", conversationId);
  },

  // --- Listeners WebSocket --- //
  setupSocketListeners: () => {
    const { socket } = get();

    socket.on("newMessage", (message) => {
      set((state) => ({
        messages: [...state.messages, message],
        conversations: state.conversations.map((conv) =>
          conv._id === message.conversationId
            ? { ...conv, lastMessage: message.text, updatedAt: new Date() }
            : conv
        ),
      }));
    });

    socket.on("conversationUpdated", (update) => {
      set({
        conversation: { ...get().conversation, ...update },
        conversations: get().conversations.map((conv) =>
          conv._id === update._id ? { ...conv, ...update } : conv
        ),
      });
    });

    socket.on("connect_error", (err) => {
      console.error("Erro no WebSocket:", err.message);
      set({ error: "Erro na conexão em tempo real" });
    });
  },

  // --- Funções de API --- //
  fetchConversations: async () => {
    try {
      set({ loading: true, error: null });
      const { data } = await axios.get("/conversations/chats");

      const populatedConversations = await Promise.all(
        data.map(async (conv) => {
          if (
            !conv.participants ||
            conv.participants.some((p) => typeof p === "string")
          ) {
            const { data: fullConv } = await axios.get(
              `/conversations/${conv._id}`
            );
            return fullConv;
          }
          return conv;
        })
      );

      set({
        conversations: populatedConversations,
        loading: false,
        hasFetched: true,
      });
    } catch (error) {
      console.error("Erro ao obter conversas:", error);
      set({
        error: error.response?.data?.message || "Erro ao carregar conversas",
        loading: false,
      });
    }
  },

  getMessages: async (conversationId) => {
    try {
      set({ loading: true, error: null });
      const { data } = await axios.get(`/messages/${conversationId}`);
      set({ messages: data, loading: false });
    } catch (error) {
      console.error("Erro ao obter mensagens:", error);
      set({
        error: error.response?.data?.message || "Erro ao carregar mensagens",
        loading: false,
      });
    }
  },

  sendMessage: async (conversationId, userId, text) => {
    try {
      set({ loading: true, error: null });
      const { data } = await axios.post("/conversations/message", {
        conversationId,
        userId,
        text,
      });
      return data;
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      set({
        error: error.response?.data?.message || "Erro ao enviar mensagem",
        loading: false,
      });
      throw error;
    }
  },

  createChat: async (participantId) => {
    try {
      if (!participantId) {
        throw new Error("ID do participante é obrigatório");
      }
  
      // Obter o token do usuário logado
      const token = localStorage.getItem('acessToken') || 
                   sessionStorage.getItem('acessToken');
  
      if (!token) {
        throw new Error("Usuário não autenticado");
      }
  
      const response = await axios.post("/conversations/chat", {
        participant: participantId
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.data?._id) {
        throw new Error("Resposta inválida do servidor");
      }
  
      return response.data;
    } catch (error) {
      console.error("Erro ao criar chat:", error);
      const errorMessage = error.response?.data?.message || 
                         error.message || 
                         "Erro ao criar conversa";
      throw new Error(errorMessage);
    }
  },

  fetchChatDetails: async (conversationId) => {
    try {
      set({ loading: true, error: null });
      const { data } = await axios.get(
        `/conversations/chat-details/${conversationId}`
      );
      set({ chatDetails: data, loading: false });
    } catch (error) {
      console.error("Erro ao buscar detalhes:", error);
      set({
        error: error.response?.data?.message || "Erro ao buscar detalhes",
        loading: false,
      });
    }
  },

  // --- Utilitários --- //
  setTyping: (isTyping) => {
    set({ typing: isTyping });
  },

  resetChat: () => {
    set({
      messages: [],
      conversation: null,
      chatDetails: null,
      typing: false,
    });
  },
}));
