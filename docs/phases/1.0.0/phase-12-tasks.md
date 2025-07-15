# Phase 12 Tasks – Modular Game System & Templates

**Goal:** Establish reusable systems for future games, reducing duplicate logic.

---

## ✅ Task Checklist

### **12.1 – Game Lifecycle Hooks**
- [ ] Create shared hooks (`useGameState`, `useGameCompletion`) for managing in-progress state, completion checks, and reset logic

### **12.2 – Templating Structure**
- [ ] Introduce a basic template format for puzzle/logic games (Wordle-like)
- [ ] Provide clear props and lifecycle (`initialState`, `isComplete`, `getFeedback`)

### **12.3 – Game Refactors**
- [ ] Refactor existing games (e.g., Numberle) to use the new templating system

---

## 📝 Notes
- Focus on simplicity and reusability; templates should require minimal setup for new games
- Refactors should not change gameplay behavior, only how logic is structured
