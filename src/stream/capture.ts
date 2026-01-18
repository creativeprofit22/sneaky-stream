import type { Page } from 'playwright';
import type { StreamServer } from './server';

export interface CaptureOptions {
  interval?: number; // ms between captures
  quality?: number; // 0-100 for jpeg
  type?: 'png' | 'jpeg';
}

const DEFAULT_OPTIONS: Required<CaptureOptions> = {
  interval: 100, // 10 FPS
  quality: 80,
  type: 'png',
};

export class ScreenshotCapture {
  private page: Page;
  private server: StreamServer;
  private options: Required<CaptureOptions>;
  private intervalId: Timer | null = null;
  private isCapturing = false;

  constructor(page: Page, server: StreamServer, options: CaptureOptions = {}) {
    this.page = page;
    this.server = server;
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }

  async start(): Promise<void> {
    if (this.isCapturing) return;
    this.isCapturing = true;

    const capture = async () => {
      if (!this.isCapturing) return;

      try {
        const screenshot = await this.page.screenshot({
          type: this.options.type,
          quality: this.options.type === 'jpeg' ? this.options.quality : undefined,
        });

        this.server.broadcastScreenshot(screenshot);
      } catch {
        // Page might be navigating, ignore
      }
    };

    // Capture immediately, then on interval
    await capture();
    this.intervalId = setInterval(capture, this.options.interval);
  }

  stop(): void {
    this.isCapturing = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  setInterval(ms: number): void {
    this.options.interval = ms;
    if (this.isCapturing) {
      this.stop();
      this.start();
    }
  }
}
