# Hooks Guide – Game Hub

This guide documents the utility hooks available in Game Hub for performance optimization and common patterns.

---

## ✅ Performance Hooks

### **useDebounce**
Debounces a value to prevent excessive updates from rapid changes.

**Use Cases:** Search inputs, text entry, rapid user interactions

```jsx
import useDebounce from '../hooks/useDebounce';

const SearchComponent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearchTerm) {
      performSearch(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  return (
    <input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search games..."
    />
  );
};
```

**Props:**
- `value` (any): The value to debounce
- `delay` (number, optional): Delay in milliseconds (default: 300ms)

---

### **useThrottle**
Throttles a value to limit the rate of updates for performance-critical operations.

**Use Cases:** Scroll events, resize events, continuous user actions

```jsx
import useThrottle from '../hooks/useThrottle';

const ScrollComponent = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const throttledScrollPosition = useThrottle(scrollPosition, 50);

  useEffect(() => {
    const handleScroll = () => setScrollPosition(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    updateScrollIndicator(throttledScrollPosition);
  }, [throttledScrollPosition]);
};
```

**Props:**
- `value` (any): The value to throttle
- `limit` (number, optional): Minimum time between updates in milliseconds (default: 100ms)

---

### **useInterval**
A safe replacement for setInterval with automatic cleanup.

**Use Cases:** Game timers, periodic updates, animations

```jsx
import useInterval from '../hooks/useInterval';

const TimerComponent = () => {
  const [count, setCount] = useState(0);
  const [isRunning, setIsRunning] = useState(true);

  useInterval(() => {
    if (isRunning) {
      setCount(c => c + 1);
    }
  }, isRunning ? 1000 : null);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setIsRunning(!isRunning)}>
        {isRunning ? 'Pause' : 'Resume'}
      </button>
    </div>
  );
};
```

**Props:**
- `callback` (function): The function to call on each interval
- `delay` (number|null): Delay in milliseconds, or null to pause the interval

---

## ✅ Game-Specific Hooks

### **useGameState**
Generic hook for managing game state.

```jsx
import useGameState from '../hooks/useGameState';

const GameComponent = () => {
  const { state, setState, resetState } = useGameState({
    score: 0,
    level: 1,
    isPlaying: false
  });
};
```

### **useGameCompletion**
Detects game completion and triggers callbacks.

```jsx
import useGameCompletion from '../hooks/useGameCompletion';

const GameComponent = () => {
  const isComplete = (state) => state.gameOver;
  
  useGameCompletion(state, isComplete, (finalState) => {
    console.log('Game completed!', finalState);
  });
};
```

### **useDailySeed**
Returns deterministic seeds for daily games.

```jsx
import useDailySeed from '../hooks/useDailySeed';

const DailyGame = () => {
  const seed = useDailySeed({ date: '2024-01-15', slug: 'numberle' });
  // Use seed for consistent daily puzzles
};
```

---

## ✅ Best Practices

### **When to Use Each Hook**

- **useDebounce**: User input that triggers expensive operations (search, API calls)
- **useThrottle**: Continuous events that need rate limiting (scroll, resize, mouse move)
- **useInterval**: Periodic tasks that need cleanup (timers, animations, polling)

### **Performance Considerations**

- Use `React.memo` with hooks that return objects or arrays
- Memoize callback functions passed to hooks with `useCallback`
- Avoid creating hooks inside render functions

### **Testing Hooks**

Use the `TestHooks` component for testing hook functionality:

```jsx
import TestHooks from '../components/TestHooks';

// Temporarily add to any page for testing
<TestHooks />
```

---

## ✅ Migration Guide

### **From setInterval to useInterval**

```jsx
// Before
useEffect(() => {
  const interval = setInterval(() => {
    setCount(c => c + 1);
  }, 1000);
  return () => clearInterval(clearInterval);
}, []);

// After
useInterval(() => {
  setCount(c => c + 1);
}, 1000);
```

### **From manual debouncing to useDebounce**

```jsx
// Before
const [searchTerm, setSearchTerm] = useState('');
const [debouncedTerm, setDebouncedTerm] = useState('');

useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedTerm(searchTerm);
  }, 500);
  return () => clearTimeout(timer);
}, [searchTerm]);

// After
const debouncedTerm = useDebounce(searchTerm, 500);
```

---

*Follow this guide to optimize performance and maintain consistent patterns across Game Hub!* 