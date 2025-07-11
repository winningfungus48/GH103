import React from 'react';
import { Link } from 'react-router-dom';
import { useScrollAtBottom } from '../../hooks/useScrollAtBottom';
import styles from './Footer.module.css';

const Footer = () => {
  const isAtBottom = useScrollAtBottom();

  if (!isAtBottom) {
    return null;
  }

  return (
    <footer className={styles.footer} role="contentinfo">
      <nav className={styles.nav}>
        <Link to="/privacy-policy" className={styles.link}>
          Privacy Policy
        </Link>
        <Link to="#" className={styles.link}>
          About
        </Link>
        <Link to="#" className={styles.link}>
          Contact
        </Link>
      </nav>
    </footer>
  );
};

export default Footer; 