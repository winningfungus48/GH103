import React from 'react';
import styles from './BackToTop.module.css';

// Custom hook to detect if scrollY > threshold
function useScrollThreshold(threshold = 500) {
  const [passed, setPassed] = React.useState(false);
  React.useEffect(() => {
    function check() {
      setPassed(window.scrollY > threshold);
    }
    check();
    window.addEventListener('scroll', check);
    window.addEventListener('resize', check);
    return () => {
      window.removeEventListener('scroll', check);
      window.removeEventListener('resize', check);
    };
  }, [threshold]);
  return passed;
}

/**
 * BackToTop button appears after scrolling down, and scrolls smoothly to top.
 * Accessible, animated, and reusable.
 */
const BackToTop = () => {
  const show = useScrollThreshold(500);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      className={`${styles.backToTop} ${show ? styles.visible : styles.hidden}`}
      onClick={handleClick}
      aria-label="Back to top"
      tabIndex={0}
      type="button"
    >
      <span className={styles.icon} aria-hidden="true">↑</span> Back to Top
    </button>
  );
};

export default BackToTop; 