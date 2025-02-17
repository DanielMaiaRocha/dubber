import React, { useState, useEffect } from "react";
import CardTag from "../components/CardTag.jsx";
import Card from "../components/Card.jsx";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { useCardStore } from "../stores/useCardStore";

const CardSection = () => {
  const [tag, setTag] = useState("All");
  const navigate = useNavigate();

  const { user, checkingAuth, checkAuth } = useUserStore();
  const { cards, loading, error, fetchAllCards } = useCardStore();

  // Verifica a autenticação do usuário
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Busca todos os cards ao carregar o componente
  useEffect(() => {
    fetchAllCards();
  }, [fetchAllCards]);

  // Função para alterar a tag selecionada
  const handleTagChange = (newTag) => {
    setTag(newTag);
  };

  // Filtra os cards com base na tag selecionada
  const filteredProjects = Array.isArray(cards)
    ? cards.filter((project) => {
        return tag === "All" || (project.role && project.role.includes(tag));
      })
    : [];

  // Exibe o estado de loading enquanto os dados são carregados
  if (checkingAuth || loading) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  // Exibe uma mensagem de erro caso ocorra algum problema
  if (error) {
    return <div className="text-center mt-20">Error: {error}</div>;
  }

  // Redireciona para a página de login se o usuário não estiver autenticado
  if (!user) {
    navigate("/login");
    return null;
  }

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

      {/* Renderiza os cards */}
      <div className="grid md:grid-cols-1 gap-8 md:gap-12 mb-10">
        {filteredProjects.map((project) => (
          <div
            key={project._id}
            onClick={() => navigate(`/card/${project._id}`)} // Navega para a página do card
            role="button"
            aria-label={`View details of ${project.title}`}
            style={{ cursor: "pointer" }} // Adiciona um cursor de ponteiro para indicar que é clicável
          >
            <Card
              id={project.userId}
              title={project.title}
              price={project.price}
              starNumber={project.starNumber}
              totalStars={project.totalStars}
              tag={project.tag}
              role={project.role}
              description={project.desc}
              cover={project.cover}
              lang={project.lang}
              country={project.country}
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default CardSection;