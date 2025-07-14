# Game Template & Scaffolding Guide

## Folder Structure

```
src/games/[slug]/
  ├── [GameName].jsx         # Main React component
  ├── [slug]-styles.module.css # CSS module for game-specific styles
  ├── [slug]-logo.svg        # (Optional) Game logo or assets
  └── index.jsx              # Exports the main component
```

## Sample Game Component ([GameName].jsx)
```jsx
import React from 'react';
import GamePageLayout from '../../components/game/GamePageLayout';
import GameHeader from '../../components/game/GameHeader';
import styles from './[slug]-styles.module.css';

const [GameName] = () => (
  <GamePageLayout>
    <GameHeader title="[Game Name]" />
    <div className={styles.gameContent}>
      {/* Game content goes here */}
    </div>
  </GamePageLayout>
);

export default [GameName];
```

## Sample index.jsx
```jsx
import [GameName] from './[GameName].jsx';
export default [GameName];
```

## Sample CSS Module ([slug]-styles.module.css)
```css
.gameContent {
  /* Add your game-specific styles here */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}
```

## Usage
- Copy this folder structure and files for each new game.
- Register the game in `src/data/gamesData.jsx`. 