import {
  Document,
  type ParsedNode,
  isCollection,
  isNode,
  isPair,
  parseDocument,
  visit,
} from 'yaml';
import {
  YAML_MAX_ALIAS_COUNT,
  YAML_MAX_DEPTH,
  YAML_MAX_NODES,
  YAML_MAX_OUTPUT_BYTES,
  type YamlFormatTask,
  YamlTaskError,
} from './yaml-viewer.worker.protocol';
import { exceedsUtf8ByteLimit } from '@/utils/utf8';

type ParsedYamlDocument = Document.Parsed<ParsedNode>;
export type ParseYamlDocument = (
  source: string,
  options?: Parameters<typeof parseDocument>[1],
) => ParsedYamlDocument;

function getErrorMessage(error: unknown, fallback: string): string {
  if (!(error instanceof Error) || error.message.trim() === '') {
    return fallback;
  }

  return error.message.slice(0, 1_000);
}

const YAML_OUTPUT_DOCUMENT_OVERHEAD_BYTES = 64;
const YAML_OUTPUT_VALUE_OVERHEAD_BYTES = 16;

class YamlOutputProjection {
  private projectedBytes = YAML_OUTPUT_DOCUMENT_OVERHEAD_BYTES;

  constructor(private readonly maxOutputBytes: number) {}

  add(bytes: number): void {
    if (!Number.isSafeInteger(bytes) || bytes < 0 || bytes > this.maxOutputBytes - this.projectedBytes) {
      throw new YamlTaskError(
        'limit',
        `Formatted YAML is limited to ${this.maxOutputBytes.toLocaleString('en')} UTF-8 bytes.`,
      );
    }

    this.projectedBytes += bytes;
  }

  addRepeated(bytesPerItem: number, itemCount: number): void {
    if (
      !Number.isSafeInteger(bytesPerItem)
      || bytesPerItem < 0
      || !Number.isSafeInteger(itemCount)
      || itemCount < 0
      || (itemCount > 0 && bytesPerItem > Math.floor((this.maxOutputBytes - this.projectedBytes) / itemCount))
    ) {
      throw new YamlTaskError(
        'limit',
        `Formatted YAML is limited to ${this.maxOutputBytes.toLocaleString('en')} UTF-8 bytes.`,
      );
    }

    this.projectedBytes += bytesPerItem * itemCount;
  }
}

function isYamlPrintable(codePoint: number): boolean {
  return codePoint === 0x09
    || codePoint === 0x0A
    || codePoint === 0x0D
    || (codePoint >= 0x20 && codePoint <= 0x7E)
    || codePoint === 0x85
    || (codePoint >= 0xA0 && codePoint <= 0xD7FF)
    || (codePoint >= 0xE000 && codePoint <= 0xFFFD)
    || (codePoint >= 0x10000 && codePoint <= 0x10FFFF);
}

function projectedYamlStringBytes(value: string, collectionDepth: number, indentSize: number): number {
  let spacesAdjacentToLineBreak = 0;
  for (let index = 0; index < value.length; index += 1) {
    if (value.charCodeAt(index) !== 0x0A) {
      continue;
    }

    // Double-quoted physical lines prefix each boundary next to LF with a
    // backslash to preserve it. A single space between two LF characters is
    // escaped on both sides and therefore intentionally contributes twice.
    if (value.charCodeAt(index - 1) === 0x20) {
      spacesAdjacentToLineBreak += 1;
    }
    if (value.charCodeAt(index + 1) === 0x20) {
      spacesAdjacentToLineBreak += 1;
    }
  }

  let doubleQuotedBytes = 2 + spacesAdjacentToLineBreak;
  let singleQuotedBytes = 2;
  let blockBytes = 8;
  let physicalLineOverheadBytes = 0;

  for (let index = 0; index < value.length; index += 1) {
    const codeUnit = value.charCodeAt(index);
    let codePoint = codeUnit;
    let rawBytes: number;
    let isLoneSurrogate = false;

    if (
      codeUnit >= 0xD800
      && codeUnit <= 0xDBFF
      && value.charCodeAt(index + 1) >= 0xDC00
      && value.charCodeAt(index + 1) <= 0xDFFF
    ) {
      codePoint = ((codeUnit - 0xD800) * 0x400) + (value.charCodeAt(index + 1) - 0xDC00) + 0x10000;
      rawBytes = 4;
      index += 1;
    }
    else if (codeUnit >= 0xD800 && codeUnit <= 0xDFFF) {
      // TextEncoder replaces an unmatched UTF-16 surrogate with U+FFFD.
      rawBytes = 3;
      isLoneSurrogate = true;
    }
    else if (codeUnit <= 0x7F) {
      rawBytes = 1;
    }
    else if (codeUnit <= 0x7FF) {
      rawBytes = 2;
    }
    else {
      rawBytes = 3;
    }

    singleQuotedBytes += rawBytes + (codePoint === 0x27 ? 1 : 0);
    blockBytes += rawBytes;

    if (codePoint === 0x22 || codePoint === 0x5C) {
      doubleQuotedBytes += 2;
    }
    else if (
      codePoint === 0x08
      || codePoint === 0x09
      || codePoint === 0x0A
      || codePoint === 0x0C
      || codePoint === 0x0D
    ) {
      doubleQuotedBytes += 2;
    }
    else if (isLoneSurrogate || !isYamlPrintable(codePoint)) {
      doubleQuotedBytes += codePoint <= 0xFF ? 4 : codePoint <= 0xFFFF ? 6 : 10;
    }
    else {
      doubleQuotedBytes += rawBytes;
    }

    if (codePoint === 0x0A || codePoint === 0x0D) {
      // Depending on the chosen scalar style, yaml may keep a physical line
      // break alongside escaped characters. Charge that cost independently of
      // the largest representation so mixed control/newline strings remain a
      // safe upper bound. Each candidate already accounts for the line-break
      // bytes themselves; only continuation indentation is extra. lineWidth=0
      // below prevents additional soft wrapping.
      physicalLineOverheadBytes += collectionDepth * indentSize;
    }
  }

  return Math.max(doubleQuotedBytes, singleQuotedBytes, blockBytes) + physicalLineOverheadBytes;
}

/**
 * Reject output amplification before yaml's serializer can allocate the full
 * string. Scalar aliases are primitive copies after toJS(), so every occurrence
 * is counted. Repeated collections retain object identity and are represented by
 * a small generated anchor/alias, matching Document's default behavior.
 *
 * The projection deliberately over-counts node syntax and indentation. String
 * values use the largest double-quoted, single-quoted, or block-scalar bound;
 * disabling line wrapping makes those three representations exhaustive.
 */
export function assertYamlOutputWithinLimits(
  root: unknown,
  indentSize: number,
  maxOutputBytes = YAML_MAX_OUTPUT_BYTES,
): void {
  const projection = new YamlOutputProjection(maxOutputBytes);
  // yaml emits sequence-item indentation in steps of at least two spaces even
  // when the requested indentation is one. Using the effective serializer
  // width globally is conservative for maps and prevents deep sequences from
  // passing the preflight with an underestimated output size.
  const effectiveIndentSize = Math.max(indentSize, 2);
  const seenObjects = new WeakSet<object>();
  const stack: Array<{ value: unknown; collectionDepth: number }> = [{ value: root, collectionDepth: 0 }];

  while (stack.length > 0) {
    const current = stack.pop();
    if (current === undefined) {
      break;
    }

    const { value, collectionDepth } = current;
    projection.add(YAML_OUTPUT_VALUE_OVERHEAD_BYTES + collectionDepth * effectiveIndentSize);

    if (typeof value === 'string') {
      projection.add(projectedYamlStringBytes(value, collectionDepth, effectiveIndentSize));
      continue;
    }

    if (value === null || value === undefined) {
      projection.add(6);
      continue;
    }

    if (typeof value === 'boolean') {
      projection.add(value ? 6 : 7);
      continue;
    }

    if (typeof value === 'number') {
      // Includes a two-byte margin for YAML-specific spellings such as .nan,
      // .inf, and negative zero without charging every scalar as a long number.
      projection.add(String(value).length + 2);
      continue;
    }

    if (typeof value === 'bigint') {
      projection.add(value.toString().length + 2);
      continue;
    }

    if (typeof value !== 'object') {
      throw new YamlTaskError('operation', 'YAML contains a value that cannot be formatted safely.');
    }

    if (seenObjects.has(value)) {
      // Generated anchors use a short fixed prefix plus a bounded node index.
      projection.add(YAML_OUTPUT_VALUE_OVERHEAD_BYTES);
      continue;
    }
    seenObjects.add(value);

    if (ArrayBuffer.isView(value)) {
      projection.addRepeated(
        YAML_OUTPUT_VALUE_OVERHEAD_BYTES + (collectionDepth + 1) * effectiveIndentSize,
        value.byteLength,
      );
      continue;
    }

    if (value instanceof ArrayBuffer) {
      projection.addRepeated(
        YAML_OUTPUT_VALUE_OVERHEAD_BYTES + (collectionDepth + 1) * effectiveIndentSize,
        value.byteLength,
      );
      continue;
    }

    if (value instanceof Date) {
      projection.add(32);
      continue;
    }

    if (Array.isArray(value)) {
      for (let index = value.length - 1; index >= 0; index -= 1) {
        stack.push({ value: value[index], collectionDepth: collectionDepth + 1 });
      }
      continue;
    }

    if (value instanceof Set) {
      for (const item of value) {
        stack.push({ value: item, collectionDepth: collectionDepth + 1 });
      }
      continue;
    }

    if (value instanceof Map) {
      for (const [key, item] of value) {
        projection.add(YAML_OUTPUT_VALUE_OVERHEAD_BYTES + collectionDepth * effectiveIndentSize);
        stack.push({ value: item, collectionDepth: collectionDepth + 1 });
        stack.push({ value: key, collectionDepth: collectionDepth + 1 });
      }
      continue;
    }

    const prototype = Object.getPrototypeOf(value);
    if (prototype !== Object.prototype && prototype !== null) {
      const toJSON = (value as { toJSON?: () => unknown }).toJSON;
      if (typeof toJSON !== 'function') {
        throw new YamlTaskError('operation', 'YAML contains a value that cannot be formatted safely.');
      }

      stack.push({ value: toJSON.call(value), collectionDepth });
      continue;
    }

    for (const [key, item] of Object.entries(value)) {
      projection.add(YAML_OUTPUT_VALUE_OVERHEAD_BYTES + collectionDepth * effectiveIndentSize);
      projection.add(projectedYamlStringBytes(key, collectionDepth + 1, effectiveIndentSize));
      stack.push({ value: item, collectionDepth: collectionDepth + 1 });
    }
  }
}

export function assertYamlDocumentWithinLimits(
  document: ParsedYamlDocument,
  limits: { maxDepth: number; maxNodes: number } = {
    maxDepth: YAML_MAX_DEPTH,
    maxNodes: YAML_MAX_NODES,
  },
): void {
  let nodeCount = 0;

  visit(document, (_key, node, path) => {
    if (isNode(node) || isPair(node)) {
      nodeCount += 1;
      if (nodeCount > limits.maxNodes) {
        throw new YamlTaskError(
          'limit',
          `YAML documents are limited to ${limits.maxNodes.toLocaleString('en')} nodes.`,
        );
      }
    }

    const collectionDepth = path.reduce(
      (depth, ancestor) => depth + (isCollection(ancestor) ? 1 : 0),
      isCollection(node) ? 1 : 0,
    );
    if (collectionDepth > limits.maxDepth) {
      throw new YamlTaskError(
        'limit',
        `YAML nesting is limited to ${limits.maxDepth.toLocaleString('en')} collection levels.`,
      );
    }
  });
}

export function formatYaml(
  task: YamlFormatTask,
  parse: ParseYamlDocument = parseDocument,
): string {
  let document: ParsedYamlDocument;

  try {
    // parseDocument itself does not log warnings. Keeping a non-silent log
    // level is nevertheless required for it to report a second document as an
    // error, matching yaml.parse's existing single-document contract.
    document = parse(task.source, {
      intAsBigInt: true,
      logLevel: 'warn',
      prettyErrors: true,
    });
  }
  catch (error) {
    throw new YamlTaskError('syntax', getErrorMessage(error, 'Provided YAML is not valid.'));
  }

  if (document.errors.length > 0) {
    throw new YamlTaskError('syntax', getErrorMessage(document.errors[0], 'Provided YAML is not valid.'));
  }

  assertYamlDocumentWithinLimits(document);

  let parsed: unknown;
  try {
    parsed = document.toJS({ maxAliasCount: YAML_MAX_ALIAS_COUNT });
  }
  catch (error) {
    const message = getErrorMessage(error, 'YAML values could not be resolved.');
    if (/alias count|resource exhaustion/i.test(message)) {
      throw new YamlTaskError(
        'limit',
        `YAML alias expansion is limited to ${YAML_MAX_ALIAS_COUNT.toLocaleString('en')}.`,
      );
    }

    throw new YamlTaskError('operation', message);
  }

  let formatted: string | undefined;
  try {
    assertYamlOutputWithinLimits(parsed, task.indentSize);
    const outputDocument = new Document(parsed, {
      sortMapEntries: task.sortKeys,
    });
    formatted = outputDocument.toString({
      indent: task.indentSize,
      lineWidth: 0,
    });
  }
  catch (error) {
    if (error instanceof YamlTaskError) {
      throw error;
    }

    throw new YamlTaskError('operation', getErrorMessage(error, 'YAML output could not be generated.'));
  }

  if (formatted === undefined) {
    throw new YamlTaskError('operation', 'YAML output could not be generated.');
  }

  if (exceedsUtf8ByteLimit(formatted, YAML_MAX_OUTPUT_BYTES)) {
    throw new YamlTaskError(
      'limit',
      `Formatted YAML is limited to ${YAML_MAX_OUTPUT_BYTES.toLocaleString('en')} UTF-8 bytes.`,
    );
  }

  return formatted;
}
