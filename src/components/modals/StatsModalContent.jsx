import React from "react";
import styles from "./ModalContent.module.css";

const StatsModalContent = () => {
  return (
    <div className={styles.content}>
      <div className={styles.placeholder}>
        <div className={styles.icon}>📊</div>
        <h3>Statistics Coming Soon</h3>
        <p>
          Detailed game statistics and performance tracking will be available in a future update.
        </p>
        <p>
          You'll be able to view:
        </p>
        <ul>
          <li>Games played and win rates</li>
          <li>Average completion times</li>
          <li>Personal best scores</li>
          <li>Progress over time</li>
        </ul>
      </div>
    </div>
  );
};

export default StatsModalContent; 