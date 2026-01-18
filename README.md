# Sneaky Stream

Browser automation with live screenshot streaming and terminal UI.

Control a headless browser from your terminal while viewing live screenshots in your browser at `localhost:3000`.

## Quick Start

```bash
bun install
bun run dev https://example.com
```

Then open `http://localhost:3000` in your browser to see the live view.

## How It Works

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│  Your Terminal  │ ───► │  Sneaky Stream  │ ───► │ Headless Chrome │
│  (control it)   │      │  (the bridge)   │      │ (invisible)     │
└─────────────────┘      └────────┬────────┘      └─────────────────┘
                                  │
                                  ▼ screenshots
                         ┌─────────────────┐
                         │ localhost:3000  │
                         │ (view in Chrome)│
                         └─────────────────┘
```

## Modules

Each module is self-contained and reusable in other projects:

| Module | Purpose | Docs |
|--------|---------|------|
| `browser/` | Playwright automation | [docs](src/browser/README.md) |
| `stream/` | WebSocket screenshot streaming | [docs](src/stream/README.md) |
| `tui/` | Terminal user interface | [docs](src/tui/README.md) |
| `transform/` | Claude code generation | [docs](src/transform/README.md) |
| `output/` | Template-based file generation | [docs](src/output/README.md) |

## Templates

Output templates for extracted components:

- `templates/react/` - React + TypeScript
- `templates/vue/` - Vue 3 SFC
- `templates/svelte/` - Svelte
- `templates/html/` - Plain HTML/CSS

## License

MIT
