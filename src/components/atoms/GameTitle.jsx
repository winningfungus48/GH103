import React from "react";
import styles from "./GameTitle.module.css";

const GameTitle = ({ title, id }) => {
  return <h2 className={styles.title} id={id}>{title}</h2>;
};

export default GameTitle;
