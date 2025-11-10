# Documentation Index

> 📚 Quick reference to all documentation files

## 🚀 Getting Started

| File | Purpose | Read Time | When to Use |
|------|---------|-----------|-------------|
| **[README.md](README.md)** | Project overview & setup | 2 min | First time setup |
| **[QUICK_START.md](QUICK_START.md)** | Fast start guide | 1 min | Just want to run it |

## 🎓 Understanding the Project

| File | Purpose | Read Time | When to Use |
|------|---------|-----------|-------------|
| **[CLAUDE.md](CLAUDE.md)** | Complete technical context | 15 min | Deep dive, continuing work |
| **[CONTRIBUTING.md](CONTRIBUTING.md)** | How to develop & contribute | 10 min | Adding features |
| **[CHANGELOG.md](CHANGELOG.md)** | Version history | 2 min | See what's changed |
| **[TODO.md](TODO.md)** | Active task list | 5 min | Finding what to work on |

## 📖 Documentation Summary

### README.md
**What:** Basic project info, setup, and usage
**Key Sections:**
- Installation steps
- Running the app
- Feature list
- Project structure
- Example workflow JSON

**Read if:** You're seeing this project for the first time

---

### QUICK_START.md
**What:** Fastest way to get up and running
**Key Sections:**
- 30-second setup
- 2-minute usage guide
- Understanding output
- Common tasks with code
- Debug tips

**Read if:** You want to start immediately without reading everything

---

### CLAUDE.md ⭐ MOST IMPORTANT
**What:** Complete technical context for AI assistants and developers
**Key Sections:**
- Project architecture
- Node types explained
- Data flow & state management
- Connection logic (source/target)
- How to extend the project
- Workflow analysis utilities
- Design decisions & rationale
- Example workflows
- Troubleshooting

**Read if:**
- Continuing development after a break
- Starting a new AI assistant session
- Need to understand how everything works
- Want to add complex features

---

### CONTRIBUTING.md
**What:** Developer guidelines and best practices
**Key Sections:**
- Code style guide
- How to add new node types (step-by-step)
- How to add workflow features
- Testing checklist
- Commit message format
- PR guidelines
- Best practices (Do's and Don'ts)

**Read if:**
- About to write code
- Want to maintain consistency
- Need examples of adding features
- Submitting changes

---

### CHANGELOG.md
**What:** Version history and planned features
**Key Sections:**
- Released versions with dates
- Features added
- Known limitations
- Planned features (Unreleased section)

**Read if:**
- Want to see what's changed
- Checking what's coming next
- Documenting a new release

---

### TODO.md
**What:** Active development task list
**Key Sections:**
- Critical tasks (do first)
- High priority features
- Medium/low priority items
- Backend integration plans
- UI/UX improvements
- Current sprint goals
- Implementation tips

**Read if:**
- Looking for something to work on
- Planning next sprint
- Need implementation hints
- Want to prioritize tasks

---

## 🎯 Quick Navigation Guide

### "I want to..."

| Goal | Read This | Time |
|------|-----------|------|
| Run the project now | [QUICK_START.md](QUICK_START.md) | 1 min |
| Understand everything | [CLAUDE.md](CLAUDE.md) | 15 min |
| Add a new feature | [CONTRIBUTING.md](CONTRIBUTING.md) → "Adding Features" | 5 min |
| Find a task to work on | [TODO.md](TODO.md) | 5 min |
| See what's changed | [CHANGELOG.md](CHANGELOG.md) | 2 min |
| Understand connections | [CLAUDE.md](CLAUDE.md) → "Data Flow" | 3 min |
| Debug an issue | [QUICK_START.md](QUICK_START.md) → "Debug Console" | 1 min |
| Set up from scratch | [README.md](README.md) → "Installation" | 2 min |

### "I am..."

| Role | Start Here | Then Read |
|------|------------|-----------|
| **New Developer** | README.md → QUICK_START.md → CLAUDE.md | CONTRIBUTING.md |
| **Returning Developer** | CLAUDE.md (refresh memory) | TODO.md |
| **AI Assistant** | CLAUDE.md (full context) | TODO.md |
| **Code Reviewer** | CONTRIBUTING.md → CLAUDE.md | Relevant files |
| **Project Manager** | README.md → CHANGELOG.md | TODO.md |

## 📊 Documentation Quality Checklist

When updating docs, ensure:

- [ ] **README.md** has current setup instructions
- [ ] **CLAUDE.md** reflects actual architecture
- [ ] **CHANGELOG.md** documents all changes
- [ ] **TODO.md** has active tasks only
- [ ] **CONTRIBUTING.md** has up-to-date guidelines
- [ ] All code examples are tested and working
- [ ] File paths are correct
- [ ] Cross-references between docs are valid

## 🔄 Keeping Docs Updated

### When Adding a Feature

1. ✅ Update **TODO.md** - Check off completed task
2. ✅ Update **CHANGELOG.md** - Add to Unreleased section
3. ✅ Update **CLAUDE.md** - Add to architecture if major
4. ✅ Update **README.md** - If user-facing feature

### When Releasing Version

1. ✅ Move items from TODO → CHANGELOG
2. ✅ Create new version section in CHANGELOG
3. ✅ Update README version number
4. ✅ Tag git commit with version

### When Changing Architecture

1. ✅ Update **CLAUDE.md** thoroughly
2. ✅ Update code examples in CONTRIBUTING
3. ✅ Add migration notes to CHANGELOG
4. ✅ Update README if user-facing

## 💡 Documentation Best Practices

### Writing Style
- **Be concise** - Respect reader's time
- **Use examples** - Show, don't just tell
- **Use headers** - Make it scannable
- **Use tables** - For comparisons
- **Use code blocks** - For technical info
- **Use checklists** - For actionable items

### Structure
- **Start with "why"** - Explain purpose first
- **Then "what"** - Describe the thing
- **Finally "how"** - Show implementation
- **Add cross-links** - Reference related docs
- **Update date** - Show when last updated

### Maintenance
- **Review quarterly** - Check accuracy
- **Remove outdated** - Delete obsolete info
- **Add examples** - When patterns emerge
- **Fix broken links** - Test all references

## 🗂️ File Relationships

```
README.md
    ↓ (basic info)
QUICK_START.md
    ↓ (detailed usage)
CLAUDE.md ← (most comprehensive)
    ↓ (how to contribute)
CONTRIBUTING.md
    ↓ (what to work on)
TODO.md
    ↓ (what was done)
CHANGELOG.md
```

## 📝 Templates

### New Feature Documentation

When adding a major feature, document in this order:

1. **TODO.md** - Add task with checkbox
2. **Code** - Implement feature
3. **CONTRIBUTING.md** - Add example if reusable pattern
4. **CHANGELOG.md** - Add to Unreleased
5. **CLAUDE.md** - Update architecture section
6. **README.md** - Update if user-facing

### Bug Fix Documentation

1. **Fix code**
2. **CHANGELOG.md** - Add to Unreleased as fix
3. **Update relevant examples** - If docs had wrong info

## 🎯 Current Documentation Status

| Doc | Status | Last Updated | Needs Update? |
|-----|--------|--------------|---------------|
| README.md | ✅ Complete | 2025-01-10 | No |
| QUICK_START.md | ✅ Complete | 2025-01-10 | No |
| CLAUDE.md | ✅ Complete | 2025-01-10 | No |
| CONTRIBUTING.md | ✅ Complete | 2025-01-10 | No |
| CHANGELOG.md | ✅ Complete | 2025-01-10 | No |
| TODO.md | ✅ Complete | 2025-01-10 | No |
| DOCS_INDEX.md | ✅ Complete | 2025-01-10 | No |

---

## 🚀 For AI Assistants

**Starting a new conversation?**

1. Read [CLAUDE.md](CLAUDE.md) first - Full context
2. Check [TODO.md](TODO.md) - See active tasks
3. Review [CHANGELOG.md](CHANGELOG.md) - Know what's new

**Resuming work?**

1. Quick scan [CLAUDE.md](CLAUDE.md) - Refresh memory
2. Check [TODO.md](TODO.md) - Current sprint
3. Look at code - Confirm current state

**User asks a question?**

1. Search [CLAUDE.md](CLAUDE.md) first
2. Check [CONTRIBUTING.md](CONTRIBUTING.md) for patterns
3. Look at code if not documented

---

Last Updated: 2025-01-10
Next Review: When major feature added
