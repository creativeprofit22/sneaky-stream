# Sneaky Stream Backlog

## In Progress
- [ ] Initial testing - verify the scaffold actually runs

## Planned Features

### High Priority
- [ ] End-to-end test: `bun run dev <url>` → screenshots appear at localhost:3000
- [ ] Extract command (press `e` to extract selected element)
- [ ] Component transformation flow (extract → Claude → file output)
- [ ] Error handling improvements

### Medium Priority
- [ ] Element tree navigation in TUI (show DOM hierarchy)
- [ ] Better element detection (more semantic selectors)
- [ ] Watch mode for element changes
- [ ] Keyboard shortcuts help overlay

### Future / Exploration
- [ ] **Bubble Tea TUI (Go)** - Replace basic TS terminal UI with Go Bubble Tea
  - Option B hybrid: Go TUI ↔ stdio JSON ↔ TS Playwright backend
  - Richer terminal experience, but requires learning Go
  - Reference: https://github.com/charmbracelet/bubbletea
- [ ] MJPEG stream as alternative to WebSocket (simpler, works in `<img>` tag)
- [ ] Element highlighting overlays in screenshots
- [ ] Pass-through keyboard mode (type into browser forms from terminal)

## Completed
- [x] Project scaffold (2026-01-18)
- [x] StyleReducer from sneaky-snatcher (2026-01-18)
- [x] GitHub repo setup (2026-01-18)
- [x] Component templates: React, Vue, Svelte, HTML (2026-01-18)

## References
- Original: `/mnt/e/Projects/sneaky-snatcher`
- Vercel agent-browser: https://github.com/vercel-labs/agent-browser
- Bubble Tea: https://github.com/charmbracelet/bubbletea
