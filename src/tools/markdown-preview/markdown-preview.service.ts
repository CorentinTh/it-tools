import markdownit from 'markdown-it';
import DomPurify from 'dompurify';

const md = markdownit();

export function renderMarkdown(markdown: string): string {
  const html = md.render(markdown);
  return DomPurify.sanitize(html, { ADD_ATTR: ['target'] });
}
