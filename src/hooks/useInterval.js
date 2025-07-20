import { useEffect, useRef } from "react";

/**
 * useInterval - A safe replacement for setInterval with automatic cleanup.
 *
 * @param {function} callback - The function to call on each interval
 * @param {number|null} delay - Delay in milliseconds, or null to pause the interval
 *
 * @example
 * const [count, setCount] = useState(0);
 *
 * // Start interval
 * useInterval(() => {
 *   setCount(c => c + 1);
 * }, 1000);
 *
 * // Pause interval
 * useInterval(() => {
 *   setCount(c => c + 1);
 * }, isRunning ? 1000 : null);
 */
export default function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval
  useEffect(() => {
    // Don't schedule if no delay is specified
    if (delay === null) {
      return;
    }

    const id = setInterval(() => {
      savedCallback.current();
    }, delay);

    return () => clearInterval(id);
  }, [delay]);
}
