# Phase 10 Tasks – Core Refactors & Best Practices

**Goal:** Standardize and clean the existing codebase to align with best practices and ensure maintainability.

---

## ✅ Task Checklist

### **10.1 – Code Health & Linting**
- [ ] Finalize Prettier + ESLint rules for consistency
- [ ] Remove unused or legacy files
- [ ] Enforce atomic design principles across components

### **10.2 – LocalStorage & Utilities Audit**
- [ ] Consolidate all localStorage logic into a single `localStorage.js` namespace
- [ ] Add robust error handling and safe fallbacks for incognito/offline modes

### **10.3 – Folder & Component Audit**
- [ ] Ensure all components follow consistent folder naming (`atoms/`, `molecules/`, `organisms/`)
- [ ] Standardize CSS Modules (naming conventions, remove unused classes)

---

## 📝 Notes
- Focus strictly on refactoring and consistency; **no new gameplay features introduced in this phase**.
- Ensure changes do not break current functionality; test thoroughly after each refactor.
- Use standard recommended ESLint/Prettier configs (React + recommended settings). No custom stylistic rules. Remove or overwrite any conflicting `.editorconfig` or other formatting files if they interfere.
- Do not remove any files in this phase. Instead, log unused/legacy files for future review.
- Place components in the closest appropriate category (`atoms`, `molecules`, `organisms`). Move shared UI elements (modals, toasts, etc.) into the atomic structure if not already there.
- Centralize all current and existing localStorage usage. Refactor any direct localStorage calls in games/components to use the new utility.
- Fail silently for users if localStorage is unavailable; dev console warnings are fine. No user-facing alerts or messages needed for incognito/offline cases in 1.0.0.
- Enforce standard CSS module naming: `ComponentName.module.css` for files, `camelCase` for classes. Remove unused CSS classes only if you’re certain they are not used anywhere.
- Test on latest Chrome desktop + one mobile browser (Chrome or Safari). Document validation results briefly in PR notes or a short markdown file (`phase-10-validation-results.md`).
- Strict refactor only. If you spot bugs or UX issues unrelated to the Phase 10 scope, log them for a future phase instead of fixing them now.
