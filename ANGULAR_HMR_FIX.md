# Angular Projects - HMR Fix Reference

> Reference guide for preventing blank page issues in Angular projects with complex libraries

## ⚠️ Issue Overview

Multiple Angular projects in this monorepo have experienced **blank page issues** on initial load or after file changes.

**Projects Affected:**
- ✅ `angular-drawflow` - Fixed by disabling HMR
- ✅ `angular-react-wrapper` - Fixed by disabling HMR
- ✅ `angular-foblex-poc` - **Preventatively fixed** in setup

## 🔍 Root Cause

When using complex libraries like Foblex Flow with Angular's Hot Module Replacement (HMR), conflicts can occur:

1. **Library Initialization:** Foblex Flow requires specific DOM initialization on component load
2. **HMR Module Updates:** HMR can update modules without full re-initialization
3. **Race Condition:** Library initialization might run before HMR completes
4. **Result:** Blank page or half-rendered components

## ✅ Solution: Disable HMR

### For New Angular Projects

In `angular.json`, configure the serve target:

```json
{
  "serve": {
    "builder": "@angular/build:dev-server",
    "configurations": {
      "development": {
        "buildTarget": "PROJECT_NAME:build:development",
        "hmr": false  // ← Add this line
      }
    }
  }
}
```

### For Existing Projects

1. Open `angular.json`
2. Find the `serve` → `configurations` → `development` section
3. Add `"hmr": false`
4. Save and restart dev server

## 🧪 Verification

After applying the fix:

```bash
npm install
npm start

# Browser should load at http://localhost:4200
# No blank page should appear
# Components should render properly
```

## 📋 Checklist for New Angular Projects

When creating a new Angular project with complex libraries:

- [ ] Create project: `ng new project-name`
- [ ] Install dependencies: `npm install`
- [ ] **Add HMR fix to `angular.json`**
- [ ] Install Foblex Flow or similar library
- [ ] Test with `npm start`
- [ ] Verify no blank pages
- [ ] Document in README that HMR is disabled
- [ ] Create SETUP_GUIDE.md explaining the fix

## 🚫 Why Not Just Keep HMR Enabled?

### HMR Pros
- Faster feedback loop
- No full page reloads
- Better development experience

### Cons (with complex libraries)
- ❌ Blank pages
- ❌ Inconsistent behavior
- ❌ Hard to debug
- ❌ Time wasted troubleshooting

**Conclusion:** For projects using Foblex Flow, the cost of HMR outweighs benefits.

## 🔄 If You Need HMR

If your project absolutely requires HMR:

1. **Test thoroughly** with multiple file edits
2. **Watch for blank pages** on reload
3. **Monitor console** for errors
4. **Consider alternatives:**
   - Incremental builds
   - Better IDE auto-save
   - Component library with faster builds

## 📝 Documentation Template

Include in your project's README:

```markdown
## ⚠️ Important: HMR is Disabled

**Hot Module Replacement (HMR) is intentionally disabled in this project.**

This prevents blank page issues when developing with [LIBRARY_NAME].

If you see a blank page:
- Hard refresh the browser (Ctrl+Shift+R)
- Restart the dev server
- Check the console for errors

See `SETUP_GUIDE.md` for details.
```

## 🛠️ Troubleshooting Template

Include in your `SETUP_GUIDE.md`:

```markdown
### Issue: Blank Page on Load
**Solution:** This is expected with HMR disabled.
- Hard refresh (Ctrl+Shift+R)
- Restart dev server
- Check browser console for errors

### Issue: Changes Not Reflecting
**Solution:**
- Manual page reload required
- Check browser console for errors
```

## 📊 Project Implementation Status

| Project | Library | HMR Status | Status |
|---------|---------|-----------|--------|
| angular-drawflow | DrawFlow | Disabled | ✅ Fixed |
| angular-react-wrapper | React | Disabled | ✅ Fixed |
| angular-foblex-poc | Foblex Flow | Disabled | ✅ Prevented |

## 🔗 Files to Update in New Projects

When creating a new Angular project:

1. **angular.json** - Add HMR fix
2. **README.md** - Document HMR is disabled
3. **SETUP_GUIDE.md** - Create with troubleshooting section
4. **QUICK_START.md** - Reference the fix

## 💡 Prevention Checklist

For future Angular projects in this monorepo:

- [ ] Disable HMR **before** installing complex libraries
- [ ] Document HMR status in README
- [ ] Test blank page scenario
- [ ] Create SETUP_GUIDE.md
- [ ] Include troubleshooting section
- [ ] Reference this document

## 🎓 Key Takeaways

1. **Some libraries don't play well with HMR**
2. **Disable HMR proactively for known problem libraries**
3. **Always document why HMR is disabled**
4. **Provide clear troubleshooting steps**
5. **Test on fresh project before claiming it works**

## 📖 Related Resources

- [Angular CLI Configuration](https://angular.dev/tools/cli/angular-json)
- [Hot Module Replacement (HMR)](https://angular.dev/guide/build#serve-with-hmr)
- [Foblex Flow Documentation](https://flow.foblex.com/docs)

---

**Last Updated:** January 2025
**Status:** ✅ Documented
**References:** All Angular POCs in this monorepo
