import React from "react";
import { useNavigate } from "react-router-dom";
import { CalendarMonth, Chat, LocationOn, Language, Star } from "@mui/icons-material";
import { Button, CircularProgress } from "@mui/material";
import { useChatStore } from "../stores/useChatStore";
import { useUserStore } from "../stores/useUserStore";

function Card({ id, cover, title, role, description, country, lang, price, totalStars, starNumber, userId }) {
  const navigate = useNavigate();
  const { createChat, loading } = useChatStore();
  const { user } = useUserStore();
  const rating = starNumber > 0 ? Math.min(5, totalStars) : 0;

  const handleCreateChat = async (event) => {
    event.stopPropagation();
    event.preventDefault();

    if (!user || !user._id) {
      return alert("Você precisa estar autenticado para iniciar um chat.");
    }

    console.log("Chamando createChat com cardId:", id); // Debug

    try {
      const chatData = await createChat(id); // Passa o cardId como participant
      if (chatData && chatData._id) {
        navigate(`/chat/${chatData._id}`);
      } else {
        throw new Error("Erro ao criar chat: Dados do chat inválidos.");
      }
    } catch (error) {
      console.error("Erro ao criar chat:", error);
      alert(error.message || "Erro ao criar chat. Tente novamente.");
    }
  };

  return (
    <div className="w-full md:w-[70%] max-h-80 md:flex mx-auto my-auto rounded-xl border overflow-hidden shadow-md bg-white hover:shadow-lg transition">
      <div
        className="w-full md:w-96 h-52 md:h-80 bg-cover bg-center cursor-pointer"
        style={{ backgroundImage: `url(${cover})` }}
        onClick={() => navigate(`/card/${id}`)}
      ></div>

      <div className="flex flex-col justify-between p-4 text-black flex-1">
        <div className="flex justify-between items-center">
          <h5
            className="text-2xl font-semibold cursor-pointer hover:underline"
            onClick={() => navigate(`/card/${id}`)}
          >
            {title}
          </h5>
          <h5 className="text-xl font-semibold text-[#17a2b8]">
            ${price}
            <span className="text-gray-600 font-normal"> /hr</span>
          </h5>
        </div>

        <div className="flex justify-between items-center mt-2">
          <h6 className="text-sm font-semibold text-gray-700">{role}</h6>
          <div className="flex items-center gap-1 text-[#ffc108]">
            <Star fontSize="small" />
            <span className="font-bold">{rating.toFixed(1)}</span>
          </div>
        </div>

        <p className="text-gray-600 line-clamp-2 mt-2">{description}</p>

        <div className="mt-4 space-y-2 text-gray-700">
          <p className="flex items-center gap-2">
            <Language fontSize="small" /> {lang}
          </p>
          <p className="flex items-center gap-2">
            <LocationOn fontSize="small" /> {country}
          </p>
        </div>

        <div className="flex gap-4 mt-4">
          <Button
            variant="contained"
            color="info"
            className="w-full"
            startIcon={<CalendarMonth />}
            onClick={() => alert("Funcionalidade de agendamento não implementada.")}
          >
            Appointment
          </Button>

          <Button
            variant="outlined"
            className="w-full"
            startIcon={<Chat />}
            onClick={handleCreateChat}
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : "Chat"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Card;