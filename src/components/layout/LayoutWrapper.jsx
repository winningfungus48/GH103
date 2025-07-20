import React, { useEffect } from "react";
import styles from "./LayoutWrapper.module.css";
import layoutUtils from "../../styles/layout.module.css";
import Header from "../Header";
import CategoryStrip from "../CategoryStrip";
import Footer from "./Footer";
// import BackToTop from '../atoms/BackToTop';
import { Helmet } from "react-helmet-async";

// LayoutWrapper provides a flexible global layout for all major pages.
// Props:
// - showHeader: controls whether the blue header is rendered (default: true)
// - showCategoryStrip: controls whether the orange category strip is rendered (default: true)
// - pageTitle: sets the <title> tag for SEO (optional)
// - metaDescription: sets the <meta name="description"> tag (optional)
// - keywords: array of keywords for <meta name="keywords"> (optional)
const LayoutWrapper = ({
  children,
  showHeader = true,
  showCategoryStrip = true,
  pageTitle = "Game Hub – Play Free Puzzle Games",
  metaDescription = "Enjoy a variety of free puzzle and logic games on Game Hub. No registration required. Play now!",
  keywords = ["games", "puzzle", "logic", "free", "browser", "fun"],
}) => {
  useEffect(() => {
    console.log("[LayoutWrapper] rendered", { width: window.innerWidth });
  }, []);
  return (
    <>
      {/* SEO metadata for the page */}
      <Helmet>
        {pageTitle && <title>{pageTitle}</title>}
        {metaDescription && (
          <meta name="description" content={metaDescription} />
        )}
        {keywords && <meta name="keywords" content={keywords.join(", ")} />}
      </Helmet>
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
        {/* Main content always rendered, full width with white background */}
        <main className={styles.mainBg}>
          <div className={layoutUtils.container}>{children}</div>
        </main>
        {/* Footer component handles its own visibility based on scroll position */}
        <div className={styles.footerContainer}>
          <Footer />
        </div>
        {/* BackToTop button appears globally on all pages */}
        {/* <BackToTop /> */}
      </div>
    </>
  );
};

export default LayoutWrapper;
