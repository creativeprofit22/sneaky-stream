/**
 * Element Extractor
 *
 * Extracts HTML elements from page with clean markup and reduced CSS.
 * Ported from sneaky-snatcher.
 */

import type { Page } from 'playwright';
import { StyleReducer } from './style-reducer';

/** Maximum recursion depth for style collection */
const MAX_DEPTH = 10;

/** Regex patterns for HTML cleanup */
const REGEX_DATA_ATTRS = /\s+data-(?!testid)[a-z-]+="[^"]*"/gi;
const REGEX_EVENT_HANDLERS =
  /\s+(?:onclick|onmouseover|onmouseout|onfocus|onblur)="[^"]*"/gi;
const REGEX_STYLE_ATTRS = /\s+style="[^"]*"/gi;
const REGEX_EMPTY_CLASS = /\s+class=""/g;
const REGEX_WHITESPACE = /\s+/g;

export interface ExtractedElement {
  html: string;
  css: string;
  selector: string;
  tagName: string;
  classNames: string[];
  boundingBox: { x: number; y: number; width: number; height: number } | null;
}

/**
 * Extract element HTML and styles from page
 */
export async function extractElement(
  page: Page,
  selector: string
): Promise<ExtractedElement> {
  // Get raw HTML and computed styles
  const rawData = await page.evaluate(
    ({ sel, maxDepth }) => {
      const element = document.querySelector(sel);
      if (!element) {
        throw new Error(`Element not found: ${sel}`);
      }

      // Get outer HTML
      const html = element.outerHTML;

      // Get computed styles for element and all children
      const styles: Record<string, Record<string, string>> = {};

      function collectStyles(el: Element, path: string, depth: number): void {
        if (depth >= maxDepth) return;

        const computed = window.getComputedStyle(el);
        const styleObj: Record<string, string> = {};

        for (let i = 0; i < computed.length; i++) {
          const prop = computed[i]!;
          styleObj[prop] = computed.getPropertyValue(prop);
        }

        styles[path] = styleObj;

        // Collect from children
        Array.from(el.children).forEach((child, index) => {
          collectStyles(child, `${path} > :nth-child(${index + 1})`, depth + 1);
        });
      }

      collectStyles(element, sel, 0);

      // Get bounding box
      const rect = element.getBoundingClientRect();

      return {
        html,
        styles,
        tagName: element.tagName.toLowerCase(),
        classNames: Array.from(element.classList),
        boundingBox: {
          x: rect.x,
          y: rect.y,
          width: rect.width,
          height: rect.height,
        },
      };
    },
    { sel: selector, maxDepth: MAX_DEPTH }
  );

  // Reduce styles (70-90% reduction)
  const reducer = new StyleReducer();
  const reducedCss = reducer.reduce(rawData.styles);

  return {
    html: cleanHtml(rawData.html),
    css: reducedCss,
    selector,
    tagName: rawData.tagName,
    classNames: rawData.classNames,
    boundingBox: rawData.boundingBox,
  };
}

/**
 * Simple extraction without style reduction (faster)
 */
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

/**
 * Clean HTML by removing unnecessary attributes
 */
function cleanHtml(html: string): string {
  return html
    .replace(REGEX_DATA_ATTRS, '')
    .replace(REGEX_EVENT_HANDLERS, '')
    .replace(REGEX_STYLE_ATTRS, '')
    .replace(REGEX_EMPTY_CLASS, '')
    .replace(REGEX_WHITESPACE, ' ')
    .trim();
}
