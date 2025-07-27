<!-- 
PROTECTED FILE - DO NOT MODIFY
This file is used as a reference for:
- UI design system and component specifications
- Responsive container standards (900px breakpoint)
- Game card and grid layout specifications
- Layout guidelines and best practices

TO UPDATE THIS FILE:
1. Create backup: cp ui-guidelines.md docs/backups/ui-guidelines.md.[date]
2. Remove protection temporarily if needed
3. Make changes and test thoroughly
4. Update this header with change details
5. Commit with clear message explaining the update

Last Updated: 2024-01-15
Last Updated By: Assistant
Reason: Added protection disclaimer
-->

# UI Guidelines & Component Specifications

This document outlines the design system, component specifications, and layout guidelines for Game Hub.

---

## Responsive Container Standards

### Global Responsive Pattern
All containers in Game Hub follow a consistent responsive pattern:
- **Small screens (< 900px)**: Full width (100%)
- **Large screens (≥ 900px)**: Constrained max-width with centered layout

### Standard Breakpoint
- **Breakpoint**: `900px`
- **Media query**: `@media (min-width: 900px)`
- **Implementation**: Full width by default, max-width applied only on large screens

### Container Specifications by Component

#### App Root (`src/App.css`)
- **Small screens**: Full width
- **Large screens**: `max-width: 1280px`
- **Centering**: `margin: 0 auto`

#### Home Page (`src/pages/Home.module.css`)
- **Grid container**:
  - Small screens: Full width
  - Large screens: `max-width: 1200px`
- **Cards grid**:
  - Small screens: Full width  
  - Large screens: `max-width: 1100px`

#### All Categories Page (`src/pages/AllCategories.module.css`)
- **Grid container**:
  - Small screens: Full width
  - Large screens: `max-width: 900px`

#### Game Containers
- **Memoryle** (`src/games/memoryle/memoryle-styles.module.css`):
  - Small screens: Full width
  - Large screens: `max-width: 1100px`
- **Numberle** (`src/games/numberle/numberle-styles.css`):
  - Small screens: Full width
  - Large screens: `max-width: 500px`

### Implementation Template
```css
.container {
  width: 100%;
  margin: 0 auto;
  /* other styles */
}

@media (min-width: 900px) {
  .container {
    max-width: [appropriate-width]px;
  }
}
```

---

## Game Cards & Grid Layout

### Grid Container Specifications

#### Main Grid Container (`src/pages/Home.module.css`)
- **Small screens**: Full width
- **Large screens**: `max-width: 1200px`
- **Width**: `100%`
- **Margin**: `0 auto` (centered)
- **Padding**: `1rem` top/bottom, no horizontal padding
- **Display**: Flexbox with CSS Grid progressive enhancement

#### Cards Grid Container
- **Small screens**: Full width
- **Large screens**: `max-width: 1100px`
- **Width**: `100%`
- **Margin**: `0 auto` (centered)
- **Padding**: `1rem 0.5rem` (desktop), scales down on smaller screens

### Responsive Grid Behavior

#### CSS Grid Implementation
```css
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

#### Responsive Breakpoints
- **Desktop (default)**: `minmax(250px, 1fr)` - allows 4-5 cards per row
- **Tablet (≤1100px)**: `minmax(220px, 1fr)` - allows 3-4 cards per row
- **Mobile (≤768px)**: `minmax(200px, 1fr)` - allows 2-3 cards per row
- **Small Mobile (≤480px)**: `minmax(280px, 1fr)` - ensures 1 card per row

#### Expected Card Count Per Row
- **Full screen (1200px+)**: 4-5 cards
- **Half screen (600-900px)**: 2-3 cards
- **Mobile (≤480px)**: 1 card
- **No horizontal scrolling** on any screen size

### Game Card Specifications

#### Card Dimensions (`src/components/GameCard.module.css`)
- **Width**: `100%` (flexible, fills available grid space)
- **Min-height**: `180px` (desktop), `160px` (tablet), `140px` (mobile), `120px` (small mobile)
- **Max-width**: `100%` (prevents overflow)
- **Box-sizing**: `border-box` (includes padding in width calculations)

#### Card Styling
- **Background**: White
- **Border-radius**: `12px`
- **Box-shadow**: `0 2px 8px rgba(0, 0, 0, 0.07)`
- **Padding**: `1.5rem 1.25rem 1.25rem 1.25rem`
- **Hover effect**: Scale `1.02` with enhanced shadow `0 8px 24px rgba(0, 0, 0, 0.12)`
- **Transition**: `all 0.35s ease`

#### Card Content Layout
- **Display**: Flexbox column
- **Alignment**: `align-items: flex-start`
- **Overflow**: `hidden` (prevents content overflow)

### Spacing & Gaps

#### Grid Gaps
- **Desktop**: `2rem` (32px)
- **Tablet (≤1100px)**: `1.5rem` (24px)
- **Mobile (≤768px)**: `1.2rem` (19.2px)
- **Small Mobile (≤480px)**: `1rem` (16px)

#### Container Padding
- **Main grid**: `1rem` top/bottom
- **Cards grid**: `1rem 0.5rem` (desktop), scales down on smaller screens

### Layout Container Specifications

#### Global Container (`src/styles/layout.module.css`)
- **Small screens**: Full width
- **Large screens**: `max-width: 1200px`
- **Margin**: `0 auto` (centered)
- **Padding**: `0 1rem` (desktop), `0 0.75rem` (mobile), `0 0.5rem` (small mobile)
- **Width**: `100%`
- **Box-sizing**: `border-box`

**Important**: No fixed left/right margins to allow proper responsive scaling.

### Technical Implementation Notes

#### CSS Grid vs Flexbox Fallback
- **Primary**: CSS Grid with `auto-fit` and `minmax()` for automatic responsive behavior
- **Fallback**: Flexbox with `flex-wrap` for older browsers
- **Progressive enhancement**: Grid features only applied when supported

#### Responsive Design Principles
- **Mobile-first**: Base styles for mobile, enhanced for larger screens
- **Fluid typography**: Scales with viewport size
- **Flexible containers**: Use percentage and viewport units
- **No horizontal overflow**: All content fits within viewport
- **Consistent breakpoint**: Use `900px` for all responsive containers

#### Performance Considerations
- **CSS Grid**: Hardware-accelerated layout
- **Transform animations**: Use `transform` for hover effects (GPU-accelerated)
- **Box-shadow**: Minimal shadow for performance
- **No layout thrashing**: Stable grid structure

### Accessibility Requirements

#### Card Accessibility
- **Focus indicators**: Visible focus states for keyboard navigation
- **ARIA labels**: Proper labeling for screen readers
- **Color contrast**: Meets WCAG AA standards
- **Touch targets**: Minimum 44px touch targets on mobile

#### Grid Accessibility
- **Logical tab order**: Cards tab in reading order
- **Screen reader announcements**: Proper grid role and structure
- **Keyboard navigation**: Full keyboard accessibility

### Browser Support

#### CSS Grid Support
- **Modern browsers**: Full support (Chrome 57+, Firefox 52+, Safari 10.1+)
- **Fallback**: Flexbox layout for older browsers
- **Progressive enhancement**: Grid features only when supported

#### Responsive Features
- **Media queries**: All modern browsers
- **Viewport units**: IE9+ with polyfill
- **Flexbox**: IE10+ with prefixes

### Testing Checklist

#### Responsive Testing
- [ ] Containers use full width on small screens (< 900px)
- [ ] Containers are constrained on large screens (≥ 900px)
- [ ] Cards fit properly on desktop (1200px+)
- [ ] Cards fit properly on tablet (768-1100px)
- [ ] Cards fit properly on mobile (≤480px)
- [ ] No horizontal scrolling on any screen size
- [ ] Proper gaps maintained at all breakpoints
- [ ] Cards don't overflow their containers

#### Interaction Testing
- [ ] Hover effects work on desktop
- [ ] Touch interactions work on mobile
- [ ] Focus states visible for keyboard navigation
- [ ] Cards scale properly on hover
- [ ] No layout shift during interactions

#### Performance Testing
- [ ] Smooth animations (60fps)
- [ ] No layout thrashing during resize
- [ ] Fast rendering on mobile devices
- [ ] Proper memory usage

---

## Component Architecture

### File Structure
```
src/
├── pages/
│   └── Home.module.css          # Grid layout styles
├── components/
│   ├── GameCard.module.css      # Individual card styles
│   └── layout/
│       └── LayoutWrapper.jsx    # Global layout wrapper
└── styles/
    └── layout.module.css        # Global container styles
```

### CSS Module Naming Convention
- **Grid container**: `.grid` (main), `.cardsGrid` (cards)
- **Card component**: `.card`
- **Layout utilities**: `.container`

### Responsive Breakpoints
- **Large screens**: `≥900px` (constrained containers)
- **Small screens**: `<900px` (full width)
- **Desktop**: `>1100px`
- **Tablet**: `768px - 1100px`
- **Mobile**: `480px - 768px`
- **Small Mobile**: `<480px`

---

**Last Updated**: 2025-01-XX
**Version**: 1.1.0 