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
| `style-reducer.ts` | CSS reduction (70-90% smaller) |
| `index.ts` | Public exports |

## Style Reducer

The `StyleReducer` class reduces extracted CSS by 70-90%:

```typescript
import { StyleReducer } from './browser';

const reducer = new StyleReducer();
const minimalCss = reducer.reduce(computedStyles);
// 4.2KB → 487B (88% reduction)
```

It removes:
- Browser default values
- Vendor prefixes (-webkit-, -moz-, etc.)
- Inherited styles (optional)
- Non-essential properties

## Dependencies

- `playwright` - Browser automation
