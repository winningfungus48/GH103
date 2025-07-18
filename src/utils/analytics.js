/**
 * trackEvent - Analytics event tracking utility (stub)
 * 
 * @param {string} eventName - Name of the event (e.g., 'view_game', 'play_now')
 * @param {Object} [payload={}] - Optional details (e.g., slug, category)
 * 
 * @example
 * trackEvent('page_view', { page: 'home' });
 * trackEvent('game_view', { name: 'numberle', mode: 'daily' });
 * 
 * TODO: Integrate with analytics provider (e.g., Plausible, Google Analytics) in future phases.
 */
export function trackEvent(eventName, payload = {}) {
  // Validate inputs
  if (typeof eventName !== 'string' || !eventName.trim()) {
    console.warn('[trackEvent] Invalid event name:', eventName);
    return;
  }

  // Log events to the console only during development
  // Prevents clutter in production and avoids accidental data leakage
  if (import.meta.env.DEV) {
    console.debug(`[trackEvent] ${eventName}`, payload);
  }

  // Future: integrate real analytics provider (GA4, Plausible, etc.)
  // Example integration points:
  // - Google Analytics 4: gtag('event', eventName, payload)
  // - Plausible: plausible(eventName, { props: payload })
  // - Custom backend: fetch('/api/analytics', { method: 'POST', body: JSON.stringify({ eventName, payload }) })
}

/**
 * trackPageView - Convenience function for page view tracking
 * 
 * @param {string} page - Page identifier (e.g., 'home', 'game/numberle')
 * @param {Object} [metadata={}] - Additional page metadata
 */
export function trackPageView(page, metadata = {}) {
  trackEvent('page_view', { page, ...metadata });
}

/**
 * trackGameEvent - Convenience function for game-specific events
 * 
 * @param {string} eventName - Game event name (e.g., 'game_start', 'game_complete')
 * @param {string} gameName - Name of the game
 * @param {Object} [metadata={}] - Additional game metadata
 */
export function trackGameEvent(eventName, gameName, metadata = {}) {
  trackEvent(eventName, { game: gameName, ...metadata });
} 