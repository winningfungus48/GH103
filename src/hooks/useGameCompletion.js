import { useEffect, useRef, useCallback } from "react";
import { setDailyProgress } from "../utils/localStorage";

/**
 * Enhanced hook for detecting game completion and managing statistics.
 * 
 * @param {object} state - The current game state.
 * @param {function} isComplete - Function that returns true if the game is complete.
 * @param {object} options - Configuration options
 * @param {function} options.onComplete - Callback to run when the game is completed.
 * @param {string} options.gameSlug - Game identifier for statistics tracking (optional)
 * @param {boolean} options.trackStats - Whether to track completion statistics (default: true)
 * @param {boolean} options.trackStreak - Whether to track daily streaks (default: true)
 * @param {function} options.getResult - Function to extract result data from state (optional)
 * @param {function} options.validateCompletion - Custom validation for completion (optional)
 * 
 * @returns {object} { 
 *   isCompleted, 
 *   completionStats, 
 *   resetCompletion,
 *   forceComplete 
 * }
 *
 * Usage Examples:
 * 
 * Basic usage:
 *   useGameCompletion(state, isComplete, { onComplete: handleGameComplete });
 * 
 * With statistics tracking:
 *   useGameCompletion(state, isComplete, {
 *     onComplete: handleGameComplete,
 *     gameSlug: 'wordle',
 *     trackStats: true,
 *     getResult: (state) => ({ 
 *       completed: state.isWon, 
 *       attempts: state.attempts,
 *       time: state.timeSpent 
 *     })
 *   });
 * 
 * With custom validation:
 *   useGameCompletion(state, isComplete, {
 *     onComplete: handleGameComplete,
 *     validateCompletion: (state) => state.isWon && state.attempts > 0
 *   });
 */
export default function useGameCompletion(state, isComplete, options = {}) {
  const {
    onComplete,
    gameSlug,
    trackStats = true,
    trackStreak = true,
    getResult = () => ({ completed: true, result: 'completed' }),
    validateCompletion = () => true
  } = options;

  const completedRef = useRef(false);
  const completionStatsRef = useRef({
    isCompleted: false,
    completedAt: null,
    result: null,
    dailyStreak: 0
  });

  // Check if completion is valid
  const isValidCompletion = useCallback((currentState) => {
    return isComplete(currentState) && validateCompletion(currentState);
  }, [isComplete, validateCompletion]);

  // Handle completion with statistics tracking
  const handleCompletion = useCallback((currentState) => {
    if (completedRef.current) return;

    const result = getResult(currentState);
    const now = new Date();
    const today = now.toISOString().slice(0, 10);

    // Update completion stats
    completionStatsRef.current = {
      isCompleted: true,
      completedAt: now,
      result: result,
      dailyStreak: 0
    };

    // Track statistics if enabled
    if (trackStats && gameSlug) {
      try {
        // Update daily progress
        if (trackStreak) {
          const progress = setDailyProgress(gameSlug, {
            date: today,
            completed: result.completed,
            result: result
          });
          
          if (progress) {
            completionStatsRef.current.dailyStreak = progress.streak;
          }
        }
      } catch (_e) {
        console.warn(`Failed to track completion statistics for ${gameSlug}`);
      }
    }

    // Mark as completed
    completedRef.current = true;

    // Call completion callback
    if (onComplete) {
      onComplete(currentState, completionStatsRef.current);
    }
  }, [onComplete, gameSlug, trackStats, trackStreak, getResult]);

  // Reset completion state
  const resetCompletion = useCallback(() => {
    completedRef.current = false;
    completionStatsRef.current = {
      isCompleted: false,
      completedAt: null,
      result: null,
      dailyStreak: 0
    };
  }, []);

  // Force completion (useful for testing or manual completion)
  const forceComplete = useCallback((customResult = null) => {
    if (completedRef.current) return;

    const result = customResult || getResult(state);
    const now = new Date();

    completionStatsRef.current = {
      isCompleted: true,
      completedAt: now,
      result: result,
      dailyStreak: 0
    };

    completedRef.current = true;

    if (onComplete) {
      onComplete(state, completionStatsRef.current);
    }
  }, [state, onComplete, getResult]);

  // Main completion detection effect
  useEffect(() => {
    if (!completedRef.current && isValidCompletion(state)) {
      handleCompletion(state);
    } else if (completedRef.current && !isComplete(state)) {
      // Reset completion if state is reset
      resetCompletion();
    }
  }, [state, isValidCompletion, handleCompletion, isComplete, resetCompletion]);

  // Get current completion statistics
  const getCompletionStats = useCallback(() => {
    return { ...completionStatsRef.current };
  }, []);

  return {
    isCompleted: completionStatsRef.current.isCompleted,
    completionStats: getCompletionStats(),
    resetCompletion,
    forceComplete
  };
}
