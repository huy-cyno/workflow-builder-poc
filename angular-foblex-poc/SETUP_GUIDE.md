# Setup Guide - Angular Foblex PoC

## ⚠️ Important: HMR Disabled

**Hot Module Replacement (HMR) is DISABLED in this project.**

### Why?

When using Foblex Flow with certain Angular configurations, HMR can cause blank pages on initial load or after certain edits. This is a known compatibility issue with Foblex Flow's internal initialization.

### The Fix Applied

The `angular.json` file has been configured with:

```json
{
  "serve": {
    "configurations": {
      "development": {
        "buildTarget": "angular-foblex-poc:build:development",
        "hmr": false  // ← Disabled to prevent blank pages
      }
    }
  }
}
```

### If You Get a Blank Page

1. **Clear browser cache:**
   ```bash
   # Hard refresh in browser: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
   ```

2. **Restart dev server:**
   ```bash
   npm start
   ```

3. **Check console for errors:**
   - Open Developer Tools (F12)
   - Check Console tab for errors
   - Check Network tab to ensure files are loading

## Installation

```bash
# Install dependencies
npm install

# Start development server (HMR disabled)
npm start

# Server runs at http://localhost:4200
```

## Build & Deploy

```bash
# Development build with source maps
npm run build

# Production build (optimized)
npm run build -- --configuration production

# Output location: dist/angular-foblex-poc/
```

## If You Need to Enable HMR

If you modify `angular.json` to enable HMR:

```json
{
  "hmr": true  // Enable HMR
}
```

**You MUST:**
1. Clear node_modules: `rm -rf node_modules`
2. Reinstall: `npm install`
3. Clear browser cache completely
4. Test thoroughly with multiple edits

**Note:** This may cause blank pages. If so, revert to `hmr: false`.

## Common Issues & Solutions

### Issue: Blank Page on Load
**Solution:** HMR is disabled. This is intentional.
- Hard refresh (Ctrl+Shift+R)
- Restart dev server
- Check browser console for errors

### Issue: Changes Not Reflecting
**Solution:**
- File saved but page not updating? Hard refresh the page
- Component not re-rendering? Check Angular change detection

### Issue: Build Fails
**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules dist
npm install
npm run build
```

### Issue: Port 4200 Already in Use
**Solution:**
```bash
# Use a different port
npm start -- --port 4300
```

### Issue: Large Bundle Size
**Solution:** This is normal for Angular + Foblex Flow.
- Development: ~577 kB
- Production: ~117 kB (gzipped)
- Not a blocker; Foblex requires many dependencies

## Test Execute Feature

The workflow builder includes a **Test Execute** feature that allows you to simulate workflow execution:

### How to Use

1. **Create a workflow** by adding and connecting nodes
2. **Click the Execute button** (▶️) in the toolbar
3. **The execution panel opens** on the right side
4. **Click "Execute"** to start the simulation

### What Happens

- **Simulation**: Each node executes in sequence with realistic delays
- **Step tracking**: Every node execution is recorded with timestamp
- **Output generation**: Mock output is generated for each node type:
  - **Level nodes**: Generate level completion data with steps
  - **Condition nodes**: Generate branch evaluation results
  - **Action nodes**: Generate action execution results
- **Path visualization**: Shows the complete path taken through the workflow
- **Statistics**: Display total steps, completed steps, and duration

### Execution Panel Features

- **Status Display**: Current execution state (In Progress / Completed)
- **Step-by-Step Trace**: View each executed node with status
- **Execution Path**: Visual representation of the path taken
- **Statistics**: Total steps, completed steps, and total duration
- **Error Handling**: Displays errors if workflow cannot be executed
- **Clear Button**: Reset execution history

### Example

For a workflow: Level → Condition → Action 1 / Action 2

Execution will:
1. Execute the Level node
2. Execute the Condition node
3. Execute either Action 1 or Action 2 based on the condition
4. Show complete trace with timestamps and outputs

## Project History

This issue was encountered across multiple Angular POC projects in this monorepo:
- ✅ `angular-drawflow` - Fixed by disabling HMR
- ✅ `angular-react-wrapper` - Fixed by disabling HMR
- ✅ `angular-foblex-poc` - **Preventatively disabled HMR** in setup

## Angular Configuration Details

### Node Version
- Recommended: Node 18+
- Tested with: Latest LTS

### Angular Version
- Version: 19.x
- Framework: Standalone Components

### Key Dependencies
```json
{
  "@angular/core": "^19.0.0",
  "@foblex/flow": "^17.9.7",
  "@angular/cdk": "^19.0.0",
  "rxjs": "^7.8.0"
}
```

## Development Workflow

1. **Start server:**
   ```bash
   npm start
   ```

2. **Make changes** to any file in `src/`

3. **Page auto-refreshes** (reload, not hot reload due to HMR being disabled)

4. **Test in browser** at http://localhost:4200

5. **Check console** for errors or logs

## Debugging

### Enable Verbose Logging
```bash
npm start -- --verbose
```

### Debug in VS Code
Add to `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "ng serve",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:4200",
      "webRoot": "${workspaceFolder}"
    }
  ]
}
```

### Browser DevTools
- **F12** - Open DevTools
- **Console** - Check for errors
- **Network** - Verify files load
- **Application** - Check localStorage/cache

## Environment Setup

### macOS
```bash
# Install Node using Homebrew
brew install node

# Verify installation
node --version
npm --version

# Start server
npm start
```

### Windows
```bash
# Download and install from nodejs.org
# Or use Chocolatey:
choco install nodejs

# Verify installation
node --version
npm --version

# Start server
npm start
```

### Linux
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nodejs npm

# Fedora
sudo dnf install nodejs npm

# Verify installation
node --version
npm --version

# Start server
npm start
```

## Production Deployment

### Build
```bash
npm run build
```

### Deploy to Firebase
```bash
npm install -g firebase-tools
firebase login
firebase init
firebase deploy
```

### Deploy to Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist/angular-foblex-poc
```

### Deploy to Docker
```dockerfile
# Dockerfile
FROM node:19 as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:latest
COPY --from=build /app/dist/angular-foblex-poc /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```bash
docker build -t workflow-builder .
docker run -p 80:80 workflow-builder
```

## Support & Documentation

- **Quick Start:** See `QUICK_START.md`
- **Full Guide:** See `ANGULAR_FOBLEX_POC.md`
- **Foblex Flow:** https://flow.foblex.com/docs
- **Angular:** https://angular.dev

## Checklist Before Sharing

- [ ] HMR disabled in `angular.json` ✅
- [ ] No blank page on fresh start
- [ ] Can create nodes
- [ ] Can connect nodes
- [ ] Can edit node properties
- [ ] Can save/load workflows
- [ ] Console has no errors
- [ ] README documents HMR fix

---

**Last Updated:** January 2025
**Status:** ✅ Ready for Development
