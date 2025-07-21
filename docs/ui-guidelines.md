# UI Guidelines – Game Hub

This guide outlines best practices for building consistent, accessible, and scalable UI in Game Hub. Follow these patterns for all new features and refactors.

---

## ✅ Grid Layout & Spacing Guidelines

### Game Card Grid System
- **Container**: `.cardsGrid` uses CSS Grid with responsive breakpoints
- **Spacing**: Consistent padding and gaps across all screen sizes
- **Responsive**: 4 → 3 → 2 → 1 columns based on screen width

**Breakpoints:**
- **Desktop (>1100px)**: 4 columns, 2rem gap, 2rem padding
- **Tablet (768px-1100px)**: 3 columns, 1.5rem gap, 1.5rem padding  
- **Mobile (480px-768px)**: 2 columns, 1.2rem gap, 1.2rem padding
- **Small Mobile (<480px)**: 1 column, 1rem gap, 1rem padding

**Implementation:**
```css
.cardsGrid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem 1rem;
}
```

### Game Card Styling
- **Width**: Use `width: 100%` to fill grid cells naturally
- **Height**: Use `min-height` for consistent card heights
- **Padding**: Consistent internal spacing (1.5rem 1.25rem)
- **Background**: Clean white background with subtle shadow

**Example:**
```css
.card {
  background: white;
  width: 100%;
  min-height: 180px;
  padding: 1.5rem 1.25rem 1.25rem 1.25rem;
}
```

---

## ✅ Modal Best Practices
- Use the shared `<Modal />` component for all dialogs (win/lose, info, etc.).
- Control modal visibility via `open` and `onClose` props (controlled-only pattern).
- Pass custom content via `children`, and use `buttons` for footer actions.
- Use `className` and `style` props for custom overrides if needed.
- Ensure ARIA roles, focus trapping, and escape-to-close are always enabled.

**Example:**
```jsx
<Modal open={isOpen} onClose={handleClose} title="Info">
  <p>Modal content here</p>
  <div slot="buttons">
    <button onClick={handleClose}>Close</button>
  </div>
</Modal>
```

---

## ✅ Toast & Notification Best Practices
- Use the `useToast().showToast({ message, type })` API for all feedback.
- Types: `info`, `success`, `error` (choose the most appropriate for the context).
- Toasts are queued and only one is shown at a time.
- Use ARIA roles and ensure toasts are keyboard accessible.

**Example:**
```js
const { showToast } = useToast();
showToast({ message: 'Game saved!', type: 'success' });
```

---

## ✅ Lazy Loading & Code Splitting
- Use `React.lazy` and `Suspense` for all game pages and heavy components.
- Use dynamic imports in `gamesData.js` for per-game code splitting.
- Provide a fallback UI for loading states.

**Example:**
```js
const GameWrapper = React.lazy(() => import('./components/GameWrapper'));
<Suspense fallback={<Loader />}>
  <GameWrapper />
</Suspense>
```

---

## ✅ Keyboard Accessibility Standards

### Required Keyboard Support
All games MUST implement comprehensive keyboard functionality:

**Standard Keys:**
- **Numbers (0-9)**: Direct input for number-based games
- **Letters (A-Z)**: Direct input for word-based games  
- **Enter**: Submit guess/action
- **Backspace**: Delete last input
- **Arrow Keys**: Navigate between elements (where applicable)
- **Tab**: Navigate between interactive elements
- **Escape**: Close modals, return to previous screen

**Implementation Pattern:**
```jsx
const handleKeyDown = (e) => {
  if (state.gameOver) return;

  // Number input
  if (e.key >= "0" && e.key <= "9") {
    inputNumber(parseInt(e.key));
  }
  // Letter input  
  else if (e.key >= "a" && e.key <= "z") {
    inputLetter(e.key.toUpperCase());
  }
  // Special keys
  else if (e.key === "Enter") {
    submitGuess();
  } else if (e.key === "Backspace") {
    deleteInput();
  }
};

// Add to game container
<div 
  className="game-container" 
  onKeyDown={handleKeyDown}
  tabIndex={0}
  role="application"
  aria-label="Game name"
>
```

**Focus Management:**
- Game container must be focusable (`tabIndex={0}`)
- All interactive elements must be keyboard accessible
- Provide clear focus indicators
- Maintain logical tab order

### Game-Specific Requirements

**Word Games (Wordle, etc.):**
- Letters A-Z for input
- Enter to submit
- Backspace to delete

**Number Games (Numberle, Mathle):**
- Numbers 0-9 for input
- Operators (+, -, ×, ÷) for math games
- Enter to submit
- Backspace to delete

**Color Games (Colorle):**
- Number keys 1-8 for color selection
- Enter to submit
- Backspace to delete

**Pattern Games (Shapele, Simonle):**
- Arrow keys for navigation
- Enter/Space for selection
- Number keys for pattern input

---

## ✅ Accessibility & Consistency
- All modals and toasts must be accessible (ARIA roles, focus trapping, keyboard navigation).
- Use semantic HTML and ensure all interactive elements are keyboard accessible.
- Maintain consistent spacing, typography, and color usage across the app.
- Use `className` and `style` props for custom overrides, but keep default styles consistent.
- **All games must implement full keyboard support** (see keyboard standards above).

---

## ✅ Contributor Checklist
- [ ] Used `<Modal />` for all dialogs, with ARIA and focus trapping
- [ ] Used `useToast().showToast({ message, type })` for all notifications
- [ ] Lazy loaded all game pages and heavy components
- [ ] Provided fallback UI for all lazy loaded components
- [ ] Ensured all UI is accessible via keyboard and screen reader
- [ ] Used `className`/`style` for custom overrides, not direct style mutations
- [ ] Added inline usage examples for new UI patterns
- [ ] **Grid Layout**: Used proper grid classes and responsive breakpoints
- [ ] **Spacing**: Maintained consistent padding and gaps across breakpoints
- [ ] **Cards**: Used `width: 100%` for natural grid cell filling
- [ ] **Keyboard Support**: Implemented full keyboard functionality (see standards above)
- [ ] **Focus Management**: Added proper focus indicators and tab order
- [ ] **Game Input**: Numbers, letters, operators, enter, backspace all working

---

*Follow this guide to keep Game Hub's UI consistent, accessible, and easy to maintain as the project grows!* 