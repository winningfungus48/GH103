import React, { useCallback, useMemo } from "react";
import styles from "./CategoryStrip.module.css";
import { setLastCategory } from "../utils/localStorage";

const tabs = [
  { label: "A-Z Games", slug: "a-z games" },
  { label: "Favorites", slug: "favorites" },
  { label: "-le Games", slug: "-le games" },
  { label: "Sports", slug: "sports" },
  { label: "Daily Games", slug: "daily games" },
];

const CategoryStrip = React.memo(({ activeCategory, onCategoryChange }) => {
  const handleCategoryChange = useCallback((slug) => {
    setLastCategory(slug);
    onCategoryChange(slug);
  }, [onCategoryChange]);

  // Ensure 'A-Z Games' is always first, rest sorted alphabetically
  const sortedTabs = useMemo(() => {
    const azTab = tabs.find(tab => tab.slug === 'a-z games');
    const otherTabs = tabs.filter(tab => tab.slug !== 'a-z games').sort((a, b) => a.label.localeCompare(b.label));
    return azTab ? [azTab, ...otherTabs] : otherTabs;
  }, []);

  return (
    <div className={styles.categoryStrip}>
      {sortedTabs.map((tab) => (
        <button
          key={tab.slug}
          className={
            `${styles.tab} ${activeCategory === tab.slug ? styles.active : ''}`
          }
          onClick={() => handleCategoryChange(tab.slug)}
          tabIndex={0}
          aria-current={activeCategory === tab.slug ? "page" : undefined}
        >
          {/* {tab.slug === 'daily games' && (
            <span className={styles.sunEmoji} role="img" aria-label="Sun">☀️</span>
          )} */}
          {tab.label}
        </button>
      ))}
    </div>
  );
});

CategoryStrip.displayName = 'CategoryStrip';

export default CategoryStrip;
