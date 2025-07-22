// Dynamic import pattern for game components (lazy loading)
// Usage: import games from './gamesData';
// Each game's component is a React.lazy import, loaded only when needed.
import React from "react";

const Numberle = React.lazy(() => import("../games/numberle"));
const Wordle = React.lazy(() => import("../games/wordle"));
const Shapele = React.lazy(() => import("../games/shapele"));
const Simonle = React.lazy(() => import("../games/simonle"));
const Colorle = React.lazy(() => import("../games/colorle"));
const Mathle = React.lazy(() => import("../games/mathle"));
const Puzzlele = React.lazy(() => import("../games/puzzlele"));
const Memoryle = React.lazy(() => import("../games/memoryle"));
const NFLPlayerGuess = React.lazy(() => import("../games/nfl-player-guess"));
const MLBPlayerComparison = React.lazy(() => import("../games/mlb-player-comparison"));

const games = [
  {
    name: "Numberle",
    slug: "numberle",
    description:
      "A number-based Wordle variant where you guess the correct number in 6 tries.",
    instructions:
      "A number-based Wordle variant where you guess the correct number in 6 tries.",
    categories: ["-le games", "see more", "Daily Games"],
    component: Numberle,
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
    component: Wordle,
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
    component: Shapele,
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
    component: Simonle,
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
    component: Colorle,
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
    component: Mathle,
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
    component: Puzzlele,
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
    component: Memoryle,
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
    categories: ["Sports"],
    component: NFLPlayerGuess,
    metaDescription: "NFL Player Guess - Test your football knowledge by guessing players based on their 2024 season statistics.",
    keywords: ["nfl", "football", "player guess", "sports game", "browser game"],
    previewImage: "/assets/previews/nfl-player-guess.png",
    supportsDaily: false,
  },
  {
    name: "MLB Player Comparison",
    slug: "mlb-player-comparison",
    description: "Head-to-head stat comparisons between MLB players",
    instructions: "Andwer the question comparing two MLB pitchers head-to-head across 10 questions. Uses real 2025 MLB pitcher data.",
    categories: ["Sports"],
    component: MLBPlayerComparison,
    metaDescription: "MLB Player Comparison - Compare MLB pitchers head-to-head and test your baseball knowledge.",
    keywords: ["mlb", "baseball", "player comparison", "sports game", "browser game"],
    previewImage: "/assets/previews/mlb-player-comparison.png",
    supportsDaily: false,
  },
];

export default games;
