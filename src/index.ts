// Sneaky Stream - Browser automation with live screenshot streaming
// https://github.com/yourusername/sneaky-stream

export { BrowserManager, ElementPicker, extractElement } from './browser';
export { StreamServer, ScreenshotCapture, injectOverlay } from './stream';
export { TuiApp, KeyHandler, renderScreen } from './tui';
export { TransformClient, buildTransformPrompt } from './transform';
export { OutputWriter, TemplateEngine } from './output';

import { BrowserManager } from './browser';
import { StreamServer, ScreenshotCapture, injectOverlay, clearOverlay } from './stream';
import { TuiApp } from './tui';

export interface MainOptions {
  url: string;
  port?: number;
  selector?: string | null;
}

export async function main(options: MainOptions): Promise<void> {
  const { url, port = 3000, selector = null } = options;

  // Initialize components
  const browser = new BrowserManager({ headless: true });
  const server = new StreamServer({ port });
  const tui = new TuiApp();

  let capture: ScreenshotCapture | null = null;
  let currentSelector = selector;
  let elements: string[] = [];
  let selectedIndex = 0;

  try {
    // Start stream server
    await server.start();
    tui.log(`Stream server at http://localhost:${port}`);

    // Launch browser and navigate
    tui.render({ status: 'Launching browser...' });
    await browser.launch();

    tui.render({ status: `Navigating to ${url}...` });
    await browser.navigate(url);

    const page = browser.getPage();

    // Start screenshot capture
    capture = new ScreenshotCapture(page, server);
    await capture.start();

    // Get initial element list
    elements = await page.evaluate(() => {
      const selectors: string[] = [];
      const interesting = document.querySelectorAll(
        'header, nav, main, section, article, aside, footer, ' +
          '[class*="hero"], [class*="card"], [class*="pricing"], ' +
          '[class*="feature"], [class*="cta"], [class*="banner"]'
      );
      interesting.forEach((el) => {
        const id = el.id ? `#${el.id}` : '';
        const classes = el.className
          ? `.${el.className.split(' ').filter(Boolean).join('.')}`
          : '';
        selectors.push(`${el.tagName.toLowerCase()}${id}${classes}`);
      });
      return selectors.slice(0, 15);
    });

    // Set up TUI
    tui.render({
      url,
      selector: currentSelector,
      status: 'Ready - Use arrow keys to navigate',
      elements,
      selectedIndex,
    });

    // Keyboard bindings
    tui.onKey('up', async () => {
      if (selectedIndex > 0) {
        selectedIndex--;
        currentSelector = elements[selectedIndex] || null;
        if (currentSelector) {
          await injectOverlay(page, currentSelector);
        }
        tui.render({ selectedIndex, selector: currentSelector });
      }
    });

    tui.onKey('down', async () => {
      if (selectedIndex < elements.length - 1) {
        selectedIndex++;
        currentSelector = elements[selectedIndex] || null;
        if (currentSelector) {
          await injectOverlay(page, currentSelector);
        }
        tui.render({ selectedIndex, selector: currentSelector });
      }
    });

    tui.onKey('enter', async () => {
      if (currentSelector) {
        tui.log(`Selected: ${currentSelector}`);
        tui.render({ status: `Selected: ${currentSelector}` });
      }
    });

    tui.onKey('c', async () => {
      await clearOverlay(page);
      currentSelector = null;
      tui.render({ selector: null, status: 'Highlight cleared' });
    });

    tui.onKey('q', async () => {
      tui.log('Shutting down...');
      tui.stop();
    });

    // Highlight initial element
    if (elements.length > 0) {
      currentSelector = elements[0];
      await injectOverlay(page, currentSelector);
      tui.render({ selector: currentSelector });
    }

    // Start TUI
    await tui.start();
  } finally {
    // Cleanup
    capture?.stop();
    await browser.close();
    await server.stop();
  }
}
