import type { Page } from 'playwright';

export interface OverlayOptions {
  borderColor?: string;
  borderWidth?: number;
  backgroundColor?: string;
  showLabel?: boolean;
}

const DEFAULT_OPTIONS: Required<OverlayOptions> = {
  borderColor: '#3b82f6',
  borderWidth: 2,
  backgroundColor: 'rgba(59, 130, 246, 0.1)',
  showLabel: true,
};

export async function injectOverlay(
  page: Page,
  selector: string,
  options: OverlayOptions = {}
): Promise<void> {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  await page.evaluate(
    ({ selector, opts }) => {
      // Remove existing overlay
      document.getElementById('sneaky-overlay')?.remove();

      const el = document.querySelector(selector);
      if (!el) return;

      const rect = el.getBoundingClientRect();

      // Create overlay div
      const overlay = document.createElement('div');
      overlay.id = 'sneaky-overlay';
      overlay.style.cssText = `
        position: fixed;
        top: ${rect.top}px;
        left: ${rect.left}px;
        width: ${rect.width}px;
        height: ${rect.height}px;
        border: ${opts.borderWidth}px solid ${opts.borderColor};
        background: ${opts.backgroundColor};
        pointer-events: none;
        z-index: 999999;
        box-sizing: border-box;
      `;

      // Add label if enabled
      if (opts.showLabel) {
        const label = document.createElement('div');
        label.style.cssText = `
          position: absolute;
          top: -24px;
          left: -2px;
          background: ${opts.borderColor};
          color: white;
          padding: 2px 8px;
          font-size: 12px;
          font-family: monospace;
          border-radius: 4px 4px 0 0;
        `;
        label.textContent = selector;
        overlay.appendChild(label);
      }

      document.body.appendChild(overlay);
    },
    { selector, opts }
  );
}

export async function clearOverlay(page: Page): Promise<void> {
  await page.evaluate(() => {
    document.getElementById('sneaky-overlay')?.remove();
  });
}
