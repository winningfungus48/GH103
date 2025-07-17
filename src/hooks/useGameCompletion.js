import { useEffect, useRef } from 'react';

/**
 * Generic hook for detecting game completion and triggering a callback.
 * @param {object} state - The current game state.
 * @param {function} isComplete - Function that returns true if the game is complete.
 * @param {function} onComplete - Callback to run when the game is completed.
 *
 * Usage:
 *   useGameCompletion(state, isComplete, onComplete);
 */
export default function useGameCompletion(state, isComplete, onComplete) {
  const completedRef = useRef(false);

  useEffect(() => {
    if (!completedRef.current && isComplete(state)) {
      completedRef.current = true;
      if (onComplete) onComplete(state);
    } else if (completedRef.current && !isComplete(state)) {
      // Reset completion if state is reset
      completedRef.current = false;
    }
  }, [state, isComplete, onComplete]);
} 