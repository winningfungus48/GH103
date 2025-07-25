import React from "react";
import styles from "./GamePageLayout.module.css";

const GamePageLayout = ({ children, extraTopContent }) => {
  return (
    <div className={styles.pageBg}>
      {extraTopContent && (
        <div className={styles.extraTop}>{extraTopContent}</div>
      )}
      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default GamePageLayout;
