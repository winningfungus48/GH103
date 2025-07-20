import React from "react";
import { Link } from "react-router-dom";
import styles from "./PlayNowButton.module.css";

const PlayNowButton = ({ to, children = "Play Now", "aria-label": ariaLabel }) => {
  return (
    <Link 
      to={to} 
      className={styles.button}
      aria-label={ariaLabel || `Play ${children}`}
      role="button"
      tabIndex={0}
    >
      {children}
    </Link>
  );
};

export default PlayNowButton;
