import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios";

export const useCardStore = create((set) => ({
  cards: [],
  loading: false,

  setCards: (cards) => set({ cards }),
  
  createCard: async (cardData) => {
    set({ loading: true });
    try {
      const res = await axios.post("/cards", cardData);
      set((prevState) => ({
        cards: [...prevState.cards, res.data],
        loading: false,
      }));
    } catch (error) {
      toast.error(error.response.data.error);
      set({ loading: false });
    }
  },
  
  fetchAllCards: async () => {
    set({ loading: true });
    try {
      const response = await axios.get("/cards");
      set({ cards: response.data.cards, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch cards", loading: false });
      toast.error(error.response.data.error || "Failed to fetch cards");
    }
  },
  
  fetchCardsByCategory: async (category) => {
    set({ loading: true });
    try {
      const response = await axios.get(`/cards/category/${category}`);
      set({ cards: response.data.cards, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch cards", loading: false });
      toast.error(error.response.data.error || "Failed to fetch cards");
    }
  },
  
  deleteCard: async (cardId) => {
    set({ loading: true });
    try {
      await axios.delete(`/cards/${cardId}`);
      set((prevCards) => ({
        cards: prevCards.cards.filter((card) => card._id !== cardId),
        loading: false,
      }));
    } catch (error) {
      set({ loading: false });
      toast.error(error.response.data.error || "Failed to delete card");
    }
  },
}));
