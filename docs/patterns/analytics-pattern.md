# 📊 Analytics Pattern – trackEvent()

## Purpose
Provide a safe, modular way to track analytics events without breaking the app or polluting production logs.

## Usage

- Use `trackEvent(name, data)` to log custom user interactions.
- Wrap all calls in `try/catch` to prevent runtime errors.
- Restrict logging to development mode using `import.meta.env.DEV`.

## Example
```js
try {
  trackEvent("page_view", { page: "home" });
} catch (err) {
  if (import.meta.env.DEV) console.warn("Tracking error:", err);
}
```

## Notes
- Logs only appear during `npm run dev`.
- Production build is clean and silent.
- Can be replaced later with Plausible, GA4, or another provider. 