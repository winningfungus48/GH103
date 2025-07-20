import React from "react";
import { Link } from "react-router-dom";
import styles from "./PlayNowButton.module.css";

const PlayNowButton = ({ to, children = "Play Now" }) => {
  return (
    <Link to={to} className={styles.button}>
      {children}
    </Link>
  );
};

export default PlayNowButton;
