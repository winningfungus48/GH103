import styles from "./CategoryStrip.module.css";
import { setLastCategory } from "../utils/localStorage";

const tabs = ["A-Z Games", "Favorites", "-le Games", "Sports"];

const CategoryStrip = ({ activeCategory, onCategoryChange }) => {
  const handleCategoryChange = (tab) => {
    // Convert the display name to the lowercase slug format used in Home component
    const categorySlug = tab.toLowerCase();
    
    // Save to localStorage
    setLastCategory(categorySlug);
    
    // Call the original onCategoryChange function
    onCategoryChange(tab);
  };

  return (
    <div className={styles.categoryStrip}>
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`${styles.tab} ${activeCategory === tab ? styles.active : ""}`}
          onClick={() => handleCategoryChange(tab)}
          tabIndex={0}
          aria-current={activeCategory === tab ? "page" : undefined}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default CategoryStrip;
