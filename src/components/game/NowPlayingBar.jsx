import React from "react";
import styles from "./NowPlayingBar.module.css";

/**
 * NowPlayingBar - Sticky bar for game pages (future: controls, share, etc.)
 *
 * Props:
 * - gameTitle: string (required)
 * - visible?: boolean (default false)
 *
 * This is scaffolded for future use and can be activated via layout config or game metadata.
 */
const NowPlayingBar = ({ gameTitle, visible = false }) => {
  if (!visible) return null;
  return (
    <div className={styles.nowPlayingBar} role="status" aria-live="polite">
      <span className={styles.text}>
        Now Playing: <strong>{gameTitle}</strong>
      </span>
      {/* Future: Add pause, sound, share buttons here */}
    </div>
  );
};

export default NowPlayingBar;
