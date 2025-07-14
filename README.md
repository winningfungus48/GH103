# Game Hub

A modern, responsive web app for playing and discovering puzzle and logic games.

## Features
- Full-bleed header, category strip, and footer for a unified look
- Centered, max-width main content for readability
- Responsive design for desktop and mobile
- Modular React components and CSS modules

## Layout & Styling
- The layout is designed for visual consistency and easy maintenance.
- **Header, category strip, and footer backgrounds** stretch edge-to-edge (100vw).
- **Main content and footer content** are centered using the `.container` class (max-width: 1200px).
- All layout variables are in `src/styles/variables.css`.

See [`docs/architecture.md`](docs/architecture.md) for full details and best practices.

## Key Files
- `src/components/layout/LayoutWrapper.jsx` – Main layout logic
- `src/styles/layout.module.css` – Layout utility classes
- `src/styles/variables.css` – Color and layout variables
- `src/components/layout/Footer.jsx` – Footer with centered links

## Best Practices
- Use the `.container` class for centering and max-width only.
- Keep layout logic in layout components, not in individual pages.
- Update the architecture doc and take a screenshot after major layout changes.

## Contributing
- Please read the architecture doc before making layout changes.
- Tag stable layout releases in git (e.g., `v1.0-layout-stable`).

---
_Last updated: 2024-06-09_
