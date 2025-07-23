import styles from "./Header.module.css";
import React, { useState, useCallback } from "react";
import SlidingPanel from "./navigation/SlidingPanel";
import { setLastCategory } from "../utils/localStorage";

// Use the same category structure as CategoryStrip
const tabs = [
  { label: "A-Z Games", slug: "a-z games" },
  { label: "Favorites", slug: "favorites" },
  { label: "-le Games", slug: "-le games" },
  { label: "Sports", slug: "Sports" },
  { label: "Daily Games", slug: "daily games" },
];

const Header = React.memo(({ activeCategory, onCategoryChange }) => {
  const [panelOpen, setPanelOpen] = useState(false);

  const handlePanelToggle = useCallback(() => {
    setPanelOpen((open) => !open);
  }, []);

  const handlePanelClose = useCallback(() => {
    setPanelOpen(false);
  }, []);

  const handleCategorySelect = useCallback((slug) => {
    setLastCategory(slug);
    onCategoryChange(slug);
    setPanelOpen(false); // Close panel when category is selected
  }, [onCategoryChange]);

  const handleKeyDown = useCallback((e, slug) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleCategorySelect(slug);
    }
  }, [handleCategorySelect]);

  // Ensure 'A-Z Games' is always first, rest sorted alphabetically
  const sortedTabs = React.useMemo(() => {
    const aToZ = tabs.find((tab) => tab.slug === "a-z games");
    const rest = tabs.filter((tab) => tab.slug !== "a-z games");
    return [aToZ, ...rest.sort((a, b) => a.label.localeCompare(b.label))];
  }, []);

  // Hamburger icon SVG
  const Hamburger = (
    <button
      className={styles.hamburger}
      aria-label="Open categories menu"
      aria-expanded={panelOpen}
      aria-controls="mobile-categories-panel"
      onClick={handlePanelToggle}
      tabIndex={0}
    >
      <span className={styles.bar} aria-hidden="true"></span>
      <span className={styles.bar} aria-hidden="true"></span>
      <span className={styles.bar} aria-hidden="true"></span>
    </button>
  );

  return (
    <header className={styles.header} role="banner">
      <h1>Game Hub</h1>
      <nav className={styles.desktopNav} aria-label="Desktop navigation">
        {/* Desktop category strip placeholder, will be hidden on mobile */}
      </nav>
      <div className={styles.mobileNav}>
        {Hamburger}
      </div>

      {/* Mobile Sliding Panel */}
      <SlidingPanel
        isOpen={panelOpen}
        onClose={handlePanelClose}
        title="Categories"
        width="70%"
        className={styles.mobileCategoriesPanel}
      >
        <nav 
          className={styles.mobileCategoriesList}
          role="navigation"
          aria-label="Mobile categories navigation"
          id="mobile-categories-panel"
        >
          {sortedTabs.map((tab) => (
            <button
              key={tab.slug}
              className={`${styles.mobileCategoryItem} ${
                activeCategory === tab.slug ? styles.active : ""
              }`}
              onClick={() => handleCategorySelect(tab.slug)}
              onKeyDown={(e) => handleKeyDown(e, tab.slug)}
              tabIndex={0}
              aria-current={activeCategory === tab.slug ? "page" : undefined}
              aria-label={`${tab.label} games`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </SlidingPanel>
    </header>
  );
});

Header.displayName = "Header";

export default Header;
