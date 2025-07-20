import React, { useEffect, useRef } from "react";
import styles from "./GamePageLayout.module.css";

const GamePageLayout = ({ children, extraTopContent }) => {
  const layoutRef = useRef(null);

  // Scroll to top on mount (smooth)
  useEffect(() => {
    if (layoutRef.current) {
      layoutRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  return (
    <div className={styles.pageBg} ref={layoutRef}>
      {extraTopContent && (
        <div className={styles.extraTop}>{extraTopContent}</div>
      )}
      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default GamePageLayout;
