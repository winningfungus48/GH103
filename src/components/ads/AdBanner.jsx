import React from "react";
import styles from "./AdBanner.module.css";

/**
 * AdBanner - Modular placeholder for future ads.
 * @param {string} position - e.g., 'top', 'inline', 'bottom'
 */
const AdBanner = ({ position = "inline" }) => (
  <div
    className={styles.adBanner}
    role="complementary"
    aria-label="Advertisement"
  >
    <span className={styles.text}>Ad Placeholder – {position}</span>
  </div>
);

export default AdBanner;
