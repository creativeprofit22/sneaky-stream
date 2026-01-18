import express, { type Express } from 'express';
import { WebSocketServer, type WebSocket } from 'ws';
import { createServer, type Server } from 'http';
import { join } from 'path';

export interface StreamOptions {
  port?: number;
  publicDir?: string;
}

const DEFAULT_OPTIONS: Required<StreamOptions> = {
  port: 3000,
  publicDir: join(import.meta.dir, '../../public'),
};

export class StreamServer {
  private app: Express;
  private server: Server | null = null;
  private wss: WebSocketServer | null = null;
  private clients: Set<WebSocket> = new Set();
  private options: Required<StreamOptions>;

  constructor(options: StreamOptions = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this.app = express();
    this.app.use(express.static(this.options.publicDir));
  }

  async start(): Promise<void> {
    return new Promise((resolve) => {
      this.server = createServer(this.app);

      this.wss = new WebSocketServer({ server: this.server });

      this.wss.on('connection', (ws) => {
        this.clients.add(ws);
        console.log(`Client connected (${this.clients.size} total)`);

        ws.on('close', () => {
          this.clients.delete(ws);
          console.log(`Client disconnected (${this.clients.size} total)`);
        });
      });

      this.server.listen(this.options.port, () => {
        console.log(`Stream server running at http://localhost:${this.options.port}`);
        resolve();
      });
    });
  }

  broadcast(data: Buffer | string): void {
    for (const client of this.clients) {
      if (client.readyState === client.OPEN) {
        client.send(data);
      }
    }
  }

  broadcastScreenshot(screenshot: Buffer): void {
    // Send as base64 with prefix for easy handling in browser
    const base64 = `data:image/png;base64,${screenshot.toString('base64')}`;
    this.broadcast(base64);
  }

  getClientCount(): number {
    return this.clients.size;
  }

  async stop(): Promise<void> {
    return new Promise((resolve) => {
      for (const client of this.clients) {
        client.close();
      }
      this.clients.clear();

      if (this.wss) {
        this.wss.close();
      }

      if (this.server) {
        this.server.close(() => {
          this.server = null;
          this.wss = null;
          resolve();
        });
      } else {
        resolve();
      }
    });
  }
}
