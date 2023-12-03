import { marked } from 'marked';
import highlight from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';

export { renderMarkdown };

function renderMarkdown(md: string): string {
  const renderer = new marked.Renderer();

  // Override the code rendering function to use highlight.js for syntax highlighting
  renderer.code = (code: string, language: string) => {
    const validLanguage = highlight.getLanguage(language) ? language : 'plaintext';
    const highlightedCode = highlight.highlight(validLanguage, code).value;
    return `<pre><code class="hljs ${validLanguage}">${highlightedCode}</code></pre>`;
  };

  marked.setOptions({ renderer });

  try {
    return marked(md);
  }
  catch (error) {
    console.error('Markdown parsing error:', error);
    return '<p>Error rendering Markdown</p>';
  }
}
