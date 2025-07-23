import React, { useState } from "react";
import SlidingPanel from "./SlidingPanel";
import styles from "./SlidingPanelTest.module.css";

const SlidingPanelTest = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return (
    <div className={styles.testContainer}>
      <h2>SlidingPanel Test</h2>
      <p>Click the button below to test the sliding panel functionality.</p>
      
      <button 
        className={styles.testButton}
        onClick={handleOpen}
        aria-label="Open sliding panel"
      >
        Open Sliding Panel
      </button>

      <SlidingPanel
        isOpen={isOpen}
        onClose={handleClose}
        title="Test Panel"
        width="70%"
      >
        <div className={styles.testContent}>
          <h3>Test Content</h3>
          <p>This is a test of the sliding panel component.</p>
          <p>You can close this panel by:</p>
          <ul>
            <li>Clicking the X button</li>
            <li>Clicking outside the panel</li>
            <li>Pressing the Escape key</li>
          </ul>
          
          <div className={styles.testButtons}>
            <button onClick={() => alert("Button 1 clicked!")}>
              Test Button 1
            </button>
            <button onClick={() => alert("Button 2 clicked!")}>
              Test Button 2
            </button>
            <button onClick={handleClose}>
              Close Panel
            </button>
          </div>
          
          <p>This content should be scrollable if it's long enough.</p>
          {Array.from({ length: 20 }, (_, i) => (
            <p key={i}>Scroll test line {i + 1}</p>
          ))}
        </div>
      </SlidingPanel>
    </div>
  );
};

export default SlidingPanelTest; 