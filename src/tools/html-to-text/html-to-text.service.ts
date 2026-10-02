const BLOCK_TAGS = new Set([
  'address', 'article', 'aside', 'blockquote', 'details', 'dialog', 'dd', 'div',
  'dl', 'dt', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2',
  'h3', 'h4', 'h5', 'h6', 'header', 'hgroup', 'hr', 'legend', 'li', 'main',
  'menu', 'nav', 'ol', 'p', 'pre', 'section', 'summary', 'table', 'ul',
]);

/** Extract visible text from an HTML fragment: <script>/<style>/<template>
 *  and everything with `display:none`-style inline hiding is dropped, block
 *  boundaries produce newlines, inline tags are flattened. */
export function extractTextFromHtml(html: string, options: { collapseWhitespace: boolean } = { collapseWhitespace: true }): string {
  if (!html.trim()) {
    return '';
  }

  const doc = new DOMParser().parseFromString(html, 'text/html');

  for (const selector of ['script', 'style', 'template', 'noscript', 'head']) {
    for (const node of doc.querySelectorAll(selector)) {
      node.remove();
    }
  }
  for (const node of doc.querySelectorAll('[hidden], [aria-hidden="true"], [style*="display:none"], [style*="display: none"]')) {
    node.remove();
  }

  const text = doc.body
    ? extractFrom(doc.body)
    : '';

  const cleaned = text
    .split('\n')
    .map(line => line.replace(/\u00A0/g, ' ').trim())
    .filter(line => line.length > 0)
    .join('\n');

  return options.collapseWhitespace
    ? cleaned.replace(/[ \t]{2,}/g, ' ')
    : cleaned;
}

function extractFrom(node: Element): string {
  let result = '';
  for (const child of node.childNodes) {
    if (child instanceof Text) {
      result += child.textContent ?? '';
      continue;
    }
    if (!(child instanceof Element)) {
      continue;
    }
    const tag = child.tagName.toLowerCase();
    if (tag === 'br') {
      result += '\n';
      continue;
    }
    const inner = extractFrom(child);
    const blockLevel = BLOCK_TAGS.has(tag);
    if (blockLevel && inner.trim()) {
      result += `\n${inner}\n`;
    }
    else {
      result += inner;
    }
  }
  return result;
}
