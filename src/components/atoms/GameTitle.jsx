import React from "react";
import styles from "./GameTitle.module.css";

const GameTitle = ({ title }) => {
  return <h2 className={styles.title}>{title}</h2>;
};

export default GameTitle;
