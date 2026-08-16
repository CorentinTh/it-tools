import DOMPurify from 'dompurify';

export const MERMAID_MAX_SOURCE_CHARACTERS = 32_768;
export const MERMAID_MAX_SOURCE_BYTES = 32_768;
export const MERMAID_MAX_LINES = 2_000;
export const MERMAID_MAX_LINE_CHARACTERS = 4_096;
export const MERMAID_MAX_EDGES = 200;
export const MERMAID_MAX_RAW_SVG_BYTES = 1_048_576;
export const MERMAID_MAX_SVG_BYTES = 524_288;
export const MERMAID_MAX_SVG_ELEMENTS = 5_000;
export const MERMAID_MAX_VIEWBOX_SIDE = 8_192;
export const MERMAID_MAX_PNG_SIDE = 4_096;
export const MERMAID_MAX_PNG_PIXELS = 16_777_216;

export type SupportedMermaidKind = 'Flowchart' | 'Sequence' | 'Class' | 'State' | 'Entity relationship';

export interface ValidatedMermaidSource {
  source: string
  kind: SupportedMermaidKind
  sourceBytes: number
  lineCount: number
}

export interface SanitizedMermaidSvg {
  svg: string
  svgBytes: number
  elementCount: number
  width: number
  height: number
}

const FORBIDDEN_SOURCE_DIRECTIVE = /(?:^|[;\n])\s*(?:click|links?|style|classDef|linkStyle)\b/imu;
const URL_SCHEME = /(?:https?|ftp|file|data|javascript|vbscript):/iu;
const PROTOCOL_RELATIVE_URL = /(?:^|[\s"'(=])\/\/[\p{L}\p{N}]/imu;
const HTML_TAG = /<\/?[A-Za-z][^>]*>/u;
const FORBIDDEN_SVG_TAGS = ['script', 'foreignObject', 'iframe', 'object', 'embed', 'image', 'a', 'audio', 'video', 'form', 'input', 'button'];
const DANGEROUS_CSS = /@import|@namespace|expression\s*\(|javascript\s*:|data\s*:|https?\s*:|\/\/|-moz-binding|behavior\s*:/iu;
const EXTERNAL_ATTRIBUTE_VALUE = /(?:https?|ftp|file|data|javascript|vbscript):|\/\//iu;
const SAFE_FRAGMENT_URL = /^url\(\s*#[A-Za-z_][\w:.-]*\s*\)$/u;

function fail(message: string): never {
  throw new Error(message);
}

function getUtf8ByteLength(value: string): number {
  return new TextEncoder().encode(value).byteLength;
}

function detectKind(source: string): SupportedMermaidKind {
  const firstLine = source
    .split('\n')
    .map(line => line.trim())
    .find(line => line && !line.startsWith('%%'));

  if (!firstLine) {
    return fail('Enter a Mermaid diagram definition.');
  }
  if (/^flowchart\s+(?:TB|TD|BT|RL|LR)\b/iu.test(firstLine)) {
    return 'Flowchart';
  }
  if (/^sequenceDiagram\s*$/iu.test(firstLine)) {
    return 'Sequence';
  }
  if (/^classDiagram(?:-v2)?\s*$/iu.test(firstLine)) {
    return 'Class';
  }
  if (/^stateDiagram(?:-v2)?\s*$/iu.test(firstLine)) {
    return 'State';
  }
  if (/^erDiagram\s*$/iu.test(firstLine)) {
    return 'Entity relationship';
  }
  return fail('Supported diagram headers are flowchart, sequenceDiagram, classDiagram, stateDiagram-v2, and erDiagram.');
}

export function validateMermaidSource(value: string): ValidatedMermaidSource {
  const source = value.replace(/\r\n?/gu, '\n').trim();
  if (!source) {
    return fail('Enter a Mermaid diagram definition.');
  }
  if (source.length > MERMAID_MAX_SOURCE_CHARACTERS) {
    return fail(`Mermaid source is limited to ${MERMAID_MAX_SOURCE_CHARACTERS.toLocaleString('en-US')} characters.`);
  }
  const sourceBytes = getUtf8ByteLength(source);
  if (sourceBytes > MERMAID_MAX_SOURCE_BYTES) {
    return fail(`Mermaid source is limited to ${MERMAID_MAX_SOURCE_BYTES.toLocaleString('en-US')} UTF-8 bytes.`);
  }
  const lines = source.split('\n');
  if (lines.length > MERMAID_MAX_LINES) {
    return fail(`Mermaid source is limited to ${MERMAID_MAX_LINES.toLocaleString('en-US')} lines.`);
  }
  if (lines.some(line => line.length > MERMAID_MAX_LINE_CHARACTERS)) {
    return fail(`Each Mermaid source line is limited to ${MERMAID_MAX_LINE_CHARACTERS.toLocaleString('en-US')} characters.`);
  }
  if (/[^\t\n\u0020-\u007E\u00A0-\u{10FFFF}]/u.test(source)) {
    return fail('Mermaid source contains unsupported control characters.');
  }
  if (/^\s*---\s*$/mu.test(source) || /^\s*%%\{/mu.test(source)) {
    return fail('Mermaid frontmatter and configuration directives are disabled; renderer security settings are fixed.');
  }
  if (FORBIDDEN_SOURCE_DIRECTIVE.test(source)) {
    return fail('Mermaid click, link, links, style, classDef, and linkStyle directives are disabled.');
  }
  if (URL_SCHEME.test(source) || PROTOCOL_RELATIVE_URL.test(source)) {
    return fail('URLs and external resources are disabled in Mermaid source.');
  }
  if (HTML_TAG.test(source)) {
    return fail('HTML labels and tags are disabled in Mermaid source.');
  }

  return {
    source,
    kind: detectKind(source),
    sourceBytes,
    lineCount: lines.length,
  };
}

function parseViewBox(root: SVGSVGElement): { width: number; height: number } {
  const values = (root.getAttribute('viewBox') ?? '').trim().split(/[\s,]+/u).map(Number);
  if (values.length !== 4 || values.some(value => !Number.isFinite(value))) {
    return fail('Mermaid produced SVG without a valid viewBox.');
  }
  const width = values[2]!;
  const height = values[3]!;
  if (width <= 0 || height <= 0 || width > MERMAID_MAX_VIEWBOX_SIDE || height > MERMAID_MAX_VIEWBOX_SIDE) {
    return fail(`Rendered SVG dimensions must be between 1 and ${MERMAID_MAX_VIEWBOX_SIDE.toLocaleString('en-US')} units per side.`);
  }
  return { width, height };
}

function validateCss(value: string) {
  if (DANGEROUS_CSS.test(value)) {
    return fail('Mermaid produced SVG with a forbidden external or executable style.');
  }
  for (const match of value.matchAll(/url\([^)]*\)/giu)) {
    if (!SAFE_FRAGMENT_URL.test(match[0])) {
      return fail('Mermaid produced SVG with a non-local CSS resource.');
    }
  }
}

export function sanitizeMermaidSvg(rawSvg: string): SanitizedMermaidSvg {
  if (getUtf8ByteLength(rawSvg) > MERMAID_MAX_RAW_SVG_BYTES) {
    return fail(`Raw Mermaid SVG exceeds the ${MERMAID_MAX_RAW_SVG_BYTES.toLocaleString('en-US')}-byte safety limit.`);
  }

  const sanitized = DOMPurify.sanitize(rawSvg, {
    USE_PROFILES: { svg: true, svgFilters: true },
    FORBID_TAGS: FORBIDDEN_SVG_TAGS,
    ALLOW_DATA_ATTR: false,
    ALLOW_ARIA_ATTR: true,
  });
  const document = new DOMParser().parseFromString(sanitized, 'image/svg+xml');
  if (document.querySelector('parsererror')) {
    return fail('Mermaid produced malformed SVG.');
  }
  const root = document.documentElement;
  if (root.namespaceURI !== 'http://www.w3.org/2000/svg' || root.localName !== 'svg') {
    return fail('Mermaid output is not an SVG document.');
  }

  const elements = [root, ...Array.from(root.querySelectorAll('*'))];
  if (elements.length > MERMAID_MAX_SVG_ELEMENTS) {
    return fail(`Rendered SVG is limited to ${MERMAID_MAX_SVG_ELEMENTS.toLocaleString('en-US')} elements.`);
  }
  for (const element of elements) {
    if (FORBIDDEN_SVG_TAGS.includes(element.localName)) {
      element.remove();
      continue;
    }
    for (const attribute of Array.from(element.attributes)) {
      const name = attribute.name.toLowerCase();
      const value = attribute.value;
      if (name.startsWith('on') || name === 'href' || name.endsWith(':href')) {
        element.removeAttribute(attribute.name);
        continue;
      }
      if (name === 'xmlns' || name.startsWith('xmlns:')) {
        continue;
      }
      if (EXTERNAL_ATTRIBUTE_VALUE.test(value)) {
        return fail('Mermaid produced SVG with an external resource reference.');
      }
      if (name === 'style') {
        validateCss(value);
      }
      if (value.toLowerCase().includes('url(')) {
        for (const match of value.matchAll(/url\([^)]*\)/giu)) {
          if (!SAFE_FRAGMENT_URL.test(match[0])) {
            return fail('Mermaid produced SVG with a non-local resource reference.');
          }
        }
      }
    }
    if (element.localName === 'style') {
      validateCss(element.textContent ?? '');
    }
  }

  const { width, height } = parseViewBox(root as unknown as SVGSVGElement);
  root.setAttribute('role', 'img');
  root.setAttribute('aria-label', 'Generated Mermaid diagram');
  root.setAttribute('width', '100%');
  root.setAttribute('height', 'auto');
  root.setAttribute('preserveAspectRatio', 'xMidYMid meet');

  const svg = new XMLSerializer().serializeToString(root);
  const svgBytes = getUtf8ByteLength(svg);
  if (svgBytes > MERMAID_MAX_SVG_BYTES) {
    return fail(`Sanitized Mermaid SVG exceeds the ${MERMAID_MAX_SVG_BYTES.toLocaleString('en-US')}-byte limit.`);
  }
  return { svg, svgBytes, elementCount: elements.length, width, height };
}

export function makeMermaidPreviewDocument(svg: string): string {
  return `<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; base-uri 'none'; connect-src 'none'; font-src 'none'; form-action 'none'; frame-src 'none'; img-src 'none'; media-src 'none'; object-src 'none'; script-src 'none'; style-src 'unsafe-inline'"><meta name="referrer" content="no-referrer"><style>html,body{margin:0;min-height:100%;background:transparent}body{display:grid;place-items:center;padding:16px;box-sizing:border-box}svg{display:block;max-width:100%;height:auto}</style></head><body>${svg}</body></html>`;
}

export function calculatePngDimensions(width: number, height: number): { width: number; height: number } {
  const scale = Math.min(
    2,
    MERMAID_MAX_PNG_SIDE / width,
    MERMAID_MAX_PNG_SIDE / height,
    Math.sqrt(MERMAID_MAX_PNG_PIXELS / (width * height)),
  );
  return {
    width: Math.max(1, Math.floor(width * scale)),
    height: Math.max(1, Math.floor(height * scale)),
  };
}
