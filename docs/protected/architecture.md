<!-- 
PROTECTED FILE - DO NOT MODIFY
This file is used as a reference for:
- Game Hub layout and architecture guide
- Layout philosophy and structure
- CSS class specifications and usage
- Best practices for layout implementation

TO UPDATE THIS FILE:
1. Create backup: cp architecture.md docs/backups/architecture.md.[date]
2. Remove protection temporarily if needed
3. Make changes and test thoroughly
4. Update this header with change details
5. Commit with clear message explaining the update

Last Updated: 2024-01-15
Last Updated By: Assistant
Reason: Added protection disclaimer
-->

# Game Hub – Layout & Architecture Guide

## Layout Philosophy
- **Full-bleed backgrounds:** Header, category strip, and footer backgrounds stretch edge-to-edge (100vw).
- **Centered content:** Main content and footer content are centered using the `.container` class (max-width: 1200px, margin: 0 auto).
- **Consistent alignment:** All major sections (header, category strip, main content, footer) are visually aligned for a unified look.
- **No top section on game pages:** Game pages do not display a title, 'Now Playing', or back link for a cleaner experience.

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

## Formatting & Linting
- ESLint and Prettier are set up with standard recommended settings (no custom rules, no enforced semicolon or quote style).
- Use format-on-save in Cursor/VSCode for consistent code style.
- See `.eslintrc`, `.prettierrc`, and `.editorconfig` for details.

## Daily Mode & Game Scaffolding
- Daily mode is supported for select games with deterministic seeding and localStorage streak tracking.
- Use `scripts/scaffold-game.cjs` to scaffold new games with the correct folder structure and template.

## Best Practices
- Only use `.container` for centering and max-width. Do not duplicate these rules elsewhere.
- Keep layout logic in `LayoutWrapper`, `Header`, `Footer`, and `CategoryStrip` components.
- Document any layout changes in this file and update screenshots as needed.
- Use the scaffolding script for new games to ensure consistency.

## Visual Reference
- See `/docs/screenshots/layout-stable.png` for the correct layout appearance.

## Versioning
- Tag stable layout releases in git (e.g., `v1.0-layout-stable`).

---
_Last updated: 2024-06-09_ 