import { describe, expect, it } from 'vitest';
import { renderSafeMarkdownPreview } from './markdown-diff-preview.service';

describe('safe Markdown diff preview', () => {
  it('keeps formatting while disabling raw HTML, links, images, attributes, SVG, and executable markup', () => {
    const html = renderSafeMarkdownPreview('# Safe\n\n**bold** [link](https://example.com) ![alt](https://example.com/x.png)\n\n<script>alert(1)</script><svg onload=alert(2)><circle /></svg>');
    expect(html).toContain('<h1>Safe</h1>');
    expect(html).toContain('<strong>bold</strong>');
    expect(html).toContain('link');
    expect(html).toContain('alt');
    expect(html).not.toMatch(/<(?:a|img|script|svg)\b/iu);
    const document = new DOMParser().parseFromString(html, 'text/html');
    expect([...document.body.querySelectorAll('*')].every(element => element.attributes.length === 0)).toBe(true);
  });

  it('does not enable Markdown linkification', () => {
    const html = renderSafeMarkdownPreview('Visit https://example.com');
    expect(html).toBe('<p>Visit https://example.com</p>\n');
  });
});
