import styles from "./GameCard.module.css";
import { Link } from "react-router-dom";

const GameCard = ({ title, description, slug }) => {
  return (
    <div className={styles.card}>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.description}>{description}</p>
      <Link to={`/game/${slug}`} className={styles.button}>
        Play Now
      </Link>
    </div>
  );
};

export default GameCard;
