# Changelog

All notable changes to this project will be documented in this file.

## [0.3.0] - 2025-01-11

### Added - Angular Implementations
- ✅ **Angular + Drawflow Implementation** - Native Angular workflow builder
  - Standalone Angular 20 components
  - Drawflow library integration
  - Custom node types (Level, Condition, Action)
  - Save/Load workflows as JSON
  - Zoom controls
  - **Test Execute feature** with WorkflowExecutor

- ✅ **Angular React Wrapper** - Hybrid Angular + React approach
  - Embeds React Flow app in Angular via iframe
  - PostMessage communication bridge (Angular ↔ React)
  - Load workflows from Angular into React
  - Trigger save/clear from Angular
  - Full React Flow features available

- ✅ **Test Execute Feature for Angular Drawflow**
  - WorkflowExecutor class (TypeScript)
  - Condition evaluation (equals, >=, <=, >, <, ==, !=)
  - ExecutionDemo modal component
  - Test data input with JSON
  - Execution path visualization
  - Step-by-step log display
  - Matches React version functionality

### Fixed
- ✅ **React Wrapper Iframe Loading** - Fixed React app not rendering in Angular wrapper
  - Added `"homepage": "."` to package.json for relative paths
  - Rebuilt React app with relative asset paths (`./static/js/...`)
  - Fixed absolute path issue (`/static/js/...` → `./static/js/...`)

- ✅ **HMR Issues** - Resolved Hot Module Replacement errors
  - Added `--hmr=false` flag to npm start scripts
  - Prevents "Failed to construct 'URL'" errors
  - Stable development experience (requires full page reloads)

- ✅ **Browser Compatibility** - Added .browserslistrc files
  - Targets modern browsers (last 2 versions)
  - Removes `import.meta` warnings
  - Better ES module support

### Documentation
- ✅ Updated ANGULAR_IMPLEMENTATIONS.md with Test Execute feature
- ✅ Updated comparison matrix showing all features
- ✅ Added detailed implementation notes

### Technical
- ✅ Disabled HMR in both Angular projects
- ✅ Added browserslist configuration for modern browsers
- ✅ Relative paths for React build in wrapper
- ✅ TypeScript WorkflowExecutor for Drawflow structure

## [0.2.0] - 2025-01-11

### Added
- ✅ **NodeEditor Panel** - Comprehensive right-side panel for editing node properties
  - Double-click nodes to open editor
  - Edit button in toolbar when node is selected
  - Support for all node types (Level, Condition, Action)
  - Dynamic add/remove branches for Condition nodes
  - Dynamic add/remove actions for Action nodes
  - Configure Level steps and types with checkboxes
  - Beautiful slide-in animation from right
  - Modern card-based UI design

### Improved
- ✅ **Toolbar Button Consistency** - All buttons now have uniform height and alignment
  - Fixed Load button vertical positioning
  - Consistent 40px height across all buttons
  - Improved padding and spacing
  - Added gradient backgrounds to primary/danger buttons
  - Better hover effects with smooth transitions

- ✅ **Overall UI Polish**
  - Modern color palette with better contrast
  - Consistent 8px border-radius throughout
  - Professional shadows and hover states
  - Better form input focus states with blue glow
  - Clean, organized layout with proper spacing

### Technical
- ✅ Added `onNodeDoubleClick` handler for quick editing
- ✅ Added `onUpdateNode` callback for node data updates
- ✅ Integrated NodeEditor with main App state management
- ✅ Improved toolbar flex alignment

## [0.1.0] - 2025-01-10

### Added - Initial Release
- ✅ Basic workflow builder with drag-and-drop interface
- ✅ Three node types: Level, Condition, Action
- ✅ Visual node connections with handles
- ✅ Sidebar with node templates
- ✅ Toolbar with Save/Load/Analyze/Delete functions
- ✅ JSON export/import functionality
- ✅ Workflow analysis in console
- ✅ MiniMap for navigation
- ✅ Zoom/pan controls
- ✅ Node selection highlighting
- ✅ Start badge for initial node
- ✅ Smooth animations and transitions

### Documentation
- ✅ README.md with basic setup instructions
- ✅ CLAUDE.md for AI assistant context
- ✅ QUICK_START.md for immediate usage
- ✅ Inline code comments

### Known Limitations
- ~~No node property editing after creation~~ ✅ FIXED in v0.2.0
- No validation for invalid flows
- Random node placement when adding
- No auto-save functionality
- No undo/redo
- No keyboard shortcuts

## [Unreleased] - Future Features

### Planned
- [x] Node property editor panel ✅ COMPLETED in v0.2.0
- [ ] Flow validation (prevent cycles, disconnected nodes)
- [ ] Auto-save with LocalStorage
- [ ] Undo/Redo stack
- [ ] Keyboard shortcuts (Del, Ctrl+S, etc.)
- [ ] Copy/paste nodes
- [ ] Export as PNG/SVG
- [ ] Drag nodes from sidebar
- [ ] Multi-select nodes
- [ ] Search/filter nodes

### Under Consideration
- [ ] Backend API integration
- [ ] User authentication
- [ ] Version control for workflows
- [ ] Real-time collaboration
- [ ] Workflow templates
- [ ] Auto-layout algorithm
- [ ] Miniature node preview in sidebar
- [ ] Grid snapping options
- [ ] Custom themes

---

## Version History

- **0.3.0** (2025-01-11) - Angular implementations & Test Execute
- **0.2.0** (2025-01-11) - Node Editor & UI improvements
- **0.1.0** (2025-01-10) - Initial PoC release

---

## How to Update This File

When making changes:

1. Add new features under `[Unreleased]`
2. When releasing, move items to new version section
3. Follow format: `- ✅ Description` (for completed) or `- [ ] Description` (for planned)
4. Include date in `[X.Y.Z] - YYYY-MM-DD` format
5. Use semantic versioning:
   - MAJOR (X.0.0) - Breaking changes
   - MINOR (0.X.0) - New features, backward compatible
   - PATCH (0.0.X) - Bug fixes

---

Last Updated: 2025-01-11
