import React from "react";
import styles from "./GameCard.module.css";
import Badge from "./atoms/Badge";
import GameTitle from "./atoms/GameTitle";
import GameCardFooter from "./molecules/GameCardFooter";
import { getGameIcon } from "./icons/GameIcons";

const GameCard = React.memo(
  ({ title, description, slug, route, new: isNew, featured }) => {
    // Preload game component on hover
    const handleMouseEnter = () => {
      // Start preloading the game component
      const gamePath = route || `/game/${slug}`;
      if (gamePath.startsWith('/game/')) {
        // Preload the game component by triggering a prefetch
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = gamePath;
        document.head.appendChild(link);
      }
    };

    return (
      <article 
        className={styles.card} 
        style={{ position: "relative" }}
        role="article"
        aria-labelledby={`game-title-${slug}`}
        aria-describedby={`game-description-${slug}`}
        tabIndex={0}
        onMouseEnter={handleMouseEnter}
      >
        {(isNew || featured) && (
          <div
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              display: "flex",
              gap: 4,
              zIndex: 3,
            }}
            aria-hidden="true"
          >
            {isNew && <Badge type="new">New</Badge>}
            {featured && <Badge type="featured">Featured</Badge>}
          </div>
        )}
        
        {/* Game Icon */}
        <div className={styles.iconContainer}>
          {getGameIcon(title, styles.gameIcon, 48)}
        </div>
        
        <GameTitle title={title} id={`game-title-${slug}`} />
        <p 
          className={styles.description} 
          id={`game-description-${slug}`}
        >
          {description}
        </p>
        <GameCardFooter slug={slug} route={route} />
      </article>
    );
  },
);

GameCard.displayName = "GameCard";

export default GameCard;
