// Navigation utility for debugging and handling navigation issues

let navigationHistory = [];
let isNavigating = false;

// Track navigation events
export const trackNavigation = (from, to, type = 'programmatic') => {
  const navigationEvent = {
    from,
    to,
    type,
    timestamp: Date.now(),
    url: window.location.href
  };
  
  navigationHistory.push(navigationEvent);
  
  // Keep only last 10 navigation events
  if (navigationHistory.length > 10) {
    navigationHistory = navigationHistory.slice(-10);
  }
  
  console.log('[Navigation]', navigationEvent);
  
  return navigationEvent;
};

// Get navigation history for debugging
export const getNavigationHistory = () => {
  return [...navigationHistory];
};

// Check if we're currently navigating
export const setIsNavigating = (navigating) => {
  isNavigating = navigating;
  console.log('[Navigation] Navigation state:', navigating);
};

export const getIsNavigating = () => {
  return isNavigating;
};

// Handle browser back/forward button
export const handleBrowserNavigation = () => {
  console.log('[Navigation] Browser navigation detected:', {
    pathname: window.location.pathname,
    search: window.location.search,
    hash: window.location.hash,
    referrer: document.referrer
  });
  
  // Force a small delay to ensure React Router has time to process
  setTimeout(() => {
    if (document.body.innerHTML.trim() === '') {
      console.warn('[Navigation] Blank page detected, attempting recovery...');
      window.location.reload();
    }
  }, 100);
};

// Initialize navigation listeners
export const initNavigationListeners = () => {
  // Listen for popstate events (browser back/forward)
  window.addEventListener('popstate', handleBrowserNavigation);
  
  // Listen for beforeunload
  window.addEventListener('beforeunload', () => {
    console.log('[Navigation] Page unloading');
    setIsNavigating(false);
  });
  
  // Listen for page visibility changes
  document.addEventListener('visibilitychange', () => {
    console.log('[Navigation] Page visibility changed:', document.visibilityState);
  });
  
  console.log('[Navigation] Navigation listeners initialized');
};

// Check for common navigation issues
export const diagnoseNavigationIssues = () => {
  const issues = [];
  
  // Check if page is blank
  if (document.body.innerHTML.trim() === '') {
    issues.push('Blank page detected');
  }
  
  // Check if React root is missing
  const root = document.getElementById('root');
  if (!root || root.innerHTML.trim() === '') {
    issues.push('React root is empty or missing');
  }
  
  // Check for JavaScript errors
  const hasErrors = navigationHistory.some(event => event.error);
  if (hasErrors) {
    issues.push('Navigation errors detected in history');
  }
  
  return issues;
};

// Recovery function for navigation issues
export const recoverFromNavigationIssue = () => {
  console.log('[Navigation] Attempting to recover from navigation issue...');
  
  const issues = diagnoseNavigationIssues();
  console.log('[Navigation] Detected issues:', issues);
  
  if (issues.length > 0) {
    console.log('[Navigation] Reloading page to recover...');
    window.location.reload();
    return true;
  }
  
  return false;
}; 