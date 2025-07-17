# GameTemplate Usage Guide

The `GameTemplate` component and its supporting hooks (`useGameState`, `useGameCompletion`) provide a flexible foundation for building modular puzzle and logic games in React.

## Basic Usage

```
import GameTemplate from 'src/components/game/GameTemplate';

const initialState = { ... };
const isComplete = (state) => { /* return true if game is complete */ };
const getFeedback = (state, guess) => { /* return feedback for guess */ };

function MyGame() {
  const handleComplete = (state) => { /* handle game completion */ };
  const handleReset = () => { /* handle game reset */ };

  return (
    <GameTemplate
      initialState={initialState}
      isComplete={isComplete}
      getFeedback={getFeedback}
      onReset={handleReset}
      onComplete={handleComplete}
      render={({ state, setState, resetState, feedback, getFeedback }) => (
        // Custom UI here, using state/setState/resetState/feedback
      )}
    />
  );
}
```

## Key Extension Points
- **initialState:** Shape your game state as needed (board, progress, etc.).
- **isComplete:** Custom logic to determine when the game is finished.
- **getFeedback:** Logic for evaluating guesses or moves.
- **onReset/onComplete:** Callbacks for reset and completion events.
- **render:** Render prop for your custom UI, with full access to state and helpers.

## Example: See `Numberle.jsx` for a full implementation. 