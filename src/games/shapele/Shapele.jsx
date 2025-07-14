import React from 'react';
import GamePageLayout from '../../components/game/GamePageLayout';
import GameHeader from '../../components/game/GameHeader';
import styles from './shapele-styles.module.css';

const Shapele = () => (
  <GamePageLayout>
    <GameHeader title="Shapele" />
    <div className={styles.gameContent}>
      {/* Game content goes here */}
    </div>
  </GamePageLayout>
);

export default Shapele;
