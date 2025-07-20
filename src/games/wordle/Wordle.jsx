import React from "react";
import GamePageLayout from "../../components/game/GamePageLayout";
import GameHeader from "../../components/game/GameHeader";
import styles from "./wordle-styles.module.css";

const Wordle = () => (
  <GamePageLayout>
    <GameHeader title="Wordle" />
    <div className={styles.gameContent}>{/* Game content goes here */}</div>
  </GamePageLayout>
);

export default Wordle;
