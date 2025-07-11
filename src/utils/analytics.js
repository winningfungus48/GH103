/**
 * trackEvent - Analytics event tracking utility (stub)
 *
 * @param {string} eventName - Name of the event (e.g., 'view_game', 'play_now')
 * @param {Object} [metadata] - Optional details (e.g., slug, category)
 *
 * TODO: Integrate with analytics provider (e.g., Plausible, Google Analytics) in Phase 10.
 */
export function trackEvent(eventName, metadata) {
  // Stub: log to console for now
  // eslint-disable-next-line no-console
  console.log('[Analytics] Event:', eventName, metadata || '');
} 