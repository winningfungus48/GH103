import React from "react";
import { Link } from "react-router-dom";
import styles from "./GameHeader.module.css";

const GameHeader = ({
  title,
  backLabel = "Back to Home",
  backHref = "/",
  rightActions,
}) => {
  return (
    <header className={styles.header}>
      <Link to={backHref} className={styles.backLink}>
        <span className={styles.icon} aria-hidden="true">
          &#8592;
        </span>{" "}
        {backLabel}
      </Link>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.rightActions}>{rightActions}</div>
    </header>
  );
};

export default GameHeader;
