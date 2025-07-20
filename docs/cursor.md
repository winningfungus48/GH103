# Cursor Project Onboarding & Process Guide

This document provides high-level context and process guidelines for setting up new Cursor chats. Use this as a reference to ensure every session is consistent, efficient, and aligned with project standards.

---

## 1. Project Context
- **Project:** Game Hub (React, atomic design, modular, scalable)
- **Core Goals:**
  - Clean, maintainable, and scalable codebase
  - Robust state management and persistence
  - Modular, reusable systems for future games
  - Consistent UI/UX and performance
- **Current Release:** 1.0.0 (Core Foundations)
- **Expansion Features:** (e.g., daily games, leaderboards, analytics) are out of scope until 2.0.0

---

## 2. Development Process Template
- **Review & Extract Requirements:**
  - Read all relevant task/validation markdown files for the phase
  - Extract actionable checklists and ask clarifying questions if needed
- **Audit & Planning:**
  - Audit the codebase for all areas affected by the phase
  - Document findings in an audit log (e.g., `phase-X-audit-log.md`)
- **Implementation:**
  - Make atomic, well-described commits
  - Refactor/implement per checklist, with robust error handling and comments
  - Document all changes in the audit log
- **Documentation:**
  - Update/create migration guides or notes as needed
  - Document all changes and validation results in markdown files (e.g., `phase-X-validation-results.md`)
- **Manual Validation & QA:**
  - Test on latest Chrome desktop and one mobile browser
  - Validate all edge cases and checklist items
  - Document results in the validation results file
- **Final Review & Sign-Off:**
  - Ensure all checklist items are complete and documented
  - Present a comprehensive summary and validation report for review/sign-off

---

## 3. Documentation & Validation Style
- Use markdown checklists, summaries, and edge case sections
- Log unused/legacy files for future review (do not delete unless instructed)
- Follow atomic design for component organization
- Use standard ESLint/Prettier configs; remove conflicting formatting files
- Centralize utilities and ensure robust error handling

---

## 4. Communication Preferences
- Minimize check-ins; only request input when blocked or at major decision points
- If requirements are ambiguous, pause and request clarification
- Written validation results are required; screenshots are optional unless a visual issue is found
- All changes should be atomic, well-documented, and validated before sign-off

---

## 5. Onboarding for New Cursor Chats
- At the start of a new chat, reference this document and:
  - Summarize the current phase's requirements and validation criteria
  - State any special instructions or recent clarifications
  - Point to relevant markdown docs for detailed context
- Use the process template above to guide the workflow for each phase

---

## 6. Rapid Development Best Practices

### Phase Planning Best Practices
1. **Keep Phases Focused on One Theme**
   - Follow the model: each phase addresses a single **category of improvements** (e.g., "Daily Game System," "SEO & Ads," "Game Expansion")
   - Avoid combining unrelated goals (e.g., don't mix new game creation with UI polish in the same phase)

2. **Define Entry & Exit Criteria Clearly**
   - Each phase should have a **definition of done**: a small checklist (e.g., "UI tested on desktop + mobile, commits pushed, markdown summary created")
   - Include clear **QA checkpoints** before closing the phase

3. **Prioritize Modular Foundations Early**
   - Always build **foundational logic first** (hooks, reusable components, data structure) **before** creating UI or adding multiple games
   - Example: Build `useTurnBasedPlayers()` **before** adding any multiplayer games

4. **Document Incrementally**
   - Maintain md file updates **at the end of each phase**, ensuring progress tracking and reducing cognitive load

### Development Workflow Best Practices
1. **Strict One-Task-Per-Prompt Policy**
   - Keep Cursor prompts tightly scoped (already a strength of your workflow)
   - Example: "Add daily streak badge to ResultModal" should be its own prompt

2. **Atomic Design First, Always**
   - Before adding new games or features, always consider:
     ✅ Can this be built as an atom/molecule/organism for reuse?
     ✅ Will this component need to be used elsewhere later?

3. **Minimum Viable Iterations**
   - Implement **basic, working versions first**, then polish in later phases
   - Example: Start with a simple "Recently Played" list before adding animations or sort options

4. **Structured Commits & Reviews**
   - Keep your **[feat]/[fix]/[refactor]** commit format and phase summaries
   - Before closing a phase, do a quick **technical debt scan** (remove console logs, redundant styles, unused files)

5. **Early Testing After Each Component**
   - As you're doing now: test in the browser after each Cursor prompt, **not after entire phases**
   - Use Phase 0–7's incremental testing style as the standard

### Ensuring Rapid Development
1. **Game Templates & Hooks First**
   - For rapid game addition, create **template folders** (`/templates/puzzle`, `/templates/wordle-style`) and **universal hooks** (`useGameState`, `useDailySeed`)
   - This lets you add new games with only minimal custom logic

2. **Strict Separation of Features vs. Polish**
   - New functionality first → polish later
   - Example: add working multiplayer turn logic now, postpone animations to a later "UX polish" phase

3. **Default to LocalStorage, Avoid Backend Until Later**
   - Keep state and persistence simple to avoid delays (as you already do with Favorites and Recently Played)

4. **Parallelizable Documentation & Testing**
   - Update markdown docs **as you close each task**, not at phase end, to reduce catch-up work

### Suggested Immediate Adjustments
- **Pre-Phase Checklist**: Before starting any phase, quickly define:
  ✅ Scope (1–2 sentences)
  ✅ Key tasks (max 5–7)
  ✅ Definition of Done
  ✅ Docs update requirement

---

## 7. Testing Strategy

### Checklist vs. Ad-hoc
- Testing is **mostly ad-hoc but methodical**—we test each component/prompt immediately in-browser (`npm run dev`) after implementation
- We check responsiveness, category filtering, routing, and expected interactions before moving to the next task
- We don't yet have a formal testing checklist but should (consider drafting one for consistency)

### Testing Workflow
- Test in browser immediately after each Cursor prompt
- Check desktop and mobile responsiveness
- Validate category filtering and routing
- Test expected interactions and edge cases
- Document any issues found in the audit log

---

## 8. Documentation Balance

### Usefulness vs. Streamlining
- Extremely helpful for future development (especially structured phase summaries)
- **Could be streamlined by maintaining running notes during development** instead of summarizing after phase completion

### Documentation Strategy
- Keep live notes during development instead of end-of-phase writing
- Update markdown docs as you close each task, not at phase end
- Focus on actionable insights and technical decisions
- Maintain phase summaries for historical reference

---

## 9. Technical Debt Management

### Threshold for Addressing
- We fix **critical UI/logic issues immediately** (blocking, or affecting multiple components)
- Cosmetic/UX polish and redundant code cleanup are deferred to a **dedicated refactor pass** (often at the start of the next release cycle)

### Common Technical Debt
- Leftover **stub files or old CSS** after refactors
- **Hardcoded props/logic** that should later be moved to reusable hooks or context
- **Game-specific hacks** (e.g., Numberle keyboard layout) that aren't yet generalized

### Technical Debt Strategy
- Address critical issues immediately
- Schedule refactor passes at the start of new release cycles
- Document technical debt items for future phases
- Prioritize debt that affects multiple components or future development

---

## 10. Game Template System

### Formal Template System
- Not fully implemented yet. Right now, adding a game is modular but still **manual per-game folder**
- Need to create formal template folders (`/templates/puzzle`, `/templates/wordle-style`)
- Develop universal hooks (`useGameState`, `useDailySeed`) for rapid game integration

### Time Investment Per Game
- ~**1–2 hours per game** if it's simple and reuses existing logic (like Wordle-style)
- Longer for unique mechanics that require custom implementation

### Template System Goals
- Cut game integration time in half
- Standardize common game patterns
- Reduce boilerplate code
- Enable rapid prototyping of new game concepts

---

## 11. Current Pain Points

### Biggest Time Sinks
- **Writing very detailed Cursor prompts** (one-task-per-prompt is great for quality but slows pace)
- **Mobile edge-case testing** takes extra time

### Areas to Streamline
1. **Game Template System** – formalizing reusable hooks/components to cut game integration time in half
2. **Testing Checklist** – having a simple UI/UX + logic checklist could reduce repeated edge-case testing
3. **Phase Docs Automation** – keeping live notes during development instead of end-of-phase writing

### Optimization Strategies
- Develop standardized prompt templates for common tasks
- Create mobile testing checklist to reduce edge-case discovery time
- Implement live documentation updates during development
- Build reusable component library for common UI patterns

---

**This document ensures every Cursor session is consistent, high-quality, and aligned with project goals. Update as needed when the process evolves!** 