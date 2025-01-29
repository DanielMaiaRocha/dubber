import React, { useState, useEffect } from "react";
import CardTag from "./CardTag";
import Card from "./Card";
import { useNavigate } from "react-router-dom";

const CardSection = () => {
  const [tag, setTag] = useState("All");
  const [projectsData, setProjectsData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await fetch("http://localhost:8800/api/cards");
        const data = await response.json();
        setProjectsData(data);
      } catch (error) {
        console.error("Error fetching cards:", error);
      }
    };

    fetchCards();
  }, []);

  const handleTagChange = (newTag) => {
    setTag(newTag);
  };

  // Filter cards based on selected tag
  const filteredProjects = projectsData.filter((project) => {
    return tag === "All" || (project.role && project.role.includes(tag));
  });

  return (
    <>
      <h2 className="text-center ml-10 text-4xl font-bold text-black mt-10 mb-10">
        Professionals
      </h2>
      <div className="text-white md:flex flex-row justify-center items-center gap-6 py-6 mb-10 ml-10 hidden border w-96 md:w-[110rem]">
        {["All", "Dubbing Actor", "Dubbing Director", "Project Manager", "Revisor", "Translator", "Dubbing Operator"].map((tagName) => (
          <CardTag
            key={tagName}
            onClick={() => handleTagChange(tagName)}
            name={tagName}
            isSelected={tag === tagName}
          />
        ))}
      </div>

      {/* Render cards */}
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
