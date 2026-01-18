# Sneaky Stream

## Project Vision

Browser automation with live screenshot streaming - control a headless browser from terminal while viewing it in Windows Chrome via localhost.

**Problem solved**: In WSL, you can't see a headed browser without X server (VcXsrv). This tool lets you:
1. Control browser from terminal (keyboard navigation)
2. See live screenshots at `localhost:3000` in Windows Chrome
3. Extract UI components from websites

## Current Status

**Phase**: Scaffold complete, needs testing and feature buildout

### Implemented
- [x] Project structure (modular, each folder is reusable)
- [x] Browser module (Playwright launch/navigate/extract)
- [x] StyleReducer (70-90% CSS reduction from sneaky-snatcher)
- [x] Stream module (Express + WebSocket screenshot server)
- [x] TUI module (basic terminal UI with keyboard controls)
- [x] Transform module (Claude code generation)
- [x] Output module (Handlebars template engine)
- [x] Component templates (React, Vue, Svelte, HTML)

### Not Yet Implemented
- [ ] **Bubble Tea TUI** - Replace current basic TUI with Go Bubble Tea for richer terminal UI
- [ ] Actual end-to-end testing
- [ ] Error handling improvements
- [ ] Element tree navigation in TUI
- [ ] Extract command (e key to extract selected element)
- [ ] Component transformation flow
- [ ] Watch mode for element changes

## Architecture

```
Terminal (control) ──► Sneaky Stream ──► Headless Chrome
                            │
                            ▼ screenshots via WebSocket
                      localhost:3000 (view in Windows Chrome)
```

## Future Ideas: Bubble Tea Hybrid

Original brainstorm was about using Go's Bubble Tea for a fancier TUI. Options discussed:

**Option A**: Keep everything TypeScript, just improve the terminal output
- Simplest, no new language
- Current approach

**Option B**: Go TUI + TypeScript backend (hybrid)
- Go Bubble Tea for rich terminal UI
- TypeScript Playwright backend (keep existing code)
- Communicate via stdio JSON
- Best of both worlds

**Option C**: Full Go rewrite
- Single binary
- Use chromedp or rod instead of Playwright
- Loses Playwright's nice APIs

**Decision**: Started with Option A (TypeScript only). Option B is the aspirational goal if we want the fancy Bubble Tea experience.

## Module Reusability (Type B Boilerplates)

Each `src/` folder is designed to be copy-pasteable to other projects:

| Module | Standalone Use Case |
|--------|---------------------|
| `browser/` | Any Playwright automation project |
| `stream/` | Any project needing WebSocket screenshot streaming |
| `tui/` | Any project needing keyboard-driven terminal UI |
| `transform/` | Any project needing Claude code generation |
| `output/` | Any project needing template-based file generation |

Each has its own README with standalone usage instructions.

## Related Projects

- **sneaky-snatcher** (`/mnt/e/Projects/sneaky-snatcher`): Original TypeScript tool this is based on
- **Vercel agent-browser**: https://github.com/vercel-labs/agent-browser (reference for headless browser + AI)
- **Bubble Tea**: https://github.com/charmbracelet/bubbletea (Go TUI framework, future consideration)

## Commands

```bash
# Run
bun run dev https://example.com

# Build
bun run build

# Quality checks
bun run lint && bun run typecheck && bun run test
```

## Files Modified Log

### 2026-01-18 - Initial Setup
- Created project scaffold (42 files)
- Added StyleReducer from sneaky-snatcher
- GitHub repo: https://github.com/creativeprofit22/sneaky-stream
