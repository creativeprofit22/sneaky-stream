# Stream Module

WebSocket screenshot streaming - send live browser screenshots to a web viewer.

## Standalone Usage

```bash
# Copy this folder to your project
cp -r src/stream/ your-project/src/

# Install dependencies
bun add express ws
bun add -d @types/express @types/ws
```

```typescript
import { StreamServer } from './stream';

const server = new StreamServer({ port: 3000 });
await server.start();

// Send a screenshot (call this in a loop)
server.broadcast(screenshotBuffer);

// Cleanup
await server.stop();
```

## Files

| File | Purpose |
|------|---------|
| `server.ts` | Express + WebSocket server |
| `capture.ts` | Screenshot capture loop |
| `overlay.ts` | Inject highlight overlays |
| `index.ts` | Public exports |

## Dependencies

- `express` - HTTP server for the viewer page
- `ws` - WebSocket for streaming screenshots
