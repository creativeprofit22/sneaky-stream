import { buildTransformPrompt } from './prompts';
import { spawn } from 'child_process';

export interface TransformOptions {
  html: string;
  css: string;
  framework: 'react' | 'vue' | 'svelte' | 'html';
  styling: 'tailwind' | 'css-modules' | 'vanilla' | 'inline';
  name: string;
}

export interface TransformResult {
  code: string;
  styles?: string;
  filename: string;
}

export class TransformClient {
  async transform(options: TransformOptions): Promise<TransformResult> {
    const prompt = buildTransformPrompt(options);
    const response = await this.callClaude(prompt);
    return this.parseResponse(response, options);
  }

  private async callClaude(prompt: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const proc = spawn('claude', ['-p', prompt], {
        stdio: ['pipe', 'pipe', 'pipe'],
      });

      let stdout = '';
      let stderr = '';

      proc.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      proc.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      proc.on('close', (code) => {
        if (code === 0) {
          resolve(stdout);
        } else {
          reject(new Error(`Claude CLI failed: ${stderr}`));
        }
      });

      proc.on('error', (err) => {
        reject(new Error(`Failed to spawn Claude CLI: ${err.message}`));
      });
    });
  }

  private parseResponse(
    response: string,
    options: TransformOptions
  ): TransformResult {
    // Extract code block
    const codeMatch = response.match(/```(?:tsx?|vue|svelte|html)?\n([\s\S]*?)```/);
    const code = codeMatch ? codeMatch[1].trim() : response.trim();

    // Extract styles if separate
    const stylesMatch = response.match(/```css\n([\s\S]*?)```/);
    const styles = stylesMatch ? stylesMatch[1].trim() : undefined;

    // Determine filename
    const extensions: Record<string, string> = {
      react: '.tsx',
      vue: '.vue',
      svelte: '.svelte',
      html: '.html',
    };

    return {
      code,
      styles,
      filename: `${options.name}${extensions[options.framework]}`,
    };
  }
}
