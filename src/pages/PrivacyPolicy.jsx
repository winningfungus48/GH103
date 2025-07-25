import React from "react";
import { useNavigate } from "react-router-dom";
import LayoutWrapper from "../components/layout/LayoutWrapper";
import layoutUtils from "../styles/layout.module.css";
import { useCategory } from "../context/CategoryContext";

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  const { onCategoryChange } = useCategory();

  // Handle category change and navigate to home
  const handleCategoryChange = (category) => {
    onCategoryChange(category);
    navigate("/");
  };

  return (
      <LayoutWrapper
      pageTitle="Privacy Policy – Game Hub"
      metaDescription="Read the Game Hub privacy policy. We respect your privacy and do not collect personal data."
      keywords={["privacy", "game hub", "policy"]}
      onCategoryChange={handleCategoryChange}
    >
    <div
      className={layoutUtils.container}
      style={{ padding: "2rem 0", maxWidth: 600, margin: "0 auto" }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        Privacy Policy
      </h1>
      <div style={{ fontSize: "1.1rem", lineHeight: 1.7 }}>
        <p style={{ marginBottom: "1.5rem" }}>
          Game Hub respects your privacy. We do not collect, store, or share any personal information.
        </p>
        
        <p style={{ marginBottom: "1.5rem" }}>
          Our games work entirely in your browser. Game progress and preferences are stored locally on your device and are not transmitted to our servers.
        </p>
        
        <p style={{ marginBottom: "1.5rem" }}>
          We do not use cookies, tracking technologies, or analytics services. Your gaming experience remains private and secure.
        </p>
        
        <p style={{ marginBottom: "0" }}>
          If you have any questions about our privacy practices, please contact us.
        </p>
      </div>
    </div>
  </LayoutWrapper>
  );
};

export default PrivacyPolicy;
