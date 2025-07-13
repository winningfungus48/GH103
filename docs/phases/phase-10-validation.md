# 🧪 Phase 10 – Validation Checklist

## Core Infrastructure
- [ ] `mode="daily"` is correctly detected from URL query or route alias
- [ ] `useDailySeed()` returns a consistent seed per day
- [ ] Games opt-in via `supportsDaily` are correctly filtered and displayed

## Daily Lockout & Streak Tracking
- [ ] User can only play once per day per daily-enabled game
- [ ] Completion is stored in localStorage and respected on refresh
- [ ] Streak updates on consecutive plays and resets when skipped
- [ ] Streak badge displays correctly in UI

## UI Integration
- [ ] Homepage daily module shows correct games and completion status
- [ ] ResultModal updates to show “Daily Complete” + streak
- [ ] Share buttons appear only after completion

## Dev Tools
- [ ] `?testDate=` overrides date for all hooks
- [ ] Can simulate streaks, lockouts, and completions without real gameplay
- [ ] localStorage keys are structured and consistent

## Cross-Browser & Edge Cases
- [ ] Works in incognito / after localStorage is cleared (no crashes)
- [ ] Handles leap days, year-end transitions
- [ ] Fully accessible via keyboard and screen reader
