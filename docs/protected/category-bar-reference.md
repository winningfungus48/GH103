# Category Bar System Reference

## Overview

The Category Bar is a responsive navigation component that provides category-based filtering for the Game Hub application. It features a fixed orange bar with centered category buttons and a smart hamburger menu for overflow categories.

## Architecture

### Core Components

- **CategoryStrip.jsx**: Main component handling category display and interaction
- **CategoryStrip.module.css**: Styling and responsive behavior
- **CategoryContext.jsx**: Global state management for active category
- **Header.jsx**: Integration with site header and mobile navigation

### File Structure

```
src/
├── components/
│   ├── CategoryStrip.jsx          # Main category bar component
│   ├── CategoryStrip.module.css   # Category bar styling
│   └── Header.jsx                 # Header with category integration
├── context/
│   └── CategoryContext.jsx        # Category state management
└── utils/
    └── localStorage.js            # Category persistence
```

## Category Configuration

### Available Categories

```javascript
const tabs = [
  { label: "A-Z Games", slug: "a-z games" },
  { label: "Daily Games", slug: "daily games" },
  { label: "Featured", slug: "featured" },
  { label: "Favorites", slug: "favorites" },
  { label: "New", slug: "new" },
  { label: "Recently Played", slug: "recently played" },
  { label: "Sports", slug: "Sports" },
  { label: "-le Games", slug: "-le games" },
];
```

### Category Ordering

- **A-Z Games**: Always first (fixed position)
- **Remaining categories**: Sorted alphabetically
- **Hamburger menu**: Always visible on the right

## Functionality

### Responsive Behavior

1. **Large Screens**: All categories visible, centered
2. **Medium Screens**: Some categories hidden, hamburger appears
3. **Small Screens**: Only "A-Z Games" + hamburger visible

### Smart Positioning

- **Dynamic width calculation**: Determines visible vs hidden categories
- **Scrollbar-aware positioning**: Automatically adjusts for scrollbar overlap
- **Real-time updates**: Responds to window resize and content changes

### Hamburger Menu

- **Always visible**: Fixed on the right side of the category bar
- **Overflow handling**: Shows categories that don't fit in the main bar
- **Smart positioning**: Dropdown positioned to avoid scrollbar overlap
- **Category swapping**: Selected category moves to main bar, last visible moves to dropdown

## Technical Implementation

### State Management

```javascript
const [visibleTabs, setVisibleTabs] = useState([]);
const [hiddenTabs, setHiddenTabs] = useState([]);
const [isDropdownOpen, setIsDropdownOpen] = useState(false);
const [dropdownPosition, setDropdownPosition] = useState({ right: 20 });
```

### Key Functions

#### Width Calculation
```javascript
const calculateVisibleTabs = () => {
  // Always start with A-Z Games
  const visible = [sortedTabs[0]];
  const hidden = [];
  
  // Calculate available width and fit categories
  let currentWidth = tabsRef.current[0]?.offsetWidth || 120;
  const hamburgerWidth = 60;
  const gap = 16;
  
  // Add categories that fit
  for (let i = 1; i < sortedTabs.length; i++) {
    const tabWidth = tabsRef.current[i]?.offsetWidth || 120;
    const totalWidth = currentWidth + gap + tabWidth + gap + hamburgerWidth;
    
    if (totalWidth <= containerWidth) {
      visible.push(sortedTabs[i]);
      currentWidth += gap + tabWidth;
    } else {
      hidden.push(sortedTabs[i]);
    }
  }
};
```

#### Scrollbar Detection
```javascript
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
```

#### Dynamic Positioning
```javascript
const updateDropdownPosition = () => {
  const scrollbarWidth = calculateScrollbarWidth();
  const hasScrollbar = document.documentElement.scrollHeight > document.documentElement.clientHeight;
  
  let rightPosition = 20;
  
  if (hasScrollbar && scrollbarWidth > 0) {
    rightPosition = Math.max(20, scrollbarWidth + 10);
  }
  
  if (window.innerWidth <= 768) {
    rightPosition = Math.max(15, rightPosition - 5);
  }
  
  setDropdownPosition({ right: rightPosition });
};
```

## Styling Reference

### CSS Variables

```css
:root {
  --brand-yellow: #f59e0b;        /* Orange background */
  --brand-blue: #2563eb;          /* Active button background */
  --brand-blue-light: #dbeafe;    /* Hover state background */
  --text-dark: #1f2937;           /* Button text color */
  --text-light: #ffffff;          /* Active button text */
  --header-height: 64px;          /* Header height */
  --category-strip-height: 56px;  /* Category bar height */
}
```

### Component Classes

#### Category Strip
```css
.categoryStrip {
  position: fixed;
  top: var(--header-height);
  background: var(--brand-yellow);
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 900;
}
```

#### Category Buttons
```css
.tab {
  background: #e3f0ff;
  color: #1857c9;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  transition: none;
}

.tab:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.tab.active {
  background: var(--brand-blue);
  color: var(--text-light);
  font-weight: bold;
}
```

#### Hamburger Menu
```css
.hamburgerButton {
  background: #e3f0ff;
  color: #1857c9;
  border-radius: 8px;
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.hamburgerIcon {
  width: 16px;
  height: 2px;
  background: currentColor;
  border-radius: 1px;
}
```

#### Dropdown
```css
.dropdown {
  position: fixed;
  top: calc(var(--header-height) + var(--category-strip-height) + 10px);
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  padding: 0.75rem;
  min-width: 220px;
  z-index: 1001;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.dropdownItem {
  background: none;
  color: var(--text-dark);
  padding: 0.875rem 1rem;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.dropdownItem:hover {
  background: var(--brand-blue-light);
  color: var(--brand-blue);
  transform: translateY(-1px);
}

.dropdownItem.active {
  background: var(--brand-blue);
  color: var(--text-light);
  font-weight: 600;
}
```

## Responsive Breakpoints

### Mobile (≤768px)
- Reduced padding and font sizes
- Closer positioning to screen edges
- Optimized touch targets

### Tablet (769px - 1024px)
- Standard sizing with some adjustments
- Balanced visibility and accessibility

### Desktop (>1024px)
- Full feature set
- Maximum category visibility
- Optimal spacing and sizing

## Integration Points

### Landing Page
- CategoryStrip integrated directly into LandingPage component
- Handles filtering between modular layout and category-specific grids
- Resets to modular layout when navigating via "Game Hub" title

### Header Component
- Links "Game Hub" title to landing page
- Includes category navigation for mobile sliding panel
- Maintains category state across navigation

### Game Filtering
- Categories filter games based on:
  - **A-Z Games**: All games sorted alphabetically
  - **Featured**: Most played games (based on localStorage play counts)
  - **New**: Recently added games (within 30 days)
  - **Recently Played**: Last 10 played games
  - **Favorites**: User-favorited games
  - **Sports**: Sports-related games
  - **-le Games**: Wordle-style games
  - **Daily Games**: Daily challenge games

## Performance Considerations

### Optimization Strategies
- **ResizeObserver**: Efficiently tracks container size changes
- **useCallback**: Prevents unnecessary re-renders
- **useMemo**: Caches sorted category arrays
- **Event cleanup**: Properly removes event listeners

### Memory Management
- **Ref cleanup**: Disconnects ResizeObserver on unmount
- **Event listener cleanup**: Removes window event listeners
- **State optimization**: Minimal state updates

## Accessibility Features

### ARIA Attributes
```javascript
aria-label="Game categories"
aria-current={activeCategory === tab.slug ? "page" : undefined}
aria-label={`${tab.label} games`}
aria-expanded={isDropdownOpen}
```

### Keyboard Navigation
- **Tab navigation**: All buttons are keyboard accessible
- **Enter/Space**: Activates category selection
- **Focus management**: Proper focus indicators and states

### Screen Reader Support
- **Semantic HTML**: Proper button and navigation elements
- **Descriptive labels**: Clear category descriptions
- **State announcements**: Dynamic content updates

## Maintenance Guidelines

### Adding New Categories

1. **Update tabs array** in CategoryStrip.jsx:
```javascript
const tabs = [
  // ... existing categories
  { label: "New Category", slug: "new-category" },
];
```

2. **Add category logic** in LandingPage.jsx for filtering
3. **Update game data** to include new category tags
4. **Test responsive behavior** across all screen sizes

### Modifying Styling

1. **Update CSS variables** in variables.css for global changes
2. **Modify component classes** in CategoryStrip.module.css for specific styling
3. **Test across breakpoints** to ensure consistency
4. **Verify accessibility** with screen readers and keyboard navigation

### Troubleshooting

#### Common Issues

1. **Categories not showing**: Check width calculation logic
2. **Hamburger not appearing**: Verify hiddenTabs array has content
3. **Positioning issues**: Check scrollbar detection and responsive breakpoints
4. **Styling inconsistencies**: Verify CSS variable definitions

#### Debug Steps

1. **Console logging**: Check for JavaScript errors
2. **Element inspection**: Verify DOM structure and CSS application
3. **Responsive testing**: Test across different screen sizes
4. **Browser compatibility**: Test in different browsers

## Future Enhancements

### Potential Improvements
- **Category icons**: Add visual indicators for each category
- **Custom ordering**: Allow user-defined category order
- **Category descriptions**: Tooltips or expanded descriptions
- **Animation enhancements**: More sophisticated transitions
- **Search functionality**: Category search within dropdown

### Performance Optimizations
- **Virtual scrolling**: For large category lists
- **Lazy loading**: For category-specific content
- **Caching strategies**: For frequently accessed categories

## Version History

### v1.1.6 (Current)
- Implemented smart scrollbar-aware positioning
- Added responsive hamburger menu
- Enhanced accessibility features
- Improved performance with ResizeObserver
- Added comprehensive error handling

### v1.1.5
- Initial category bar implementation
- Basic responsive behavior
- Category filtering functionality

---

**Last Updated**: December 2024  
**Maintainer**: Development Team  
**Status**: Production Ready 