# Sneaky Stream

Browser automation with live screenshot streaming. Control headless browser from terminal, view at localhost:3000.

## Quick Start
```bash
bun install
bun run dev https://example.com
# Open localhost:3000 in browser
```

## Structure
```
src/
  browser/    # Playwright automation + StyleReducer
  stream/     # WebSocket screenshot server
  tui/        # Terminal UI
  transform/  # Claude code generation
  output/     # Template file writing
templates/    # React, Vue, Svelte, HTML boilerplates
public/       # Browser viewer page
```

Each module is self-contained with its own README for standalone use.

## Commands
```bash
bun run dev <url>      # Run
bun run build          # Build
bun run check          # Lint + typecheck + test
```

## See Also
- `BACKLOG.md` - Feature roadmap and todos
- `/mnt/e/Projects/sneaky-snatcher` - Original project this is based on
