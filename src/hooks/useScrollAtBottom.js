import { useState, useEffect } from 'react';

/**
 * useScrollAtBottom - React hook to detect if the user has scrolled to the bottom of the page.
 *
 * @param {number} threshold - How close (in px) to the bottom before triggering. Default: 100.
 * @returns {boolean} isAtBottom - True if user is at (or near) the bottom of the page.
 *
 * Usage:
 *   const isAtBottom = useScrollAtBottom(120);
 */
function useScrollAtBottom(threshold = 100) {
  const [isAtBottom, setIsAtBottom] = useState(false);

  useEffect(() => {
    // Helper to check if the user is at the bottom
    function checkAtBottom() {
      const scrollY = window.scrollY || window.pageYOffset;
      const windowHeight = window.innerHeight;
      const scrollableHeight = document.documentElement.scrollHeight - windowHeight;
      
      // Show footer even on short pages that don't require scrolling
      // Ensures consistent footer visibility across all layouts
      if (scrollableHeight <= 0) {
        setIsAtBottom(true);
        return;
      }
      
      // Check if scrolled to bottom (within threshold)
      const scrolledToBottom = scrollY >= scrollableHeight - threshold;
      setIsAtBottom(scrolledToBottom);
    }

    // Initial check
    checkAtBottom();
    // Listen for scroll events
    window.addEventListener('scroll', checkAtBottom);
    window.addEventListener('resize', checkAtBottom);
    // Cleanup on unmount
    return () => {
      window.removeEventListener('scroll', checkAtBottom);
      window.removeEventListener('resize', checkAtBottom);
    };
  }, [threshold]);

  return isAtBottom;
}

export default useScrollAtBottom; 