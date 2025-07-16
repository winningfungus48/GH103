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
  - Summarize the current phase’s requirements and validation criteria
  - State any special instructions or recent clarifications
  - Point to relevant markdown docs for detailed context
- Use the process template above to guide the workflow for each phase

---

**This document ensures every Cursor session is consistent, high-quality, and aligned with project goals. Update as needed when the process evolves!** 