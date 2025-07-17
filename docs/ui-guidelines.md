# UI Guidelines – Game Hub

This guide outlines best practices for building consistent, accessible, and scalable UI in Game Hub. Follow these patterns for all new features and refactors.

---

## ✅ Modal Best Practices
- Use the shared `<Modal />` component for all dialogs (win/lose, info, etc.).
- Control modal visibility via `open` and `onClose` props (controlled-only pattern).
- Pass custom content via `children`, and use `buttons` for footer actions.
- Use `className` and `style` props for custom overrides if needed.
- Ensure ARIA roles, focus trapping, and escape-to-close are always enabled.

**Example:**
```jsx
<Modal open={isOpen} onClose={handleClose} title="Info">
  <p>Modal content here</p>
  <div slot="buttons">
    <button onClick={handleClose}>Close</button>
  </div>
</Modal>
```

---

## ✅ Toast & Notification Best Practices
- Use the `useToast().showToast({ message, type })` API for all feedback.
- Types: `info`, `success`, `error` (choose the most appropriate for the context).
- Toasts are queued and only one is shown at a time.
- Use ARIA roles and ensure toasts are keyboard accessible.

**Example:**
```js
const { showToast } = useToast();
showToast({ message: 'Game saved!', type: 'success' });
```

---

## ✅ Lazy Loading & Code Splitting
- Use `React.lazy` and `Suspense` for all game pages and heavy components.
- Use dynamic imports in `gamesData.js` for per-game code splitting.
- Provide a fallback UI for loading states.

**Example:**
```js
const GameWrapper = React.lazy(() => import('./components/GameWrapper'));
<Suspense fallback={<Loader />}>
  <GameWrapper />
</Suspense>
```

---

## ✅ Accessibility & Consistency
- All modals and toasts must be accessible (ARIA roles, focus trapping, keyboard navigation).
- Use semantic HTML and ensure all interactive elements are keyboard accessible.
- Maintain consistent spacing, typography, and color usage across the app.
- Use `className` and `style` props for custom overrides, but keep default styles consistent.

---

## ✅ Contributor Checklist
- [ ] Used `<Modal />` for all dialogs, with ARIA and focus trapping
- [ ] Used `useToast().showToast({ message, type })` for all notifications
- [ ] Lazy loaded all game pages and heavy components
- [ ] Provided fallback UI for all lazy loaded components
- [ ] Ensured all UI is accessible via keyboard and screen reader
- [ ] Used `className`/`style` for custom overrides, not direct style mutations
- [ ] Added inline usage examples for new UI patterns

---

*Follow this guide to keep Game Hub’s UI consistent, accessible, and easy to maintain as the project grows!* 