import React from "react";
import { useNavigate } from "react-router-dom";
import LayoutWrapper from "../components/layout/LayoutWrapper";
import layoutUtils from "../styles/layout.module.css";
import { useCategory } from "../context/CategoryContext";

const About = () => {
  const navigate = useNavigate();
  const { onCategoryChange } = useCategory();

  // Handle category change and navigate to home
  const handleCategoryChange = (category) => {
    onCategoryChange(category);
    navigate("/");
  };

    return (
    <LayoutWrapper
      pageTitle="About – Game Hub"
      metaDescription="Learn about Game Hub, a collection of daily puzzle games and challenges."
      keywords={["about", "game hub", "puzzle games", "daily challenges"]}
      onCategoryChange={handleCategoryChange}
    >
    <div
      className={layoutUtils.container}
      style={{ padding: "2rem 0", maxWidth: 600, margin: "0 auto" }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        About Game Hub
      </h1>
      
      <div style={{ fontSize: "1.1rem", lineHeight: 1.7 }}>
        <p style={{ marginBottom: "1.5rem" }}>
          Game Hub is a collection of daily puzzle games and challenges. Each game offers a unique experience with new content every day.
        </p>
        
        <p style={{ marginBottom: "1.5rem" }}>
          Our games include word puzzles, number challenges, memory games, and sports trivia. All games are designed to be accessible and enjoyable for everyone.
        </p>
        
        <p style={{ marginBottom: "1.5rem" }}>
          Game Hub is built with modern web technologies and focuses on performance and user experience. No personal data is collected, and all games work offline.
        </p>
      </div>
    </div>
  </LayoutWrapper>
  );
};

export default About; 