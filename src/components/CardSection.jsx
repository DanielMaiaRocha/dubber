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

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    fetchAllCards();
  }, [fetchAllCards]);

  const handleTagChange = (newTag) => {
    setTag(newTag);
  };

  const filteredProjects = Array.isArray(cards)
    ? cards.filter((project) => {
        return tag === "All" || (project.role && project.role.includes(tag));
      })
    : [];

  if (checkingAuth || loading) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-20">Error: {error}</div>;
  }

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
            onClick={() => navigate(`/card/${project._id}`)}
            role="button"
            aria-label={`View details of ${project.title}`}
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
