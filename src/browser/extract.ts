import type { Page } from 'playwright';

export interface ExtractedElement {
  html: string;
  css: string;
  selector: string;
  boundingBox: { x: number; y: number; width: number; height: number } | null;
}

export async function extractElement(
  page: Page,
  selector: string
): Promise<ExtractedElement> {
  const element = await page.$(selector);
  if (!element) {
    throw new Error(`Element not found: ${selector}`);
  }

  const html = await element.evaluate((el) => el.outerHTML);
  const css = await extractStyles(page, selector);
  const boundingBox = await element.boundingBox();

  return {
    html,
    css,
    selector,
    boundingBox,
  };
}

export async function extractStyles(
  page: Page,
  selector: string
): Promise<string> {
  return await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return '';

    const styles = window.getComputedStyle(el);
    const relevantProps = [
      'display',
      'flex-direction',
      'justify-content',
      'align-items',
      'gap',
      'padding',
      'margin',
      'width',
      'height',
      'background',
      'background-color',
      'color',
      'font-family',
      'font-size',
      'font-weight',
      'border',
      'border-radius',
      'box-shadow',
    ];

    const cssRules: string[] = [];
    for (const prop of relevantProps) {
      const value = styles.getPropertyValue(prop);
      if (value && value !== 'none' && value !== 'normal' && value !== 'auto') {
        cssRules.push(`  ${prop}: ${value};`);
      }
    }

    return cssRules.length > 0 ? `{\n${cssRules.join('\n')}\n}` : '';
  }, selector);
}
