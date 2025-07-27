import React, { useCallback, useMemo, useState, useEffect, useRef } from "react";
import styles from "./CategoryStrip.module.css";
import { setLastCategory } from "../utils/localStorage";

const tabs = [
  { label: "A-Z Games", slug: "a-z games" },
  { label: "Daily Games", slug: "daily games" },
  { label: "Featured", slug: "featured" },
  { label: "Favorites", slug: "favorites" },
  { label: "Logic", slug: "logic" },
  { label: "Math", slug: "math" },
  { label: "Memory", slug: "memory" },
  { label: "New", slug: "new" },
  { label: "Recently Played", slug: "recently played" },
  { label: "Sports", slug: "Sports" },
  { label: "Wordles", slug: "wordles" },
  { label: "-le Games", slug: "-le games" },
];

const CategoryStrip = React.memo(({ activeCategory, onCategoryChange }) => {
  const [visibleTabs, setVisibleTabs] = useState([]);
  const [hiddenTabs, setHiddenTabs] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ right: 20 });
  const containerRef = useRef(null);
  const tabsRef = useRef([]);
  const hamburgerRef = useRef(null);

  const handleCategoryChange = useCallback(
    (slug) => {
      setLastCategory(slug);
      onCategoryChange(slug);

      // If category was selected from dropdown, move it to visible tabs
      if (hiddenTabs.some(tab => tab.slug === slug)) {
        // Find the selected tab
        const selectedTab = hiddenTabs.find(tab => tab.slug === slug);
        const lastVisibleTab = visibleTabs[visibleTabs.length - 1];
        
        // Move selected tab to visible, move last visible to hidden
        setVisibleTabs(prev => [...prev.slice(0, -1), selectedTab]);
        setHiddenTabs(prev => [...prev.filter(tab => tab.slug !== slug), lastVisibleTab]);
      }
      
      setIsDropdownOpen(false);
    },
    [onCategoryChange, hiddenTabs, visibleTabs],
  );

  // Ensure 'A-Z Games' is always first, rest sorted alphabetically
  const sortedTabs = useMemo(() => {
    const aToZ = tabs.find((tab) => tab.slug === "a-z games");
    const rest = tabs.filter((tab) => tab.slug !== "a-z games");
    return [aToZ, ...rest.sort((a, b) => a.label.localeCompare(b.label))];
  }, []);

  // Calculate scrollbar width and adjust dropdown positioning
  useEffect(() => {
    const calculateScrollbarWidth = () => {
      const outer = document.createElement('div');
      outer.style.visibility = 'hidden';
      outer.style.overflow = 'scroll';
      document.body.appendChild(outer);

      const inner = document.createElement('div');
      outer.appendChild(inner);

      const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
      document.body.removeChild(outer);

      return scrollbarWidth;
    };

    const updateDropdownPosition = () => {
      const scrollbarWidth = calculateScrollbarWidth();
      const hasScrollbar = document.documentElement.scrollHeight > document.documentElement.clientHeight;
      
      // Base positioning with scrollbar consideration
      let rightPosition = 20;
      
      if (hasScrollbar && scrollbarWidth > 0) {
        rightPosition = Math.max(20, scrollbarWidth + 10);
      }
      
      // Responsive adjustments
      if (window.innerWidth <= 768) {
        rightPosition = Math.max(15, rightPosition - 5);
      }
      
      setDropdownPosition({ right: rightPosition });
    };

    updateDropdownPosition();
    
    // Update on resize and scroll
    const handleResize = () => updateDropdownPosition();
    const handleScroll = () => updateDropdownPosition();
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Simple width calculation - always show A-Z Games and hamburger
  useEffect(() => {
    const calculateVisibleTabs = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const containerWidth = container.offsetWidth;
      
      // Always start with A-Z Games
      const visible = [sortedTabs[0]];
      const hidden = [];
      
      // Try to fit additional tabs between A-Z Games and hamburger
      let currentWidth = tabsRef.current[0]?.offsetWidth || 120; // A-Z Games width
      const hamburgerWidth = 60; // Approximate hamburger width
      const gap = 16; // Gap between tabs
      
      // Check remaining tabs (skip A-Z Games which is already added)
      for (let i = 1; i < sortedTabs.length; i++) {
        const tabWidth = tabsRef.current[i]?.offsetWidth || 120;
        const totalWidth = currentWidth + gap + tabWidth + gap + hamburgerWidth;
        
        // If this tab fits, add it to visible
        if (totalWidth <= containerWidth) {
          visible.push(sortedTabs[i]);
          currentWidth += gap + tabWidth;
        } else {
          // If it doesn't fit, add to hidden
          hidden.push(sortedTabs[i]);
        }
      }
      
      setVisibleTabs(visible);
      setHiddenTabs(hidden);
    };

    calculateVisibleTabs();
    
    const resizeObserver = new ResizeObserver(calculateVisibleTabs);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [sortedTabs]);

  const toggleDropdown = useCallback(() => {
    setIsDropdownOpen(prev => !prev);
  }, []);

  const handleKeyDown = useCallback((e, slug) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleCategoryChange(slug);
    }
  }, [handleCategoryChange]);

  return (
    <nav 
      ref={containerRef}
      className={styles.categoryStrip} 
      role="navigation" 
      aria-label="Game categories"
    >
      <div className={styles.visibleTabs}>
        {visibleTabs.map((tab, index) => (
          <button
            key={tab.slug}
            ref={el => tabsRef.current[index] = el}
            className={`${styles.tab} ${
              activeCategory === tab.slug ? styles.active : ""
            }`}
            onClick={() => handleCategoryChange(tab.slug)}
            onKeyDown={(e) => handleKeyDown(e, tab.slug)}
            aria-current={activeCategory === tab.slug ? "page" : undefined}
            aria-label={`${tab.label} games`}
            tabIndex={0}
          >
            {tab.label}
          </button>
        ))}
        
        {/* Always show hamburger menu */}
        <div className={styles.hamburgerContainer}>
          <button
            ref={hamburgerRef}
            className={`${styles.hamburgerButton} ${isDropdownOpen ? styles.active : ""}`}
            onClick={toggleDropdown}
            aria-label="Show more categories"
            aria-expanded={isDropdownOpen}
            tabIndex={0}
          >
            <span className={styles.hamburgerIcon}></span>
            <span className={styles.hamburgerIcon}></span>
            <span className={styles.hamburgerIcon}></span>
          </button>
          
          {isDropdownOpen && (
            <div className={styles.dropdownOverlay} onClick={() => setIsDropdownOpen(false)}>
              <div 
                className={styles.dropdown}
                style={{ right: `${dropdownPosition.right}px` }}
                onClick={(e) => e.stopPropagation()}
              >
                {hiddenTabs.map((tab) => (
                  <button
                    key={tab.slug}
                    className={`${styles.dropdownItem} ${
                      activeCategory === tab.slug ? styles.active : ""
                    }`}
                    onClick={() => handleCategoryChange(tab.slug)}
                    onKeyDown={(e) => handleKeyDown(e, tab.slug)}
                    aria-current={activeCategory === tab.slug ? "page" : undefined}
                    tabIndex={0}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
});

CategoryStrip.displayName = "CategoryStrip";

export default CategoryStrip;
