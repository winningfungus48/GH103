# Accessibility Guidelines

**Version:** 1.1.2  
**Last Updated:** [Current Date]  
**Status:** ✅ Complete

---

## 📋 Overview

These accessibility guidelines ensure that all games and components in the Game Hub platform meet WCAG 2.1 AA standards and provide an inclusive experience for all users, including those using screen readers, keyboard navigation, and other assistive technologies.

---

## 🎯 WCAG 2.1 AA Compliance

### Perceivable
- **Text Alternatives**: All non-text content has appropriate text alternatives
- **Time-based Media**: Captions and audio descriptions where applicable
- **Adaptable**: Content can be presented in different ways without losing information
- **Distinguishable**: Content is easy to see and hear

### Operable
- **Keyboard Accessible**: All functionality is available from a keyboard
- **Enough Time**: Users have enough time to read and use content
- **Seizures**: Content does not cause seizures or physical reactions
- **Navigable**: Users can navigate, find content, and determine where they are

### Understandable
- **Readable**: Text is readable and understandable
- **Predictable**: Pages operate in predictable ways
- **Input Assistance**: Users are helped to avoid and correct mistakes

### Robust
- **Compatible**: Content is compatible with current and future user tools

---

## 🎮 Game-Specific Accessibility

### Game State Announcements
```jsx
// Use aria-live regions for dynamic content
<div aria-live="polite" aria-atomic="true">
  {gameStatus}
</div>

// Use role="alert" for important messages
<div role="alert" aria-live="assertive">
  {errorMessage}
</div>
```

### Game Controls
```jsx
// All interactive elements must be keyboard accessible
<button
  onClick={handleAction}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleAction();
    }
  }}
  aria-label="Clear description of action"
  tabIndex={0}
>
  Action
</button>
```

### Game Boards and Grids
```jsx
// Use semantic grid structure
<div role="grid" aria-label="Game board">
  {rows.map((row, rowIndex) => (
    <div role="row" aria-label={`Row ${rowIndex + 1}`}>
      {row.map((cell, colIndex) => (
        <div 
          role="gridcell" 
          aria-label={`Position ${colIndex + 1}, ${cell.value || 'empty'}`}
        >
          {cell.value}
        </div>
      ))}
    </div>
  ))}
</div>
```

---

## 🎨 Component Accessibility Patterns

### Interactive Cards
```jsx
// Game cards should be keyboard navigable
<article 
  role="article"
  aria-labelledby={`game-title-${slug}`}
  aria-describedby={`game-description-${slug}`}
  tabIndex={0}
>
  <h2 id={`game-title-${slug}`}>{title}</h2>
  <p id={`game-description-${slug}`}>{description}</p>
</article>
```

### Navigation Components
```jsx
// Navigation should use semantic nav elements
<nav role="navigation" aria-label="Game categories">
  <button
    aria-current={isActive ? "page" : undefined}
    aria-label={`${category} games`}
  >
    {category}
  </button>
</nav>
```

### Modal Dialogs
```jsx
// Modals should have proper focus management
<Modal
  open={isOpen}
  onClose={handleClose}
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
>
  <h2 id="modal-title">Modal Title</h2>
  <div id="modal-description">Modal content</div>
</Modal>
```

---

## ⌨️ Keyboard Navigation

### Tab Order
- Logical tab order that follows visual layout
- Skip links for main content
- Focus indicators visible on all interactive elements

### Keyboard Shortcuts
```jsx
// Common game shortcuts
const handleKeyDown = (e) => {
  switch (e.key) {
    case 'Enter':
    case ' ':
      e.preventDefault();
      handleAction();
      break;
    case 'Escape':
      handleCancel();
      break;
    case 'ArrowUp':
    case 'ArrowDown':
    case 'ArrowLeft':
    case 'ArrowRight':
      handleDirection(e.key);
      break;
  }
};
```

### Focus Management
```jsx
// Return focus to previous element when modal closes
const [previouslyFocused, setPreviouslyFocused] = useState(null);

useEffect(() => {
  if (isOpen) {
    setPreviouslyFocused(document.activeElement);
    // Focus first focusable element in modal
  } else if (previouslyFocused) {
    previouslyFocused.focus();
  }
}, [isOpen]);
```

---

## 🗣️ Screen Reader Support

### ARIA Labels
```jsx
// Descriptive labels for all interactive elements
<button aria-label="Add Wordle to favorites">
  <HeartIcon />
</button>

<input 
  aria-label="Search games"
  aria-describedby="search-help"
  placeholder="Search..."
/>
<div id="search-help">Type to search for games</div>
```

### Live Regions
```jsx
// Announce dynamic content changes
<div aria-live="polite" aria-atomic="true">
  {gameStatus}
</div>

<div role="alert" aria-live="assertive">
  {errorMessage}
</div>
```

### Status Messages
```jsx
// Provide context for game state
const getGameStatus = () => {
  if (gameOver) {
    return gameWon 
      ? "Congratulations! You won the game!" 
      : `Game over. The correct answer was ${answer}`;
  }
  return `Attempt ${currentAttempt} of ${maxAttempts}`;
};
```

---

## 🎨 Visual Accessibility

### Color and Contrast
- **Minimum contrast ratio**: 4.5:1 for normal text, 3:1 for large text
- **Color independence**: Information not conveyed by color alone
- **Focus indicators**: Visible focus indicators on all interactive elements

### Typography
- **Readable font sizes**: Minimum 16px for body text
- **Line spacing**: 1.5x line height for readability
- **Font choices**: Sans-serif fonts for better readability

### Visual Indicators
```css
/* Focus indicators */
*:focus {
  outline: 2px solid #646cff;
  outline-offset: 2px;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .button {
    border: 2px solid currentColor;
  }
}
```

---

## 📱 Mobile Accessibility

### Touch Targets
- **Minimum size**: 44px × 44px for touch targets
- **Spacing**: Adequate spacing between interactive elements
- **Touch feedback**: Visual feedback for touch interactions

### Gesture Support
```jsx
// Support both touch and keyboard interactions
const handleInteraction = (e) => {
  if (e.type === 'click' || e.type === 'keydown') {
    // Handle interaction
  }
};
```

### Responsive Design
- **Viewport**: Proper viewport meta tag
- **Scaling**: Content scales appropriately
- **Orientation**: Works in both portrait and landscape

---

## 🧪 Testing Accessibility

### Manual Testing
1. **Keyboard navigation**: Navigate entire app using only keyboard
2. **Screen reader testing**: Test with NVDA, JAWS, or VoiceOver
3. **Color contrast**: Use tools like WebAIM Contrast Checker
4. **Focus indicators**: Ensure all interactive elements have visible focus

### Automated Testing
```jsx
// Jest accessibility testing
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

test('should not have accessibility violations', async () => {
  const { container } = render(<MyComponent />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### Browser DevTools
- **Chrome DevTools**: Accessibility panel
- **Firefox DevTools**: Accessibility inspector
- **Safari**: Web Inspector accessibility features

---

## 🔧 Implementation Checklist

### Required for All Components
- [ ] **Semantic HTML**: Use appropriate HTML elements
- [ ] **ARIA labels**: Descriptive labels for all interactive elements
- [ ] **Keyboard navigation**: All functionality accessible via keyboard
- [ ] **Focus management**: Proper focus indicators and management
- [ ] **Color contrast**: Meet WCAG contrast requirements
- [ ] **Screen reader support**: Test with screen readers

### Required for Games
- [ ] **Game state announcements**: Live regions for status updates
- [ ] **Error handling**: Clear error messages and recovery options
- [ ] **Progress indicators**: Announce progress and completion
- [ ] **Alternative input methods**: Support for different input devices
- [ ] **Pause/resume**: Allow users to pause and resume games

### Required for Navigation
- [ ] **Skip links**: Skip to main content
- [ ] **Breadcrumbs**: Clear navigation hierarchy
- [ ] **Current page indication**: aria-current for active pages
- [ ] **Landmark regions**: Proper use of main, nav, aside, etc.

---

## 🚨 Common Issues & Solutions

### Issue: Missing ARIA labels
**Solution:**
```jsx
// ❌ Bad
<button onClick={handleClick}>→</button>

// ✅ Good
<button 
  onClick={handleClick}
  aria-label="Next page"
>
  →
</button>
```

### Issue: No keyboard support
**Solution:**
```jsx
// ❌ Bad
<div onClick={handleClick}>Click me</div>

// ✅ Good
<button 
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }}
  tabIndex={0}
>
  Click me
</button>
```

### Issue: Poor color contrast
**Solution:**
```css
/* ❌ Bad */
.button {
  background: #ccc;
  color: #fff;
}

/* ✅ Good */
.button {
  background: #333;
  color: #fff;
}
```

---

## 📚 Resources

### Documentation
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [WebAIM Guidelines](https://webaim.org/standards/wcag/checklist)

### Testing Tools
- [axe DevTools](https://www.deque.com/axe/)
- [WAVE Web Accessibility Evaluator](https://wave.webaim.org/)
- [Color Contrast Analyzer](https://www.tpgi.com/color-contrast-checker/)

### Screen Readers
- **Windows**: NVDA (free), JAWS (commercial)
- **macOS**: VoiceOver (built-in)
- **Linux**: Orca (free)

---

## 🔗 Related Documentation

- [Game Template System](./game-template-system.md)
- [Template Validation Checklist](./template-validation-checklist.md)
- [Performance Utilities Guide](./performance-utilities-guide.md)
- [Phase 1.1.2 Audit Log](../phases/1.1/phase-1.1.2-audit-log.md)

---

**Accessibility Guidelines Status:** ✅ **COMPLETE**  
**WCAG Compliance:** 2.1 AA  
**Ready for:** Phase 1.1.3 - New Games Batch 1 