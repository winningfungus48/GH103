import { useState, useEffect, useRef } from 'react';

/**
 * useThrottle - Throttles a value to limit the rate of updates for performance-critical operations.
 * 
 * @param {any} value - The value to throttle
 * @param {number} limit - Minimum time between updates in milliseconds (default: 100ms)
 * @returns {any} The throttled value
 * 
 * @example
 * const [scrollPosition, setScrollPosition] = useState(0);
 * const throttledScrollPosition = useThrottle(scrollPosition, 50);
 * 
 * // Use throttledScrollPosition for expensive scroll-based calculations
 * useEffect(() => {
 *   updateScrollIndicator(throttledScrollPosition);
 * }, [throttledScrollPosition]);
 */
export default function useThrottle(value, limit = 100) {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastRan = useRef(Date.now());

  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRan.current >= limit) {
        setThrottledValue(value);
        lastRan.current = Date.now();
      }
    }, limit - (Date.now() - lastRan.current));

    return () => {
      clearTimeout(handler);
    };
  }, [value, limit]);

  return throttledValue;
} 