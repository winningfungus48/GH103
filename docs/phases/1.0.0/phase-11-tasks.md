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
- Ensure backward compatibility with existing favorites/recently played data
- Test persistence thoroughly after schema changes
