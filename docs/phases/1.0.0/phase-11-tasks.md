# Phase 11 Tasks – State Management & Persistence Foundation

**Goal:** Strengthen global state and persistence to make adding future systems easier.

---

## ✅ Task Checklist

### **11.1 – Favorites & Recently Played Refactor**
- [ ] Rewrite with scalable structure (future support for multiplayer and daily stats)
- [ ] Deduplicate logic and ensure clear data shape in localStorage

### **11.2 – Context Provider Updates**
- [ ] Review and refactor `FavoritesProvider` and related contexts for long-term scalability
- [ ] Add placeholders for future providers (e.g., `PlayerContext`, `DailyContext`)

### **11.3 – Structured LocalStorage Schema**
- [ ] Introduce namespacing convention (`gh_favorites`, `gh_recentlyPlayed`)
- [ ] Add versioning key to prepare for schema migration in future releases

---

## 📝 Notes
- Use a flat array of slugs for favorites and recently played; no extra metadata required for 1.0.0.
- Run migration logic only if new keys are missing. On failure (corrupted data), clear old keys and initialize new keys cleanly.
- Use `gh_schemaVersion` as a simple string (e.g., "1.0.0") for versioning.
- Add empty provider scaffolds (with default values and comments) for future use in `src/context/`, clearly labeled.
- Keep fallback logic for old keys until Release 2.0.0; plan to remove in the expansion track.
- Manual validation: test on latest Chrome desktop + one mobile browser; document results in `phase-11-validation-results.md`.
- Edge cases to test: rapid toggling of favorites, multiple tabs open (no duplicate migration or crashes), clearing localStorage mid-session should not crash the app.
