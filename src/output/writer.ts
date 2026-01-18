import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';
import { TemplateEngine } from './template-engine';

export interface OutputOptions {
  outputDir: string;
  templatesDir?: string;
}

export interface WriteOptions {
  name: string;
  framework: 'react' | 'vue' | 'svelte' | 'html';
  code: string;
  styles?: string;
  props?: Array<{ name: string; type: string }>;
}

export class OutputWriter {
  private outputDir: string;
  private templateEngine: TemplateEngine;

  constructor(options: OutputOptions) {
    this.outputDir = options.outputDir;
    this.templateEngine = new TemplateEngine(options.templatesDir);
  }

  async write(options: WriteOptions): Promise<string[]> {
    const { name, framework, code, styles } = options;

    // Create component directory
    const componentDir = join(this.outputDir, name);
    await mkdir(componentDir, { recursive: true });

    const writtenFiles: string[] = [];

    // Determine file extension
    const extensions: Record<string, string> = {
      react: '.tsx',
      vue: '.vue',
      svelte: '.svelte',
      html: '.html',
    };

    // Write main component file
    const componentFile = join(componentDir, `${name}${extensions[framework]}`);
    await writeFile(componentFile, code);
    writtenFiles.push(componentFile);

    // Write styles if separate
    if (styles) {
      const stylesFile = join(componentDir, `${name}.module.css`);
      await writeFile(stylesFile, styles);
      writtenFiles.push(stylesFile);
    }

    // Write index barrel file (for React/Svelte)
    if (framework === 'react' || framework === 'svelte') {
      const indexFile = join(componentDir, 'index.ts');
      const indexContent = `export { ${name} } from './${name}';\n`;
      await writeFile(indexFile, indexContent);
      writtenFiles.push(indexFile);
    }

    return writtenFiles;
  }

  async writeFromTemplate(
    templateName: string,
    outputPath: string,
    data: Record<string, unknown>
  ): Promise<void> {
    const content = await this.templateEngine.render(templateName, data);
    await mkdir(join(outputPath, '..'), { recursive: true });
    await writeFile(outputPath, content);
  }
}
