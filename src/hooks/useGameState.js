import { useState, useCallback } from "react";

/**
 * Generic hook for managing game state.
 * @param {object} initialState - The initial state object for the game.
 * @returns {object} { state, setState, resetState }
 *
 * Usage:
 *   const { state, setState, resetState } = useGameState({ ... });
 */
export default function useGameState(initialState) {
  const [state, setState] = useState(initialState);

  // Resets state to initialState
  const resetState = useCallback(() => {
    setState(initialState);
  }, [initialState]);

  return { state, setState, resetState };
}
