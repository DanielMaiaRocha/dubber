import React, { useState, useEffect } from "react";
import CardTag from "../components/CardTag.jsx";
import Card from "../components/Card.jsx";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { useCardStore } from "../stores/useCardStore";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { CalendarCheck, MessageSquare, XCircle } from "lucide-react";

const CardSection = () => {
  const [tag, setTag] = useState("All");
  const [selectedCard, setSelectedCard] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const navigate = useNavigate();
  const { user, checkingAuth, checkAuth } = useUserStore();
  const { cards, loading, error, fetchAllCards } = useCardStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    fetchAllCards();
  }, [fetchAllCards]);

  const handleTagChange = (newTag) => setTag(newTag);

  const filteredProjects = Array.isArray(cards)
    ? cards.filter(
        (project) =>
          tag === "All" || (project.role && project.role.includes(tag))
      )
    : [];

  if (checkingAuth || loading) {
    return (
      <div className="text-center mt-20 text-lg font-semibold">
        Carregando...
      </div>
    );
  }

  if (error) {
    return <div className="text-center mt-20 text-red-500">Erro: {error}</div>;
  }

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleOpenConfirm = (project, type) => {
    setSelectedCard(project);
    setModalType(type);
    setConfirmOpen(true);
  };

  const handleConfirmAction = () => {
    setConfirmOpen(false);
    if (selectedCard) {
      if (modalType === "chat") {
        navigate(`/chat/${selectedCard.userId}`);
      } else if (modalType === "appointment") {
        navigate(`/appointment/${selectedCard.userId}`);
      }
    }
  };

  return (
    <>
      <h2 className="text-center ml-10 text-4xl font-bold text-black mt-10 mb-10">
        Professionals
      </h2>

      <div className="text-white md:flex flex-row justify-center items-center gap-6 py-6 mb-10 ml-10 hidden border w-96 md:w-[110rem]">
        {[
          "All",
          "Dubbing Actor",
          "Dubbing Director",
          "Project Manager",
          "Revisor",
          "Translator",
          "Dubbing Operator",
        ].map((tagName) => (
          <CardTag
            key={tagName}
            onClick={() => handleTagChange(tagName)}
            name={tagName}
            isSelected={tag === tagName}
          />
        ))}
      </div>

      <div className="grid md:grid-cols-1 gap-8 md:gap-12 mb-10">
        {filteredProjects.map((project) => (
          <div key={project._id}>
            {/* Card que leva para a página do profissional */}
            <div
              onClick={() => navigate(`/card/${project._id}`)}
              className="cursor-pointer"
            >
              <Card
                id={project.userId}
                title={project.title}
                price={project.price}
                starNumber={project.starNumber}
                totalStars={project.totalStars}
                tag={project.tag}
                role={project.role}
                description={project.shortDesc}
                cover={project.cover}
                lang={project.lang}
                country={project.country}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default CardSection;
