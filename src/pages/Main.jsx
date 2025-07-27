import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import MazeGrid from '../components/MazeGrid';
import GameIcon from '../components/GameIcon';
import PlayerAvatar from '../components/PlayerAvatar';
import { WordleIcon, NumberleIcon, ShapeleIcon, SimonleIcon, ColorleIcon, MathleIcon, PuzzleleIcon, MemoryleIcon, NFLPlayerGuessIcon, MLBPlayerComparisonIcon, MLBPlayerGuessIcon, NBAPlayerGuessIcon } from '../components/icons/GameIcons';
import '../components/MazeGrid.css';
import '../components/GameIcon.css';
import '../components/PlayerAvatar.css';
import styles from './Main.module.css';

const gameIcons = [
  { Icon: WordleIcon, label: 'Wordle', route: '/game/wordle' },
  { Icon: NumberleIcon, label: 'Numberle', route: '/game/numberle' },
  { Icon: ShapeleIcon, label: 'Shapele', route: '/game/shapele' },
  { Icon: SimonleIcon, label: 'Simonle', route: '/game/simonle' },
  { Icon: ColorleIcon, label: 'Colorle', route: '/game/colorle' },
  { Icon: MathleIcon, label: 'Mathle', route: '/game/mathle' },
  { Icon: PuzzleleIcon, label: 'Puzzlele', route: '/game/puzzlele' },
  { Icon: MemoryleIcon, label: 'Memoryle', route: '/game/memoryle' },
  { Icon: NFLPlayerGuessIcon, label: 'NFL Player Guess', route: '/game/nfl-player-guess' },
      { Icon: MLBPlayerComparisonIcon, label: 'Pitcher Data Quiz', route: '/game/mlb-player-comparison' },
  { Icon: MLBPlayerGuessIcon, label: 'MLB Player Guess', route: '/game/mlb-player-guess' },
  { Icon: NBAPlayerGuessIcon, label: 'NBA Player Guess', route: '/game/nba-player-guess' },
];

// Valid positions in the maze (corridor-based coordinates)
const VALID_POSITIONS = new Set([
  // Main corridor (columns 9-11, rows 0-14) - NOT including wall columns 8 and 12
  '9,0', '9,1', '9,2', '9,3', '9,4', '9,5', '9,6', '9,7', '9,8', '9,9', '9,10', '9,11', '9,12', '9,13', '9,14',
  '10,0', '10,1', '10,2', '10,3', '10,4', '10,5', '10,6', '10,7', '10,8', '10,9', '10,10', '10,11', '10,12', '10,13', '10,14',
  '11,0', '11,1', '11,2', '11,3', '11,4', '11,5', '11,6', '11,7', '11,8', '11,9', '11,10', '11,11', '11,12', '11,13', '11,14',
  
  // Left corridors (columns 2-7, specific rows) - NOT including wall column 8
  '2,2', '3,2', '4,2', '5,2', '6,2', '7,2',
  '2,4', '3,4', '4,4', '5,4', '6,4', '7,4',
  '2,6', '3,6', '4,6', '5,6', '6,6', '7,6',
  '2,8', '3,8', '4,8', '5,8', '6,8', '7,8',
  '2,10', '3,10', '4,10', '5,10', '6,10', '7,10',
  '2,12', '3,12', '4,12', '5,12', '6,12', '7,12',
  
  // Right corridors (columns 13-18, specific rows) - NOT including wall column 12
  '13,2', '14,2', '15,2', '16,2', '17,2', '18,2',
  '13,4', '14,4', '15,4', '16,4', '17,4', '18,4',
  '13,6', '14,6', '15,6', '16,6', '17,6', '18,6',
  '13,8', '14,8', '15,8', '16,8', '17,8', '18,8',
  '13,10', '14,10', '15,10', '16,10', '17,10', '18,10',
  '13,12', '14,12', '15,12', '16,12', '17,12', '18,12',
  
  // Connection points between main corridor and side corridors
  // These allow the avatar to move from main corridor to side corridors
  '8,2', '8,4', '8,6', '8,8', '8,10', '8,12', // Left connections (column 8)
  '12,2', '12,4', '12,6', '12,8', '12,10', '12,12', // Right connections (column 12)
  
  // Additional corridor positions to ensure all games are reachable
  // These fill in any gaps in the corridor system
  '8,3', '8,5', '8,7', '8,9', '8,11', '8,13', // Left corridor extensions
  '12,3', '12,5', '12,7', '12,9', '12,11', '12,13', // Right corridor extensions
  
  // Missing row 11 corridors - this was the issue!
  '2,11', '3,11', '4,11', '5,11', '6,11', '7,11', // Left corridor row 11
  '13,11', '14,11', '15,11', '16,11', '17,11', '18,11', // Right corridor row 11
  
  // ALL missing odd-numbered rows for complete corridor coverage
  // Row 1
  '2,1', '3,1', '4,1', '5,1', '6,1', '7,1', '8,1', '12,1', '13,1', '14,1', '15,1', '16,1', '17,1', '18,1',
  // Row 3
  '2,3', '3,3', '4,3', '5,3', '6,3', '7,3', '8,3', '12,3', '13,3', '14,3', '15,3', '16,3', '17,3', '18,3',
  // Row 5
  '2,5', '3,5', '4,5', '5,5', '6,5', '7,5', '8,5', '12,5', '13,5', '14,5', '15,5', '16,5', '17,5', '18,5',
  // Row 7
  '2,7', '3,7', '4,7', '5,7', '6,7', '7,7', '8,7', '12,7', '13,7', '14,7', '15,7', '16,7', '17,7', '18,7',
  // Row 9
  '2,9', '3,9', '4,9', '5,9', '6,9', '7,9', '8,9', '12,9', '13,9', '14,9', '15,9', '16,9', '17,9', '18,9',
  // Row 13
  '2,13', '3,13', '4,13', '5,13', '6,13', '7,13', '8,13', '12,13', '13,13', '14,13', '15,13', '16,13', '17,13', '18,13',
]);

// Game positions (at the end of corridors)
const GAME_POSITIONS = [
  { x: 2, y: 2, gameIndex: 0 },   // Wordle
  { x: 2, y: 4, gameIndex: 1 },  // Numberle
  { x: 2, y: 6, gameIndex: 2 },  // Shapele
  { x: 2, y: 8, gameIndex: 3 },  // Simonle
  { x: 2, y: 10, gameIndex: 4 }, // Colorle
  { x: 2, y: 12, gameIndex: 5 }, // Mathle
  { x: 18, y: 2, gameIndex: 6 },  // Puzzlele
  { x: 18, y: 4, gameIndex: 7 },  // Memoryle
  { x: 18, y: 6, gameIndex: 8 },  // NFL Player Guess
      { x: 18, y: 8, gameIndex: 9 },  // Pitcher Data Quiz
  { x: 18, y: 10, gameIndex: 10 }, // MLB Player Guess
  { x: 18, y: 12, gameIndex: 11 }, // NBA Player Guess
];

const Main = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [avatarPosition, setAvatarPosition] = useState({ x: 10, y: 14 }); // Start at bottom center
  const [direction, setDirection] = useState({ x: 0, y: -1 }); // Start moving north
  const [gridSize, setGridSize] = useState({ width: 1000, height: 600 });
  const animationRef = useRef();
  const lastMoveTime = useRef(0);
  const moveInterval = 50; // Move every 50ms (fast, smooth movement)
  const moveSpeed = 0.25; // Increased speed: 0.25 grid cells per frame

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Track grid size for pixel positioning
  useEffect(() => {
    const updateGridSize = () => {
      const gridElement = document.querySelector('.maze-grid');
      if (gridElement) {
        const rect = gridElement.getBoundingClientRect();
        setGridSize({ width: rect.width, height: rect.height });
      }
    };

    updateGridSize();
    window.addEventListener('resize', updateGridSize);
    return () => window.removeEventListener('resize', updateGridSize);
  }, []);

  // Check if position is valid (snap to grid for collision detection)
  const isValidPosition = (x, y) => {
    const gridX = Math.round(x);
    const gridY = Math.round(y);
    return VALID_POSITIONS.has(`${gridX},${gridY}`);
  };

  // Check if position has a game (snap to grid for collision detection)
  const getGameAtPosition = (x, y) => {
    const gridX = Math.round(x);
    const gridY = Math.round(y);
    return GAME_POSITIONS.find(game => game.x === gridX && game.y === gridY);
  };

  // Check if avatar is in main corridor (can move in all directions)
  const isInMainCorridor = (x, y) => {
    const gridX = Math.round(x);
    return gridX >= 9 && gridX <= 11;
  };

  // Check if avatar is in horizontal corridor (can only move left/right)
  const isInHorizontalCorridor = (x, y) => {
    const gridX = Math.round(x);
    const gridY = Math.round(y);
    return (gridX >= 2 && gridX <= 8) || (gridX >= 12 && gridX <= 18);
  };

  // Check if direction change is valid for current position
  const isValidDirectionChange = (newDirection) => {
    const gridX = Math.round(avatarPosition.x);
    const gridY = Math.round(avatarPosition.y);
    
    // In main corridor - can move in all directions
    if (isInMainCorridor(gridX, gridY)) {
      return true;
    }
    
    // In horizontal corridor - can only move left/right
    if (isInHorizontalCorridor(gridX, gridY)) {
      return newDirection.x !== 0; // Only horizontal movement allowed
    }
    
    return false;
  };

  // Reset avatar to a valid starting position
  const resetAvatar = () => {
    setAvatarPosition({ x: 10, y: 14 }); // Reset to bottom center of main corridor
    setDirection({ x: 0, y: -1 }); // Reset to moving north
  };

  // Check if current position is valid, if not, reset
  const validateAndResetPosition = () => {
    const gridX = Math.round(avatarPosition.x);
    const gridY = Math.round(avatarPosition.y);
    const currentPos = `${gridX},${gridY}`;
    
    if (!VALID_POSITIONS.has(currentPos)) {
      resetAvatar();
    }
  };

  // Validate position on mount and when valid positions change
  useEffect(() => {
    validateAndResetPosition();
  }, []);

  // Continuous movement loop
  const moveAvatar = (currentTime) => {
    if (currentTime - lastMoveTime.current >= moveInterval) {
      setAvatarPosition(prevPos => {
        const newX = prevPos.x + direction.x * moveSpeed;
        const newY = prevPos.y + direction.y * moveSpeed;
        
        // Check if new position is valid
        if (isValidPosition(newX, newY)) {
          // Check for game collision
          const game = getGameAtPosition(newX, newY);
          if (game) {
            navigate(gameIcons[game.gameIndex].route);
            return prevPos;
          }
          
          return { x: newX, y: newY };
        }
        
        // If we hit a wall, try to snap to the nearest valid position
        // This prevents getting stuck at wall boundaries
        const snappedX = Math.round(newX);
        const snappedY = Math.round(newY);
        
        // Try to find a valid position near the wall
        if (isValidPosition(snappedX, snappedY)) {
          return { x: snappedX, y: snappedY };
        }
        
        // If still invalid, don't move (but this should rarely happen)
        return prevPos;
      });
      
      lastMoveTime.current = currentTime;
    }
    
    animationRef.current = requestAnimationFrame(moveAvatar);
  };

  // Start continuous movement immediately
  useEffect(() => {
    if (!isMobile) {
      // Start movement immediately
      animationRef.current = requestAnimationFrame(moveAvatar);
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }
  }, [direction, isMobile, navigate]);

  // Keyboard controls (desktop only) - prevent scrolling
  useEffect(() => {
    if (isMobile) return;

    const handleKeyDown = (e) => {
      // Prevent arrow key scrolling
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        e.stopPropagation();
      }

      // Reset avatar position with R key
      if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        resetAvatar();
        return;
      }

      let newDirection = { ...direction };
      
      switch (e.key) {
        case 'ArrowUp':
          newDirection = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
          newDirection = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
          newDirection = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
          newDirection = { x: 1, y: 0 };
          break;
        default:
          return;
      }
      
      // Check if direction change is valid for current position
      if (!isValidDirectionChange(newDirection)) {
        return;
      }
      
      // Check if the new direction would lead to a valid position
      const newX = avatarPosition.x + newDirection.x * moveSpeed;
      const newY = avatarPosition.y + newDirection.y * moveSpeed;
      
      if (isValidPosition(newX, newY)) {
        setDirection(newDirection);
      } else {
        // If the exact position isn't valid, try snapping to grid
        const snappedX = Math.round(newX);
        const snappedY = Math.round(newY);
        
        if (isValidPosition(snappedX, snappedY)) {
          setDirection(newDirection);
        }
        // If still not valid, don't change direction (prevents getting stuck)
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, avatarPosition, isMobile, moveSpeed]);

  // Handle icon click (mobile and desktop)
  const handleIconClick = (route) => {
    navigate(route);
  };

  return (
    <div className={styles['main-page-container']} style={{ paddingTop: 32 }}>
      <header style={{ textAlign: 'center', marginBottom: 16 }}>
        <h1 style={{
          color: '#fff',
          fontFamily: 'Press Start 2P, VT323, monospace, Arial, sans-serif',
          fontSize: 32,
          letterSpacing: 2,
          textShadow: '0 0 8px #0ff, 0 0 16px #80f',
        }}>
          Arcade Select
        </h1>
        {!isMobile && (
          <p style={{ color: '#0ff', fontSize: 14, marginTop: 8 }}>
            Drive north and turn left/right to collect games
          </p>
        )}
      </header>
      <MazeGrid>
        {/* Render game icons at their positions */}
        {GAME_POSITIONS.map((pos, i) => {
          const game = gameIcons[pos.gameIndex];
          return (
            <div
              key={`game-${i}`}
              style={{ 
                gridRow: pos.y + 1, 
                gridColumn: pos.x + 1, 
                zIndex: 2, 
                position: 'relative' 
              }}
            >
              <GameIcon 
                Icon={game.Icon} 
                label={game.label} 
                onClick={() => handleIconClick(game.route)}
              />
            </div>
          );
        })}
        {/* Render avatar at its position (hidden on mobile) */}
        {!isMobile && (
          <PlayerAvatar 
            x={avatarPosition.x} 
            y={avatarPosition.y} 
            gridWidth={gridSize.width}
            gridHeight={gridSize.height}
          />
        )}
      </MazeGrid>
    </div>
  );
};

export default Main; 