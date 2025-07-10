import React from 'react';
import PlayNowButton from '../atoms/PlayNowButton';
import FavoriteToggle from '../atoms/FavoriteToggle';
import styles from './GameCardFooter.module.css';

const GameCardFooter = ({ slug, route }) => {
  return (
    <div className={styles.footer}>
      <PlayNowButton to={route || `/game/${slug}`} />
      <FavoriteToggle slug={slug} />
    </div>
  );
};

export default GameCardFooter; 