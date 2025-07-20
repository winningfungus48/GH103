# Game Hub – Partner Game Migration Checklist (1.1.4)
**Purpose:** Ensure partner games can be integrated smoothly, consistently, and with minimal rework.  
**Phase:** 1.1.4 – Partner Game Migration Infrastructure Prep  

---

## ✅ 1. Pre-Migration Preparation

### **1.1 Code & Standards Documentation**
- [ ] Create **Contributor Guide** detailing:
  - Folder structure (`/src/games/[slug]/`)
  - Component & file naming conventions
  - CSS Modules best practices
  - Commit message format (following GH standards)

### **1.2 Shared Component Library**
- [ ] Confirm partner games can reuse:
  - `<Modal />`, `<Toast />`, `<GameWrapper />`
  - Standardized hooks (`useGameState`, `useGameCompletion`)
  - Atomic UI components (buttons, toggles, titles)
- [ ] Provide usage examples for partners.

### **1.3 Migration Pipeline Testing**
- [ ] Use **1–2 placeholder games** to simulate partner migration.
- [ ] Document any pipeline issues or missing utilities.

---

## ✅ 2. Game Submission Requirements

### **2.1 Folder & File Requirements**
- [ ] Each game must reside in `/src/games/[game-slug]/`
- [ ] Include:
  - `index.jsx` (default export for the game)
  - `[game-name].module.css` (scoped styles)
  - Additional helper files only if necessary.

### **2.2 gamesData.js Entry**
- [ ] Each new game requires:
  - `name` (human-readable title)
  - `slug` (unique, lowercase identifier)
  - `description`
  - `categories` (array of valid categories)
  - `component` (import from game folder)
  - `metaDescription`, `keywords`, `previewImage`

### **2.3 Responsive & Accessibility Standards**
- [ ] Games must:
  - Scale properly for **desktop, tablet, and mobile**
  - Support **keyboard navigation** (tab, enter, space)
  - Use ARIA labels for custom controls

---

## ✅ 3. Testing & Validation

### **3.1 Functional Testing**
- [ ] Test playability across devices and browsers
- [ ] Validate routing (`/game/:slug`) works correctly

### **3.2 UI/UX Consistency Audit**
- [ ] Confirm alignment with GH design system:
  - Fonts, colors, and spacing
  - Consistent button & card styles

### **3.3 Performance Checks**
- [ ] Ensure games load without excessive delays
- [ ] Validate lazy loading where possible

---

## ✅ 4. Post-Migration Actions
- [ ] Update `/docs/phases/` with migration notes
- [ ] Add partner credits if applicable
- [ ] Perform final regression testing

---

## ✅ 5. Deliverables for 1.1.4
- Completed **Partner Game Migration Checklist**
- Contributor Guide saved in `/docs/maps/`
- Test results from placeholder migrations
