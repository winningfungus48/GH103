import React, { useState } from "react";
import useDebounce from "../hooks/useDebounce";
import useThrottle from "../hooks/useThrottle";
import useInterval from "../hooks/useInterval";

/**
 * TestHooks - Component to test utility hooks functionality
 * This component can be temporarily added to any page for testing
 */
const TestHooks = () => {
  const [searchInput, setSearchInput] = useState("");
  const [scrollPosition, setScrollPosition] = useState(0);
  const [count, setCount] = useState(0);
  const [isIntervalRunning, setIsIntervalRunning] = useState(true);

  // Test useDebounce
  const debouncedSearch = useDebounce(searchInput, 500);

  // Test useThrottle
  const throttledScroll = useThrottle(scrollPosition, 100);

  // Test useInterval
  useInterval(
    () => {
      if (isIntervalRunning) {
        setCount((c) => c + 1);
      }
    },
    isIntervalRunning ? 1000 : null,
  );

  // Simulate scroll position changes
  const simulateScroll = () => {
    setScrollPosition((prev) => prev + 10);
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      <h2>Utility Hooks Test</h2>

      {/* useDebounce Test */}
      <div
        style={{
          marginBottom: "2rem",
          padding: "1rem",
          border: "1px solid #ccc",
        }}
      >
        <h3>useDebounce Test</h3>
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Type to test debounce..."
          style={{ width: "100%", padding: "0.5rem" }}
        />
        <p>
          <strong>Input:</strong> {searchInput}
        </p>
        <p>
          <strong>Debounced:</strong> {debouncedSearch}
        </p>
      </div>

      {/* useThrottle Test */}
      <div
        style={{
          marginBottom: "2rem",
          padding: "1rem",
          border: "1px solid #ccc",
        }}
      >
        <h3>useThrottle Test</h3>
        <button onClick={simulateScroll} style={{ marginRight: "1rem" }}>
          Simulate Scroll (+10)
        </button>
        <p>
          <strong>Scroll Position:</strong> {scrollPosition}
        </p>
        <p>
          <strong>Throttled:</strong> {throttledScroll}
        </p>
      </div>

      {/* useInterval Test */}
      <div
        style={{
          marginBottom: "2rem",
          padding: "1rem",
          border: "1px solid #ccc",
        }}
      >
        <h3>useInterval Test</h3>
        <button
          onClick={() => setIsIntervalRunning(!isIntervalRunning)}
          style={{ marginRight: "1rem" }}
        >
          {isIntervalRunning ? "Pause" : "Resume"} Counter
        </button>
        <p>
          <strong>Count:</strong> {count}
        </p>
        <p>
          <strong>Status:</strong> {isIntervalRunning ? "Running" : "Paused"}
        </p>
      </div>
    </div>
  );
};

export default TestHooks;
