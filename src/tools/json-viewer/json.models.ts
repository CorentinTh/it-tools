import JSON5 from 'json5';
import {
  type Node as JsonNode,
  type ParseError,
  type ParseOptions,
  parseTree,
  printParseErrorCode,
} from 'jsonc-parser';
import {
  JSON_MAX_DEPTH,
  JSON_MAX_NODES,
  JSON_MAX_OUTPUT_BYTES,
  type JsonFormatTask,
  JsonTaskError,
} from './json-viewer.worker.protocol';

export type ParseStrictJson = (
  source: string,
  errors?: ParseError[],
  options?: ParseOptions,
) => JsonNode | undefined;

export type ParseCompatibilityJson = (source: string) => unknown;

interface JsonFormatDependencies {
  parseStrict?: ParseStrictJson
  parseCompatibility?: ParseCompatibilityJson
  maxDepth?: number
  maxNodes?: number
  maxOutputBytes?: number
}

interface JsonLimits {
  maxDepth: number
  maxNodes: number
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (!(error instanceof Error) || error.message.trim() === '') {
    return fallback;
  }

  return error.message.slice(0, 1_000);
}

function compareKeys(left: string, right: string): number {
  if (left < right) {
    return -1;
  }

  if (left > right) {
    return 1;
  }

  return 0;
}

function utf8ByteLength(value: string): number {
  let byteLength = 0;

  for (let index = 0; index < value.length; index += 1) {
    const codeUnit = value.charCodeAt(index);

    if (codeUnit <= 0x007F) {
      byteLength += 1;
    }
    else if (codeUnit <= 0x07FF) {
      byteLength += 2;
    }
    else if (
      codeUnit >= 0xD800
      && codeUnit <= 0xDBFF
      && value.charCodeAt(index + 1) >= 0xDC00
      && value.charCodeAt(index + 1) <= 0xDFFF
    ) {
      byteLength += 4;
      index += 1;
    }
    else {
      byteLength += 3;
    }
  }

  return byteLength;
}

class BoundedJsonWriter {
  private readonly parts: string[] = [];
  private byteLength = 0;

  constructor(private readonly maxOutputBytes: number) {}

  append(value: string): void {
    const nextByteLength = this.byteLength + utf8ByteLength(value);
    if (nextByteLength > this.maxOutputBytes) {
      throw new JsonTaskError(
        'limit',
        `Formatted JSON is limited to ${this.maxOutputBytes.toLocaleString('en')} UTF-8 bytes.`,
      );
    }

    this.byteLength = nextByteLength;
    this.parts.push(value);
  }

  toString(): string {
    return this.parts.join('');
  }
}

function isCollection(node: JsonNode): boolean {
  return node.type === 'object' || node.type === 'array';
}

export function assertStrictJsonTreeWithinLimits(
  root: JsonNode,
  limits: JsonLimits = { maxDepth: JSON_MAX_DEPTH, maxNodes: JSON_MAX_NODES },
): void {
  const stack: Array<{ node: JsonNode; collectionDepth: number }> = [{
    node: root,
    collectionDepth: isCollection(root) ? 1 : 0,
  }];
  let nodeCount = 0;

  while (stack.length > 0) {
    const current = stack.pop();
    if (current === undefined) {
      break;
    }

    nodeCount += 1;
    if (nodeCount > limits.maxNodes) {
      throw new JsonTaskError(
        'limit',
        `JSON documents are limited to ${limits.maxNodes.toLocaleString('en')} syntax nodes.`,
      );
    }

    if (current.collectionDepth > limits.maxDepth) {
      throw new JsonTaskError(
        'limit',
        `JSON nesting is limited to ${limits.maxDepth.toLocaleString('en')} collection levels.`,
      );
    }

    if (current.node.type === 'object') {
      const seenKeys = new Set<string>();
      for (const property of current.node.children ?? []) {
        const key = propertyKey(property);
        if (seenKeys.has(key)) {
          throw new JsonTaskError('syntax', 'Strict JSON does not allow duplicate object keys.');
        }
        seenKeys.add(key);
      }
    }

    for (const child of current.node.children ?? []) {
      stack.push({
        node: child,
        collectionDepth: current.collectionDepth + (isCollection(child) ? 1 : 0),
      });
    }
  }
}

function assertCompatibilityJsonWithinLimits(
  root: unknown,
  limits: JsonLimits,
): void {
  const stack: Array<{ value: unknown; collectionDepth: number }> = [{
    value: root,
    collectionDepth: typeof root === 'object' && root !== null ? 1 : 0,
  }];
  let nodeCount = 0;

  while (stack.length > 0) {
    const current = stack.pop();
    if (current === undefined) {
      break;
    }

    nodeCount += 1;
    if (nodeCount > limits.maxNodes) {
      throw new JsonTaskError(
        'limit',
        `JSON documents are limited to ${limits.maxNodes.toLocaleString('en')} syntax nodes.`,
      );
    }

    if (current.collectionDepth > limits.maxDepth) {
      throw new JsonTaskError(
        'limit',
        `JSON nesting is limited to ${limits.maxDepth.toLocaleString('en')} collection levels.`,
      );
    }

    if (typeof current.value === 'number') {
      if (!Number.isFinite(current.value)) {
        throw new JsonTaskError(
          'operation',
          'JSON5 compatibility does not format non-finite numbers. Use strict JSON for lossless numeric lexemes.',
        );
      }

      if (Number.isInteger(current.value) && !Number.isSafeInteger(current.value)) {
        throw new JsonTaskError(
          'operation',
          'JSON5 compatibility does not format integers outside the JavaScript safe range. Use strict JSON instead.',
        );
      }
    }

    if (typeof current.value !== 'object' || current.value === null) {
      continue;
    }

    if (Array.isArray(current.value)) {
      for (const value of current.value) {
        stack.push({
          value,
          collectionDepth: current.collectionDepth + (typeof value === 'object' && value !== null ? 1 : 0),
        });
      }
      continue;
    }

    for (const [key, value] of Object.entries(current.value)) {
      // Match the strict tree accounting: each property has a property node,
      // a key string node, and a value node.
      nodeCount += 2;
      if (nodeCount > limits.maxNodes) {
        throw new JsonTaskError(
          'limit',
          `JSON documents are limited to ${limits.maxNodes.toLocaleString('en')} syntax nodes.`,
        );
      }

      void key;
      stack.push({
        value,
        collectionDepth: current.collectionDepth + (typeof value === 'object' && value !== null ? 1 : 0),
      });
    }
  }
}

export function sortObjectKeys(value: unknown): unknown {
  if (typeof value !== 'object' || value === null) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(item => sortObjectKeys(item));
  }

  return Object.fromEntries(
    Object.entries(value)
      .sort(([left], [right]) => compareKeys(left, right))
      .map(([key, item]) => [key, sortObjectKeys(item)]),
  );
}

function propertyKey(property: JsonNode): string {
  const key = property.children?.[0];
  if (property.type !== 'property' || key?.type !== 'string' || typeof key.value !== 'string') {
    throw new JsonTaskError('operation', 'The parsed JSON property structure is invalid.');
  }

  return key.value;
}

function appendCompatibilityString(value: string, writer: BoundedJsonWriter): void {
  writer.append('"');
  let segmentStart = 0;

  for (let index = 0; index < value.length; index += 1) {
    const codeUnit = value.charCodeAt(index);
    let escaped: string | undefined;

    if (codeUnit === 0x22) {
      escaped = '\\"';
    }
    else if (codeUnit === 0x5C) {
      escaped = '\\\\';
    }
    else if (codeUnit === 0x08) {
      escaped = '\\b';
    }
    else if (codeUnit === 0x09) {
      escaped = '\\t';
    }
    else if (codeUnit === 0x0A) {
      escaped = '\\n';
    }
    else if (codeUnit === 0x0C) {
      escaped = '\\f';
    }
    else if (codeUnit === 0x0D) {
      escaped = '\\r';
    }
    else if (codeUnit <= 0x1F) {
      escaped = `\\u${codeUnit.toString(16).padStart(4, '0')}`;
    }
    else if (
      codeUnit >= 0xD800
      && codeUnit <= 0xDBFF
      && !(value.charCodeAt(index + 1) >= 0xDC00 && value.charCodeAt(index + 1) <= 0xDFFF)
    ) {
      escaped = `\\u${codeUnit.toString(16)}`;
    }
    else if (
      codeUnit >= 0xDC00
      && codeUnit <= 0xDFFF
      && !(value.charCodeAt(index - 1) >= 0xD800 && value.charCodeAt(index - 1) <= 0xDBFF)
    ) {
      escaped = `\\u${codeUnit.toString(16)}`;
    }

    if (escaped !== undefined) {
      writer.append(value.slice(segmentStart, index));
      writer.append(escaped);
      segmentStart = index + 1;
    }
  }

  writer.append(value.slice(segmentStart));
  writer.append('"');
}

function formatCompatibilityValue({
  value,
  indentSize,
  sortKeys,
  depth,
  writer,
}: {
  value: unknown
  indentSize: number
  sortKeys: boolean
  depth: number
  writer: BoundedJsonWriter
}): void {
  if (value === null) {
    writer.append('null');
    return;
  }

  if (typeof value === 'string') {
    appendCompatibilityString(value, writer);
    return;
  }

  if (typeof value === 'number') {
    writer.append(Object.is(value, -0) ? '0' : String(value));
    return;
  }

  if (typeof value === 'boolean') {
    writer.append(value ? 'true' : 'false');
    return;
  }

  const isArray = Array.isArray(value);
  if (!isArray && (typeof value !== 'object' || value === null)) {
    throw new JsonTaskError('operation', 'JSON5 produced a value that cannot be represented as JSON.');
  }

  const open = isArray ? '[' : '{';
  const close = isArray ? ']' : '}';
  const entries: Array<[string | undefined, unknown]> = isArray
    ? value.map(item => [undefined, item])
    : Object.entries(value as Record<string, unknown>)
      .sort(([left], [right]) => sortKeys ? compareKeys(left, right) : 0);

  writer.append(open);
  if (entries.length === 0) {
    writer.append(close);
    return;
  }

  for (let index = 0; index < entries.length; index += 1) {
    const [key, item] = entries[index];
    if (indentSize > 0) {
      writer.append(`\n${' '.repeat((depth + 1) * indentSize)}`);
    }

    if (key !== undefined) {
      appendCompatibilityString(key, writer);
      writer.append(indentSize === 0 ? ':' : ': ');
    }

    formatCompatibilityValue({
      value: item,
      indentSize,
      sortKeys,
      depth: depth + 1,
      writer,
    });

    if (index < entries.length - 1) {
      writer.append(',');
    }
  }

  if (indentSize > 0) {
    writer.append(`\n${' '.repeat(depth * indentSize)}`);
  }
  writer.append(close);
}

function formatStrictNode({
  node,
  source,
  indentSize,
  sortKeys,
  depth,
  writer,
}: {
  node: JsonNode
  source: string
  indentSize: number
  sortKeys: boolean
  depth: number
  writer: BoundedJsonWriter
}): void {
  if (node.type !== 'object' && node.type !== 'array' && node.type !== 'property') {
    writer.append(source.slice(node.offset, node.offset + node.length));
    return;
  }

  if (node.type === 'property') {
    const [key, value] = node.children ?? [];
    if (key?.type !== 'string' || value === undefined) {
      throw new JsonTaskError('operation', 'The parsed JSON property structure is invalid.');
    }

    writer.append(source.slice(key.offset, key.offset + key.length));
    writer.append(indentSize === 0 ? ':' : ': ');
    formatStrictNode({ node: value, source, indentSize, sortKeys, depth, writer });
    return;
  }

  const isObject = node.type === 'object';
  const open = isObject ? '{' : '[';
  const close = isObject ? '}' : ']';
  const children = [...(node.children ?? [])];

  if (isObject && sortKeys) {
    children.sort((left, right) => compareKeys(propertyKey(left), propertyKey(right)));
  }

  writer.append(open);
  if (children.length === 0) {
    writer.append(close);
    return;
  }

  for (let index = 0; index < children.length; index += 1) {
    if (indentSize > 0) {
      writer.append(`\n${' '.repeat((depth + 1) * indentSize)}`);
    }

    formatStrictNode({
      node: children[index],
      source,
      indentSize,
      sortKeys,
      depth: depth + 1,
      writer,
    });

    if (index < children.length - 1) {
      writer.append(',');
    }
  }

  if (indentSize > 0) {
    writer.append(`\n${' '.repeat(depth * indentSize)}`);
  }
  writer.append(close);
}

function formatStrictJson(
  task: JsonFormatTask,
  dependencies: Required<Pick<JsonFormatDependencies, 'parseStrict' | 'maxDepth' | 'maxNodes' | 'maxOutputBytes'>>,
): string {
  const errors: ParseError[] = [];
  let root: JsonNode | undefined;

  try {
    root = dependencies.parseStrict(task.source, errors, {
      allowEmptyContent: false,
      allowTrailingComma: false,
      disallowComments: true,
    });
  }
  catch (error) {
    throw new JsonTaskError('syntax', getErrorMessage(error, 'Provided JSON is not valid.'));
  }

  if (root === undefined || errors.length > 0) {
    const firstError = errors[0];
    const detail = firstError === undefined
      ? ''
      : ` (${printParseErrorCode(firstError.error)} at character ${firstError.offset + 1})`;
    throw new JsonTaskError('syntax', `Provided JSON is not valid${detail}.`);
  }

  assertStrictJsonTreeWithinLimits(root, {
    maxDepth: dependencies.maxDepth,
    maxNodes: dependencies.maxNodes,
  });

  const writer = new BoundedJsonWriter(dependencies.maxOutputBytes);
  formatStrictNode({
    node: root,
    source: task.source,
    indentSize: task.indentSize,
    sortKeys: task.sortKeys,
    depth: 0,
    writer,
  });
  return writer.toString();
}

function formatCompatibilityJson(
  task: JsonFormatTask,
  dependencies: Required<Pick<JsonFormatDependencies, 'parseCompatibility' | 'maxDepth' | 'maxNodes' | 'maxOutputBytes'>>,
): string {
  let parsed: unknown;
  try {
    parsed = dependencies.parseCompatibility(task.source);
  }
  catch (error) {
    throw new JsonTaskError('syntax', getErrorMessage(error, 'Provided JSON5 is not valid.'));
  }

  assertCompatibilityJsonWithinLimits(parsed, {
    maxDepth: dependencies.maxDepth,
    maxNodes: dependencies.maxNodes,
  });

  const writer = new BoundedJsonWriter(dependencies.maxOutputBytes);
  formatCompatibilityValue({
    value: parsed,
    indentSize: task.indentSize,
    sortKeys: task.sortKeys,
    depth: 0,
    writer,
  });
  return writer.toString();
}

export function formatJson(
  task: JsonFormatTask,
  dependencies: JsonFormatDependencies = {},
): string {
  const resolved = {
    parseStrict: dependencies.parseStrict ?? parseTree,
    parseCompatibility: dependencies.parseCompatibility ?? JSON5.parse,
    maxDepth: dependencies.maxDepth ?? JSON_MAX_DEPTH,
    maxNodes: dependencies.maxNodes ?? JSON_MAX_NODES,
    maxOutputBytes: dependencies.maxOutputBytes ?? JSON_MAX_OUTPUT_BYTES,
  };

  return task.mode === 'strict'
    ? formatStrictJson(task, resolved)
    : formatCompatibilityJson(task, resolved);
}
