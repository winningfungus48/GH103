import React from "react";
import GamePageLayout from "../../components/game/GamePageLayout";
import GameHeader from "../../components/game/GameHeader";
import useWelcomeModal from "../../hooks/useWelcomeModal.jsx";
import styles from "./shapele-styles.module.css";

const Shapele = ({ mode: _mode, description: _description, instructions }) => {
  const { WelcomeModal } = useWelcomeModal("Shapele", instructions);

  return (
  <GamePageLayout>
    <GameHeader title="Shapele" />
      <WelcomeModal />
    <div className={styles.gameContent}>{/* Game content goes here */}</div>
  </GamePageLayout>
);
};

export default Shapele;
