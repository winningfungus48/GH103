/**
 * trackEvent - Analytics event tracking utility (stub)
 *
 * @param {string} eventName - Name of the event (e.g., 'view_game', 'play_now')
 * @param {Object} [metadata] - Optional details (e.g., slug, category)
 *
 * TODO: Integrate with analytics provider (e.g., Plausible, Google Analytics) in Phase 10.
 */
export function trackEvent(eventName, metadata) {
  // Log events to the console only during development
  // Prevents clutter in production and avoids accidental data leakage
  if (import.meta.env.DEV) {
    console.log(`[trackEvent] ${eventName}`, metadata || '');
  }

  // Future: integrate real analytics provider (GA4, Plausible, etc.)
}
// Wrap trackEvent in try/catch to prevent app crashes in case of analytics errors 