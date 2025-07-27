// Dynamic import pattern for game components (lazy loading)
// Usage: import games from './gamesData';
// Each game's component is dynamically imported only when needed.
import React from "react";

// Dynamic import functions for each game
const getNumberle = () => import("../games/numberle");
const getWordle = () => import("../games/wordle");
const getShapele = () => import("../games/shapele");
const getSimonle = () => import("../games/simonle");
const getColorle = () => import("../games/colorle");
const getMathle = () => import("../games/mathle");
const getPuzzlele = () => import("../games/puzzlele");
const getMemoryle = () => import("../games/memoryle");
const getNFLPlayerGuess = () => import("../games/nfl-player-guess");
const getMLBPlayerComparison = () => import("../games/mlb-player-comparison");
const getMLBPlayerGuess = () => import("../games/mlb-player-guess");
const getNBAPlayerGuess = () => import("../games/nba-player-guess");

const games = [
  {
    name: "Numberle",
    slug: "numberle",
    description:
      "A number-based Wordle variant where you guess the correct 5-digit number in 6 tries.",
    instructions:
      "A number-based Wordle variant where you guess the correct 5-digit number in 6 tries.",
    categories: ["-le games", "see more", "Daily Games", "Featured", "logic", "math"],
    component: React.lazy(getNumberle),
    metaDescription:
      "Numberle is a fun and free puzzle game where you guess the 5-digit number in 6 tries. A number-based twist on Wordle.",
    keywords: ["numberle", "math game", "puzzle", "logic", "browser game"],
    previewImage: "/assets/previews/numberle.png",
    supportsDaily: true,
    dailySettings: {
      seedSource: "date",
      difficulty: "medium",
    },
    dateAdded: "2024-01-15",
  },
  {
    name: "Wordle",
    slug: "wordle",
    description: "Guess the 5-letter word in 6 tries.",
    instructions: "Guess the 5-letter word in 6 tries.",
    categories: ["word games", "-le games", "Featured", "wordles"],
    component: React.lazy(getWordle),
    metaDescription: "Classic Wordle game - guess the word in 6 tries.",
    keywords: ["wordle", "word game", "puzzle", "browser game"],
    supportsDaily: true,
    dailySettings: {
      seedSource: "date",
      difficulty: "medium",
    },
    dateAdded: "2024-01-10",
  },
  {
    name: "Shapele",
    slug: "shapele",
    description: "Identify the odd shape out in a grid.",
    instructions: "Identify the odd shape out in a grid.",
    categories: ["memory games", "-le games", "Featured"],
    component: React.lazy(getShapele),
    metaDescription: "Find the different shape in the grid.",
    keywords: ["shapele", "memory game", "puzzle", "browser game"],
    supportsDaily: true,
    dailySettings: {
      seedSource: "date",
      difficulty: "easy",
    },
  },
  {
    name: "Simonle",
    slug: "simonle",
    description: "Repeat the pattern of flashing colors or sounds.",
    instructions: "Repeat the pattern of flashing colors or sounds.",
    categories: ["memory games", "-le games", "memory"],
    component: React.lazy(getSimonle),
    metaDescription: "Test your memory with Simon-style pattern matching.",
    keywords: ["simonle", "memory game", "puzzle", "browser game"],
    supportsDaily: true,
    dailySettings: {
      seedSource: "date",
      difficulty: "hard",
    },
  },
  {
    name: "Colorle",
    slug: "colorle",
    description: "Guess the color pattern in 6 tries. A new puzzle every day!",
    instructions: "Guess the color pattern in 6 tries. A new puzzle every day!",
    categories: ["-le games", "see more", "Daily Games"],
    component: React.lazy(getColorle),
    metaDescription: "Colorle is a fun and free puzzle game where you guess the color pattern in 6 tries. A colorful twist on Wordle.",
    keywords: ["colorle", "color game", "puzzle", "logic", "browser game"],
    previewImage: "/assets/previews/colorle.png",
    supportsDaily: true,
    dailySettings: {
      seedSource: "date",
      difficulty: "medium",
    },
  },
  {
    name: "Mathle",
    slug: "mathle",
    description: "Guess the 8-character mathematical equation in 6 tries. A new puzzle every day!",
    instructions: "Guess the 8-character mathematical equation in 6 tries. A new puzzle every day!",
    categories: ["-le games", "see more", "Daily Games", "logic", "math"],
    component: React.lazy(getMathle),
    metaDescription: "Mathle is a fun and free puzzle game where you guess the 8-character mathematical equation in 6 tries. A mathematical twist on Wordle.",
    keywords: ["mathle", "math game", "puzzle", "logic", "browser game", "equation"],
    previewImage: "/assets/previews/mathle.png",
    supportsDaily: true,
    dailySettings: {
      seedSource: "date",
      difficulty: "medium",
    },
  },
  {
    name: "Puzzlele",
    slug: "puzzlele",
    description: "Slide tiles to arrange them in order. A new puzzle every day!",
    instructions: "Slide tiles to arrange them in order. A new puzzle every day!",
    categories: ["-le games", "see more", "Daily Games", "puzzle games", "logic"],
    component: React.lazy(getPuzzlele),
    metaDescription: "Puzzlele is a fun and free sliding puzzle game where you arrange tiles in order. A classic puzzle with a modern twist.",
    keywords: ["puzzlele", "sliding puzzle", "puzzle", "logic", "browser game", "tiles"],
    previewImage: "/assets/previews/puzzlele.png",
    supportsDaily: true,
    dailySettings: {
      seedSource: "date",
      difficulty: "medium",
    },
  },
  {
    name: "Memoryle",
    slug: "memoryle",
    description: "Find matching pairs of cards. A new puzzle every day!",
    instructions: "Find matching pairs of cards. A new puzzle every day!",
    categories: ["-le games", "see more", "Daily Games", "memory games", "Featured", "memory"],
    component: React.lazy(getMemoryle),
    metaDescription: "Memoryle is a fun and free memory card matching game where you find pairs of cards. Test your memory skills!",
    keywords: ["memoryle", "memory game", "card matching", "puzzle", "browser game", "memory"],
    previewImage: "/assets/previews/memoryle.png",
    supportsDaily: true,
    dailySettings: {
      seedSource: "date",
      difficulty: "medium",
    },
  },
  {
    name: "NFL Player Guess",
    slug: "nfl-player-guess",
    description: "Guess the NFL player based on 2024 stats",
    instructions: "Guess the random NFL player. Search for players by name, team, or position. After 4 wrong guesses, you can use a team hint. After 6 wrong guesses, you can use an initial letter hint.",
    categories: ["Sports", "New"],
    component: React.lazy(getNFLPlayerGuess),
    metaDescription: "NFL Player Guess - Test your football knowledge by guessing players based on their 2024 season statistics.",
    keywords: ["nfl", "football", "player guess", "sports game", "browser game"],
    previewImage: "/assets/previews/nfl-player-guess.png",
    supportsDaily: false,
    dateAdded: "2024-12-01",
  },
  {
    name: "Pitcher Data Quiz",
    slug: "mlb-player-comparison",
    description: "Head-to-head stat comparisons between MLB pitchers",
    instructions: "Answer the question comparing two MLB pitchers head-to-head across 10 questions. Uses real 2025 MLB pitcher data.",
    categories: ["Sports", "New"],
    component: React.lazy(getMLBPlayerComparison),
    metaDescription: "Pitcher Data Quiz - Compare MLB pitchers head-to-head and test your baseball knowledge.",
    keywords: ["mlb", "baseball", "pitcher quiz", "sports game", "browser game"],
    previewImage: "/assets/previews/mlb-player-comparison.png",
    supportsDaily: false,
    dateAdded: "2024-12-05",
  },
  {
    name: "MLB Player Guess",
    slug: "mlb-player-guess",
    description: "Guess the MLB player based on 2025 stats",
    instructions: "Guess the hidden MLB player in 8 tries! Search for players by name, team, or league. After 4 wrong guesses, you can use a team hint. After 6 wrong guesses, you can use an initial letter hint. Compare stats like age, team, league, runs, stolen bases, home runs, and OPS to find the target player.",
    categories: ["Sports"],
    component: React.lazy(getMLBPlayerGuess),
    metaDescription: "MLB Player Guess - Test your baseball knowledge by guessing players based on their 2025 season statistics.",
    keywords: ["mlb", "baseball", "player guess", "sports game", "browser game"],
    previewImage: "/assets/previews/mlb-player-guess.png",
    supportsDaily: false,
  },
  {
    name: "NBA Player Guess",
    slug: "nba-player-guess",
    description: "Guess the NBA player based on 2024 stats",
    instructions: "Guess the hidden NBA player in 8 tries! Search for players by name, team, conference, or position. After 4 wrong guesses, you can use a team hint. After 6 wrong guesses, you can use an initial letter hint. Compare stats like age, team, conference, position, points per game, rebounds per game, and assists per game to find the target player.",
    categories: ["Sports", "New"],
    component: React.lazy(getNBAPlayerGuess),
    metaDescription: "NBA Player Guess - Test your basketball knowledge by guessing players based on their 2024 season statistics.",
    keywords: ["nba", "basketball", "player guess", "sports game", "browser game"],
    previewImage: "/assets/previews/nba-player-guess.png",
    supportsDaily: false,
    dateAdded: "2024-12-10",
  },
];

export default games;
