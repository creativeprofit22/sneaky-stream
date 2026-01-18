import type { Page } from 'playwright';

export interface PickerOptions {
  highlightColor?: string;
  highlightBorder?: string;
}

const DEFAULT_OPTIONS: Required<PickerOptions> = {
  highlightColor: 'rgba(59, 130, 246, 0.2)',
  highlightBorder: '2px solid rgb(59, 130, 246)',
};

export class ElementPicker {
  private page: Page;
  private options: Required<PickerOptions>;
  private currentSelector: string | null = null;

  constructor(page: Page, options: PickerOptions = {}) {
    this.page = page;
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }

  async highlightElement(selector: string): Promise<void> {
    await this.clearHighlight();

    await this.page.evaluate(
      ({ selector, color, border }) => {
        const el = document.querySelector(selector);
        if (el instanceof HTMLElement) {
          el.dataset.sneakyHighlight = 'true';
          el.style.outline = border;
          el.style.backgroundColor = color;
        }
      },
      {
        selector,
        color: this.options.highlightColor,
        border: this.options.highlightBorder,
      }
    );

    this.currentSelector = selector;
  }

  async clearHighlight(): Promise<void> {
    await this.page.evaluate(() => {
      const el = document.querySelector('[data-sneaky-highlight="true"]');
      if (el instanceof HTMLElement) {
        el.style.outline = '';
        el.style.backgroundColor = '';
        delete el.dataset.sneakyHighlight;
      }
    });

    this.currentSelector = null;
  }

  async getElementTree(): Promise<ElementNode[]> {
    return await this.page.evaluate(() => {
      function buildTree(el: Element, depth = 0): ElementNode {
        const children: ElementNode[] = [];
        for (const child of el.children) {
          if (depth < 3) {
            children.push(buildTree(child, depth + 1));
          }
        }

        return {
          tag: el.tagName.toLowerCase(),
          id: el.id || undefined,
          classes: el.className ? el.className.split(' ').filter(Boolean) : [],
          children,
        };
      }

      interface ElementNode {
        tag: string;
        id?: string;
        classes: string[];
        children: ElementNode[];
      }

      return Array.from(document.body.children).map((el) => buildTree(el));
    });
  }

  getCurrentSelector(): string | null {
    return this.currentSelector;
  }
}

export interface ElementNode {
  tag: string;
  id?: string;
  classes: string[];
  children: ElementNode[];
}
