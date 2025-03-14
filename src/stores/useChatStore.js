import { create } from "zustand";
import axios from "../lib/axios";
import { useUserStore } from "./useUserStore";

export const useChatStore = create((set, get) => ({
  conversation: null,
  messages: [],
  conversations: [],
  loading: false,
  error: null,
  typing: false, // Estado para rastrear se o usuário está digitando
  sseConnection: null,
  hasFetched: false,
  chatDetails: null, // Novo estado para armazenar os detalhes do chat

  // Função para definir o estado de "digitando"
  setTyping: (conversationId, isTyping) => {
    set({ typing: isTyping });
  },

  // Conectar ao SSE
  connectSSE: (conversationId) => {
    // Fecha a conexão SSE existente, se houver
    if (useChatStore.getState().eventSource) {
      useChatStore.getState().eventSource.close();
    }

    // Cria uma nova conexão SSE
    const eventSource = new EventSource(`/conversations/sse?conversationId=${conversationId}`);

    // Configura o listener para mensagens recebidas
    eventSource.onmessage = (event) => {
      const newMessage = JSON.parse(event.data); // Converte o evento para JSON
      set((state) => ({ messages: [...state.messages, newMessage] })); // Atualiza o estado
    };

    // Configura o listener para erros
    eventSource.onerror = (error) => {
      console.error("Erro na conexão SSE:", error);
      eventSource.close(); // Fecha a conexão em caso de erro
    };

    // Armazena a referência do eventSource no estado
    set({ eventSource });
  },

  // Desconectar do SSE
  disconnectSSE: () => {
    const eventSource = useChatStore.getState().eventSource;
    if (eventSource) {
      eventSource.close(); // Fecha a conexão SSE
      set({ eventSource: null }); // Remove a referência
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

      const { data } = await axios.get(`/messages/${conversationId}`);
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
      const messagesResponse = await axios.get(`/messages/${conversationId}`);
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

      const { data } = await axios.post(`/conversations/message`, {
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

  // Nova função: Buscar detalhes do chat
  fetchChatDetails: async (conversationId) => {
    try {
      set({ loading: true, error: null });

      // Faz a requisição para a nova rota
      const { data } = await axios.get(`/conversations/chat-details/${conversationId}`);

      // Atualiza o estado com os detalhes do chat
      set({ chatDetails: data, loading: false });
    } catch (error) {
      console.error("Erro ao buscar detalhes do chat:", error);
      set({ error: "Erro ao buscar detalhes do chat.", loading: false });
    }
  },
}));