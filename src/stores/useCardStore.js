import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios";

const handleRequest = async (requestFn, set, successCallback, errorMessage) => {
  set({ loading: true, error: null });
  try {
    const response = await requestFn();
    const result = successCallback(response.data);
    return result;
  } catch (error) {
    let errorMsg = "Erro de conexão";
    
    if (error.response) {
      errorMsg = error.response.data.error || errorMessage;
      if (error.response.status === 401) {
        errorMsg = "Não autorizado - faça login novamente";
      }
    }
    
    set({ error: errorMsg });
    toast.error(errorMsg);
    throw error;
  } finally {
    set({ loading: false });
  }
};

export const useCardStore = create((set, get) => ({
  cards: [],
  selectedCard: null,
  userCard: null,
  loading: false,
  error: null,

  // Setters básicos
  setCards: (cards) => set({ cards }),
  setSelectedCard: (card) => set({ selectedCard: card }),
  clearSelectedCard: () => set({ selectedCard: null }),
  clearUserCard: () => set({ userCard: null }),

  // Limpa todos os dados da store
  resetStore: () => set({
    cards: [],
    selectedCard: null,
    userCard: null,
    loading: false,
    error: null
  }),

  // Buscar um card pelo ID
  fetchCardById: async (_id) => {
    const existingCard = get().cards.find(card => card._id === _id);
    if (existingCard) {
      set({ selectedCard: existingCard });
      return existingCard;
    }

    return await handleRequest(
      () => axios.get(`/cards/${_id}`),
      set,
      (data) => {
        set({ selectedCard: data });
        return data;
      },
      "Falha ao buscar detalhes do card"
    );
  },

  // Buscar todos os cards
  fetchAllCards: async (forceRefresh = false) => {
    if (!forceRefresh && get().cards.length > 0) {
      return get().cards;
    }

    return await handleRequest(
      () => axios.get("/cards"),
      set,
      (data) => {
        set({ cards: data });
        return data;
      },
      "Falha ao buscar os cards"
    );
  },

  // Buscar card do usuário logado
  fetchUserCard: async () => {
    // Limpa o card atual antes de buscar
    set({ userCard: null });
    
    return await handleRequest(
      () => axios.get("/cards/user-card"),
      set,
      (data) => {
        set({ userCard: data });
        return data;
      },
      "Falha ao buscar o card do usuário"
    );
  },

  // Criar um novo card
  createCard: async (cardData) => {
    return await handleRequest(
      () => axios.post("/cards", cardData),
      set,
      (newCard) => {
        set((state) => ({
          cards: [newCard, ...state.cards],
          selectedCard: newCard,
          userCard: newCard.userId === get().userCard?.userId ? newCard : state.userCard
        }));
        return newCard;
      },
      "Falha ao criar o card"
    );
  },

  // Deletar um card
  deleteCard: async (_id) => {
    const previousCards = get().cards;
    const previousUserCard = get().userCard;
    
    // Atualização otimista
    set({
      cards: previousCards.filter((card) => card._id !== _id),
      selectedCard: get().selectedCard?._id === _id ? null : get().selectedCard,
      userCard: previousUserCard?._id === _id ? null : previousUserCard
    });

    try {
      await handleRequest(
        () => axios.delete(`/cards/${_id}`),
        set,
        () => true,
        "Falha ao deletar o card"
      );
    } catch (error) {
      // Rollback em caso de erro
      set({ 
        cards: previousCards,
        userCard: previousUserCard
      });
      throw error;
    }
  },

  // Atualizar um card
  updateCard: async (_id, cardData) => {
    const isFormData = cardData instanceof FormData;
    const config = isFormData ? {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    } : {};

    return await handleRequest(
      () => axios.put(`/cards/${_id}`, cardData, config),
      set,
      (updatedCard) => {
        set((state) => ({
          cards: state.cards.map(card => 
            card._id === _id ? updatedCard : card
          ),
          selectedCard: updatedCard,
          userCard: state.userCard?._id === _id ? updatedCard : state.userCard
        }));
        return updatedCard;
      },
      "Falha ao atualizar o card"
    );
  }

})); 

