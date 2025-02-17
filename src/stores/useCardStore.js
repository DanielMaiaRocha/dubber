import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios";

// Função genérica para manipular requisições
const handleRequest = async (requestFn, set, successCallback, errorMessage) => {
  set({ loading: true });
  try {
    const response = await requestFn();
    successCallback(response.data);
    set({ loading: false });
  } catch (error) {
    set({ loading: false });
    if (error.response) {
      toast.error(error.response.data.error || errorMessage);
    } else if (error.request) {
      toast.error("Network error. Please check your connection.");
    } else {
      toast.error("An unexpected error occurred.");
    }
  }
};

export const useCardStore = create((set) => ({
  cards: [],
  selectedCard: null, // Estado para armazenar o card selecionado
  loading: false,

  setCards: (cards) => set({ cards }),

  // Buscar um card pelo ID
  fetchCardById: async (_id) => { // Alterado de cardId para _id
    console.log("Buscando card com ID:", _id);
    await handleRequest(
      () => axios.get(`/cards/${_id}`), // Alterado de cardId para _id
      set,
      (data) => {
        set({ selectedCard: data });
        toast.success("Detalhes do card carregados com sucesso!");
      },
      "Falha ao buscar detalhes do card"
    );
  },

  // Buscar todos os cards
  fetchAllCards: async () => {
    await handleRequest(
      () => axios.get("/cards"), // Função de requisição
      set, // Função set do Zustand
      (data) => {
        set({ cards: data }); // Callback de sucesso
        toast.success("Cards loaded successfully!");
      },
      "Failed to fetch cards" // Mensagem de erro
    );
  },

  // Criar um novo card
  createCard: async (cardData) => {
    await handleRequest(
      () => axios.post("/cards", cardData), // Função de requisição
      set, // Função set do Zustand
      (newCard) => {
        set((prevState) => ({
          cards: [...prevState.cards, newCard], // Adiciona o novo card à lista
        }));
        toast.success("Card created successfully!");
      },
      "Failed to create card" // Mensagem de erro
    );
  },

  // Deletar um card
  deleteCard: async (_id) => {
    await handleRequest(
      () => axios.delete(`/cards/${_id}`), // Função de requisição
      set, // Função set do Zustand
      () => {
        set((prevState) => ({
          cards: prevState.cards.filter((card) => card._id !== _id), // Remove o card da lista
        }));
        toast.success("Card deleted successfully!");
      },
      "Failed to delete card" // Mensagem de erro
    );
  },
}));