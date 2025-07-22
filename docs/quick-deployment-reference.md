# Quick Deployment Reference

## 🚀 Standard Workflow (5 Steps)

### 1. **Develop & Test Locally**
```bash
npm run dev
# Make changes, test in browser
# Test responsive behavior
```

### 2. **Build & Preview**
```bash
npm run build
npm run preview
# Verify built version works
```

### 3. **Commit Changes**
```bash
git add .
git commit -m "[type] Description"
git push origin main  # ONLY when explicitly told to
```

### 4. **Deploy to Live**
```bash
npm run deploy  # ONLY when explicitly told to
# Wait for completion
```

### 5. **Verify Live Site**
- Visit: https://winningfungus48.github.io/GH103/
- Test all functionality
- Test responsive behavior

---

## 🔧 Quick Commands Reference

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview built version |
| `npm run deploy` | Deploy to live site (ONLY when told to) |
| `git status` | Check current changes |
| `git add .` | Add all changes |
| `git commit -m "msg"` | Commit changes |
| `git push origin main` | Push to main branch (ONLY when told to) |

---

## 🚨 Common Issues & Solutions

### **Blank Page After Deploy**
```bash
npm run build  # Check for build errors
npm run deploy # Redeploy
```

### **Changes Not Showing**
- Clear browser cache (Ctrl+Shift+R)
- Wait 5-10 minutes for GitHub Pages update

### **Build Errors**
```bash
npm install    # Install dependencies
npm run build  # Try again
```

---

## 📱 Testing Checklist

**Before Deploying:**
- [ ] Dev server works
- [ ] Build completes successfully
- [ ] Preview works correctly
- [ ] No console errors

**After Deploying:**
- [ ] Live site loads
- [ ] All functionality works
- [ ] Responsive behavior correct
- [ ] No broken links

---

**Live Site:** https://winningfungus48.github.io/GH103/
**Full Guide:** `docs/deployment-guide.md`

---

## 🤖 AI Assistant Note

**When working with AI Assistant:**
- AI will NOT push/pull to GitHub unless explicitly told to
- AI will ask permission before deploying to live site
- AI will commit changes locally but wait for instruction to push 