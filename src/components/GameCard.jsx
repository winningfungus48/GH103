import styles from "./GameCard.module.css";
import { Link } from "react-router-dom";
import Badge from "./atoms/Badge";

const GameCard = ({ title, description, slug, route, new: isNew, featured }) => {
  return (
    <div className={styles.card} style={{ position: 'relative' }}>
      {(isNew || featured) && (
        <div style={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 4, zIndex: 3 }}>
          {isNew && <Badge type="new">New</Badge>}
          {featured && <Badge type="featured">Featured</Badge>}
        </div>
      )}
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.description}>{description}</p>
      <Link to={route || `/game/${slug}`} className={styles.button}>
        Play Now
      </Link>
    </div>
  );
};

export default GameCard;
