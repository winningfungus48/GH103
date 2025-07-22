# Games Website v2

A collaborative website featuring multiple games built with modern web technologies.

## 🏗️ Project Structure

```
games_v2/
├── public/                     # Static assets served directly
│   ├── assets/                # Global assets (logos, icons, etc.)
│   ├── images/               # Global images
│   └── favicon.ico
├── src/                       # Source code
│   ├── components/           # Reusable UI components
│   │   ├── common/          # Shared components (Button, Modal, etc.)
│   │   └── game-specific/   # Game-specific components
│   ├── games/               # Individual game implementations
│   │   ├── game1/          # Each game in its own folder
│   │   │   ├── components/ # Game-specific components
│   │   │   ├── assets/     # Game-specific assets
│   │   │   ├── styles/     # Game-specific styles
│   │   │   ├── logic/      # Game logic/engine
│   │   │   └── index.js    # Game entry point
│   │   └── game2/
│   ├── styles/              # Global styles
│   │   ├── globals.css     # Global CSS variables, resets
│   │   ├── components.css  # Component-specific styles
│   │   └── themes.css      # Theme definitions
│   ├── utils/              # Utility functions
│   │   ├── constants.js    # App constants
│   │   ├── helpers.js      # Helper functions
│   │   └── api.js          # API calls (if needed)
│   ├── hooks/              # Custom React hooks (if using React)
│   ├── contexts/           # Context providers
│   └── main.js             # App entry point
├── docs/                   # Documentation
│   ├── CONTRIBUTING.md     # Contribution guidelines
│   ├── GAME_TEMPLATE.md    # Template for new games
│   └── API.md              # API documentation
├── tests/                  # Test files
│   ├── components/
│   └── games/
├── .gitignore             # Git ignore patterns
├── .eslintrc.json         # ESLint configuration
├── .prettierrc            # Prettier configuration
├── package.json           # Dependencies and scripts
└── README.md              # This file
```

## 🤝 Collaboration Guidelines

### Branching Strategy
- `main` - Production ready code
- `develop` - Development branch
- `feature/game-name` - New game development
- `feature/component-name` - New component development
- `bugfix/issue-description` - Bug fixes

### Commit Convention
Use conventional commits:
```
feat: add new tic-tac-toe game
fix: resolve game state bug in chess
docs: update game template documentation
style: format code with prettier
refactor: extract common game logic
test: add unit tests for utility functions
```

### Code Style
- Use consistent indentation (2 spaces)
- Use meaningful variable and function names
- Add JSDoc comments for complex functions
- Follow established naming conventions:
  - camelCase for variables and functions
  - PascalCase for components/classes
  - UPPER_CASE for constants
  - kebab-case for CSS classes and file names

### File Naming
- Components: `PascalCase.js` (e.g., `GameBoard.js`)
- Utilities: `camelCase.js` (e.g., `gameHelpers.js`)
- Styles: `kebab-case.css` (e.g., `game-board.css`)
- Assets: `kebab-case.ext` (e.g., `player-icon.svg`)

## 🎮 Adding New Games

1. Copy the game template from `docs/GAME_TEMPLATE.md`
2. Create a new folder in `src/games/your-game-name/`
3. Follow the established component structure
4. Add game-specific assets to the game's `assets/` folder
5. Export your game from `src/games/index.js`
6. Add documentation to your game's README

## 🚀 Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. Build for production: `npm run build`

## 📦 Dependencies

Core dependencies will be documented here as they're added.

## 🧪 Testing

Run tests with: `npm run test`

## 📄 License

[Add your license information here] 