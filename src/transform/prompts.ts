import type { TransformOptions } from './client';

export const SYSTEM_PROMPT = `You are a frontend component generator. Given HTML and CSS extracted from a website, transform it into a clean, reusable component for the specified framework.

Guidelines:
- Extract dynamic content (text, images, prices) as props
- Use semantic HTML
- Follow framework conventions and best practices
- Apply the specified styling approach
- Include TypeScript types where applicable
- Output ONLY the code, no explanations`;

export function buildTransformPrompt(options: TransformOptions): string {
  const { html, css, framework, styling, name } = options;

  const frameworkInstructions: Record<string, string> = {
    react: `Create a React functional component with TypeScript.
Use the component name: ${name}
Export as named export.`,

    vue: `Create a Vue 3 Single File Component (SFC) with <script setup lang="ts">.
Use the component name: ${name}`,

    svelte: `Create a Svelte component with TypeScript.
Use the component name: ${name}`,

    html: `Create a clean HTML file with embedded styles.
Use semantic HTML5 elements.`,
  };

  const stylingInstructions: Record<string, string> = {
    tailwind: 'Use Tailwind CSS utility classes. Remove the original CSS.',
    'css-modules': 'Use CSS Modules. Output styles in a separate CSS block.',
    vanilla: 'Use scoped CSS with a unique class prefix.',
    inline: 'Use inline styles via the style attribute or style object.',
  };

  return `${SYSTEM_PROMPT}

Framework: ${framework}
${frameworkInstructions[framework]}

Styling: ${styling}
${stylingInstructions[styling]}

---

Extracted HTML:
\`\`\`html
${html}
\`\`\`

Extracted CSS:
\`\`\`css
${css}
\`\`\`

---

Generate the component:`;
}
