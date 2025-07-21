# Game Hub Contributor Guide
**Purpose:** Guide for partners integrating games into Game Hub  
**Version:** 1.0  
**Last Updated:** [Current Date]

---

## 📋 Table of Contents

1. [Getting Started](#getting-started)
2. [Project Structure](#project-structure)
3. [Game Integration Requirements](#game-integration-requirements)
4. [Coding Standards](#coding-standards)
5. [Component Guidelines](#component-guidelines)
6. [Testing Requirements](#testing-requirements)
7. [Performance Guidelines](#performance-guidelines)
8. [Accessibility Standards](#accessibility-standards)
9. [Common Issues & Solutions](#common-issues--solutions)
10. [FAQ](#faq)

---

## 🚀 Getting Started

### Prerequisites
- React 18+ knowledge
- Familiarity with CSS Modules
- Understanding of modern JavaScript (ES6+)
- Basic knowledge of Vite build system

### Development Environment
- Node.js 18+ 
- npm or yarn package manager
- Modern browser for testing
- Code editor with ESLint/Prettier support

### Quick Start
1. Fork the Game Hub repository
2. Clone your fork locally
3. Install dependencies: `npm install`
4. Start development server: `npm run dev`
5. Create your game in `/src/games/[your-game-slug]/`

---

## 📁 Project Structure

### Game Folder Structure
```
src/games/[game-slug]/
├── index.jsx              # Main game component (default export)
├── [GameName].module.css  # Scoped styles for the game
├── components/            # Game-specific components (optional)
│   ├── GameBoard.jsx
│   └── GameBoard.module.css
├── hooks/                 # Game-specific hooks (optional)
│   └── useGameLogic.js
├── utils/                 # Game-specific utilities (optional)
│   └── gameHelpers.js
└── assets/               # Game assets (optional)
    ├── images/
    └── sounds/
```

### Required Files
- **`index.jsx`**: Must export the main game component as default
- **`[GameName].module.css`**: Scoped styles using CSS Modules

### Optional Files
- Additional components, hooks, utilities, and assets as needed
- Keep the structure simple and organized

---

## 🎮 Game Integration Requirements

### 1. gamesData.jsx Entry
Each game must be added to `/src/data/gamesData.jsx`:

```javascript
const YourGame = React.lazy(() => import("../games/your-game-slug"));

const games = [
  // ... existing games
  {
    name: "Your Game Name",
    slug: "your-game-slug",
    description: "Brief description of your game (max 200 characters)",
    categories: ["category1", "category2"],
    component: YourGame,
    metaDescription: "SEO description for search engines",
    keywords: ["keyword1", "keyword2", "keyword3"],
    previewImage: "/assets/previews/your-game.png",
    // Optional fields:
    supportsDaily: true, // If game supports daily challenges
    dailySettings: {
      seedSource: "date",
      difficulty: "medium"
    },
    difficulty: "medium", // easy, medium, hard
    estimatedPlayTime: 5 // in minutes
  }
];
```

### 2. Required Metadata
- **name**: Human-readable title
- **slug**: URL-friendly identifier (lowercase, hyphens)
- **description**: Brief game description (max 200 characters)
- **categories**: Array of valid categories (see categories.js)
- **component**: Lazy-loaded React component
- **metaDescription**: SEO description (150-160 characters)
- **keywords**: Array of relevant keywords
- **previewImage**: Path to game preview image

### 3. Valid Categories
Check `/src/data/categories.js` for current valid categories:
- "-le games"
- "word games"
- "memory games"
- "puzzle games"
- "strategy games"
- "action games"
- "see more"

---

## 💻 Coding Standards

### JavaScript/JSX Standards
- Use functional components with hooks
- Use modern ES6+ syntax
- Prefer `const` and `let` over `var`
- Use arrow functions for components and callbacks
- Use destructuring for props and state

### Naming Conventions
- **Files**: `PascalCase` for components, `camelCase` for utilities
- **Components**: `PascalCase` (e.g., `GameBoard`, `ScoreDisplay`)
- **CSS Classes**: `camelCase` (e.g., `gameBoard`, `scoreDisplay`)
- **Variables/Functions**: `camelCase`
- **Constants**: `UPPER_SNAKE_CASE`

### Code Style
- Use 2-space indentation
- Use semicolons (enforced by Prettier)
- Use single quotes for strings
- Use trailing commas in objects and arrays
- Maximum line length: 80 characters

### ESLint/Prettier
- Follow the project's ESLint configuration
- Use Prettier for code formatting
- No custom formatting rules - use project defaults

---

## 🧩 Component Guidelines

### Game Component Structure
```javascript
import React, { useState, useEffect } from 'react';
import styles from './YourGame.module.css';

const YourGame = () => {
  // State management
  const [gameState, setGameState] = useState('playing');
  
  // Game logic
  useEffect(() => {
    // Initialize game
  }, []);
  
  // Event handlers
  const handleGameAction = () => {
    // Game logic
  };
  
  return (
    <div className={styles.gameContainer}>
      {/* Game UI */}
    </div>
  );
};

export default YourGame;
```

### Using Shared Components
Game Hub provides several shared components you can use:

#### Modal Component
```javascript
import { Modal } from '../../components/ui/Modal';

const YourGame = () => {
  const [showModal, setShowModal] = useState(false);
  
  return (
    <>
      <button onClick={() => setShowModal(true)}>Show Rules</button>
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <h2>Game Rules</h2>
          <p>Your game rules here...</p>
        </Modal>
      )}
    </>
  );
};
```

#### Toast Component
```javascript
import { Toast } from '../../components/ui/Toast';

const YourGame = () => {
  const [showToast, setShowToast] = useState(false);
  
  const showMessage = (message) => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };
  
  return (
    <>
      <button onClick={() => showMessage('Great move!')}>Make Move</button>
      {showToast && <Toast message="Great move!" />}
    </>
  );
};
```

#### GameWrapper Component
```javascript
import { GameWrapper } from '../../components/game/GameWrapper';

const YourGame = () => {
  return (
    <GameWrapper>
      {/* Your game content */}
    </GameWrapper>
  );
};
```

### Using Shared Hooks
Game Hub provides several useful hooks:

#### useGameState Hook
```javascript
import { useGameState } from '../../hooks/useGameState';

const YourGame = () => {
  const { gameState, setGameState, resetGame } = useGameState();
  
  // Use gameState for current game status
  // Use setGameState to update game status
  // Use resetGame to restart the game
};
```

#### useGameCompletion Hook
```javascript
import { useGameCompletion } from '../../hooks/useGameCompletion';

const YourGame = () => {
  const { markCompleted, isCompleted } = useGameCompletion();
  
  const handleWin = () => {
    markCompleted();
    // Show win message
  };
};
```

---

## 🧪 Testing Requirements

### Functional Testing
- [ ] Game loads correctly
- [ ] Game mechanics work as expected
- [ ] Win/lose conditions function properly
- [ ] Game state persists correctly (if applicable)
- [ ] Integration with favorites system works
- [ ] Recently played tracking works
- [ ] Category filtering includes your game

### Responsive Testing
Test on these breakpoints:
- **Mobile**: 320px, 375px, 414px
- **Tablet**: 768px, 1024px
- **Desktop**: 1440px, 1920px

### Browser Testing
Test on:
- **Desktop**: Chrome, Firefox, Safari, Edge
- **Mobile**: Chrome Mobile, Safari Mobile

### Performance Testing
- [ ] Game loads in < 3 seconds on 3G
- [ ] Memory usage < 100MB
- [ ] Smooth 60fps animations
- [ ] No memory leaks after 10+ minutes of play

---

## ⚡ Performance Guidelines

### Code Splitting
- Use React.lazy() for game components (already handled in gamesData.jsx)
- Keep game bundles under 100KB
- Optimize images and assets

### State Management
- Use local state for game-specific data
- Avoid unnecessary re-renders
- Use useCallback and useMemo for expensive operations

### Asset Optimization
- Compress images (use WebP format when possible)
- Optimize audio files
- Use appropriate image sizes for different screen densities

### Memory Management
- Clean up event listeners in useEffect cleanup
- Avoid memory leaks in game loops
- Dispose of timers and intervals properly

---

## ♿ Accessibility Standards

### WCAG 2.1 AA Compliance
- **Color Contrast**: Minimum 4.5:1 ratio
- **Keyboard Navigation**: All interactive elements accessible via keyboard
- **Screen Reader Support**: Proper ARIA labels and roles
- **Focus Indicators**: Visible focus indicators for all interactive elements

### ARIA Implementation
```javascript
// Example of accessible game controls
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

### Keyboard Support
- **Tab**: Navigate between interactive elements
- **Enter/Space**: Activate buttons and controls
- **Arrow Keys**: Navigate game boards or grids
- **Escape**: Close modals or cancel actions

### Screen Reader Support
- Use semantic HTML elements
- Provide descriptive labels for custom controls
- Announce game state changes
- Provide instructions for screen reader users

---

## 🔧 Common Issues & Solutions

### Issue: Game not appearing in the list
**Solution:**
- Check that the game is properly added to gamesData.jsx
- Verify the component export is correct
- Check for JavaScript errors in the console

### Issue: Styling conflicts with other games
**Solution:**
- Use CSS Modules for all styling
- Avoid global CSS classes
- Use specific class names for your game

### Issue: Game not responsive on mobile
**Solution:**
- Test on actual mobile devices
- Use relative units (rem, em, %) instead of fixed pixels
- Implement touch-friendly interactions

### Issue: Performance problems
**Solution:**
- Profile the game using browser dev tools
- Optimize expensive operations
- Reduce bundle size
- Implement lazy loading for heavy assets

### Issue: Accessibility problems
**Solution:**
- Test with screen readers
- Verify keyboard navigation
- Check color contrast ratios
- Add proper ARIA labels

---

## ❓ FAQ

### Q: Can I use external libraries?
**A:** External dependencies require approval. Contact the team before adding any new packages.

### Q: How do I add sound effects?
**A:** Use the Web Audio API or HTML5 Audio. Keep audio files small and provide volume controls.

### Q: Can I use Canvas or WebGL?
**A:** Yes, but ensure the game is still accessible and works without JavaScript.

### Q: How do I handle game state persistence?
**A:** Use the provided hooks (useGameState, useGameCompletion) for basic persistence. For complex state, contact the team.

### Q: What if my game doesn't fit the standard template?
**A:** Contact the team to discuss custom requirements. We can extend the template system if needed.

### Q: How do I test my game?
**A:** Use the testing checklist in this guide. Test on multiple devices and browsers.

### Q: Can I add multiplayer features?
**A:** Multiplayer features are not supported in the current version. Contact the team for future versions.

### Q: How do I handle analytics?
**A:** Use the provided analytics utility. Contact the team for custom analytics requirements.

---

## 📞 Support

### Getting Help
- Check this guide first
- Review existing games for examples
- Contact the team for technical support
- Use the project's issue tracker for bugs

### Contact Information
- **Technical Support**: [Contact details]
- **Documentation Issues**: [Contact details]
- **Feature Requests**: [Contact details]

---

## 📝 Checklist for Game Submission

Before submitting your game, ensure you've completed:

### Code Quality
- [ ] Follows coding standards
- [ ] Uses CSS Modules for styling
- [ ] Proper error handling
- [ ] No console errors or warnings
- [ ] Clean, readable code

### Functionality
- [ ] Game works as intended
- [ ] All features implemented
- [ ] Win/lose conditions work
- [ ] Game state management works
- [ ] Integration with Game Hub systems

### Testing
- [ ] Tested on multiple browsers
- [ ] Tested on mobile devices
- [ ] Performance requirements met
- [ ] Accessibility requirements met
- [ ] No memory leaks

### Documentation
- [ ] Game description complete
- [ ] Metadata properly configured
- [ ] Categories assigned correctly
- [ ] Preview image provided
- [ ] Code comments where needed

---

**Last Updated:** [Current Date]  
**Version:** 1.0 