# Transform Module

Claude-powered code generation - transform extracted HTML/CSS into framework components.

## Standalone Usage

```bash
# Copy this folder to your project
cp -r src/transform/ your-project/src/
```

```typescript
import { TransformClient } from './transform';

const client = new TransformClient();

const result = await client.transform({
  html: '<div class="card">...</div>',
  css: '.card { ... }',
  framework: 'react',
  styling: 'tailwind',
  name: 'PricingCard',
});

console.log(result.code); // React component code
```

## Files

| File | Purpose |
|------|---------|
| `client.ts` | LLM wrapper for Claude |
| `prompts.ts` | Prompt templates for transformation |
| `index.ts` | Public exports |

## Dependencies

- Claude CLI (`claude`) must be installed and authenticated
