# Changelog

All notable changes to this project will be documented in this file.

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
- No node property editing after creation
- No validation for invalid flows
- Random node placement when adding
- No auto-save functionality
- No undo/redo
- No keyboard shortcuts

## [Unreleased] - Future Features

### Planned
- [ ] Node property editor panel
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

Last Updated: 2025-01-10
