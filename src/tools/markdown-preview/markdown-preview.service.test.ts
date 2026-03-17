import { describe, expect, it } from 'vitest';
import { renderMarkdown } from './markdown-preview.service';

describe('markdown-preview', () => {
  it('renders markdown to html', () => {
    expect(renderMarkdown('# Hello')).toContain('<h1>Hello</h1>');
    expect(renderMarkdown('**bold**')).toContain('<strong>bold</strong>');
    expect(renderMarkdown('*italic*')).toContain('<em>italic</em>');
  });

  it('renders empty string as empty', () => {
    expect(renderMarkdown('')).toBe('');
  });

  it('sanitizes script tags', () => {
    const result = renderMarkdown('<script>alert("xss")</script>');
    expect(result).not.toContain('<script>');
  });
});
