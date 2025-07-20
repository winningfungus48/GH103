import React from "react";
import LayoutWrapper from "../components/layout/LayoutWrapper";
import layoutUtils from "../styles/layout.module.css";

const PrivacyPolicy = () => (
  <LayoutWrapper
    pageTitle="Privacy Policy – Game Hub"
    metaDescription="Read the Game Hub privacy policy. We respect your privacy and do not collect personal data."
    keywords={["privacy", "game hub", "policy"]}
  >
    <div
      className={layoutUtils.container}
      style={{ padding: "2rem 0", maxWidth: 600, margin: "0 auto" }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        Privacy Policy
      </h1>
      <p style={{ fontSize: "1.1rem", textAlign: "center", lineHeight: 1.7 }}>
        This is a placeholder privacy policy. We do not collect personal data.
      </p>
    </div>
  </LayoutWrapper>
);

export default PrivacyPolicy;
