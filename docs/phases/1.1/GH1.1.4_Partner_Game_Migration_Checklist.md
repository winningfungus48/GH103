# Game Hub – Partner Game Migration Checklist (1.1.4)
**Purpose:** Ensure partner games can be integrated smoothly, consistently, and with minimal rework.  
**Phase:** 1.1.4 – Partner Game Migration Infrastructure Prep  
**Version:** 1.0

---

## ✅ 1. Pre-Migration Preparation

### **1.1 Code & Standards Documentation**
- [x] Create **Contributor Guide** detailing:
  - Folder structure (`/src/games/[slug]/`)
  - Component & file naming conventions
  - CSS Modules best practices
  - Commit message format (following GH standards)
- [ ] Document React 18 + Vite compatibility requirements
- [ ] Define TypeScript guidelines (if applicable)
- [ ] Create ESLint/Prettier configuration standards

### **1.2 Shared Component Library**
- [x] Confirm partner games can reuse:
  - `<Modal />`, `<Toast />`, `<GameWrapper />`
  - Standardized hooks (`useGameState`, `useGameCompletion`)
  - Atomic UI components (buttons, toggles, titles)
- [ ] Provide usage examples for partners
- [ ] Document component API and props
- [ ] Create component testing guidelines

### **1.3 Migration Pipeline Testing**
- [ ] Use **1–2 placeholder games** to simulate partner migration
- [ ] Document any pipeline issues or missing utilities
- [ ] Test build process and optimization
- [ ] Validate lazy loading implementation

---

## ✅ 2. Game Submission Requirements

### **2.1 Folder & File Requirements**
- [x] Each game must reside in `/src/games/[game-slug]/`
- [x] Include:
  - `index.jsx` (default export for the game)
  - `[game-name].module.css` (scoped styles)
  - Additional helper files only if necessary
- [ ] Maximum file size limits (CSS: 50KB, JS: 100KB per game)
- [ ] Asset optimization requirements (images, sounds, etc.)
- [ ] No external dependencies without approval

### **2.2 gamesData.js Entry**
- [x] Each new game requires:
  - `name` (human-readable title)
  - `slug` (unique, lowercase identifier)
  - `description` (max 200 characters)
  - `categories` (array of valid categories)
  - `component` (import from game folder)
  - `metaDescription`, `keywords`, `previewImage`
- [ ] Optional fields:
  - `supportsDaily` (boolean for daily game support)
  - `dailySettings` (object with seed source and difficulty)
  - `difficulty` (easy, medium, hard)
  - `estimatedPlayTime` (in minutes)

### **2.3 Responsive & Accessibility Standards**
- [x] Games must:
  - Scale properly for **desktop, tablet, and mobile**
  - Support **keyboard navigation** (tab, enter, space)
  - Use ARIA labels for custom controls
- [ ] Performance requirements:
  - Load time < 3 seconds on 3G connection
  - Memory usage < 100MB
  - Smooth 60fps animations
- [ ] Accessibility requirements:
  - WCAG 2.1 AA compliance
  - Color contrast ratio 4.5:1 minimum
  - Screen reader compatibility
  - Focus indicators visible

---

## ✅ 3. Testing & Validation

### **3.1 Functional Testing**
- [x] Test playability across devices and browsers
- [x] Validate routing (`/game/:slug`) works correctly
- [ ] Test game state persistence (if applicable)
- [ ] Validate integration with favorites system
- [ ] Test recently played tracking
- [ ] Verify category filtering works correctly

### **3.2 UI/UX Consistency Audit**
- [x] Confirm alignment with GH design system:
  - Fonts, colors, and spacing
  - Consistent button & card styles
- [ ] Test responsive breakpoints (320px, 768px, 1024px, 1440px)
- [ ] Validate touch interactions on mobile
- [ ] Check for visual consistency with existing games
- [ ] Test dark/light theme compatibility (if applicable)

### **3.3 Performance Checks**
- [x] Ensure games load without excessive delays
- [x] Validate lazy loading where possible
- [ ] Lighthouse performance score > 90
- [ ] First Contentful Paint < 1.5s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Cumulative Layout Shift < 0.1
- [ ] Memory leak testing (play for 10+ minutes)

---

## ✅ 4. Post-Migration Actions
- [x] Update `/docs/phases/` with migration notes
- [x] Add partner credits if applicable
- [x] Perform final regression testing
- [ ] Update game catalog documentation
- [ ] Add game to appropriate categories
- [ ] Create game-specific documentation
- [ ] Update sitemap and SEO metadata
- [ ] Test analytics integration (if applicable)

---

## ✅ 5. Browser & Device Testing

### **5.1 Desktop Browsers**
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### **5.2 Mobile Browsers**
- [ ] Chrome Mobile (Android)
- [ ] Safari Mobile (iOS)
- [ ] Firefox Mobile (Android)
- [ ] Samsung Internet (Android)

### **5.3 Device Testing**
- [ ] iPhone SE (320px width)
- [ ] iPhone 12/13/14 (375px width)
- [ ] iPad (768px width)
- [ ] Desktop (1024px+ width)

---

## ✅ 6. Security & Compliance

### **6.1 Security Requirements**
- [ ] No external scripts without CSP approval
- [ ] No localStorage for sensitive data
- [ ] Input validation and sanitization
- [ ] XSS prevention measures
- [ ] No eval() or similar dynamic code execution

### **6.2 Privacy Compliance**
- [ ] GDPR compliance for EU users
- [ ] No unnecessary data collection
- [ ] Clear privacy policy compliance
- [ ] Cookie consent integration (if applicable)

---

## ✅ 7. Deliverables for 1.1.4
- [x] Completed **Partner Game Migration Checklist**
- [ ] Contributor Guide saved in `/docs/`
- [ ] Test results from placeholder migrations
- [ ] Coding standards documentation
- [ ] Troubleshooting guide
- [ ] FAQ section
- [ ] Performance benchmarks established
- [ ] Migration pipeline validated
