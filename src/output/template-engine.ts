import Handlebars from 'handlebars';
import { readFile } from 'fs/promises';
import { join } from 'path';

export class TemplateEngine {
  private templatesDir: string;
  private cache: Map<string, HandlebarsTemplateDelegate> = new Map();

  constructor(templatesDir?: string) {
    this.templatesDir = templatesDir || join(import.meta.dir, '../../templates');
    this.registerHelpers();
  }

  private registerHelpers(): void {
    // Join array items
    Handlebars.registerHelper('join', (arr: string[], sep: string) => {
      return Array.isArray(arr) ? arr.join(sep) : '';
    });

    // Conditional block
    Handlebars.registerHelper('ifEquals', function (a, b, options) {
      // @ts-expect-error - Handlebars context
      return a === b ? options.fn(this) : options.inverse(this);
    });

    // Capitalize first letter
    Handlebars.registerHelper('capitalize', (str: string) => {
      return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
    });

    // Lowercase
    Handlebars.registerHelper('lowercase', (str: string) => {
      return str ? str.toLowerCase() : '';
    });

    // kebab-case
    Handlebars.registerHelper('kebab', (str: string) => {
      return str
        ? str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
        : '';
    });
  }

  async render(
    templatePath: string,
    data: Record<string, unknown>
  ): Promise<string> {
    const template = await this.getTemplate(templatePath);
    return template(data);
  }

  private async getTemplate(
    templatePath: string
  ): Promise<HandlebarsTemplateDelegate> {
    if (this.cache.has(templatePath)) {
      return this.cache.get(templatePath)!;
    }

    const fullPath = join(this.templatesDir, templatePath);
    const source = await readFile(fullPath, 'utf-8');
    const template = Handlebars.compile(source);

    this.cache.set(templatePath, template);
    return template;
  }

  clearCache(): void {
    this.cache.clear();
  }
}
