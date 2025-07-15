export const games = [
  {
    id: 1,
    title: "Wordle",
    description: "Guess the hidden word in six tries. A new puzzle every day!",
    categories: ["-le Games", "A-Z Games"],
    route: "/games/wordle",
  },
  {
    id: 7,
    title: "Numberle",
    description: "Guess the 5-digit number in six tries. A new puzzle every day!",
    categories: ["-le Games", "A-Z Games", "Daily Games"],
    route: "/games/numberle",
    supportsDaily: true,
  },
  {
    id: 2,
    title: "Sudoku",
    description:
      "Fill the grid so every row, column, and box contains the numbers 1-9.",
    categories: ["A-Z Games", "Favorites"],
    route: "/games/sudoku",
  },
  {
    id: 3,
    title: "Chess",
    description:
      "Challenge your mind with classic chess against the computer or a friend.",
    categories: ["A-Z Games", "Favorites", "Sports"],
    route: "/games/chess",
  },
  {
    id: 4,
    title: "Mini Golf",
    description:
      "Test your aim and skill in this fun and challenging mini golf game.",
    categories: ["Sports"],
    route: "/games/minigolf",
  },
  {
    id: 5,
    title: "2048",
    description: "Combine tiles to reach 2048 in this addictive puzzle game.",
    categories: ["A-Z Games"],
    route: "/games/2048",
  },
  {
    id: 6,
    title: "Memory Match",
    description:
      "Flip cards and find all the pairs in as few moves as possible.",
    categories: ["A-Z Games", "Favorites"],
    route: "/games/memory-match",
  },
];
