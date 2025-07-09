import styles from "./CategoryStrip.module.css";

const tabs = ["A-Z Games", "Favorites", "-le Games", "Sports"];

const CategoryStrip = ({ activeCategory, onCategoryChange }) => {
  return (
    <div className={styles.categoryStrip}>
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`${styles.tab} ${activeCategory === tab ? styles.active : ""}`}
          onClick={() => onCategoryChange(tab)}
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
