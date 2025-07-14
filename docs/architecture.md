# Game Hub – Layout & Architecture Guide

## Layout Philosophy
- **Full-bleed backgrounds:** Header, category strip, and footer backgrounds stretch edge-to-edge (100vw).
- **Centered content:** Main content and footer content are centered using the `.container` class (max-width: 1200px, margin: 0 auto).
- **Consistent alignment:** All major sections (header, category strip, main content, footer) are visually aligned for a unified look.

## Key CSS Classes
- `.container`: Constrains content to max-width, centers horizontally, and adds responsive padding.
- `.mainBg`: Applies a full-width white background to the main content area.
- `.footer`: Full-width purple background, with centered content inside a `.container`.
- `.header`, `.categoryStrip`: Full-width backgrounds, content centered via `.container` or flex.

## Layout Structure Example
```jsx
<Header />  // Full-bleed blue background
<CategoryStrip /> // Full-bleed orange background
<main className="mainBg">
  <div className="container">
    {/* Main content/cards here */}
  </div>
</main>
<Footer /> // Full-bleed purple background, centered links
```

## CSS Variables
- All layout variables (colors, max-width, breakpoints) are in `src/styles/variables.css`.

## Best Practices
- Only use `.container` for centering and max-width. Do not duplicate these rules elsewhere.
- Keep layout logic in `LayoutWrapper`, `Header`, `Footer`, and `CategoryStrip` components.
- Document any layout changes in this file and update screenshots as needed.

## Visual Reference
- See `/docs/screenshots/layout-stable.png` for the correct layout appearance.

## Versioning
- Tag stable layout releases in git (e.g., `v1.0-layout-stable`).

---
_Last updated: 2024-06-09_ 