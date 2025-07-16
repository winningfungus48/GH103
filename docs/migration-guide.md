# Migration & Refactor Guide – Phase 10 (Core Cleanup)

## Linting & Formatting
- Use standard recommended ESLint/Prettier configs (React + recommended settings).
- No custom stylistic rules (no strict semicolon/quotes preferences).
- Remove or overwrite any conflicting `.editorconfig` or other formatting files if they interfere. Prettier + ESLint should be the single source of truth.

## Legacy/Unused Files
- Do not remove any files in this phase. Instead, log unused/legacy files for future review.

## Atomic Design Enforcement
- Place components in the closest appropriate category (`atoms`, `molecules`, `organisms`).
- If a component doesn’t perfectly fit, choose the closest match rather than making a new category.
- Move shared UI elements (modals, toasts, etc.) into the atomic structure if not already there.

## LocalStorage Centralization
- Centralize all current and existing localStorage usage (favorites, recently played, lastCategory, etc.).
- Refactor any direct localStorage calls in games/components to use the new utility.
- No future-feature prep is required yet.

## Error Handling & Fallbacks
- Fail silently for users; dev console warnings are fine.
- No user-facing alerts or messages needed for incognito/offline cases in 1.0.0.
- If localStorage fails, features like favorites/recently played should simply not persist, but the app should continue functioning normally.

## CSS Modules & Naming
- Enforce standard naming:
  - Files: `ComponentName.module.css`
  - Classes: `camelCase` (or `PascalCase` for root container classes if needed).
- Remove unused CSS classes only if you’re certain they are not used anywhere (do not remove “planned” or commented placeholders unless obviously abandoned).

## Manual Validation
- Test on latest Chrome desktop + one mobile browser (Chrome or Safari).
- Document validation results briefly in PR notes or a short markdown file (`phase-10-validation-results.md`).

## No New Features
- Strict refactor only.
- If you spot bugs or UX issues unrelated to the Phase 10 scope, log them for a future phase instead of fixing them now. 