import { useState, useCallback, useEffect, useRef } from "react";

/**
 * Enhanced hook for managing game state with persistence and advanced features.
 * 
 * @param {object} initialState - The initial state object for the game.
 * @param {object} options - Configuration options
 * @param {string} options.storageKey - localStorage key for persistence (optional)
 * @param {boolean} options.persist - Whether to persist state to localStorage (default: false)
 * @param {function} options.serialize - Custom serialization function (optional)
 * @param {function} options.deserialize - Custom deserialization function (optional)
 * @param {function} options.validate - Custom validation function (optional)
 * @param {number} options.debounceMs - Debounce time for persistence (default: 1000)
 * 
 * @returns {object} { 
 *   state, 
 *   setState, 
 *   resetState, 
 *   updateState, 
 *   clearPersistedState,
 *   isPersisted,
 *   hasChanges 
 * }
 *
 * Usage Examples:
 * 
 * Basic usage:
 *   const { state, setState, resetState } = useGameState({ score: 0, level: 1 });
 * 
 * With persistence:
 *   const { state, setState, resetState } = useGameState(
 *     { score: 0, level: 1 },
 *     { persist: true, storageKey: 'mygame-state' }
 *   );
 * 
 * With custom serialization:
 *   const { state, setState } = useGameState(
 *     { board: [], moves: [] },
 *     {
 *       persist: true,
 *       storageKey: 'game-board',
 *       serialize: (state) => ({ ...state, timestamp: Date.now() }),
 *       deserialize: (data) => ({ ...data, timestamp: undefined })
 *     }
 *   );
 */
export default function useGameState(initialState, options = {}) {
  const {
    storageKey,
    persist = false,
    serialize = JSON.stringify,
    deserialize = JSON.parse,
    validate = () => true,
    debounceMs = 1000
  } = options;

  const [state, setState] = useState(initialState);
  const [isPersisted, setIsPersisted] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const lastSavedRef = useRef(null);
  const saveTimeoutRef = useRef(null);

  // Load persisted state on mount
  useEffect(() => {
    if (persist && storageKey) {
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          const parsed = deserialize(saved);
          if (validate(parsed)) {
            setState(parsed);
            setIsPersisted(true);
            lastSavedRef.current = parsed;
          }
        }
      } catch (_e) {
        // Silently fail and use initialState
        console.warn(`Failed to load persisted state for key: ${storageKey}`);
      }
    }
  }, [persist, storageKey, deserialize, validate]);

  // Debounced save function
  const saveToStorage = useCallback((newState) => {
    if (!persist || !storageKey) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      try {
        const serialized = serialize(newState);
        localStorage.setItem(storageKey, serialized);
        lastSavedRef.current = newState;
        setIsPersisted(true);
        setHasChanges(false);
      } catch (_e) {
        console.warn(`Failed to save state for key: ${storageKey}`);
      }
    }, debounceMs);
  }, [persist, storageKey, serialize, debounceMs]);

  // Enhanced setState with persistence
  const setStateWithPersistence = useCallback((newStateOrUpdater) => {
    setState(prevState => {
      const newState = typeof newStateOrUpdater === 'function' 
        ? newStateOrUpdater(prevState) 
        : newStateOrUpdater;
      
      setHasChanges(true);
      saveToStorage(newState);
      return newState;
    });
  }, [saveToStorage]);

  // Reset state to initial values
  const resetState = useCallback(() => {
    setState(initialState);
    setHasChanges(false);
    setIsPersisted(false);
    
    if (persist && storageKey) {
      try {
        localStorage.removeItem(storageKey);
      } catch (_e) {
        console.warn(`Failed to clear persisted state for key: ${storageKey}`);
      }
    }
  }, [initialState, persist, storageKey]);

  // Update specific state properties
  const updateState = useCallback((updates) => {
    setStateWithPersistence(prevState => ({
      ...prevState,
      ...updates
    }));
  }, [setStateWithPersistence]);

  // Clear persisted state without resetting current state
  const clearPersistedState = useCallback(() => {
    if (persist && storageKey) {
      try {
        localStorage.removeItem(storageKey);
        setIsPersisted(false);
        setHasChanges(false);
        lastSavedRef.current = null;
      } catch (_e) {
        console.warn(`Failed to clear persisted state for key: ${storageKey}`);
      }
    }
  }, [persist, storageKey]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return {
    state,
    setState: setStateWithPersistence,
    resetState,
    updateState,
    clearPersistedState,
    isPersisted,
    hasChanges
  };
}
