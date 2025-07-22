import styles from "./Header.module.css";
import React, { useState, useCallback } from "react";

const tabs = ["A-Z Games", "Favorites", "-le Games", "Sports"];

const Header = React.memo(({ activeCategory, onCategoryChange }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuToggle = useCallback(() => {
    setMenuOpen((open) => !open);
  }, []);

  const handleMenuKeyDown = useCallback((e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleMenuToggle();
    }
  }, [handleMenuToggle]);

  const handleTabKeyDown = useCallback((e, tab) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onCategoryChange(tab);
      setMenuOpen(false);
    }
  }, [onCategoryChange]);

  // Hamburger icon SVG
  const Hamburger = (
    <button
      className={styles.hamburger}
      aria-label="Open menu"
      aria-expanded={menuOpen}
      aria-controls="mobile-menu"
      onClick={handleMenuToggle}
      onKeyDown={handleMenuKeyDown}
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
        {menuOpen && (
          <nav 
            className={styles.mobileMenu} 
            id="mobile-menu"
            role="navigation"
            aria-label="Mobile navigation"
          >
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`${styles.mobileTab} ${activeCategory === tab ? styles.active : ""}`}
                onClick={() => {
                  onCategoryChange(tab);
                  setMenuOpen(false);
                }}
                onKeyDown={(e) => handleTabKeyDown(e, tab)}
                tabIndex={0}
                aria-current={activeCategory === tab ? "page" : undefined}
                aria-label={`${tab} games`}
              >
                {tab}
              </button>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
});

Header.displayName = "Header";

export default Header;
