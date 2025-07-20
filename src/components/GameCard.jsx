import React from "react";
import styles from "./GameCard.module.css";
import Badge from "./atoms/Badge";
import GameTitle from "./atoms/GameTitle";
import GameCardFooter from "./molecules/GameCardFooter";

const GameCard = React.memo(
  ({ title, description, slug, route, new: isNew, featured }) => {
    return (
      <div className={styles.card} style={{ position: "relative" }}>
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
          >
            {isNew && <Badge type="new">New</Badge>}
            {featured && <Badge type="featured">Featured</Badge>}
          </div>
        )}
        <GameTitle title={title} />
        <p className={styles.description}>{description}</p>
        <GameCardFooter slug={slug} route={route} />
      </div>
    );
  },
);

GameCard.displayName = "GameCard";

export default GameCard;
