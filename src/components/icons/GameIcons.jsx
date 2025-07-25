import React from "react";

// Wordle Icon - Green gradient background with white W in black square
export const WordleIcon = ({ className = "", size = 48 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="wordleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{stopColor: "#10b981", stopOpacity: 1}} />
        <stop offset="100%" style={{stopColor: "#059669", stopOpacity: 1}} />
      </linearGradient>
    </defs>
    <rect width="48" height="48" rx="8" fill="url(#wordleGradient)" />
    <rect x="12" y="12" width="24" height="24" rx="2" fill="black" />
    <text
      x="24"
      y="28"
      textAnchor="middle"
      fill="white"
      fontSize="16"
      fontWeight="bold"
      fontFamily="Arial, sans-serif"
    >
      W
    </text>
  </svg>
);

// Numberle Icon - Simple numbers
export const NumberleIcon = ({ className = "", size = 48 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="numberleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{stopColor: "#6366f1", stopOpacity: 1}} />
        <stop offset="100%" style={{stopColor: "#4f46e5", stopOpacity: 1}} />
      </linearGradient>
    </defs>
    <rect width="48" height="48" rx="8" fill="url(#numberleGradient)" />
    <text
      x="24"
      y="20"
      textAnchor="middle"
      fill="white"
      fontSize="14"
      fontWeight="bold"
      fontFamily="Arial, sans-serif"
    >
      12
    </text>
    <text
      x="24"
      y="32"
      textAnchor="middle"
      fill="white"
      fontSize="14"
      fontWeight="bold"
      fontFamily="Arial, sans-serif"
    >
      34
    </text>
  </svg>
);

// Sudoku Icon - Grid with numbers
export const SudokuIcon = ({ className = "", size = 48 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="48" height="48" rx="8" fill="#FFD700" />
    <rect x="8" y="8" width="32" height="32" rx="2" fill="white" stroke="#333" strokeWidth="1" />
    {/* Grid lines */}
    <line x1="16" y1="8" x2="16" y2="40" stroke="#333" strokeWidth="1" />
    <line x1="24" y1="8" x2="24" y2="40" stroke="#333" strokeWidth="1" />
    <line x1="32" y1="8" x2="32" y2="40" stroke="#333" strokeWidth="1" />
    <line x1="8" y1="16" x2="40" y2="16" stroke="#333" strokeWidth="1" />
    <line x1="8" y1="24" x2="40" y2="24" stroke="#333" strokeWidth="1" />
    <line x1="8" y1="32" x2="40" y2="32" stroke="#333" strokeWidth="1" />
    {/* Sample numbers */}
    <text x="12" y="22" fill="#333" fontSize="8" fontFamily="Arial, sans-serif">1</text>
    <text x="20" y="22" fill="#333" fontSize="8" fontFamily="Arial, sans-serif">2</text>
    <text x="28" y="22" fill="#333" fontSize="8" fontFamily="Arial, sans-serif">3</text>
    <text x="12" y="30" fill="#333" fontSize="8" fontFamily="Arial, sans-serif">4</text>
    <text x="20" y="30" fill="#333" fontSize="8" fontFamily="Arial, sans-serif">5</text>
    <text x="28" y="30" fill="#333" fontSize="8" fontFamily="Arial, sans-serif">6</text>
  </svg>
);

// Chess Icon - Chess board pattern
export const ChessIcon = ({ className = "", size = 48 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="48" height="48" rx="8" fill="#8B4513" />
    <rect x="8" y="8" width="32" height="32" rx="2" fill="#DEB887" />
    {/* Chess board pattern */}
    <rect x="8" y="8" width="8" height="8" fill="#8B4513" />
    <rect x="24" y="8" width="8" height="8" fill="#8B4513" />
    <rect x="16" y="16" width="8" height="8" fill="#8B4513" />
    <rect x="32" y="16" width="8" height="8" fill="#8B4513" />
    <rect x="8" y="24" width="8" height="8" fill="#8B4513" />
    <rect x="24" y="24" width="8" height="8" fill="#8B4513" />
    <rect x="16" y="32" width="8" height="8" fill="#8B4513" />
    <rect x="32" y="32" width="8" height="8" fill="#8B4513" />
  </svg>
);

// Mini Golf Icon - Green with golf ball and hole
export const MiniGolfIcon = ({ className = "", size = 48 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="48" height="48" rx="8" fill="#228B22" />
    {/* Golf ball */}
    <circle cx="16" cy="24" r="4" fill="white" />
    {/* Golf hole */}
    <circle cx="32" cy="24" r="6" fill="black" />
    <circle cx="32" cy="24" r="4" fill="#228B22" />
    {/* Flag */}
    <line x1="36" y1="16" x2="36" y2="32" stroke="white" strokeWidth="2" />
    <polygon points="36,16 42,20 36,24" fill="red" />
  </svg>
);

// 2048 Icon - Colorful tiles
export const Game2048Icon = ({ className = "", size = 48 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="48" height="48" rx="8" fill="#FF6B6B" />
    <rect x="8" y="8" width="8" height="8" rx="2" fill="#FFE66D" />
    <rect x="18" y="8" width="8" height="8" rx="2" fill="#4ECDC4" />
    <rect x="28" y="8" width="8" height="8" rx="2" fill="#45B7D1" />
    <rect x="38" y="8" width="8" height="8" rx="2" fill="#96CEB4" />
    <rect x="8" y="18" width="8" height="8" rx="2" fill="#FFEAA7" />
    <rect x="18" y="18" width="8" height="8" rx="2" fill="#DDA0DD" />
    <rect x="28" y="18" width="8" height="8" rx="2" fill="#98D8C8" />
    <rect x="38" y="18" width="8" height="8" rx="2" fill="#F7DC6F" />
    <rect x="8" y="28" width="8" height="8" rx="2" fill="#BB8FCE" />
    <rect x="18" y="28" width="8" height="8" rx="2" fill="#85C1E9" />
    <rect x="28" y="28" width="8" height="8" rx="2" fill="#F8C471" />
    <rect x="38" y="28" width="8" height="8" rx="2" fill="#82E0AA" />
    <rect x="8" y="38" width="8" height="8" rx="2" fill="#F1948A" />
    <rect x="18" y="38" width="8" height="8" rx="2" fill="#85C1E9" />
    <rect x="28" y="38" width="8" height="8" rx="2" fill="#F7DC6F" />
    <rect x="38" y="38" width="8" height="8" rx="2" fill="#D7BDE2" />
  </svg>
);

// Memory Match Icon - Cards with symbols
export const MemoryMatchIcon = ({ className = "", size = 48 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="48" height="48" rx="8" fill="#9B59B6" />
    {/* Card 1 */}
    <rect x="8" y="8" width="12" height="16" rx="2" fill="white" stroke="#333" strokeWidth="1" />
    <circle cx="14" cy="16" r="3" fill="#E74C3C" />
    {/* Card 2 */}
    <rect x="22" y="8" width="12" height="16" rx="2" fill="white" stroke="#333" strokeWidth="1" />
    <polygon points="28,12 30,18 26,18" fill="#3498DB" />
    {/* Card 3 */}
    <rect x="8" y="26" width="12" height="16" rx="2" fill="white" stroke="#333" strokeWidth="1" />
    <rect x="12" y="30" width="4" height="4" fill="#F39C12" />
    {/* Card 4 */}
    <rect x="22" y="26" width="12" height="16" rx="2" fill="white" stroke="#333" strokeWidth="1" />
    <circle cx="28" cy="34" r="3" fill="#E74C3C" />
  </svg>
);

// Simonle Icon - Colorful circles
export const SimonleIcon = ({ className = "", size = 48 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="48" height="48" rx="8" fill="#2C3E50" />
    {/* Top left - Red */}
    <circle cx="16" cy="16" r="8" fill="#E74C3C" />
    {/* Top right - Blue */}
    <circle cx="32" cy="16" r="8" fill="#3498DB" />
    {/* Bottom left - Green */}
    <circle cx="16" cy="32" r="8" fill="#2ECC71" />
    {/* Bottom right - Yellow */}
    <circle cx="32" cy="32" r="8" fill="#F1C40F" />
  </svg>
);

// Shapele Icon - Geometric shapes
export const ShapeleIcon = ({ className = "", size = 48 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="48" height="48" rx="8" fill="#E67E22" />
    {/* Triangle */}
    <polygon points="24,8 16,24 32,24" fill="#F39C12" />
    {/* Circle */}
    <circle cx="24" cy="32" r="6" fill="#E74C3C" />
    {/* Square */}
    <rect x="12" y="12" width="8" height="8" fill="#3498DB" />
  </svg>
);

// Colorle Icon - Simple color palette
export const ColorleIcon = ({ className = "", size = 48 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="colorleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{stopColor: "#8b5cf6", stopOpacity: 1}} />
        <stop offset="100%" style={{stopColor: "#7c3aed", stopOpacity: 1}} />
      </linearGradient>
    </defs>
    <rect width="48" height="48" rx="8" fill="url(#colorleGradient)" />
    {/* Simple color palette */}
    <circle cx="16" cy="16" r="4" fill="#E74C3C" />
    <circle cx="24" cy="16" r="4" fill="#3498DB" />
    <circle cx="32" cy="16" r="4" fill="#2ECC71" />
    <circle cx="20" cy="24" r="4" fill="#F1C40F" />
    <circle cx="28" cy="24" r="4" fill="#9B59B6" />
  </svg>
);

// Mathle Icon - Simple abacus
export const MathleIcon = ({ className = "", size = 48 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="mathleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{stopColor: "#10b981", stopOpacity: 1}} />
        <stop offset="100%" style={{stopColor: "#059669", stopOpacity: 1}} />
      </linearGradient>
    </defs>
    <rect width="48" height="48" rx="8" fill="url(#mathleGradient)" />
    {/* Simple abacus */}
    <rect x="12" y="16" width="24" height="16" fill="white" rx="2" />
    <line x1="16" y1="20" x2="32" y2="20" stroke="#10b981" strokeWidth="2" />
    <line x1="16" y1="24" x2="32" y2="24" stroke="#10b981" strokeWidth="2" />
    <line x1="16" y1="28" x2="32" y2="28" stroke="#10b981" strokeWidth="2" />
    {/* Beads */}
    <circle cx="18" cy="20" r="2" fill="#ef4444" />
    <circle cx="22" cy="20" r="2" fill="#f59e0b" />
    <circle cx="26" cy="24" r="2" fill="#ef4444" />
    <circle cx="30" cy="24" r="2" fill="#f59e0b" />
    <circle cx="20" cy="28" r="2" fill="#ef4444" />
    <circle cx="24" cy="28" r="2" fill="#f59e0b" />
  </svg>
);

// Puzzlele Icon - Puzzle pieces
export const PuzzleleIcon = ({ className = "", size = 48 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="48" height="48" rx="8" fill="#8E44AD" />
    {/* Puzzle piece 1 */}
    <path d="M12 12 L20 12 L20 20 L28 20 L28 28 L20 28 L20 36 L12 36 Z" fill="#E74C3C" />
    {/* Puzzle piece 2 */}
    <path d="M28 12 L36 12 L36 20 L28 20 Z" fill="#3498DB" />
    {/* Puzzle piece 3 */}
    <path d="M12 28 L20 28 L20 36 L12 36 Z" fill="#F39C12" />
  </svg>
);

// Memoryle Icon - Simple puzzle piece
export const MemoryleIcon = ({ className = "", size = 48 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="memoryleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{stopColor: "#f59e0b", stopOpacity: 1}} />
        <stop offset="100%" style={{stopColor: "#d97706", stopOpacity: 1}} />
      </linearGradient>
    </defs>
    <rect width="48" height="48" rx="8" fill="url(#memoryleGradient)" />
    {/* Simple puzzle piece */}
    <path d="M16 16 L24 16 L24 24 L32 24 L32 32 L24 32 L24 24 L16 24 Z" fill="white" />
  </svg>
);

// Sports Icons
export const NFLPlayerGuessIcon = ({ className = "", size = 48 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="nflGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{stopColor: "#8b4513", stopOpacity: 1}} />
        <stop offset="100%" style={{stopColor: "#a0522d", stopOpacity: 1}} />
      </linearGradient>
    </defs>
    <rect width="48" height="48" rx="8" fill="url(#nflGradient)" />
    {/* Simple football */}
    <ellipse cx="24" cy="24" rx="12" ry="6" fill="#8B4513" stroke="white" strokeWidth="2" />
    {/* Simple laces */}
    <path d="M12 24 L36 24" stroke="white" strokeWidth="1" />
    <path d="M20 22 L20 26" stroke="white" strokeWidth="1" />
    <path d="M24 22 L24 26" stroke="white" strokeWidth="1" />
    <path d="M28 22 L28 26" stroke="white" strokeWidth="1" />
  </svg>
);

export const NBAPlayerGuessIcon = ({ className = "", size = 48 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="nbaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{stopColor: "#f97316", stopOpacity: 1}} />
        <stop offset="100%" style={{stopColor: "#ea580c", stopOpacity: 1}} />
      </linearGradient>
    </defs>
    <rect width="48" height="48" rx="8" fill="url(#nbaGradient)" />
    {/* Simple basketball */}
    <circle cx="24" cy="24" r="12" fill="#f97316" stroke="white" strokeWidth="2" />
    {/* Simple lines */}
    <path d="M12 24 L36 24" stroke="white" strokeWidth="1" />
    <path d="M24 12 L24 36" stroke="white" strokeWidth="1" />
  </svg>
);

export const MLBPlayerGuessIcon = ({ className = "", size = 48 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="mlbGuessGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{stopColor: "#ef4444", stopOpacity: 1}} />
        <stop offset="100%" style={{stopColor: "#dc2626", stopOpacity: 1}} />
      </linearGradient>
    </defs>
    <rect width="48" height="48" rx="8" fill="url(#mlbGuessGradient)" />
    {/* Simple baseball stadium */}
    <rect x="12" y="16" width="24" height="16" fill="white" rx="2" />
    <rect x="14" y="18" width="20" height="12" fill="#ef4444" rx="1" />
    {/* Simple field */}
    <circle cx="24" cy="24" r="3" fill="white" />
  </svg>
);

export const MLBPlayerComparisonIcon = ({ className = "", size = 48 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="mlbComparisonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{stopColor: "#3b82f6", stopOpacity: 1}} />
        <stop offset="100%" style={{stopColor: "#2563eb", stopOpacity: 1}} />
      </linearGradient>
    </defs>
    <rect width="48" height="48" rx="8" fill="url(#mlbComparisonGradient)" />
    {/* Single baseball with red stitching */}
    <circle cx="24" cy="24" r="12" fill="white" />
    {/* Baseball stitching */}
    <path d="M12 24 Q24 12 36 24" stroke="#ef4444" strokeWidth="2" fill="none" />
    <path d="M12 24 Q24 36 36 24" stroke="#ef4444" strokeWidth="2" fill="none" />
  </svg>
);

// Default Icon for games without specific icons
export const DefaultGameIcon = ({ className = "", size = 48 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="48" height="48" rx="8" fill="#95A5A6" />
    <circle cx="24" cy="24" r="12" fill="white" />
    <text
      x="24"
      y="28"
      textAnchor="middle"
      fill="#95A5A6"
      fontSize="12"
      fontWeight="bold"
      fontFamily="Arial, sans-serif"
    >
      ?
    </text>
  </svg>
);

// Icon mapping function
export const getGameIcon = (gameTitle, className = "", size = 48) => {
  const iconMap = {
    // Original games
    "Wordle": <WordleIcon className={className} size={size} />,
    "Numberle": <NumberleIcon className={className} size={size} />,
    "Sudoku": <SudokuIcon className={className} size={size} />,
    "Chess": <ChessIcon className={className} size={size} />,
    "Mini Golf": <MiniGolfIcon className={className} size={size} />,
    "2048": <Game2048Icon className={className} size={size} />,
    "Memory Match": <MemoryMatchIcon className={className} size={size} />,
    
    // -le Games
    "Simonle": <SimonleIcon className={className} size={size} />,
    "Shapele": <ShapeleIcon className={className} size={size} />,
    "Colorle": <ColorleIcon className={className} size={size} />,
    "Mathle": <MathleIcon className={className} size={size} />,
    "Puzzlele": <PuzzleleIcon className={className} size={size} />,
    "Memoryle": <MemoryleIcon className={className} size={size} />,
    
    // Sports Games
    "NFL Player Guess": <NFLPlayerGuessIcon className={className} size={size} />,
    "NBA Player Guess": <NBAPlayerGuessIcon className={className} size={size} />,
    "MLB Player Guess": <MLBPlayerGuessIcon className={className} size={size} />,
    "MLB Player Comparison": <MLBPlayerComparisonIcon className={className} size={size} />,
  };

  return iconMap[gameTitle] || <DefaultGameIcon className={className} size={size} />;
}; 