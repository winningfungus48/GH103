# Phase 13 Tasks – UI & UX Consistency Foundation

**Goal:** Create shared, reusable UI patterns to ensure visual consistency and reduce duplicate UI code.

---

## ✅ Task Checklist

### **13.1 – Universal Modal System**
- [ ] Build a generic, controlled-only `<Modal />` component (accepts `open`, `onClose`, `title`, `content`, `buttons`, `children`, `className`, `style`)
- [ ] Modal is accessible by default (ARIA roles, focus trapping, escape-to-close)
- [ ] Only a single modal instance is needed for 1.0.0 (no stacking)

### **13.2 – Toast & Notifications Refinement**
- [ ] Standardize Toast system with provider pattern and queue-based stacking
- [ ] Support basic types (`success`, `error`, `info`) with minimal color/icon differentiation
- [ ] Provide `className` and `style` props for custom overrides
- [ ] Ensure consistent placement, animation, and ARIA support for accessibility

### **13.3 – Performance & Lazy Loading Review**
- [ ] Use `React.lazy` + `Suspense` for game pages and heavy components only
- [ ] Use dynamic imports in `gamesData.js` for per-game code splitting
- [ ] Remove duplicate imports and unused chunks

### **13.4 – Documentation & Guidelines**
- [ ] Add inline usage examples for modal and toast in code
- [ ] Create `docs/ui-guidelines.md` with high-level best practices, code snippets, and a contributor checklist (ARIA roles, focus trapping, keyboard nav)

---

## 📝 Notes
- Modal and toast should not contain any game-specific logic; UI only
- Default styles with optional overrides; no theme/variant prop for now
- Manual accessibility testing with keyboard navigation and Chrome DevTools accessibility tree
- No need for external accessibility tools or modal stacking in 1.0.0
