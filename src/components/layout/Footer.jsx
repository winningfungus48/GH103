import React from "react";
import { Link } from "react-router-dom";
import useScrollAtBottom from "../../hooks/useScrollAtBottom";
import styles from "./Footer.module.css";
import layoutUtils from "../../styles/layout.module.css";

console.log("[Footer] rendered");

const Footer = () => {
  const isAtBottom = useScrollAtBottom();

  if (!isAtBottom) {
    return null;
  }

  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={layoutUtils.container}>
        <nav
          className={styles.nav}
          style={{ width: "100%", display: "flex", justifyContent: "center" }}
        >
          <Link to="/privacy" className={styles.link}>
            Privacy Policy
          </Link>
          <Link to="/about" className={styles.link}>
            About
          </Link>
          <Link to="/contact" className={styles.link}>
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
