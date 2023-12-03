import { marked } from "marked";
import highlight from "highlight.js";
import 'highlight.js/styles/atom-one-dark.css';

export const renderMarkdown = (md: string) => {
    highlight.configure({

    })
    const renderer = new marked.Renderer();

    // Override the code rendering function to use highlight.js for syntax highlighting
    renderer.code = (code: string, language: string) => {
        const validLanguage = highlight.getLanguage(language) ? language : 'plaintext';
        return `<pre><code class="hljs ${validLanguage}">${highlight.highlight(validLanguage, code).value}</code></pre>`;
    };

    marked.use({ renderer });

    return marked.parse(md)
}
