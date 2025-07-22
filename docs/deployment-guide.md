# Deployment Guide - From Development to Live Site

This guide provides a clear, step-by-step process for committing changes and deploying to the live Game Hub site.

---

## 🎯 Overview

**Two Branches System:**
- **`main` branch**: Source code and development history
- **`gh-pages` branch**: Built files for live site hosting

**Live Site URL:** `https://winningfungus48.github.io/GH103/`

---

## 📋 Pre-Development Checklist

Before starting any development work:

- [ ] **Pull latest changes**: `git pull origin main` (ONLY when explicitly told to)
- [ ] **Check current branch**: Ensure you'm on `main` branch
- [ ] **Start dev server**: `npm run dev` to test locally
- [ ] **Review requirements**: Understand what needs to be built

**⚠️ IMPORTANT: Only pull/push to GitHub when explicitly instructed to do so.**

---

## 🔄 Development Workflow

### Step 1: Local Development
```bash
# 1. Start development server
npm run dev

# 2. Make your changes in the code
# 3. Test thoroughly in browser (http://localhost:5173)
# 4. Test responsive behavior (resize browser window)
# 5. Test all affected functionality
```

### Step 2: Build Testing
```bash
# 1. Stop dev server (Ctrl+C)
# 2. Build for production
npm run build

# 3. Test the built version locally
npm run preview

# 4. Verify everything works in the built version
# 5. Check for any build errors or warnings
```

### Step 3: Commit Changes
```bash
# 1. Check what files have changed
git status

# 2. Add your changes
git add .

# 3. Commit with descriptive message
git commit -m "[type] Brief description of changes"

# 4. Push to main branch (ONLY when explicitly told to)
git push origin main
```

**⚠️ IMPORTANT: Only push to GitHub when explicitly instructed to do so.**

**Commit Message Format:**
- `[feat]` - New features
- `[fix]` - Bug fixes
- `[refactor]` - Code improvements
- `[docs]` - Documentation updates
- `[style]` - UI/styling changes

**Examples:**
- `[feat] Add new game card layout`
- `[fix] Resolve responsive grid issues`
- `[style] Update button hover effects`

---

## 🚀 Deployment Process

### Step 4: Deploy to Live Site
```bash
# 1. Deploy to gh-pages branch (this builds and pushes)
npm run deploy

# 2. Wait for deployment to complete
# 3. Verify deployment was successful
```

**⚠️ IMPORTANT: Only deploy to live site when explicitly instructed to do so.**

### Step 5: Verify Live Site
```bash
# 1. Check the live site: https://winningfungus48.github.io/GH103/
# 2. Test all functionality on live site
# 3. Test responsive behavior on live site
# 4. Test on different browsers if needed
```

---

## 🔧 Troubleshooting Common Issues

### Issue: "Site is blank after deployment"
**Solution:**
1. Check if build completed successfully: `npm run build`
2. Verify gh-pages branch has correct files
3. Check browser console for errors
4. Ensure no CSS conflicts (like `place-items: center`)

### Issue: "Changes not appearing on live site"
**Solution:**
1. Verify deployment completed: `npm run deploy`
2. Check gh-pages branch content
3. Clear browser cache (Ctrl+Shift+R)
4. Wait 5-10 minutes for GitHub Pages to update

### Issue: "Build errors"
**Solution:**
1. Check console for specific error messages
2. Fix any import or syntax errors
3. Ensure all dependencies are installed: `npm install`
4. Try clean build: `rm -rf dist && npm run build`

### Issue: "Dev server works but build doesn't"
**Solution:**
1. Check for environment-specific code
2. Verify all imports are correct
3. Check for any browser-only APIs
4. Test with `npm run preview` to debug

---

## 📱 Testing Checklist

### Before Committing
- [ ] **Functionality**: All features work as expected
- [ ] **Responsive**: Test on desktop, tablet, and mobile
- [ ] **Cross-browser**: Test in Chrome, Firefox, Safari
- [ ] **Performance**: No major slowdowns or errors
- [ ] **Accessibility**: Keyboard navigation works

### Before Deploying
- [ ] **Build success**: `npm run build` completes without errors
- [ ] **Preview works**: `npm run preview` shows correct site
- [ ] **No console errors**: Check browser console
- [ ] **All assets load**: Images, CSS, JS files load properly

### After Deploying
- [ ] **Live site loads**: https://winningfungus48.github.io/GH103/
- [ ] **All functionality works**: Test every feature
- [ ] **Responsive behavior**: Test on different screen sizes
- [ ] **No broken links**: All navigation works
- [ ] **Performance**: Site loads quickly

---

## 🛠️ Development Commands Reference

### Essential Commands
```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview built version locally
npm run deploy       # Deploy to live site (ONLY when explicitly told to)

# Git operations
git status           # Check current changes
git add .            # Add all changes
git commit -m "msg"  # Commit changes
git push origin main # Push to main branch (ONLY when explicitly told to)
git pull origin main # Pull latest changes (ONLY when explicitly told to)
```

### Useful Commands
```bash
# Check branches
git branch -a        # List all branches
git checkout main    # Switch to main branch
git checkout gh-pages # Switch to gh-pages branch

# Check deployment
git ls-remote --heads origin  # Check remote branches
git log --oneline -5          # Recent commits
```

---

## 📊 Branch Management

### Main Branch (Development)
- **Purpose**: Source code and development history
- **Contains**: All source files, documentation, configuration
- **Workflow**: Commit → Push → Deploy

### Gh-Pages Branch (Production)
- **Purpose**: Live site hosting
- **Contains**: Only built files (index.html, assets/, etc.)
- **Workflow**: Auto-generated by `npm run deploy`

### Branch Protection
- **Never edit gh-pages branch directly**
- **Always work on main branch**
- **Use `npm run deploy` to update live site**

---

## 🔍 Quality Assurance

### Code Quality
- [ ] **ESLint**: No linting errors (`npm run lint`)
- [ ] **Prettier**: Code is properly formatted
- [ ] **No console errors**: Clean browser console
- [ ] **Performance**: Fast loading times

### User Experience
- [ ] **Intuitive navigation**: Easy to find and use features
- [ ] **Responsive design**: Works on all screen sizes
- [ ] **Accessibility**: Screen readers and keyboard navigation
- [ ] **Error handling**: Graceful error states

### Testing Strategy
- [ ] **Manual testing**: Test all user flows
- [ ] **Cross-browser**: Test in multiple browsers
- [ ] **Mobile testing**: Test on actual mobile devices
- [ ] **Performance testing**: Check loading speeds

---

## 🚨 Emergency Procedures

### If Live Site is Broken
1. **Don't panic** - the main branch is safe
2. **Check gh-pages branch** for issues
3. **Redeploy**: `npm run deploy`
4. **If still broken**: Revert to previous working version

### If Build is Broken
1. **Check for syntax errors** in recent changes
2. **Review console output** for specific errors
3. **Fix issues** and rebuild
4. **Test locally** before deploying

### If Git Issues Occur
1. **Check git status**: `git status`
2. **Stash changes if needed**: `git stash`
3. **Pull latest**: `git pull origin main` (ONLY when explicitly told to)
4. **Resolve conflicts** if any

---

## 📞 Support & Resources

### Documentation
- **UI Guidelines**: `docs/ui-guidelines.md`
- **Development Checklist**: `docs/development-checklist.md`
- **Cursor Process**: `docs/cursor.md`

### Tools
- **GitHub Repository**: https://github.com/winningfungus48/GH103
- **Live Site**: https://winningfungus48.github.io/GH103/
- **Development Server**: http://localhost:5173

### Common Issues
- **Port conflicts**: Try different port if 5173 is busy
- **Cache issues**: Hard refresh (Ctrl+Shift+R)
- **Build errors**: Check for missing dependencies

---

**Last Updated**: 2025-01-XX
**Version**: 1.0.0

**Remember**: Always test thoroughly before deploying to the live site!

---

## 🤖 AI Assistant Guidelines

### When Working with AI Assistant:
- **AI will NOT push/pull to GitHub unless explicitly told to do so**
- **AI will ask permission before deploying to live site**
- **AI will commit changes locally but wait for instruction to push**
- **AI will suggest when changes are ready for deployment**

### AI Workflow:
1. **Make changes locally** and test thoroughly
2. **Commit changes** with descriptive messages
3. **Ask user** if they want to push to GitHub
4. **Ask user** if they want to deploy to live site
5. **Only proceed** when explicitly instructed 