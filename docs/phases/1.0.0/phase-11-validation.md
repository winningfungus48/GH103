# Phase 11 Validation – State Management & Persistence Foundation

**Goal:** Confirm that global state and persistence are scalable and structured for future systems.

---

## ✅ Validation Checklist

### Favorites & Recently Played Refactor
- [ ] Favorites still toggle correctly after refactor
- [ ] Recently Played tracking works and preserves existing history
- [ ] No duplicate entries or unexpected overwrites in localStorage
- [ ] All component access is via helpers only (no direct array manipulation)
- [ ] isFavorite, addRecentlyPlayed, isRecentlyPlayed helpers work as expected

### Context Provider Updates
- [ ] FavoritesProvider remains functional after refactor
- [ ] Context scaffolding for future providers (files only) does not break current functionality

### Structured LocalStorage Schema
- [ ] Keys follow the new naming convention (`gh_` prefix)
- [ ] Versioning key (`gh_schemaVersion`) is stored as a simple string and retrievable without breaking older data
- [ ] Centralized migration logic is present and runs only on app load
- [ ] Helpers encapsulate fallback for old keys until 2.0.0
- [ ] Safe migration logic for pre-existing keys is confirmed (only runs if new keys are missing; clears old keys on failure)

### Safe Concurrency Guards
- [ ] Timestamp-based concurrency guard is present for favorites and recently played
- [ ] No data loss or crashes in multi-tab scenarios (last write wins)

---

## 🧪 Edge Cases & Testing
- [ ] App compiles and runs successfully after refactor
- [ ] No console warnings or errors related to localStorage or context
- [ ] Clearing localStorage does not crash the app
- [ ] Rapid toggling of favorites does not create duplicates or errors
- [ ] Multiple tabs open: no duplicate migration or crashes
- [ ] Manual validation performed on latest Chrome desktop + one mobile browser
- [ ] Validation results documented in `phase-11-validation-results.md`

---

## 🕒 Concurrency Tests
- [ ] Multi-tab: Rapidly toggle favorites in two tabs – last write wins, no data loss
- [ ] Multi-tab: Add/remove recently played in two tabs – last write wins, no data loss
- [ ] Simulate localStorage clearing mid-session – app recovers gracefully, no crashes

---

## ✅ Sign-Off
- [ ] All checklist items verified and approved before moving to Phase 12
