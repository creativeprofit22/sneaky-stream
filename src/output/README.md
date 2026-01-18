# Output Module

Template-based file generation - write components from templates.

## Standalone Usage

```bash
# Copy this folder to your project
cp -r src/output/ your-project/src/

# Install dependency
bun add handlebars
```

```typescript
import { OutputWriter } from './output';

const writer = new OutputWriter({
  outputDir: './components',
  templatesDir: './templates',
});

await writer.write({
  name: 'PricingCard',
  framework: 'react',
  code: '...',
  styles: '...',
});
```

## Files

| File | Purpose |
|------|---------|
| `writer.ts` | File writing logic |
| `template-engine.ts` | Handlebars template rendering |
| `index.ts` | Public exports |

## Dependencies

- `handlebars` - Template engine
