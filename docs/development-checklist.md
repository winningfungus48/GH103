# Development Checklist

This checklist ensures all games are properly integrated and prevents common issues.

## 🎮 Game Implementation Checklist

### Before Starting
- [ ] Review existing game patterns (Numberle, Wordle)
- [ ] Check game catalog for requirements
- [ ] Ensure game template is appropriate
- [ ] Review UI guidelines (`docs/protected/ui-guidelines.md`) for layout and responsive design
- [ ] Review responsive container standards (900px breakpoint)

### During Implementation
- [ ] Create game component with proper structure
- [ ] Implement game logic and state management
- [ ] Add responsive CSS styles following container standards
- [ ] Test game mechanics thoroughly
- [ ] Add accessibility features (ARIA, keyboard navigation)

### Integration Steps
- [ ] **Add word list/data file** (if needed)
- [ ] **Add stats utilities** to localStorage.js
- [ ] **Register game in gamesData.jsx** with correct slug
- [ ] **Test routing** - verify `/game/[slug]` works
- [ ] **Test daily mode** - verify `?mode=daily` works *(Note: Daily features are on hold until 2.0.0 - only test existing functionality)*
- [ ] **Test favorites integration**
- [ ] **Test recently played tracking**
- [ ] **Test category filtering**

### Post-Implementation
- [ ] **Build test** - run `npm run build`
- [ ] **Development server test** - run `npm run dev`
- [ ] **Browser testing** - Chrome desktop and mobile
- [ ] **Cross-browser testing** - Firefox, Safari, Edge
- [ ] **Accessibility testing** - keyboard navigation, screen readers
- [ ] **Performance testing** - load times, memory usage
- [ ] **Responsive testing** - verify containers follow 900px breakpoint standard

## 📱 Responsive Design Requirements

### Container Standards
All new components must follow the established responsive pattern:
- **Small screens (< 900px)**: Full width (100%)
- **Large screens (≥ 900px)**: Constrained max-width with centered layout

### Implementation Template
```css
.container {
  width: 100%;
  margin: 0 auto;
  /* other styles */
}

@media (min-width: 900px) {
  .container {
    max-width: [appropriate-width]px;
  }
}
```

### Testing Requirements
- [ ] Container uses full width on screens < 900px
- [ ] Container is constrained on screens ≥ 900px
- [ ] No horizontal scrolling on any screen size
- [ ] Content remains readable and usable at all breakpoints

## 🚨 Common Issues & Prevention

### Merge Conflicts
**Problem**: ESLint errors with merge conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`)
**Causes**:
- Git merge conflicts not properly resolved
- Conflict markers left in code

**Prevention**:
- Always resolve conflicts completely before committing
- Use `git status` to check for unresolved conflicts
- ESLint will now catch conflict markers automatically

### Routing Issues
**Problem**: "Game Not Found" error
**Causes**:
- Parameter name mismatch (`gameId` vs `slug`)
- Game not registered in gamesData.jsx
- Incorrect slug in gamesData.jsx

**Prevention**:
- Always use `slug` parameter in GameWrapper
- Verify game is in gamesData.jsx before testing
- Use validation function in GameWrapper

### Import Issues
**Problem**: Build errors or runtime errors
**Causes**:
- Missing game component files
- Incorrect import paths
- Missing dependencies

**Prevention**:
- Create all required files before adding to gamesData.jsx
- Use relative paths correctly
- Test imports individually

### Styling Issues
**Problem**: Broken layout or unresponsive design
**Causes**:
- Missing CSS modules
- Incorrect class names
- No responsive breakpoints
- Not following UI guidelines
- Not following responsive container standards

**Prevention**:
- Follow existing CSS patterns
- Test on multiple screen sizes
- Use CSS modules consistently
- Reference `docs/protected/ui-guidelines.md` for grid and card specifications
- Follow responsive container standards (900px breakpoint)
- Use full width on small screens, constrained width on large screens

## 🔧 Development Commands

### Windows PowerShell
```powershell
# Start development server
npm run dev

# Build for production
npm run build

# Check for linting issues
npm run lint
```

### Unix/Linux/Mac
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Check for linting issues
npm run lint
```

## 📋 Testing Checklist

### Functionality Testing
- [ ] Game loads correctly
- [ ] Game mechanics work as expected
- [ ] Win/lose conditions work
- [ ] Daily mode works (if supported) *(Note: Daily features are on hold until 2.0.0 - only test existing functionality)*
- [ ] Practice mode works
- [ ] Game state persists correctly
- [ ] Statistics update correctly

### Integration Testing
- [ ] Favorites system works
- [ ] Recently played tracking works
- [ ] Category filtering works
- [ ] Search functionality works
- [ ] Navigation between games works
- [ ] Analytics tracking works

### UI/UX Testing
- [ ] Responsive design works
- [ ] Containers follow 900px breakpoint standard
- [ ] Keyboard navigation works
- [ ] Touch interactions work
- [ ] Loading states work
- [ ] Error states work
- [ ] Accessibility features work

### Performance Testing
- [ ] Game loads quickly
- [ ] No memory leaks
- [ ] Smooth animations
- [ ] No console errors
- [ ] Build size is reasonable

## 🎯 Success Criteria

A game is considered successfully implemented when:
1. ✅ All functionality tests pass
2. ✅ All integration tests pass
3. ✅ All UI/UX tests pass
3. ✅ All performance tests pass
4. ✅ Build completes without errors
5. ✅ Development server runs without issues
6. ✅ Game is accessible via `/game/[slug]`
7. ✅ Daily mode works (if supported) *(Note: Daily features are on hold until 2.0.0 - only test existing functionality)*
8. ✅ Responsive design follows container standards
9. ✅ Documentation is updated

## 📝 Documentation Requirements

After implementing a game:
- [ ] Update game catalog
- [ ] Document any custom implementations
- [ ] Note any template extensions needed
- [ ] Update phase documentation
- [ ] Create validation results file
- [ ] Verify responsive design follows established standards 