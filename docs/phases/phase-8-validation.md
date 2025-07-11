# ✅ Phase 8 Final Validation Checklist

This checklist confirms that all layout, scroll behavior, favorites logic, and modular UI features are complete and tested before moving on to Phase 9.

---

## 🔄 1. Scroll-Triggered Footer Behavior
- [ ] Footer only appears when scrolling to bottom
- [ ] On short pages, it still appears (fallback logic works)
- [ ] On long pages, it animates in without shifting layout
- [ ] On game pages (`/game/:slug`), the footer is not constrained

---

## 🆙 2. Back to Top Button Behavior
- [ ] Appears only after 500px scroll
- [ ] Smoothly scrolls the page up when clicked
- [ ] Does not overlap or interfere with footer or other components
- [ ] Is hidden properly without rendering a ghost (white box)

---

## 🏷️ 3. Category Filtering and Favorites
- [ ] Category slugs now come from `{ label, slug }` structure — no casing bugs
- [ ] Switching tabs updates the visible games correctly
- [ ] Favoriting/unfavoriting updates the Favorites tab without affecting other tabs
- [ ] A-Z tab renders all games alphabetically

---

## 📐 4. Layout Consistency (All Pages)
- [ ] Header, footer, and grid content are aligned horizontally
- [ ] `.container` is only used for main content (not header/footer)
- [ ] No extra padding/margins on the page edges
- [ ] No layout jump when switching tabs or scrolling

---

## 🌗 5. Theme + Footer Props (Scaffold Check)
- [ ] `ThemeProvider` mounts and sets `data-theme="light"` on `<html>`
- [ ] `Footer` accepts and responds to `theme="purple"` (can test others if added)

---

## 📊 6. trackEvent() Utility
- [ ] Call `trackEvent("view_game", { slug: "numberle" })` manually on a game route
- [ ] Check that it logs to the console without error
- [ ] No analytics logic is prematurely active

---

## 🧪 7. Cross-Device + Mobile
- [ ] Footer still animates properly on mobile
- [ ] BackToTop button is tappable
- [ ] Game grid scales correctly on mobile
- [ ] No layout overflow or scrollbars appear unexpectedly

---
