import styles from "./CategoryStrip.module.css";
import { setLastCategory } from "../utils/localStorage";

const tabs = [
  { label: "A-Z Games", slug: "a-z games" },
  { label: "Favorites", slug: "favorites" },
  { label: "-le Games", slug: "-le games" },
  { label: "Sports", slug: "sports" }
];

const CategoryStrip = ({ activeCategory, onCategoryChange }) => {
  const handleCategoryChange = (slug) => {
    setLastCategory(slug);
    onCategoryChange(slug);
  };

  return (
    <div className={styles.categoryStrip}>
      {tabs.map((tab) => (
        <button
          key={tab.slug}
          className={`${styles.tab} ${activeCategory === tab.slug ? styles.active : ""}`}
          onClick={() => handleCategoryChange(tab.slug)}
          tabIndex={0}
          aria-current={activeCategory === tab.slug ? "page" : undefined}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default CategoryStrip;
