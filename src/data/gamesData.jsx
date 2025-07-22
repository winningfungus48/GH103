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

const games = [
  {
    name: "Numberle",
    slug: "numberle",
    description:
      "A number-based Wordle variant where you guess the correct number in 6 tries.",
    instructions:
      "A number-based Wordle variant where you guess the correct number in 6 tries.",
    categories: ["-le games", "see more", "Daily Games"],
    component: React.lazy(getNumberle),
    metaDescription:
      "Numberle is a fun and free puzzle game where you guess the number in 6 tries. A math-based twist on Wordle.",
    keywords: ["numberle", "math game", "puzzle", "logic", "browser game"],
    previewImage: "/assets/previews/numberle.png",
    supportsDaily: true,
    dailySettings: {
      seedSource: "date",
      difficulty: "medium",
    },
  },
  {
    name: "Wordle",
    slug: "wordle",
    description: "Guess the 5-letter word in 6 tries.",
    instructions: "Guess the 5-letter word in 6 tries.",
    categories: ["word games", "-le games"],
    component: React.lazy(getWordle),
    metaDescription: "Classic Wordle game - guess the word in 6 tries.",
    keywords: ["wordle", "word game", "puzzle", "browser game"],
    supportsDaily: true,
    dailySettings: {
      seedSource: "date",
      difficulty: "medium",
    },
  },
  {
    name: "Shapele",
    slug: "shapele",
    description: "Identify the odd shape out in a grid.",
    instructions: "Identify the odd shape out in a grid.",
    categories: ["memory games", "-le games"],
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
    categories: ["memory games", "-le games"],
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
    description: "Guess the mathematical equation in 6 tries. A new puzzle every day!",
    instructions: "Guess the mathematical equation in 6 tries. A new puzzle every day!",
    categories: ["-le games", "see more", "Daily Games", "logic games"],
    component: React.lazy(getMathle),
    metaDescription: "Mathle is a fun and free puzzle game where you guess the mathematical equation in 6 tries. A mathematical twist on Wordle.",
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
    categories: ["-le games", "see more", "Daily Games", "puzzle games"],
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
    categories: ["-le games", "see more", "Daily Games", "memory games"],
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
    instructions: "Guess the NFL player based on 2024 stats",
    categories: ["Sports"],
    component: React.lazy(getNFLPlayerGuess),
    metaDescription: "NFL Player Guess - Test your football knowledge by guessing players based on their 2024 season statistics.",
    keywords: ["nfl", "football", "player guess", "sports game", "browser game"],
    previewImage: "/assets/previews/nfl-player-guess.png",
    supportsDaily: false,
  },
  {
    name: "MLB Player Comparison",
    slug: "mlb-player-comparison",
    description: "Head-to-head stat comparisons between MLB players",
    instructions: "Head-to-head stat comparisons between MLB players",
    categories: ["Sports"],
    component: React.lazy(getMLBPlayerComparison),
    metaDescription: "MLB Player Comparison - Compare MLB pitchers head-to-head and test your baseball knowledge.",
    keywords: ["mlb", "baseball", "player comparison", "sports game", "browser game"],
    previewImage: "/assets/previews/mlb-player-comparison.png",
    supportsDaily: false,
  },
];

export default games;
