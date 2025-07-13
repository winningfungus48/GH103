# ✅ Phase 10 – Daily Game System Tasks

## Phase 10A: Core Infrastructure & Routing
- [ ] Add `mode="daily"` support to `/game/:slug` via query param and `/daily/:slug` alias
- [ ] Create `useDailySeed()` hook that accepts optional date and returns deterministic seed
- [ ] Update `gamesData.js` to include `supportsDaily` and optional `dailySettings` object

## Phase 10B: State Management & Logic
- [ ] Create `useDailyCompletion(slug)` hook to check and mark daily completion in localStorage
- [ ] Create `useStreak(slug)` hook to track current and best streaks based on play history

## Phase 10C: UI Components & Homepage
- [ ] Create `DailyGameRow.jsx` to show daily-eligible games grouped by completion status
- [ ] Update `ResultModal` to include streak display and “Daily Complete” badge if applicable
- [ ] Add share options (copy to clipboard, Twitter, SMS) based on game result

## Phase 10D: Dev Mode & Testing
- [ ] Implement `?testDate=YYYY-MM-DD` override and make `useDailySeed`, `useDailyCompletion`, and `useStreak` respect it
- [ ] Create dev toggles for test replays and simulate locked/completed states
- [ ] Confirm localStorage schema is backend-friendly:
  - `dailyProgress_[slug] = { date, completed, result }`
  - `dailyStreak_[slug] = { currentStreak, bestStreak, lastPlayed }`
- [ ] Generate `/docs/validation/phase-10.md` with QA steps and edge cases
