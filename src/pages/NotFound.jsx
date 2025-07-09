import { Link } from "react-router-dom";
import styles from "./NotFound.module.css";

const NotFound = () => (
  <div className={styles.notFoundContainer}>
    <h2 className={styles.title}>Oops! Page not found.</h2>
    <Link to="/" className={styles.homeLink}>
      Return to Home
    </Link>
  </div>
);

export default NotFound;
