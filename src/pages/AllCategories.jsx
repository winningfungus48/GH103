import Header from "../components/Header";
import CategoryStrip from "../components/CategoryStrip";
import Footer from "../components/Footer";
import styles from "./AllCategories.module.css";
import { Link } from "react-router-dom";

const categories = [
  { name: "Puzzle", route: "/category/puzzle", icon: "🧩" },
  { name: "Trivia", route: "/category/trivia", icon: "❓" },
  { name: "Classic", route: "/category/classic", icon: "🎲" },
];

const AllCategories = () => (
  <div className={styles.layout}>
    <Header />
    <CategoryStrip activeCategory={null} onCategoryChange={() => {}} />
    <main className={styles.grid}>
      <h2 className={styles.heading}>All Categories</h2>
      <div className={styles.cardsGrid}>
        {categories.map((cat) => (
          <Link
            to={cat.route}
            className={styles.categoryCard}
            key={cat.name}
            tabIndex={0}
          >
            <span className={styles.icon}>{cat.icon}</span>
            <span className={styles.name}>{cat.name}</span>
          </Link>
        ))}
      </div>
    </main>
    <Footer />
  </div>
);

export default AllCategories;
