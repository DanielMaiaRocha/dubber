import React from "react";
import { useNavigate } from "react-router-dom";
import { Chat, Star, Language, Place } from "@mui/icons-material";
import { Button, CircularProgress, Chip, Stack } from "@mui/material";
import { useChatStore } from "../stores/useChatStore";
import { useUserStore } from "../stores/useUserStore";
import countryFlagEmoji from "country-flag-emoji";

function Card({
  id, // ID do usuário dono do card
  cover,
  title,
  description,
  price,
  totalStars,
  starNumber,
  role,
  lang,
  country,
  billingMethod,
}) {
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

    if (user._id === id) {
      return alert("Você não pode iniciar um chat consigo mesmo.");
    }

    try {
      const chatData = await createChat(id);

      if (chatData?._id) {
        navigate(`/chat/${chatData._id}`);
      } else {
        throw new Error("O servidor não retornou os dados do chat");
      }
    } catch (error) {
      console.error("Erro completo:", error);
      alert(`Falha ao criar chat: ${error.message}`);
    }
  };

  // Obter informações do país
  const countryInfo = countryFlagEmoji.get(country);
  const countryFlag = countryInfo?.emoji || "🌍";
  const countryName = countryInfo?.name || country;

  const getBillingSuffix = (method) => {
    switch (method) {
      case "hour":
        return "/hr";
      
      case "minute":
        return "/min";
      
      case "loop":
        return "/loop";

      default:
        return "";     
    }
  }

  const billingSuffix = getBillingSuffix(billingMethod)

  return (
    <div className="relative w-full max-w-md mx-auto bg-white text-gray-900 rounded-xl border overflow-hidden shadow-md hover:shadow-lg transition hover:scale-[1.02] duration-200">
      {/* Imagem de Capa */}
      <div
        className="w-full h-48 bg-cover bg-center"
        style={{ backgroundImage: `url(${cover})` }}
      ></div>

      {/* Conteúdo do Card */}
      <div className="p-4">
        {/* Título e Role */}
        <div className="mb-2">
          <h5 className="text-lg font-semibold">{title}</h5>
          {role && (
            <Chip
              label={role}
              size="small"
              className="mt-1 bg-blue-100 text-blue-800"
              sx={{ fontSize: "0.75rem" }}
            />
          )}
        </div>

        {/* Descrição */}
        <p className="text-sm text-gray-500 line-clamp-3 mb-3">{description}</p>

        {/* Country e Lang */}
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          {country && (
            <div className="flex items-center bg-gray-50 rounded-full px-3 py-1">
              <Place fontSize="small" className="text-gray-500 mr-1" />
              <span className="text-sm font-medium text-gray-700">
                {country}
              </span>
            </div>
          )}

          {lang && (
            <div className="flex items-center bg-gray-50 rounded-full px-3 py-1">
              <Language fontSize="small" className="text-gray-500 mr-1" />
              <span className="text-sm font-medium text-gray-700">{lang}</span>
            </div>
          )}
        </Stack>

        <div className="flex justify-between items-center">
        <div className="flex items-center gap-1 text-yellow-500">
          <Star fontSize="small" />
          <span className="text-sm font-bold">{rating.toFixed(1)}</span>
          <span className="text-gray-500 text-sm">({starNumber})</span>
        </div>
        <p className="text-lg font-bold text-gray-800">
          $ {price} <span className="text-sm text-gray-500">{billingSuffix}</span>
        </p>
      </div>

        {/* Botão de Chat */}
        <div className="mt-4">
          <Button
            variant="contained"
            fullWidth
            startIcon={<Chat />}
            onClick={handleCreateChat}
            disabled={loading}
            sx={{
              backgroundColor: "#17a2b8",
              "&:hover": {
                backgroundColor: "#2daabd",
              },
              py: 1.5,
              borderRadius: "8px",
            }}
          >
            {loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Iniciar Chat"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Card;
