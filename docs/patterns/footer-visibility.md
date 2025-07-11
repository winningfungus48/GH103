# 🦶 Footer Visibility Pattern – Scroll-Aware Footer

## Purpose
Ensure the footer appears only when a user scrolls to the bottom of the content — even if the page is short.

## Hook Used
`useScrollAtBottom(threshold)` in `src/utils/`

## Special Logic
Short pages (content height ≤ viewport height) won't scroll.  
To fix this:
```js
if (scrollableHeight <= 0) {
  setIsAtBottom(true); // Force footer to appear
}
```

## Where It's Used
`LayoutWrapper.jsx` wraps content and renders `<Footer />` when `useScrollAtBottom()` returns true.

## Benefits
- Prevents footer from cluttering short screens unless content is fully viewed.
- Enhances polish for static and dynamic pages alike. 