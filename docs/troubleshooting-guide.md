# Game Hub Troubleshooting Guide
**Purpose:** Solutions for common issues when integrating games into Game Hub  
**Version:** 1.0  
**Last Updated:** [Current Date]

---

## 📋 Table of Contents

1. [Game Integration Issues](#game-integration-issues)
2. [Build & Performance Issues](#build--performance-issues)
3. [Styling & UI Issues](#styling--ui-issues)
4. [State Management Issues](#state-management-issues)
5. [Accessibility Issues](#accessibility-issues)
6. [Browser Compatibility Issues](#browser-compatibility-issues)
7. [Testing Issues](#testing-issues)
8. [Debugging Tools](#debugging-tools)

---

## 🎮 Game Integration Issues

### Issue: Game not appearing in the game list

**Symptoms:**
- Game doesn't show up in the main game list
- Game doesn't appear in category filters
- 404 error when trying to access game directly

**Possible Causes:**
1. Game not properly added to `gamesData.jsx`
2. Incorrect component export
3. JavaScript errors preventing load
4. Incorrect slug or route

**Solutions:**

#### 1. Check gamesData.jsx Entry
```javascript
// Ensure your game is properly added to gamesData.jsx
const YourGame = React.lazy(() => import("../games/your-game-slug"));

const games = [
  // ... existing games
  {
    name: "Your Game Name",
    slug: "your-game-slug", // Must match folder name
    description: "Game description",
    categories: ["valid-category"], // Must be valid categories
    component: YourGame, // Must be the lazy-loaded component
    // ... other required fields
  }
];
```

#### 2. Verify Component Export
```javascript
// In your game's index.jsx
import React from 'react';
import styles from './YourGame.module.css';

const YourGame = () => {
  return (
    <div className={styles.container}>
      {/* Your game content */}
    </div>
  );
};

export default YourGame; // Must be default export
```

#### 3. Check for JavaScript Errors
- Open browser developer tools (F12)
- Check Console tab for errors
- Fix any syntax or import errors
- Ensure all dependencies are available

#### 4. Verify File Structure
```
src/games/your-game-slug/
├── index.jsx              # Must exist and export component
├── YourGame.module.css    # Must exist
└── ... other files
```

### Issue: Game loads but shows blank screen

**Symptoms:**
- Game appears in list but shows empty content
- No error messages in console
- Game wrapper loads but no game content

**Solutions:**

#### 1. Check Component Rendering
```javascript
const YourGame = () => {
  // Add console.log to debug
  console.log('YourGame component rendering');
  
  return (
    <div className={styles.container}>
      <h1>Your Game</h1>
      {/* Add visible content to test */}
    </div>
  );
};
```

#### 2. Check CSS Issues
```css
/* Ensure your container has visible styles */
.container {
  min-height: 200px;
  background-color: #f0f0f0; /* Temporary for debugging */
  padding: 20px;
}
```

#### 3. Check for Conditional Rendering
```javascript
// Make sure your game always renders something
const YourGame = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  if (isLoading) {
    return <div>Loading...</div>; // Always show something
  }
  
  return (
    <div className={styles.container}>
      {/* Game content */}
    </div>
  );
};
```

---

## ⚡ Build & Performance Issues

### Issue: Game takes too long to load

**Symptoms:**
- Game loads slowly on first visit
- Long loading times on mobile
- Poor Lighthouse performance scores

**Solutions:**

#### 1. Optimize Bundle Size
```javascript
// Use dynamic imports for heavy components
const HeavyComponent = React.lazy(() => import('./HeavyComponent'));

// Use code splitting for large utilities
const { heavyFunction } = await import('./heavyUtils');
```

#### 2. Optimize Images
```javascript
// Use WebP format when possible
// Compress images before adding to project
// Use appropriate sizes for different screen densities
```

#### 3. Reduce Dependencies
```javascript
// Only import what you need
import { useState } from 'react'; // Instead of import React from 'react'

// Avoid large external libraries
// Use built-in browser APIs when possible
```

#### 4. Implement Lazy Loading
```javascript
// Game components are already lazy-loaded via gamesData.jsx
// Ensure any heavy assets are also lazy-loaded
const [showHeavyContent, setShowHeavyContent] = useState(false);

{showHeavyContent && <HeavyContent />}
```

### Issue: Memory leaks

**Symptoms:**
- Game becomes slower over time
- High memory usage in browser dev tools
- Crashes after extended play

**Solutions:**

#### 1. Clean Up Event Listeners
```javascript
useEffect(() => {
  const handleKeyPress = (e) => {
    // Handle key press
  };
  
  window.addEventListener('keydown', handleKeyPress);
  
  // Clean up on unmount
  return () => {
    window.removeEventListener('keydown', handleKeyPress);
  };
}, []);
```

#### 2. Clean Up Timers
```javascript
useEffect(() => {
  const timer = setInterval(() => {
    // Timer logic
  }, 1000);
  
  return () => {
    clearInterval(timer);
  };
}, []);
```

#### 3. Clean Up Game Loops
```javascript
useEffect(() => {
  let animationId;
  
  const gameLoop = () => {
    // Game logic
    animationId = requestAnimationFrame(gameLoop);
  };
  
  gameLoop();
  
  return () => {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
  };
}, []);
```

---

## 🎨 Styling & UI Issues

### Issue: Styling conflicts with other games

**Symptoms:**
- Game styles affect other games
- Global CSS classes causing conflicts
- Inconsistent appearance

**Solutions:**

#### 1. Use CSS Modules
```javascript
// Always use CSS Modules for game-specific styles
import styles from './YourGame.module.css';

const YourGame = () => {
  return (
    <div className={styles.container}>
      <button className={styles.button}>Click me</button>
    </div>
  );
};
```

#### 2. Avoid Global Classes
```css
/* ❌ Don't use global classes */
.button {
  background: blue;
}

/* ✅ Use CSS Modules */
.button {
  background: blue;
}
```

#### 3. Use Specific Class Names
```css
/* Use game-specific prefixes */
.yourGameButton {
  background: blue;
}

.yourGameContainer {
  padding: 20px;
}
```

### Issue: Game not responsive on mobile

**Symptoms:**
- Game doesn't scale properly on mobile
- Touch interactions don't work
- Text too small to read

**Solutions:**

#### 1. Use Responsive Units
```css
/* Use relative units instead of fixed pixels */
.container {
  width: 100%;
  max-width: 800px;
  padding: 1rem;
  font-size: 1rem;
}

.button {
  min-height: 44px; /* Minimum touch target size */
  padding: 0.75rem 1rem;
}
```

#### 2. Add Media Queries
```css
/* Mobile-first approach */
.container {
  padding: 1rem;
}

@media (min-width: 768px) {
  .container {
    padding: 2rem;
  }
}

@media (min-width: 1024px) {
  .container {
    padding: 3rem;
  }
}
```

#### 3. Implement Touch-Friendly Interactions
```javascript
// Use touch events for mobile
const handleTouch = (e) => {
  e.preventDefault();
  // Handle touch interaction
};

<div 
  onTouchStart={handleTouch}
  onTouchEnd={handleTouch}
  className={styles.touchTarget}
>
  Touch me
</div>
```

---

## 🔄 State Management Issues

### Issue: Game state not persisting

**Symptoms:**
- Game resets when page refreshes
- Progress lost when navigating away
- State not saved between sessions

**Solutions:**

#### 1. Use Provided Hooks
```javascript
import { useGameState, useGameCompletion } from '../../hooks';

const YourGame = () => {
  const { gameState, setGameState } = useGameState();
  const { markCompleted, isCompleted } = useGameCompletion();
  
  // Use these hooks for basic persistence
};
```

#### 2. Use localStorage for Custom State
```javascript
import { saveToLocalStorage, loadFromLocalStorage } from '../../utils/localStorage';

const YourGame = () => {
  const [customState, setCustomState] = useState(() => {
    return loadFromLocalStorage('yourGameState') || initialState;
  });
  
  const updateState = (newState) => {
    setCustomState(newState);
    saveToLocalStorage('yourGameState', newState);
  };
};
```

#### 3. Handle Storage Errors
```javascript
const saveState = (state) => {
  try {
    localStorage.setItem('gameState', JSON.stringify(state));
  } catch (error) {
    console.warn('Failed to save game state:', error);
    // Continue without persistence
  }
};
```

### Issue: State updates not triggering re-renders

**Symptoms:**
- UI doesn't update when state changes
- Game appears frozen
- Interactions don't work

**Solutions:**

#### 1. Use Proper State Updates
```javascript
// ❌ Don't mutate state directly
const [score, setScore] = useState(0);

const updateScore = () => {
  score += 1; // This won't trigger re-render
};

// ✅ Use setter function
const updateScore = () => {
  setScore(prevScore => prevScore + 1);
};
```

#### 2. Check Dependencies in useEffect
```javascript
useEffect(() => {
  // Effect logic
}, [dependency1, dependency2]); // Include all dependencies
```

#### 3. Use useCallback for Stable References
```javascript
const handleClick = useCallback(() => {
  // Click handler logic
}, [dependency1, dependency2]);
```

---

## ♿ Accessibility Issues

### Issue: Game not keyboard accessible

**Symptoms:**
- Can't navigate with keyboard
- Focus not visible
- Screen readers can't access game

**Solutions:**

#### 1. Add Keyboard Support
```javascript
const handleKeyDown = (e) => {
  switch (e.key) {
    case 'ArrowUp':
      e.preventDefault();
      moveUp();
      break;
    case 'ArrowDown':
      e.preventDefault();
      moveDown();
      break;
    case 'Enter':
    case ' ':
      e.preventDefault();
      select();
      break;
  }
};

<div 
  tabIndex={0}
  onKeyDown={handleKeyDown}
  role="button"
  aria-label="Game control"
>
  Game content
</div>
```

#### 2. Add Focus Indicators
```css
/* Ensure focus is visible */
.button:focus,
.interactive:focus {
  outline: 2px solid #007bff;
  outline-offset: 2px;
}

/* Or use focus-visible for better UX */
.button:focus-visible {
  outline: 2px solid #007bff;
  outline-offset: 2px;
}
```

#### 3. Add ARIA Labels
```javascript
<button 
  aria-label="Make a move"
  aria-describedby="move-instructions"
  onClick={handleMove}
>
  Move
</button>
<div id="move-instructions" className="sr-only">
  Click to make your move in the game
</div>
```

### Issue: Poor color contrast

**Symptoms:**
- Text hard to read
- Buttons not visible
- Fails accessibility tests

**Solutions:**

#### 1. Check Color Contrast
```css
/* Ensure sufficient contrast */
.text {
  color: #333; /* Dark text on light background */
  background: #fff;
}

.button {
  background: #007bff;
  color: #fff; /* Light text on dark background */
}
```

#### 2. Use Color Contrast Tools
- Use browser dev tools to check contrast
- Use online contrast checkers
- Test with color blindness simulators

#### 3. Provide Alternative Indicators
```css
/* Use more than just color to indicate state */
.button.active {
  background: #007bff;
  border: 2px solid #0056b3; /* Additional visual indicator */
}
```

---

## 🌐 Browser Compatibility Issues

### Issue: Game doesn't work in certain browsers

**Symptoms:**
- Game works in Chrome but not Firefox
- Mobile Safari issues
- Older browser compatibility problems

**Solutions:**

#### 1. Check Browser Support
```javascript
// Check for required features
if (!window.localStorage) {
  console.warn('localStorage not supported');
  // Provide fallback
}

if (!window.requestAnimationFrame) {
  console.warn('requestAnimationFrame not supported');
  // Use setTimeout fallback
}
```

#### 2. Use Polyfills
```javascript
// Add polyfills for missing features
import 'core-js/stable';
import 'regenerator-runtime/runtime';
```

#### 3. Test Across Browsers
- Test on Chrome, Firefox, Safari, Edge
- Test on mobile browsers
- Use browser dev tools to simulate different devices

### Issue: CSS not working in all browsers

**Symptoms:**
- Styles look different across browsers
- Some CSS properties not supported
- Layout breaks in certain browsers

**Solutions:**

#### 1. Use Cross-Browser CSS
```css
/* Use vendor prefixes when needed */
.button {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  
  -webkit-border-radius: 4px;
  -moz-border-radius: 4px;
  border-radius: 4px;
}
```

#### 2. Use CSS Reset
```css
/* Ensure consistent base styles */
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
}
```

#### 3. Test CSS Properties
```css
/* Check browser support before using new features */
@supports (display: grid) {
  .container {
    display: grid;
  }
}

@supports not (display: grid) {
  .container {
    display: flex;
  }
}
```

---

## 🧪 Testing Issues

### Issue: Game not working in production build

**Symptoms:**
- Game works in development but not production
- Build errors
- Runtime errors in production

**Solutions:**

#### 1. Test Production Build Locally
```bash
# Build and test locally
npm run build
npm run preview
```

#### 2. Check Build Configuration
```javascript
// Ensure all imports are correct
// Check for missing dependencies
// Verify file paths
```

#### 3. Handle Environment Differences
```javascript
// Use environment variables for different builds
const API_URL = import.meta.env.PROD 
  ? 'https://production-api.com' 
  : 'http://localhost:3000';
```

### Issue: Performance issues in production

**Symptoms:**
- Game slow in production
- High memory usage
- Poor user experience

**Solutions:**

#### 1. Profile Production Build
```javascript
// Use browser dev tools to profile
// Check for memory leaks
// Optimize expensive operations
```

#### 2. Implement Performance Monitoring
```javascript
// Add performance marks
performance.mark('gameStart');
// ... game logic
performance.mark('gameEnd');
performance.measure('gameDuration', 'gameStart', 'gameEnd');
```

#### 3. Optimize Assets
```javascript
// Compress images and audio
// Use appropriate formats
// Implement lazy loading
```

---

## 🔧 Debugging Tools

### Browser Developer Tools
- **Console**: Check for errors and warnings
- **Network**: Monitor loading times and requests
- **Performance**: Profile memory and CPU usage
- **Application**: Check localStorage and sessionStorage
- **Elements**: Inspect DOM and CSS

### React Developer Tools
- Install React Developer Tools browser extension
- Inspect component hierarchy
- Monitor state changes
- Profile component performance

### Performance Monitoring
```javascript
// Add performance monitoring
const startTime = performance.now();

// ... game logic

const endTime = performance.now();
console.log(`Game took ${endTime - startTime} milliseconds`);
```

### Error Boundaries
```javascript
class GameErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Game error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong. Please refresh the page.</div>;
    }

    return this.props.children;
  }
}
```

---

## 📞 Getting Help

### Before Contacting Support
1. Check this troubleshooting guide
2. Review the contributor guide
3. Test in different browsers
4. Check browser console for errors
5. Try a minimal reproduction

### When to Contact Support
- Game completely broken after following all solutions
- Performance issues that can't be resolved
- Accessibility issues requiring expert help
- Integration problems with Game Hub systems

### Information to Provide
- Browser and version
- Device and operating system
- Steps to reproduce the issue
- Console errors and warnings
- Screenshots or videos if applicable

---

**Last Updated:** [Current Date]  
**Version:** 1.0 