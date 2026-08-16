import { describe, expect, it } from 'vitest';
import {
  MERMAID_MAX_LINES,
  MERMAID_MAX_SVG_ELEMENTS,
  calculatePngDimensions,
  makeMermaidPreviewDocument,
  sanitizeMermaidSvg,
  validateMermaidSource,
} from './mermaid-diagram.policy';

describe('Mermaid diagram policy', () => {
  it.each([
    ['flowchart LR\nA --> B', 'Flowchart'],
    ['sequenceDiagram\nA->>B: hello', 'Sequence'],
    ['classDiagram\nA <|-- B', 'Class'],
    ['stateDiagram-v2\n[*] --> Ready', 'State'],
    ['erDiagram\nA ||--o{ B : owns', 'Entity relationship'],
  ])('accepts the restricted %s syntax family', (source, kind) => {
    expect(validateMermaidSource(source)).toMatchObject({ kind });
  });

  it('normalizes line endings and accounts UTF-8 bytes exactly', () => {
    expect(validateMermaidSource('flowchart LR\r\nA[é] --> B')).toMatchObject({
      source: 'flowchart LR\nA[é] --> B',
      sourceBytes: 24,
      lineCount: 2,
    });
  });

  it.each([
    ['---\nconfig:\n  theme: dark\n---\nflowchart LR\nA-->B', 'frontmatter'],
    ['%%{init: {"securityLevel": "loose"}}%%\nflowchart LR\nA-->B', 'configuration'],
    ['flowchart LR\nclick A "https://secret.invalid"', 'click'],
    ['flowchart LR\nclassDef red fill:red', 'classDef'],
    ['flowchart LR\nA --> B; style A fill:red', 'style'],
    ['flowchart LR\nA --> B;classDef injected fill:red', 'classDef'],
    ['sequenceDiagram\nA->>B: hello\nlink A: Internal @ /private', 'link'],
    ['flowchart LR\nA[<img src=x onerror=alert(1)>]', 'HTML'],
    ['flowchart LR\nA[https://secret.invalid]', 'URLs'],
    ['pie\n"A": 1', 'Supported diagram headers'],
    ['flowchart LR\nA[\u0000]', 'control'],
  ])('rejects unsafe or unsupported source without echoing it: %s', (source, message) => {
    expect(() => validateMermaidSource(source)).toThrow(message);
    try {
      validateMermaidSource(source);
    }
    catch (error) {
      expect((error as Error).message).not.toContain('secret.invalid');
      expect((error as Error).message).not.toContain('onerror');
    }
  });

  it('rejects byte and line amplification before rendering', () => {
    expect(() => validateMermaidSource(`flowchart LR\nA[${'é'.repeat(20_000)}]`)).toThrow('UTF-8 bytes');
    expect(() => validateMermaidSource(`flowchart LR\n${'A\n'.repeat(MERMAID_MAX_LINES)}`)).toThrow('lines');
  });

  it('sanitizes executable/link elements and produces bounded accessible SVG', () => {
    const result = sanitizeMermaidSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 60" onload="alert(1)">
      <a href="https://secret.invalid"><text x="1" y="10">safe text</text></a>
      <script>alert(1)</script><foreignObject><div xmlns="http://www.w3.org/1999/xhtml">unsafe</div></foreignObject>
      <defs><marker id="arrow"><path d="M0 0L5 5"/></marker></defs><path marker-end="url(#arrow)" d="M0 0L10 10"/>
    </svg>`);
    expect(result).toMatchObject({ width: 120, height: 60 });
    expect(result.svg).toContain('role="img"');
    expect(result.svg).toContain('url(#arrow)');
    expect(result.svg).not.toMatch(/script|foreignObject|onload|secret\.invalid|href=/u);
  });

  it('rejects unsafe CSS, bad dimensions, malformed documents, and excessive SVG trees', () => {
    expect(() => sanitizeMermaidSvg('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><style>@import "https://secret.invalid/x"</style></svg>')).toThrow('forbidden');
    expect(() => sanitizeMermaidSvg('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9000 10"/>')).toThrow('dimensions');
    expect(() => sanitizeMermaidSvg('<div>not svg</div>')).toThrow('SVG');
    const many = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10">${'<g/>'.repeat(MERMAID_MAX_SVG_ELEMENTS)}</svg>`;
    expect(() => sanitizeMermaidSvg(many)).toThrow('elements');
  });

  it('bounds PNG allocation while preserving aspect ratio', () => {
    expect(calculatePngDimensions(100, 50)).toEqual({ width: 200, height: 100 });
    expect(calculatePngDimensions(8_000, 4_000)).toEqual({ width: 4_096, height: 2_048 });
    const large = calculatePngDimensions(8_000, 8_000);
    expect(large.width * large.height).toBeLessThanOrEqual(16_777_216);
  });

  it('wraps only sanitized SVG in a scriptless network-denying preview document', () => {
    const document = makeMermaidPreviewDocument('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"/>');
    expect(document).toContain('default-src \'none\'');
    expect(document).toContain('script-src \'none\'');
    expect(document).toContain('connect-src \'none\'');
    expect(document).toContain('<svg');
  });
});
