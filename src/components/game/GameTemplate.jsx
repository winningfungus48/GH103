import React from "react";
import useGameState from "../../hooks/useGameState";
import useGameCompletion from "../../hooks/useGameCompletion";

/**
 * GameTemplate - Flexible template for puzzle/logic games.
 *
 * Props:
 *   initialState: object - Initial state for the game
 *   isComplete: function - Returns true if the game is complete
 *   getFeedback: function - Returns feedback for a guess/action
 *   onReset: function - Called when the game is reset
 *   onComplete: function - Called when the game is completed
 *   render: function - Render prop for custom UI (receives { state, setState, resetState, feedback })
 *
 * Usage Example:
 *   <GameTemplate
 *     initialState={...}
 *     isComplete={...}
 *     getFeedback={...}
 *     onReset={...}
 *     onComplete={...}
 *     render={({ state, setState, resetState, feedback }) => (
 *       // Custom UI here
 *     )}
 *   />
 */
export default function GameTemplate({
  initialState,
  isComplete,
  getFeedback,
  onReset,
  onComplete,
  render,
}) {
  const { state, setState, resetState } = useGameState(initialState);
  const [feedback, setFeedback] = React.useState(null);

  // Handle completion
  useGameCompletion(state, isComplete, onComplete);

  // Handle reset
  const handleReset = () => {
    resetState();
    setFeedback(null);
    if (onReset) onReset();
  };

  // Provide a way for the render prop to get feedback
  const handleFeedback = (...args) => {
    const fb = getFeedback ? getFeedback(state, ...args) : null;
    setFeedback(fb);
    return fb;
  };

  return render({
    state,
    setState,
    resetState: handleReset,
    feedback,
    getFeedback: handleFeedback,
  });
}
