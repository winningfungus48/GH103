import React from "react";
import { useNavigate } from "react-router-dom";
import LayoutWrapper from "../components/layout/LayoutWrapper";
import layoutUtils from "../styles/layout.module.css";
import { useCategory } from "../context/CategoryContext";

const Contact = () => {
  const navigate = useNavigate();
  const { onCategoryChange } = useCategory();

  // Handle category change and navigate to home
  const handleCategoryChange = (category) => {
    onCategoryChange(category);
    navigate("/");
  };

  return (
      <LayoutWrapper
      pageTitle="Contact – Game Hub"
      metaDescription="Get in touch with Game Hub. We welcome feedback and suggestions."
      keywords={["contact", "game hub", "feedback", "support"]}
      onCategoryChange={handleCategoryChange}
    >
    <div
      className={layoutUtils.container}
      style={{ padding: "2rem 0", maxWidth: 600, margin: "0 auto" }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        Contact
      </h1>
      
      <div style={{ fontSize: "1.1rem", lineHeight: 1.7 }}>
        <p style={{ marginBottom: "1.5rem" }}>
          We welcome feedback, suggestions, and bug reports for Game Hub.
        </p>
        
        <p style={{ marginBottom: "1.5rem" }}>
          Contact methods coming soon.
        </p>
      </div>
    </div>
  </LayoutWrapper>
  );
};

export default Contact; 