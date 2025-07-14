#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const [,, slug, ...rest] = process.argv;
if (!slug) {
  console.error('Usage: node scaffold-game.js <game-slug> [GameName]');
  process.exit(1);
}
const gameName = rest[0] || slug.charAt(0).toUpperCase() + slug.slice(1);
const gameDir = path.join(__dirname, '../src/games', slug);

if (fs.existsSync(gameDir)) {
  console.error(`Directory ${gameDir} already exists.`);
  process.exit(1);
}
fs.mkdirSync(gameDir, { recursive: true });

// Game component
const component = `import React from 'react';
import GamePageLayout from '../../components/game/GamePageLayout';
import GameHeader from '../../components/game/GameHeader';
import styles from './${slug}-styles.module.css';

const ${gameName} = () => (
  <GamePageLayout>
    <GameHeader title="${gameName}" />
    <div className={styles.gameContent}>
      {/* Game content goes here */}
    </div>
  </GamePageLayout>
);

export default ${gameName};
`;

// index.jsx
const index = `import ${gameName} from './${gameName}.jsx';
export default ${gameName};
`;

// CSS module
const css = `.gameContent {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}
`;

fs.writeFileSync(path.join(gameDir, `${gameName}.jsx`), component);
fs.writeFileSync(path.join(gameDir, 'index.jsx'), index);
fs.writeFileSync(path.join(gameDir, `${slug}-styles.module.css`), css);

console.log(`Scaffolded new game: ${gameName} in ${gameDir}`); 