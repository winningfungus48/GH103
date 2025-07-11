import React from 'react';
import styles from './LayoutWrapper.module.css';
import layoutUtils from '../../styles/layout.module.css';
import Header from '../Header';
import CategoryStrip from '../CategoryStrip';
import Footer from './Footer';
import useScrollAtBottom from '../../hooks/useScrollAtBottom';
import BackToTop from '../ui/BackToTop';

// LayoutWrapper provides a flexible global layout for all major pages.
// Props:
// - showHeader: controls whether the blue header is rendered (default: true)
// - showCategoryStrip: controls whether the orange category strip is rendered (default: true)
// - footerTheme: controls the footer color/theme (default: 'purple')
const LayoutWrapper = ({
  children,
  showHeader = true,
  showCategoryStrip = true,
  footerTheme = 'purple',
}) => {
  // Use scroll detection to control footer visibility
  const isAtBottom = useScrollAtBottom(100);

  return (
    <div className={styles.layoutWrapper}>
      {/* Render header if showHeader is true */}
      {showHeader && (
        <div className={styles.headerWrapper}>
          <Header />
        </div>
      )}
      {/* Render category strip if showCategoryStrip is true */}
      {showCategoryStrip && (
        <div className={styles.categoryStripWrapper}>
          <CategoryStrip />
        </div>
      )}
      {/* Main content always rendered, constrained by .container */}
      <main className={layoutUtils.container}>
        {children}
      </main>
      {/* Footer always mounted, but animates in/out based on scroll */}
      <footer className={styles.footerWrapper}>
        <Footer theme={footerTheme} isVisible={isAtBottom} />
      </footer>
      {/* BackToTop button appears globally on all pages */}
      <BackToTop />
    </div>
  );
};

export default LayoutWrapper; 