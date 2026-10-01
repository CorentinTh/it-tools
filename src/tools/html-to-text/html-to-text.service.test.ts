import { describe, expect, it } from 'vitest';
import { extractTextFromHtml } from './html-to-text.service';

describe('html-to-text', () => {
  it('extracts plain text and flattens inline tags', () => {
    expect(extractTextFromHtml('<p>Hello <b>world</b>!</p>')).toBe('Hello world!');
  });

  it('puts block boundaries on separate lines', () => {
    const text = extractTextFromHtml('<ul><li>First</li><li>Second</li></ul><p>Para</p>');
    expect(text.split('\n')).toEqual(['First', 'Second', 'Para']);
  });

  it('removes script, style and template content', () => {
    const text = extractTextFromHtml(
      '<style>.x{color:red}</style><script>alert(1)</script><p>Visible</p>',
    );
    expect(text).toBe('Visible');
  });

  it('removes hidden elements', () => {
    const text = extractTextFromHtml(
      '<p>Shown</p><div hidden>hidden1</div><span aria-hidden="true">hidden2</span><div style="display:none">hidden3</div>',
    );
    expect(text).toBe('Shown');
  });

  it('handles br as a line break', () => {
    expect(extractTextFromHtml('<p>a<br>b</p>')).toBe('a\nb');
  });

  it('preserves entity-decoded characters', () => {
    expect(extractTextFromHtml('<p>Tom &amp; Jerry &lt;3</p>')).toBe('Tom & Jerry <3');
  });

  it('collapses runs of whitespace by default', () => {
    expect(extractTextFromHtml('<p>Hello    \t  world</p>')).toBe('Hello world');
  });

  it('can keep original inner spacing', () => {
    expect(extractTextFromHtml('<p>Hello    world</p>', { collapseWhitespace: false }).trim()).toBe('Hello    world');
  });

  it('returns an empty string for empty input', () => {
    expect(extractTextFromHtml('')).toBe('');
    expect(extractTextFromHtml('   ')).toBe('');
  });
});
