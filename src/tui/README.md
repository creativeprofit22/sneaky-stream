# TUI Module

Terminal user interface - keyboard-driven control for browser automation.

## Standalone Usage

```bash
# Copy this folder to your project
cp -r src/tui/ your-project/src/

# Install dependency
bun add chalk
```

```typescript
import { TuiApp } from './tui';

const app = new TuiApp();

app.onKey('up', () => console.log('Navigate up'));
app.onKey('down', () => console.log('Navigate down'));
app.onKey('enter', () => console.log('Select'));
app.onKey('q', () => app.stop());

app.render({
  url: 'https://example.com',
  selector: '.hero',
  status: 'Ready',
});

await app.start();
```

## Files

| File | Purpose |
|------|---------|
| `app.ts` | Main TUI application loop |
| `keys.ts` | Keyboard input handling |
| `render.ts` | Screen rendering |
| `index.ts` | Public exports |

## Dependencies

- `chalk` - Terminal colors
