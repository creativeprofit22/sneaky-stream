# Sneaky Stream

Browser automation with live screenshot streaming. Control headless browser from terminal, view at localhost:3000.

## Project Structure

```
src/
  ├── browser/          # Playwright automation
  │   ├── manager.ts    # Browser lifecycle (launch, navigate, close)
  │   ├── picker.ts     # Element selection and highlighting
  │   ├── extract.ts    # HTML/CSS extraction with cleanup
  │   └── style-reducer.ts  # CSS reduction (70-90% smaller)
  │
  ├── stream/           # Screenshot streaming server
  │   ├── server.ts     # Express + WebSocket server
  │   ├── capture.ts    # Screenshot capture loop
  │   └── overlay.ts    # Element highlight injection
  │
  ├── tui/              # Terminal user interface
  │   ├── app.ts        # Main TUI application
  │   ├── keys.ts       # Keyboard input handling
  │   └── render.ts     # Screen rendering
  │
  ├── transform/        # Claude code generation
  │   ├── client.ts     # LLM wrapper
  │   └── prompts.ts    # Prompt templates
  │
  ├── output/           # File generation
  │   ├── writer.ts     # Component file writing
  │   └── template-engine.ts  # Handlebars rendering
  │
  └── index.ts          # Main entry point

templates/              # Component boilerplates (.hbs)
  ├── react/            # React + TypeScript templates
  ├── vue/              # Vue 3 SFC templates
  ├── svelte/           # Svelte templates
  └── html/             # Plain HTML templates

public/                 # Browser viewer
  ├── index.html        # Viewer page
  └── viewer.js         # WebSocket client

bin/
  └── sneaky-stream.ts  # CLI entry point
```

## Organization Rules

- Each `src/` module is self-contained with its own `index.ts` and `README.md`
- One class/function per file, clear naming
- Templates use Handlebars (`.hbs` extension)
- Modules can be copied standalone to other projects

## Code Quality

After ANY file edit, run:
```bash
bun run lint && bun run typecheck && bun run test
```
Fix ALL errors before continuing.

## Commands

```bash
bun run dev <url>    # Run with URL
bun run build        # Build to dist/
bun run check        # Lint + typecheck + test
```

## See Also

- `BACKLOG.md` - Feature roadmap and todos
- `/mnt/e/Projects/sneaky-snatcher` - Original project
