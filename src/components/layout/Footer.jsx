import React from 'react';
import styles from './Footer.module.css';

/**
 * Footer component with theme support and static links.
 *
 * Props:
 * - theme: 'purple' | 'dark' | 'none' (default: 'purple')
 *   - 'purple': purple background
 *   - 'dark': dark/gray background (future)
 *   - 'none': renders nothing
 * - isVisible: boolean (controls animated entrance/exit)
 *
 * This component may evolve into a multi-section footer later.
 */
const Footer = ({ theme = 'purple', isVisible = true }) => {
  if (theme === 'none') return null;

  // Choose background class based on theme
  const themeClass =
    theme === 'dark' ? styles.dark : styles.purple;

  // Animate visibility
  const visibilityClass = isVisible ? styles.footerVisible : styles.footerHidden;

  return (
    <footer
      className={`${styles.footer} ${themeClass} ${visibilityClass}`}
      aria-hidden={!isVisible}
    >
      <nav className={styles.links} aria-label="Footer links">
        <a href="/privacy-policy" className={styles.link}>Privacy Policy</a>
        <a href="/about" className={styles.link}>About</a>
        <a href="/contact" className={styles.link}>Contact</a>
      </nav>
    </footer>
  );
};

export default Footer; 