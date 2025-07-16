# Phase 11 Tasks – State Management & Persistence Foundation

**Goal:** Strengthen global state and persistence to make adding future systems easier.

---

## ✅ Task Checklist

### **11.1 – Favorites & Recently Played Refactor**
- [ ] Rewrite with scalable structure (future support for multiplayer and daily stats)
- [ ] Deduplicate logic and ensure clear data shape in localStorage
- [ ] All component access via helpers only (no direct array manipulation)
- [ ] Add isFavorite(slug), addRecentlyPlayed(slug), isRecentlyPlayed(slug) helpers

### **11.2 – Context Provider Updates**
- [ ] Review and refactor `FavoritesProvider` and related contexts for long-term scalability
- [ ] Add placeholders for future providers (e.g., `PlayerContext`, `DailyContext`) as files only

### **11.3 – Structured LocalStorage Schema**
- [ ] Introduce namespacing convention (`gh_favorites`, `gh_recentlyPlayed`)
- [ ] Add versioning key (`gh_schemaVersion`) for schema migration
- [ ] Centralize migration logic in localStorage.js (`getSchemaVersion()`, internal `migrateSchema()`)
- [ ] Migration runs only on app load; new keys always take precedence
- [ ] Helpers encapsulate fallback for old keys until 2.0.0

### **11.4 – Safe Concurrency Guards**
- [ ] Add timestamp-based concurrency guard for favorites and recently played writes
- [ ] Test multi-tab scenarios (last write wins, no crashes)

---

## 📝 Notes
- Use a flat array of slugs for favorites and recently played; no extra metadata required for 1.0.0.
- Migration logic only runs if new keys are missing. On failure (corrupted data), clear old keys and initialize new keys cleanly.
- Add empty provider scaffolds (with default values and comments) for future use in `src/context/`, clearly labeled.
- Keep fallback logic for old keys until Release 2.0.0; plan to remove in the expansion track.
- Manual validation: test on latest Chrome desktop + one mobile browser; document results in `phase-11-validation-results.md`.
- Edge cases to test: rapid toggling of favorites, multiple tabs open (no duplicate migration or crashes), clearing localStorage mid-session should not crash the app.
- Concurrency guard: last write wins, no data loss or crashes.
