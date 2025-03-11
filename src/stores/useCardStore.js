import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios";

// Função genérica para manipular requisições
const handleRequest = async (requestFn, set, successCallback, errorMessage) => {
  set({ loading: true });
  try {
    const response = await requestFn();
    successCallback(response.data);
  } catch (error) {
    if (error.response) {
      toast.error(error.response.data.error || errorMessage);
    } else {
      toast.error("Erro de conexão.");
    }
  } finally {
    set({ loading: false });
  }
};

export const useCardStore = create((set) => ({
  cards: [],
  selectedCard: null,
  loading: false,

  setCards: (cards) => set({ cards }),

  // Buscar um card pelo ID
  fetchCardById: async (_id) => {
    console.log("Buscando card com ID:", _id);
    await handleRequest(
      () => axios.get(`/cards/${_id}`),
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
      () => axios.get("/cards"),
      set,
      (data) => {
        set({ cards: data });
        toast.success("Cards carregados com sucesso!");
      },
      "Falha ao buscar os cards"
    );
  },

  // Criar um novo card
  createCard: async (cardData) => {
    await handleRequest(
      () => axios.post("/cards", cardData),
      set,
      (newCard) => {
        set((prevState) => ({
          cards: [...prevState.cards, newCard],
        }));
        toast.success("Card criado com sucesso!");
      },
      "Falha ao criar o card"
    );
  },

  // Deletar um card
  deleteCard: async (_id) => {
    await handleRequest(
      () => axios.delete(`/cards/${_id}`),
      set,
      () => {
        set((prevState) => ({
          cards: prevState.cards.filter((card) => card._id !== _id),
        }));
        toast.success("Card deletado com sucesso!");
      },
      "Falha ao deletar o card"
    );
  },
}));
