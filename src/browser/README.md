# Browser Module

Playwright browser automation - launch, navigate, and interact with web pages.

## Standalone Usage

```bash
# Copy this folder to your project
cp -r src/browser/ your-project/src/

# Install dependency
bun add playwright
```

```typescript
import { BrowserManager } from './browser';

const browser = new BrowserManager({ headless: true });
await browser.launch();
await browser.navigate('https://example.com');

const page = browser.getPage();
// Do stuff with page...

await browser.close();
```

## Files

| File | Purpose |
|------|---------|
| `manager.ts` | Browser lifecycle (launch, navigate, close) |
| `picker.ts` | Element selection and highlighting |
| `extract.ts` | HTML/CSS extraction from elements |
| `index.ts` | Public exports |

## Dependencies

- `playwright` - Browser automation
