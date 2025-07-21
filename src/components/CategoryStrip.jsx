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
  const handleCategoryChange = useCallback(
    (slug) => {
      setLastCategory(slug);
      onCategoryChange(slug);
    },
    [onCategoryChange],
  );

  // Ensure 'A-Z Games' is always first, rest sorted alphabetically
  const sortedTabs = useMemo(() => {
    const aToZ = tabs.find((tab) => tab.slug === "a-z games");
    const rest = tabs.filter((tab) => tab.slug !== "a-z games");
    return [aToZ, ...rest.sort((a, b) => a.label.localeCompare(b.label))];
  }, []);

  const handleKeyDown = useCallback((e, slug) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleCategoryChange(slug);
    }
  }, [handleCategoryChange]);

  return (
    <nav 
      className={styles.categoryStrip} 
      role="navigation" 
      aria-label="Game categories"
    >
      {sortedTabs.map((tab) => (
        <button
          key={tab.slug}
          className={`${styles.tab} ${
            activeCategory === tab.slug ? styles.active : ""
          }`}
          // NOTE: Daily Games special styling temporarily disabled
          // ${tab.slug === "daily games" ? styles.dailyTab : ""}
          onClick={() => handleCategoryChange(tab.slug)}
          onKeyDown={(e) => handleKeyDown(e, tab.slug)}
          aria-current={activeCategory === tab.slug ? "page" : undefined}
          aria-label={`${tab.label} games`}
          tabIndex={0}
        >
          {/* NOTE: Daily Games emoji temporarily disabled */}
          {/* {tab.slug === "daily games" && (
            <span className={styles.sunEmoji} aria-hidden="true">
              ☀️
            </span>
          )} */}
          {tab.label}
        </button>
      ))}
    </nav>
  );
});

CategoryStrip.displayName = "CategoryStrip";

export default CategoryStrip;
