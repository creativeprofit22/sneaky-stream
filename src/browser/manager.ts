import { chromium, type Browser, type Page, type BrowserContext } from 'playwright';

export interface BrowserOptions {
  headless?: boolean;
  viewport?: { width: number; height: number };
  timeout?: number;
}

const DEFAULT_OPTIONS: Required<BrowserOptions> = {
  headless: true,
  viewport: { width: 1920, height: 1080 },
  timeout: 30000,
};

export class BrowserManager {
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;
  private page: Page | null = null;
  private options: Required<BrowserOptions>;

  constructor(options: BrowserOptions = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }

  async launch(): Promise<void> {
    if (this.browser) {
      throw new Error('Browser already launched');
    }

    this.browser = await chromium.launch({
      headless: this.options.headless,
    });

    this.context = await this.browser.newContext({
      viewport: this.options.viewport,
    });

    this.page = await this.context.newPage();
    this.page.setDefaultTimeout(this.options.timeout);
  }

  async navigate(url: string): Promise<void> {
    if (!this.page) {
      throw new Error('Browser not launched');
    }

    // Add protocol if missing
    const fullUrl = url.startsWith('http') ? url : `https://${url}`;
    await this.page.goto(fullUrl, { waitUntil: 'domcontentloaded' });
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.context = null;
      this.page = null;
    }
  }

  getPage(): Page {
    if (!this.page) {
      throw new Error('Browser not launched');
    }
    return this.page;
  }

  isLaunched(): boolean {
    return this.browser !== null;
  }
}
