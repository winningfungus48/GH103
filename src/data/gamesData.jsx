// Dynamic import pattern for game components (lazy loading)
// Usage: import games from './gamesData';
// Each game's component is a React.lazy import, loaded only when needed.
import React from 'react';

const Numberle = React.lazy(() => import('../games/numberle'));
const Wordle = React.lazy(() => import('../games/wordle'));
const Shapele = React.lazy(() => import('../games/shapele'));
const Simonle = React.lazy(() => import('../games/simonle'));

const games = [
  {
    name: 'Numberle',
    slug: 'numberle',
    description: 'A number-based Wordle variant where you guess the correct number in 6 tries.',
    categories: ['-le games', 'see more', 'Daily Games'],
    component: Numberle,
    metaDescription: 'Numberle is a fun and free puzzle game where you guess the number in 6 tries. A math-based twist on Wordle.',
    keywords: ['numberle', 'math game', 'puzzle', 'logic', 'browser game'],
    previewImage: '/assets/previews/numberle.png',
    supportsDaily: true,
    dailySettings: {
      seedSource: "date",
      difficulty: "medium"
    }
  },
  {
    name: 'Wordle',
    slug: 'wordle',
    description: 'Guess the 5-letter word in 6 tries.',
    categories: ['word games', '-le games'],
    component: Wordle,
    metaDescription: 'Classic Wordle game - guess the word in 6 tries.',
    keywords: ['wordle', 'word game', 'puzzle', 'browser game'],
    supportsDaily: true,
    dailySettings: {
      seedSource: "date",
      difficulty: "medium"
    }
  },
  {
    name: 'Shapele',
    slug: 'shapele',
    description: 'Identify the odd shape out in a grid.',
    categories: ['memory games', '-le games'],
    component: Shapele,
    metaDescription: 'Find the different shape in the grid.',
    keywords: ['shapele', 'memory game', 'puzzle', 'browser game'],
    supportsDaily: true,
    dailySettings: {
      seedSource: "date",
      difficulty: "easy"
    }
  },
  {
    name: 'Simonle',
    slug: 'simonle',
    description: 'Repeat the pattern of flashing colors or sounds.',
    categories: ['memory games', '-le games'],
    component: Simonle,
    metaDescription: 'Test your memory with Simon-style pattern matching.',
    keywords: ['simonle', 'memory game', 'puzzle', 'browser game'],
    supportsDaily: true,
    dailySettings: {
      seedSource: "date",
      difficulty: "hard"
    }
  }
];

export default games;
