import React from "react";
import AboutSection from "../components/AboutSection";
import Carrousel from "../components/Carrousel";
import Clients from "../components/Clients";
import Hero from "../components/Hero";
import MidAboutSection from "../components/MidAboutSection";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const HomePage = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <AboutSection />
      <MidAboutSection />
      <Clients />
      <Carrousel />
      <Footer />
    </div>
  );
};

export default HomePage;
