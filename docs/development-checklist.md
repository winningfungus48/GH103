# Development Checklist

This checklist ensures all games are properly integrated and prevents common issues.

## 🎮 Game Implementation Checklist

### Before Starting
- [ ] Review existing game patterns (Numberle, Wordle)
- [ ] Check game catalog for requirements
- [ ] Ensure game template is appropriate

### During Implementation
- [ ] Create game component with proper structure
- [ ] Implement game logic and state management
- [ ] Add responsive CSS styles
- [ ] Test game mechanics thoroughly
- [ ] Add accessibility features (ARIA, keyboard navigation)

### Integration Steps
- [ ] **Add word list/data file** (if needed)
- [ ] **Add stats utilities** to localStorage.js
- [ ] **Register game in gamesData.jsx** with correct slug
- [ ] **Test routing** - verify `/game/[slug]` works
- [ ] **Test daily mode** - verify `?mode=daily` works
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

## 🚨 Common Issues & Prevention

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

**Prevention**:
- Follow existing CSS patterns
- Test on multiple screen sizes
- Use CSS modules consistently

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
- [ ] Daily mode works (if supported)
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
7. ✅ Daily mode works (if supported)
8. ✅ Documentation is updated

## 📝 Documentation Requirements

After implementing a game:
- [ ] Update game catalog
- [ ] Document any custom implementations
- [ ] Note any template extensions needed
- [ ] Update phase documentation
- [ ] Create validation results file 