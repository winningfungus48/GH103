import styles from "./Header.module.css";
import React, { useState } from "react";

const tabs = ["A-Z Games", "Favorites", "-le Games", "Sports"];

const Header = ({ activeCategory, onCategoryChange }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  // Hamburger icon SVG
  const Hamburger = (
    <button
      className={styles.hamburger}
      aria-label="Open menu"
      onClick={() => setMenuOpen((open) => !open)}
    >
      <span className={styles.bar}></span>
      <span className={styles.bar}></span>
      <span className={styles.bar}></span>
    </button>
  );

  return (
    <header className={styles.header}>
      <h1>Game Hub</h1>
      <nav className={styles.desktopNav}>
        {/* Desktop category strip placeholder, will be hidden on mobile */}
      </nav>
      <div className={styles.mobileNav}>
        {Hamburger}
        {menuOpen && (
          <div className={styles.mobileMenu}>
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`${styles.mobileTab} ${activeCategory === tab ? styles.active : ""}`}
                onClick={() => {
                  onCategoryChange(tab);
                  setMenuOpen(false);
                }}
                tabIndex={0}
                aria-current={activeCategory === tab ? "page" : undefined}
              >
                {tab}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
