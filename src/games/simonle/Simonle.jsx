import React from "react";
import GamePageLayout from "../../components/game/GamePageLayout";
import GameHeader from "../../components/game/GameHeader";
import styles from "./simonle-styles.module.css";

const Simonle = () => (
  <GamePageLayout>
    <GameHeader title="Simonle" />
    <div className={styles.gameContent}>{/* Game content goes here */}</div>
  </GamePageLayout>
);

export default Simonle;
