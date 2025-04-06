import React, { useState, useEffect, useMemo } from "react";
import Card from "../components/Card.jsx";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { useCardStore } from "../stores/useCardStore";
import Select from "react-select";
import countryFlagEmoji from "country-flag-emoji";
import { FiSearch, FiFilter, FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const CardSection = () => {
  const [filters, setFilters] = useState({ country: "", lang: "", role: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [isFiltered, setIsFiltered] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 15;

  const navigate = useNavigate();
  const { user, checkingAuth, checkAuth } = useUserStore();
  const { cards, loading, error, fetchAllCards } = useCardStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    fetchAllCards();
  }, [fetchAllCards]);

  useEffect(() => {
    const hasActiveFilters = Object.values(filters).some(Boolean) || searchQuery;
    setIsFiltered(hasActiveFilters);
    setCurrentPage(1); // Reset to first page when filters change
  }, [filters, searchQuery]);

  const handleFilterChange = (selectedOption, { name }) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: selectedOption ? selectedOption.value : "",
    }));
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const clearAllFilters = () => {
    setFilters({ country: "", lang: "", role: "" });
    setSearchQuery("");
  };

  const countries = useMemo(() => [
    { value: "United States", label: "United States" },
    { value: "Brazil", label: "Brazil" },
    { value: "Canada", label: "Canada" },
    { value: "United Kingdom", label: "United Kingdom" },
    { value: "Germany", label: "Germany" },
    { value: "France", label: "France" },
    { value: "Spain", label: "Spain" },
    { value: "Italy", label: "Italy" },
    { value: "Japan", label: "Japan" },
    { value: "China", label: "China" },
    { value: "India", label: "India" },
    { value: "Australia", label: "Australia" },
    { value: "Mexico", label: "Mexico" },
    { value: "Argentina", label: "Argentina" },
    { value: "Portugal", label: "Portugal" },
  ], []);

  const languages = useMemo(() => [
    { value: "English", label: "English" },
    { value: "Portuguese", label: "Portuguese" },
    { value: "Spanish", label: "Spanish" },
    { value: "French", label: "French" },
    { value: "German", label: "German" },
    { value: "Italian", label: "Italian" },
    { value: "Japanese", label: "Japanese" },
    { value: "Chinese", label: "Chinese" },
    { value: "Hindi", label: "Hindi" },
    { value: "Russian", label: "Russian" },
  ], []);

  const roles = useMemo(() => [
    { value: "Dubbing Actor", label: "Dubbing Actor" },
    { value: "Dubbing Director", label: "Dubbing Director" },
    { value: "Project Manager", label: "Project Manager" },
    { value: "Revisor", label: "Revisor" },
    { value: "Translator", label: "Translator" },
    { value: "Dubbing Operator", label: "Dubbing Operator" },
  ], []);

  const filteredProjects = useMemo(() => {
    if (!cards) return [];
    
    return cards.filter((project) => {
      const matchesCountry = !filters.country || project.country === filters.country;
      const matchesLang = !filters.lang || project.lang.toLowerCase().includes(filters.lang.toLowerCase());
      const matchesRole = !filters.role || project.role.toLowerCase().includes(filters.role.toLowerCase());
      const matchesSearch = !searchQuery || 
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (project.description && project.description.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return matchesCountry && matchesLang && matchesRole && matchesSearch;
    });
  }, [cards, filters, searchQuery]);

  // Pagination logic
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = filteredProjects.slice(indexOfFirstCard, indexOfLastCard);
  const totalPages = Math.ceil(filteredProjects.length / cardsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const customStyles = {
    control: (provided) => ({
      ...provided,
      width: "100%",
      minWidth: "200px",
      backgroundColor: "white",
      border: "1px solid #e2e8f0",
      borderRadius: "8px",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#cbd5e0",
      },
      minHeight: "44px",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#3182ce" : "white",
      color: state.isSelected ? "white" : "#4a5568",
      "&:hover": {
        backgroundColor: "#ebf8ff",
        color: "#2b6cb0",
      },
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#a0aec0",
    }),
  };

  if (checkingAuth) {
    return <div className="text-center mt-20 text-lg font-semibold">Verificando autenticação...</div>;
  }

  if (!user) {
    navigate("/login");
    return null;
  }

  if (error) {
    return (
      <div className="text-center mt-20 text-red-500">
        Erro ao carregar profissionais: {error}
        <button 
          onClick={fetchAllCards}
          className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  const renderSkeletons = () => {
    return Array(6).fill(0).map((_, index) => (
      <div key={index}>
        <Skeleton height={300} borderRadius={12} />
        <Skeleton height={24} width={200} className="mt-2" />
        <Skeleton height={20} width={150} className="mt-1" />
        <Skeleton height={16} width={180} className="mt-1" />
      </div>
    ));
  };

  return (
    <div className="container mx-auto px-4 pb-12">
      <h2 className="text-center text-4xl font-bold font-Oswald text-gray-600 mt-20 mb-8">Professionals</h2>
      {/* Filtros para desktop */}
      <div className="hidden md:flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 mb-8">
        <div className="relative w-full md:w-64">
          <FiSearch className="absolute left-3 top-3.5 font-Oswald text-gray-500" />
          <input
            type="text"
            placeholder="Search for a Name..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-10 pr-4 py-2  border rounded-md w-full bg-white font-Oswald focus:outline-none focus:ring-2 focus:ring-blue-[#17a2b8]"
          />
        </div>

        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <Select
            name="country"
            options={countries}
            value={countries.find(opt => opt.value === filters.country)}
            onChange={(selectedOption) => handleFilterChange(selectedOption, { name: "country" })}
            placeholder="Country"
            styles={customStyles}
            isClearable
            formatOptionLabel={(option) => (
              <div className="flex items-center">
                <span className="mr-2">
                  {countryFlagEmoji.get(option.value)?.emoji || "🌍"}
                </span>
                <span>{option.label}</span>
              </div>
            )}
          />

          <Select
            name="lang"
            options={languages}
            value={languages.find(opt => opt.value === filters.lang)}
            onChange={(selectedOption) => handleFilterChange(selectedOption, { name: "lang" })}
            placeholder="Language"
            styles={customStyles}
            isClearable
          />

          <Select
            name="role"
            options={roles}
            value={roles.find(opt => opt.value === filters.role)}
            onChange={(selectedOption) => handleFilterChange(selectedOption, { name: "role" })}
            placeholder="Role"
            styles={customStyles}
            isClearable
          />

          {isFiltered && (
            <button
              onClick={clearAllFilters}
              className="flex items-center px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition"
            >
              <FiX className="mr-1" /> Clean filters
            </button>
          )}
        </div>
      </div>

      {/* Filtros para mobile */}
      <div className="md:hidden mb-6">
        <div className="flex gap-3">
          <div className="relative flex-grow">
            <FiSearch className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for a name..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10 pr-4 py-2 border rounded-md w-full bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="flex items-center px-4 py-2 bg-white border rounded-md hover:bg-gray-50"
          >
            <FiFilter className="mr-2" />
            Filtros
          </button>
        </div>

        {mobileFiltersOpen && (
          <div className="mt-3 p-4 bg-white rounded-lg shadow-md">
            <div className="grid grid-cols-1 gap-3">
              <Select
                name="country"
                options={countries}
                value={countries.find(opt => opt.value === filters.country)}
                onChange={(selectedOption) => handleFilterChange(selectedOption, { name: "country" })}
                placeholder="País"
                styles={customStyles}
                isClearable
                formatOptionLabel={(option) => (
                  <div className="flex items-center">
                    <span className="mr-2">
                      {countryFlagEmoji.get(option.value)?.emoji || "🌍"}
                    </span>
                    <span>{option.label}</span>
                  </div>
                )}
              />

              <Select
                name="lang"
                options={languages}
                value={languages.find(opt => opt.value === filters.lang)}
                onChange={(selectedOption) => handleFilterChange(selectedOption, { name: "lang" })}
                placeholder="Idioma"
                styles={customStyles}
                isClearable
              />

              <Select
                name="role"
                options={roles}
                value={roles.find(opt => opt.value === filters.role)}
                onChange={(selectedOption) => handleFilterChange(selectedOption, { name: "role" })}
                placeholder="Função"
                styles={customStyles}
                isClearable
              />
            </div>

            {isFiltered && (
              <button
                onClick={clearAllFilters}
                className="mt-3 w-full flex justify-center items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition"
              >
                <FiX className="mr-1" /> Limpar filtros
              </button>
            )}
          </div>
        )}
      </div>

      {/* Contador de resultados */}
      <div className="mb-6 text-sm text-gray-600">
        Showing {indexOfFirstCard + 1}-{Math.min(indexOfLastCard, filteredProjects.length)} of {filteredProjects.length} professionals
        {isFiltered && (
          <button
            onClick={clearAllFilters}
            className="ml-3 text-blue-500 hover:text-blue-700 text-sm"
          >
            Clean filters
          </button>
        )}
      </div>

      {/* Exibição dos cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {renderSkeletons()}
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-gray-700 mb-2">
            Nenhum profissional encontrado
          </h3>
          <p className="text-gray-500 mb-4">
            {isFiltered 
              ? "Tente ajustar seus filtros de busca" 
              : "No momento não há profissionais disponíveis"}
          </p>
          {isFiltered && (
            <button
              onClick={clearAllFilters}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            >
              Limpar todos os filtros
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentCards.map((project) => (
              <div 
                key={project._id} 
                onClick={() => navigate(`/card/${project._id}`)} 
                className="cursor-pointer"
              >
                <Card
                  id={project.userId}
                  title={project.title}
                  price={project.price}
                  billingMethod={project.billingMethod}
                  starNumber={project.starNumber}
                  totalStars={project.totalStars}
                  role={project.role}
                  description={project.shortDesc}
                  cover={project.cover}
                  lang={project.lang}
                  country={project.country}
                />
              </div>
            ))}
          </div>

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <nav className="flex items-center gap-2">
                <button
                  onClick={() => paginate(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-md border disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiChevronLeft />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                  <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={`w-10 h-10 rounded-md ${currentPage === number ? 'bg-blue-500 text-white' : 'border'}`}
                  >
                    {number}
                  </button>
                ))}

                <button
                  onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-md border disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiChevronRight />
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CardSection;