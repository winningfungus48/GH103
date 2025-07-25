# Agent Testing Quick Reference

## 🚀 Quick Start
1. **URL**: http://localhost:5174/
2. **Open DevTools**: F12 (Console + Network tabs)
3. **Take Screenshots**: Use browser screenshot or agent tools
4. **Document Issues**: Use structured format below

## 🎯 Priority Testing Order
1. **Numberle** (recently fixed - 5-digit numbers)
2. **Mathel** (recently fixed - 8-character equations)
3. **Memoryle** (recently fixed - responsive grid)
4. **Navigation** (hamburger menu, categories)
5. **Other games** (Wordle, Colorle, etc.)

## 🔍 Key Test Scenarios

### Numberle (5-digit numbers)
- ✅ Valid: "12345", "00000", "99999"
- ❌ Invalid: "1234", "123456", "abcde"
- Colors: Green (correct position), Yellow (wrong position), Gray (not in number)

### Mathel (8-character equations)
- ✅ Valid: "1+2*3=7", "4+5-2=7", "3*4/2=6"
- ❌ Invalid: "12+12=24", "1+2=3", "abc+def=ghi"
- Colors: Green (correct position), Yellow (wrong position), Gray (not in equation)

### Memoryle (responsive grid)
- ✅ Should fit on mobile without overflow
- ✅ Cards should flip smoothly
- ✅ Counters should update correctly

## 📱 Viewport Testing
- **Desktop**: 1920x1080
- **Tablet**: 768x1024
- **Mobile**: 375x667
- **Mobile Landscape**: 667x375

## 🐛 Issue Documentation Template
```
**Game**: [Game Name]
**Issue**: [Brief description]
**Severity**: Critical/High/Medium/Low
**Steps to Reproduce**:
1. [Step 1]
2. [Step 2]
3. [Step 3]
**Expected**: [Expected behavior]
**Actual**: [Actual behavior]
**Screenshot**: [If applicable]
**Console Errors**: [If any]
**Browser**: [Chrome/Firefox/Safari]
**Viewport**: [Desktop/Tablet/Mobile]
```

## ⚡ Quick Commands
- **Check Console**: Look for red error messages
- **Test Responsive**: Resize browser window
- **Test Keyboard**: Use Tab, Enter, Backspace
- **Test Mobile**: Use browser dev tools mobile simulation
- **Clear Storage**: Application tab → Local Storage → Clear

## 🎨 Visual Checks
- [ ] No horizontal scrolling
- [ ] Touch targets ≥ 44px on mobile
- [ ] Color contrast sufficient
- [ ] Focus indicators visible
- [ ] Animations smooth (60fps)

## 🔧 Common Issues to Watch For
1. **Color feedback not working** (Numberle/Mathel)
2. **Grid overflow on mobile** (Memoryle)
3. **Navigation not working** (hamburger menu)
4. **Invalid input accepted** (validation bugs)
5. **Daily mode inconsistency** (same date, different results)
6. **Performance issues** (lag, freezing)
7. **Accessibility problems** (keyboard navigation, screen readers)

## 📊 Success Criteria
- [ ] All games load and function correctly
- [ ] Responsive design works on all screen sizes
- [ ] No console errors
- [ ] No accessibility violations
- [ ] Performance is acceptable (< 3s load, 60fps animations)
- [ ] Cross-browser compatibility maintained

## 🆘 When to Stop Testing
- Critical game-breaking bugs found
- Security vulnerabilities discovered
- Performance degradation > 50%
- Accessibility violations that prevent gameplay

## 📝 Final Report Structure
1. **Executive Summary** (2-3 sentences)
2. **Test Coverage** (what was tested)
3. **Issues Found** (prioritized list)
4. **Recommendations** (next steps)
5. **Pass/Fail Status** (overall assessment) 