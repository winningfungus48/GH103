# Game Card Styling Reference

This document provides a complete reference for the game card styling system on the Game Hub homescreen. Use this as a reference to revert or fix any styling issues.

---

## 📋 Table of Contents

1. [Component Structure](#component-structure)
2. [Main Card Styling](#main-card-styling)
3. [Game-Specific Backgrounds](#game-specific-backgrounds)
4. [Responsive Behavior](#responsive-behavior)
5. [Interactive Elements](#interactive-elements)
6. [Grid Layout](#grid-layout)
7. [CSS Variables](#css-variables)
8. [Troubleshooting](#troubleshooting)

---

## 🏗️ Component Structure

### Main Component: `GameCard.jsx`
```jsx
<article className={`${styles.card} ${styles[slug] || ''}`}>
  {/* Favorite Toggle - top-right */}
  <div style={{ position: "absolute", top: 8, right: 8, zIndex: 3 }}>
    <FavoriteToggle slug={slug} />
  </div>
  
  {/* Badges - top-left */}
  {(isNew || featured) && (
    <div style={{ position: "absolute", top: 8, left: 8, display: "flex", gap: 4, zIndex: 3 }}>
      {isNew && <Badge type="new">New</Badge>}
      {featured && <Badge type="featured">Featured</Badge>}
    </div>
  )}
  
  {/* Game Icon */}
  <div className={styles.iconContainer}>
    {getGameIcon(title, styles.gameIcon, 56)}
  </div>
  
  {/* Game Title */}
  <GameTitle title={title} id={`game-title-${slug}`} />
  
  {/* Description */}
  <p className={styles.description} id={`game-description-${slug}`}>
    {description}
  </p>
  
  {/* Play Now Button */}
  <PlayNowButton to={route || `/game/${slug}`} />
</article>
```

---

## 🎨 Main Card Styling

### Base Card Class: `.card`
```css
.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
  padding: 1rem 1rem 1rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-height: 180px;
  max-width: 100%;
  transition: all 0.35s ease;
  transform: scale(1);
  overflow: hidden;
  box-sizing: border-box;
  position: relative;
}
```

### Hover/Focus States
```css
.card:hover,
.card:focus-within {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  transform: scale(1.02);
}
```

---

## 🌈 Game-Specific Backgrounds

Each game has a unique gradient background applied via CSS classes:

```css
/* Colorle */
.card.colorle {
  background: linear-gradient(135deg, #f8f5ff 0%, #f0ebff 100%);
}

/* Mathle */
.card.mathle {
  background: linear-gradient(135deg, #f0fff4 0%, #e6ffed 100%);
}

/* Memoryle */
.card.memoryle {
  background: linear-gradient(135deg, #fff8f0 0%, #ffe6cc 100%);
}

/* Pitcher Data Quiz */
.card.mlb-player-comparison {
  background: linear-gradient(135deg, #f0f8ff 0%, #e6f3ff 100%);
}

/* MLB Player Guess */
.card.mlb-player-guess {
  background: linear-gradient(135deg, #fff0f0 0%, #ffe6e6 100%);
}

/* NBA Player Guess */
.card.nba-player-guess {
  background: linear-gradient(135deg, #fff8e6 0%, #ffe6b3 100%);
}

/* NFL Player Guess */
.card.nfl-player-guess {
  background: linear-gradient(135deg, #f5f0e6 0%, #e6d9b3 100%);
}

/* Numberle */
.card.numberle {
  background: linear-gradient(135deg, #f0f0ff 0%, #e6e6ff 100%);
}

/* Puzzlele */
.card.puzzlele {
  background: linear-gradient(135deg, #fff0f5 0%, #ffe6f0 100%);
}

/* Shapele */
.card.shapele {
  background: linear-gradient(135deg, #f0f8ff 0%, #e6f3ff 100%);
}

/* Simonle */
.card.simonle {
  background: linear-gradient(135deg, #fff8f0 0%, #ffe6cc 100%);
}

/* Wordle */
.card.wordle {
  background: linear-gradient(135deg, #f0fff4 0%, #e6ffed 100%);
}
```

---

## 📱 Responsive Behavior

### Icon Container
```css
.iconContainer {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-bottom: 0.75rem;
  min-height: 56px;
}
```

### Game Icon
```css
.gameIcon {
  border-radius: 8px;
  transition: transform 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.gameIcon:hover {
  transform: scale(1.05);
}
```

### Description
```css
.description {
  font-size: 1rem;
  color: #333;
  margin-bottom: 0.875rem;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  text-align: center;
}
```

### Responsive Min-Heights
```css
@media (max-width: 1100px) {
  .card {
    min-height: 150px;
  }
}

@media (max-width: 768px) {
  .card {
    min-height: 130px;
  }
}

@media (max-width: 480px) {
  .card {
    min-height: 110px;
  }
}
```

---

## 🎯 Interactive Elements

### Game Title Component
**File:** `src/components/atoms/GameTitle.jsx`
```jsx
const GameTitle = ({ title, id }) => {
  return <h2 className={styles.title} id={id}>{title}</h2>;
};
```

**Styling:** `src/components/atoms/GameTitle.module.css`
```css
.title {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  color: var(--brand-blue);
  text-align: center;
  width: 100%;
  white-space: normal;
  overflow: visible;
  line-height: 1.2;
}
```

### Play Now Button
**File:** `src/components/atoms/PlayNowButton.jsx`
```jsx
const PlayNowButton = ({ to, children = "Play Now", "aria-label": ariaLabel }) => {
  return (
    <Link 
      to={to} 
      className={styles.button}
      aria-label={ariaLabel || `Play ${children}`}
      role="button"
      tabIndex={0}
    >
      {children}
    </Link>
  );
};
```

**Styling:** `src/components/atoms/PlayNowButton.module.css`
```css
.button {
  background: var(--brand-blue);
  color: var(--text-light);
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1.25rem;
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.35s ease;
  align-self: center;
  transform: scale(1);
}

.button:hover,
.button:focus {
  background: var(--brand-purple);
  color: var(--text-light);
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
}

.button:active {
  transform: scale(1.02);
}
```

### Badge Component
**File:** `src/components/atoms/Badge.jsx`
```jsx
const Badge = ({ type, children }) => {
  const color = badgeColors[type] || "#888";
  
  return (
    <Tooltip content={getTooltipContent()} position="top">
      <span
        className={styles.badge}
        style={{
          background: color,
          color: "#fff",
        }}
        role="status"
        aria-label={getTooltipContent()}
        tabIndex={0}
      >
        {children}
      </span>
    </Tooltip>
  );
};

const badgeColors = {
  new: "#38bdf8", // blue
  featured: "#fbbf24", // yellow
};
```

**Styling:** `src/components/atoms/Badge.module.css`
```css
.badge {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 0.75rem;
  padding: 0.18em 0.7em;
  margin-right: 6px;
  margin-top: 6px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.07);
  letter-spacing: 0.03em;
  position: relative;
  z-index: 2;
  transition: all 0.35s ease;
  cursor: help;
}

.badge:hover,
.badge:focus {
  transform: scale(1.05);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
}
```

### Favorite Toggle
**File:** `src/components/atoms/FavoriteToggle.jsx`
```jsx
const FavoriteToggle = ({ slug }) => {
  const { favorites, toggleFavorite } = useFavorites();
  const isFavorite = favorites.includes(slug);
  
  return (
    <button
      className={`${styles.favoriteButton} ${isFavorite ? styles.favorited : ""}`}
      onClick={handleToggle}
      aria-label={ariaLabel}
      tabIndex={0}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.heartIcon}>
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
};
```

**Styling:** `src/components/atoms/FavoriteToggle.module.css`
```css
.favoriteButton {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  color: #666;
  transition: all 0.35s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: scale(1);
}

.favoriteButton:hover,
.favoriteButton:focus {
  background: rgba(0, 0, 0, 0.05);
  color: #e53e3e;
  transform: scale(1.1);
  animation: pulse 0.6s ease-in-out;
}

.favoriteButton.favorited {
  color: #e53e3e;
}

.favoriteButton.favorited:hover,
.favoriteButton.favorited:focus {
  color: #c53030;
  transform: scale(1.1);
  animation: pulse 0.6s ease-in-out;
}

@keyframes pulse {
  0% { transform: scale(1.1); }
  50% { transform: scale(1.15); }
  100% { transform: scale(1.1); }
}
```

---

## 🏗️ Grid Layout

### Home Page Grid Container
**File:** `src/pages/Home.module.css`
```css
.grid {
  flex: 1;
  width: 100%;
  margin: 0 auto;
  box-sizing: border-box;
  padding-top: 1rem;
  padding-bottom: 0.5rem;
  min-height: 70vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}

@media (min-width: 900px) {
  .grid {
    max-width: 1200px;
  }
}
```

### Cards Grid
```css
.cardsGrid {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  width: 100%;
  margin: 0 auto;
  justify-content: center;
  padding: 1rem 0.5rem;
}

@media (min-width: 900px) {
  .cardsGrid {
    max-width: 1100px;
  }
}

/* Progressive enhancement for CSS Grid */
@supports (display: grid) {
  .cardsGrid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    justify-items: center;
  }
}
```

### Responsive Grid Breakpoints
```css
@media (max-width: 1100px) {
  .cardsGrid {
    max-width: 900px;
    gap: 1.5rem;
    padding: 0.75rem 0.5rem;
  }
  
  @supports (display: grid) {
    .cardsGrid {
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    }
  }
}

@media (max-width: 768px) {
  .cardsGrid {
    max-width: 600px;
    gap: 1.2rem;
    padding: 0.6rem 0.5rem;
  }
  
  @supports (display: grid) {
    .cardsGrid {
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    }
  }
}

@media (max-width: 480px) {
  .cardsGrid {
    max-width: 400px;
    gap: 1rem;
    padding: 0.5rem 0.25rem;
  }
  
  @supports (display: grid) {
    .cardsGrid {
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    }
  }
}
```

---

## 🎨 CSS Variables

**File:** `src/styles/variables.css`
```css
:root {
  /* Brand Colors */
  --brand-blue: #2563eb;
  --brand-blue-light: #dbeafe;
  --brand-yellow: #f59e0b;
  --brand-yellow-light: #fef3c7;
  --brand-purple: #7c3aed;
  --brand-purple-light: #ede9fe;

  /* Layout */
  --header-height: 64px;
  --category-strip-height: 56px;
  --footer-height: 56px;

  /* Text Colors */
  --text-dark: #1f2937;
  --text-light: #ffffff;
}
```

---

## 🔧 Troubleshooting

### Common Issues and Solutions

#### 1. Cards Not Aligning Properly
**Problem:** Cards appear misaligned or have inconsistent spacing
**Solution:** Check that the grid container has proper CSS Grid support and fallback:
```css
.cardsGrid {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
}

@supports (display: grid) {
  .cardsGrid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }
}
```

#### 2. Hover Effects Not Working
**Problem:** Cards don't scale or show shadow on hover
**Solution:** Ensure transition and transform properties are set:
```css
.card {
  transition: all 0.35s ease;
  transform: scale(1);
}

.card:hover,
.card:focus-within {
  transform: scale(1.02);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}
```

#### 3. Game-Specific Backgrounds Not Applied
**Problem:** Individual game cards don't show their unique backgrounds
**Solution:** Verify the CSS class is applied correctly:
```jsx
<article className={`${styles.card} ${styles[slug] || ''}`}>
```

#### 4. Responsive Issues
**Problem:** Cards don't adapt properly on mobile devices
**Solution:** Check responsive breakpoints and min-heights:
```css
@media (max-width: 768px) {
  .card {
    min-height: 130px;
  }
}
```

#### 5. Badge Positioning Issues
**Problem:** New/Featured badges overlap or are positioned incorrectly
**Solution:** Ensure absolute positioning with proper z-index:
```css
/* In GameCard.jsx inline styles */
<div style={{
  position: "absolute",
  top: 8,
  left: 8,
  display: "flex",
  gap: 4,
  zIndex: 3,
}}>
```

#### 6. Favorite Button Not Visible
**Problem:** Heart icon doesn't appear or is positioned incorrectly
**Solution:** Check positioning and z-index:
```css
/* In GameCard.jsx inline styles */
<div style={{
  position: "absolute",
  top: 8,
  right: 8,
  zIndex: 3,
}}>
```

---

## 📝 Quick Reference

### Essential Files
- `src/components/GameCard.jsx` - Main component
- `src/components/GameCard.module.css` - Main styling
- `src/components/atoms/GameTitle.jsx` - Title component
- `src/components/atoms/PlayNowButton.jsx` - Button component
- `src/components/atoms/Badge.jsx` - Badge component
- `src/components/atoms/FavoriteToggle.jsx` - Favorite toggle
- `src/pages/Home.module.css` - Grid layout
- `src/styles/variables.css` - CSS variables

### Key CSS Classes
- `.card` - Base card styling
- `.card.[game-slug]` - Game-specific backgrounds
- `.iconContainer` - Icon wrapper
- `.gameIcon` - Game icon styling
- `.description` - Description text
- `.title` - Game title (in GameTitle component)
- `.button` - Play Now button (in PlayNowButton component)
- `.badge` - Badge styling
- `.favoriteButton` - Favorite toggle button

### Responsive Breakpoints
- **Desktop (≥ 900px)**: Full grid layout
- **Tablet (768px - 1100px)**: Adjusted spacing
- **Mobile (≤ 768px)**: Compact layout
- **Small Mobile (≤ 480px)**: Single column

---

*Last updated: [Current Date]*
*Version: 1.0* 