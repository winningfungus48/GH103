# Game Template System Documentation

**Version:** 1.1.2  
**Last Updated:** [Current Date]  
**Status:** ✅ Complete

---

## 📋 Overview

The Game Template System provides a standardized approach for creating new games in the Game Hub platform. It ensures consistency, accessibility, and maintainability across all games while providing powerful features like state persistence, statistics tracking, and universal UI components.

---

## 🏗️ Architecture

### Core Components
- **useGameState Hook** - Enhanced state management with persistence
- **useGameCompletion Hook** - Completion detection and statistics tracking
- **Universal UI Components** - Modal, Toast, and accessibility features
- **localStorage Utilities** - Scalable data persistence with migration
- **Performance Hooks** - useDebounce, useThrottle, useInterval

### Design Principles
- **Atomic Design** - Components follow atomic design principles
- **Accessibility First** - ARIA compliance and keyboard navigation
- **Mobile Responsive** - All components work on mobile devices
- **Performance Optimized** - Debounced updates and efficient rendering
- **Type Safe** - Comprehensive JSDoc documentation

---

## 🎮 Game Template Structure

### Basic Game Template
```jsx
import React from 'react';
import useGameState from '../../hooks/useGameState';
import useGameCompletion from '../../hooks/useGameCompletion';
import { useToast } from '../../context/ToastProvider';
import Modal from '../../components/ui/Modal';

const GameTemplate = () => {
  // 1. State Management
  const { state, setState, resetState, updateState } = useGameState(
    {
      score: 0,
      level: 1,
      isPlaying: false,
      isWon: false,
      attempts: 0
    },
    {
      persist: true,
      storageKey: 'game-template-state'
    }
  );

  // 2. Completion Tracking
  const { isCompleted, completionStats } = useGameCompletion(
    state,
    (state) => state.isWon || state.attempts >= 6,
    {
      onComplete: handleGameComplete,
      gameSlug: 'game-template',
      trackStats: true,
      getResult: (state) => ({
        completed: state.isWon,
        attempts: state.attempts,
        score: state.score
      })
    }
  );

  // 3. Toast Notifications
  const { showToast } = useToast();

  // 4. Modal State
  const [showModal, setShowModal] = React.useState(false);

  // 5. Game Logic
  const handleGameComplete = (finalState, stats) => {
    showToast({
      message: finalState.isWon ? 'Congratulations! You won!' : 'Game Over!',
      type: finalState.isWon ? 'success' : 'info'
    });
    setShowModal(true);
  };

  const startGame = () => {
    resetState();
    updateState({ isPlaying: true });
  };

  const makeMove = (move) => {
    if (!state.isPlaying) return;
    
    updateState(prev => ({
      attempts: prev.attempts + 1,
      // Add your game logic here
    }));
  };

  // 6. Render
  return (
    <div className="game-container">
      {/* Game Header */}
      <div className="game-header">
        <h1>Game Template</h1>
        <div className="game-stats">
          <span>Score: {state.score}</span>
          <span>Level: {state.level}</span>
          <span>Attempts: {state.attempts}</span>
        </div>
      </div>

      {/* Game Board */}
      <div className="game-board">
        {/* Your game-specific UI here */}
        <button onClick={startGame} disabled={state.isPlaying}>
          Start Game
        </button>
      </div>

      {/* Game Controls */}
      <div className="game-controls">
        <button onClick={resetState}>Reset</button>
        <button onClick={() => setShowModal(true)}>Help</button>
      </div>

      {/* Completion Modal */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={state.isWon ? "Congratulations!" : "Game Over"}
      >
        <div>
          <p>Final Score: {state.score}</p>
          <p>Attempts: {state.attempts}</p>
          {completionStats.dailyStreak > 0 && (
            <p>Daily Streak: {completionStats.dailyStreak}</p>
          )}
        </div>
        <div slot="buttons">
          <button onClick={() => setShowModal(false)}>Close</button>
          <button onClick={startGame}>Play Again</button>
        </div>
      </Modal>
    </div>
  );
};

export default GameTemplate;
```

---

## 🪝 Hook Usage Guide

### useGameState Hook

#### Basic Usage
```jsx
const { state, setState, resetState } = useGameState({
  score: 0,
  level: 1
});
```

#### With Persistence
```jsx
const { state, setState, resetState, isPersisted, hasChanges } = useGameState(
  { score: 0, level: 1 },
  {
    persist: true,
    storageKey: 'mygame-state',
    debounceMs: 1000 // Save after 1 second of inactivity
  }
);
```

#### With Custom Serialization
```jsx
const { state, setState } = useGameState(
  { board: [], moves: [] },
  {
    persist: true,
    storageKey: 'game-board',
    serialize: (state) => ({
      ...state,
      timestamp: Date.now(),
      version: '1.0.0'
    }),
    deserialize: (data) => {
      const { timestamp, version, ...state } = data;
      return state;
    },
    validate: (data) => {
      return data.board && Array.isArray(data.board);
    }
  }
);
```

### useGameCompletion Hook

#### Basic Usage
```jsx
useGameCompletion(
  state,
  (state) => state.isWon || state.attempts >= 6,
  {
    onComplete: (finalState) => {
      console.log('Game completed!', finalState);
    }
  }
);
```

#### With Statistics Tracking
```jsx
const { isCompleted, completionStats } = useGameCompletion(
  state,
  (state) => state.isWon || state.attempts >= 6,
  {
    onComplete: handleGameComplete,
    gameSlug: 'wordle',
    trackStats: true,
    trackStreak: true,
    getResult: (state) => ({
      completed: state.isWon,
      attempts: state.attempts,
      time: state.timeSpent,
      score: state.score
    }),
    validateCompletion: (state) => {
      return state.isWon && state.attempts > 0;
    }
  }
);
```

---

## 🎨 UI Components

### Modal System
```jsx
import Modal from '../../components/ui/Modal';

// Basic Modal
<Modal
  open={showModal}
  onClose={() => setShowModal(false)}
  title="Game Help"
>
  <p>This is the help content.</p>
  <div slot="buttons">
    <button onClick={() => setShowModal(false)}>Close</button>
  </div>
</Modal>

// Modal with Custom Styling
<Modal
  open={showModal}
  onClose={() => setShowModal(false)}
  title="Congratulations!"
  className="game-completion-modal"
  style={{ maxWidth: '500px' }}
>
  <div className="completion-content">
    <h3>You won!</h3>
    <p>Score: {state.score}</p>
  </div>
</Modal>
```

### Toast Notifications
```jsx
import { useToast } from '../../context/ToastProvider';

const { showToast } = useToast();

// Different toast types
showToast({ message: 'Game saved!', type: 'success' });
showToast({ message: 'Invalid move!', type: 'error' });
showToast({ message: 'Hint available!', type: 'info' });
```

---

## 📊 Performance Utilities

### useDebounce Hook
```jsx
import useDebounce from '../../hooks/useDebounce';

const debouncedValue = useDebounce(value, 500);
```

### useThrottle Hook
```jsx
import useThrottle from '../../hooks/useThrottle';

const throttledCallback = useThrottle(callback, 100);
```

### useInterval Hook
```jsx
import useInterval from '../../hooks/useInterval';

useInterval(() => {
  // Update timer every second
  updateState(prev => ({ time: prev.time + 1 }));
}, 1000);
```

---

## 🔧 Best Practices

### State Management
1. **Use Descriptive State Keys** - Make state properties self-documenting
2. **Implement Proper Validation** - Validate persisted data on load
3. **Use Debounced Persistence** - Prevent excessive localStorage writes
4. **Handle Errors Gracefully** - Provide fallbacks for localStorage failures

### Game Logic
1. **Separate Concerns** - Keep game logic separate from UI logic
2. **Use Immutable Updates** - Always return new state objects
3. **Implement Proper Reset** - Ensure games can be properly reset
4. **Track User Progress** - Use completion tracking for analytics

### Accessibility
1. **Use Semantic HTML** - Use proper HTML elements for structure
2. **Implement ARIA Labels** - Provide screen reader support
3. **Support Keyboard Navigation** - Ensure all interactions work with keyboard
4. **Test with Screen Readers** - Verify accessibility with actual tools

### Performance
1. **Use React.memo** - Memoize expensive components
2. **Implement useCallback** - Prevent unnecessary re-renders
3. **Use useMemo** - Cache expensive calculations
4. **Debounce User Input** - Prevent excessive updates

---

## 🧪 Testing Guidelines

### Unit Testing
```jsx
import { render, screen, fireEvent } from '@testing-library/react';
import GameTemplate from './GameTemplate';

test('game starts correctly', () => {
  render(<GameTemplate />);
  
  const startButton = screen.getByText('Start Game');
  fireEvent.click(startButton);
  
  expect(screen.getByText('Score: 0')).toBeInTheDocument();
});
```

### Integration Testing
```jsx
test('game completion triggers statistics', () => {
  const mockSetDailyProgress = jest.fn();
  jest.mock('../../utils/localStorage', () => ({
    setDailyProgress: mockSetDailyProgress
  }));

  render(<GameTemplate />);
  
  // Simulate game completion
  // Verify statistics are tracked
  expect(mockSetDailyProgress).toHaveBeenCalled();
});
```

---

## 🚨 Common Issues & Solutions

### Issue: State Not Persisting
**Solution:** Check that `persist: true` and `storageKey` are provided
```jsx
// Correct
const { state, setState } = useGameState(
  initialState,
  { persist: true, storageKey: 'mygame-state' }
);

// Incorrect
const { state, setState } = useGameState(initialState);
```

### Issue: Completion Not Detecting
**Solution:** Ensure completion function returns boolean
```jsx
// Correct
const isComplete = (state) => state.isWon || state.attempts >= 6;

// Incorrect
const isComplete = (state) => {
  if (state.isWon) return 'won';
  return 'playing';
};
```

### Issue: Modal Not Closing
**Solution:** Ensure onClose is properly implemented
```jsx
// Correct
<Modal open={showModal} onClose={() => setShowModal(false)} />

// Incorrect
<Modal open={showModal} onClose={undefined} />
```

---

## 📚 Examples

### Wordle-Style Game
See `src/games/wordle/Wordle.jsx` for a complete implementation using the template system.

### Numberle-Style Game
See `src/games/numberle/Numberle.jsx` for a complete implementation using the template system.

### Simple Counter Game
```jsx
const CounterGame = () => {
  const { state, updateState, resetState } = useGameState(
    { count: 0, target: 10 },
    { persist: true, storageKey: 'counter-game' }
  );

  const { isCompleted } = useGameCompletion(
    state,
    (state) => state.count >= state.target,
    {
      onComplete: () => showToast({ message: 'Target reached!', type: 'success' })
    }
  );

  return (
    <div>
      <h2>Counter Game</h2>
      <p>Count: {state.count} / {state.target}</p>
      <button onClick={() => updateState({ count: state.count + 1 })}>
        Increment
      </button>
      <button onClick={resetState}>Reset</button>
    </div>
  );
};
```

---

## 🔗 Related Documentation

- [Phase 1.1.2 Audit Log](../phases/1.1/phase-1.1.2-audit-log.md)
- [Accessibility Guidelines](./accessibility-guidelines.md)
- [Performance Benchmarks](./performance-benchmarks.md)
- [Migration Guide](./migration-guide.md)

---

**Template System Status:** ✅ **COMPLETE**  
**Ready for:** Phase 1.1.3 - New Games Batch 1 