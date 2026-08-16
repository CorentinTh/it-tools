import DOMPurify from 'dompurify';
import MarkdownIt from 'markdown-it';

export const MARKDOWN_DIFF_PREVIEW_MAX_BYTES = 64 * 1024;

const ALLOWED_MARKDOWN_TAGS = [
  'p', 'br', 'hr', 'blockquote', 'pre', 'code', 'em', 'strong', 's',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
];

const renderer = new MarkdownIt({ html: false, linkify: false, typographer: false });
renderer.renderer.rules.link_open = () => '';
renderer.renderer.rules.link_close = () => '';
renderer.renderer.rules.image = (tokens, index) => renderer.utils.escapeHtml(tokens[index].content);

export function renderSafeMarkdownPreview(source: string): string {
  return DOMPurify.sanitize(renderer.render(source), {
    ALLOWED_TAGS: ALLOWED_MARKDOWN_TAGS,
    ALLOWED_ATTR: [],
    ALLOW_ARIA_ATTR: false,
    ALLOW_DATA_ATTR: false,
    KEEP_CONTENT: true,
    SANITIZE_NAMED_PROPS: true,
  });
}
