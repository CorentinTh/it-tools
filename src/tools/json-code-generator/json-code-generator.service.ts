import JSON5 from 'json5';
import { type Node as JsonNode, type ParseError, parseTree } from 'jsonc-parser';
import { isUnknownRecord } from '@/utils/worker-protocol';
import { assertStrictJsonTreeWithinLimits } from '@/tools/json-viewer/json.models';

export type JsonCodeTarget = 'schema' | 'typescript' | 'stats' | 'patch';
export interface JsonCodeTask { source: string; comparison: string; target: JsonCodeTarget; rootName: string }

interface GraphStats {
  nodes: number
  maxDepth: number
  objects: number
  arrays: number
  keys: number
  strings: number
  numbers: number
  booleans: number
  nulls: number
}

type JsonSchema = Record<string, unknown>;
const MAX_NODES = 100_000;
const MAX_DEPTH = 128;
const MAX_UNION_VARIANTS = 20;
const MAX_PATCH_OPERATIONS = 20_000;

interface JsonPatchOperation {
  op: 'add' | 'remove' | 'replace'
  path: string
  value?: string
}

function inspectGraph(value: unknown, depth = 0, stats: GraphStats = {
  nodes: 0,
  maxDepth: 0,
  objects: 0,
  arrays: 0,
  keys: 0,
  strings: 0,
  numbers: 0,
  booleans: 0,
  nulls: 0,
}): GraphStats {
  stats.nodes += 1;
  stats.maxDepth = Math.max(stats.maxDepth, depth);
  if (stats.nodes > MAX_NODES || depth > MAX_DEPTH) {
    throw new Error('JSON is too deeply nested or contains too many values.');
  }
  if (value === null) {
    stats.nulls += 1;
  }
  else if (typeof value === 'string') {
    stats.strings += 1;
  }
  else if (typeof value === 'number') {
    stats.numbers += 1;
  }
  else if (typeof value === 'boolean') {
    stats.booleans += 1;
  }
  else if (Array.isArray(value)) {
    stats.arrays += 1;
    value.forEach(child => inspectGraph(child, depth + 1, stats));
  }
  else if (isUnknownRecord(value)) {
    stats.objects += 1;
    stats.keys += Object.keys(value).length;
    Object.values(value).forEach(child => inspectGraph(child, depth + 1, stats));
  }
  return stats;
}

function inferSchema(value: unknown): JsonSchema {
  if (value === null) {
    return { type: 'null' };
  }
  if (typeof value === 'string') {
    return { type: 'string' };
  }
  if (typeof value === 'number') {
    return { type: Number.isInteger(value) ? 'integer' : 'number' };
  }
  if (typeof value === 'boolean') {
    return { type: 'boolean' };
  }
  if (Array.isArray(value)) {
    const variants = new Map<string, JsonSchema>();
    for (const child of value) {
      const schema = inferSchema(child);
      const key = JSON.stringify(schema);
      if (!variants.has(key)) {
        variants.set(key, schema);
      }
      if (variants.size > MAX_UNION_VARIANTS) {
        return { type: 'array', items: {}, $comment: `More than ${MAX_UNION_VARIANTS} item shapes were observed; items were left unconstrained.` };
      }
    }
    const schemas = [...variants.values()];
    return {
      type: 'array',
      items: schemas.length === 0 ? {} : schemas.length === 1 ? schemas[0] : { anyOf: schemas },
    };
  }
  if (isUnknownRecord(value)) {
    const properties = Object.create(null) as Record<string, JsonSchema>;
    for (const [key, child] of Object.entries(value)) {
      properties[key] = inferSchema(child);
    }
    return {
      type: 'object',
      properties,
      required: Object.keys(value),
      additionalProperties: false,
    };
  }
  return {};
}

function typeName(value: string): string {
  const cleaned = value.trim().replace(/[^A-Za-z0-9_$]+/g, ' ').split(/\s+/).filter(Boolean)
    .map(part => `${part[0]?.toUpperCase() ?? ''}${part.slice(1)}`).join('');
  const candidate = cleaned || 'Root';
  return /^[A-Za-z_$]/.test(candidate) ? candidate : `_${candidate}`;
}

function propertyName(value: string): string {
  return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(value) ? value : JSON.stringify(value);
}

function inferTypeScript(value: unknown, depth = 0): string {
  if (value === null) {
    return 'null';
  }
  if (typeof value === 'string') {
    return 'string';
  }
  if (typeof value === 'number') {
    return 'number';
  }
  if (typeof value === 'boolean') {
    return 'boolean';
  }
  if (Array.isArray(value)) {
    const variants = new Set<string>();
    for (const child of value) {
      variants.add(inferTypeScript(child, depth + 1));
      if (variants.size > MAX_UNION_VARIANTS) {
        return 'unknown[]';
      }
    }
    const item = variants.size ? [...variants].join(' | ') : 'unknown';
    return `Array<${item}>`;
  }
  if (isUnknownRecord(value)) {
    const indent = '  '.repeat(depth);
    const childIndent = '  '.repeat(depth + 1);
    const fields = Object.entries(value).map(([key, child]) => `${childIndent}${propertyName(key)}: ${inferTypeScript(child, depth + 1)};`);
    return fields.length ? `{\n${fields.join('\n')}\n${indent}}` : 'Record<string, never>';
  }
  return 'unknown';
}

function parseStrictTree(source: string): JsonNode {
  const errors: ParseError[] = [];
  const root = parseTree(source, errors, { allowTrailingComma: false, disallowComments: true, allowEmptyContent: false });
  if (!root || errors.length > 0) {
    throw new Error('JSON Patch inputs must be strict JSON.');
  }
  assertStrictJsonTreeWithinLimits(root, { maxDepth: MAX_DEPTH, maxNodes: MAX_NODES });
  return root;
}

function rawNode(node: JsonNode, source: string): string {
  return source.slice(node.offset, node.offset + node.length);
}

function objectChildren(node: JsonNode): Map<string, JsonNode> {
  const result = new Map<string, JsonNode>();
  for (const property of node.children ?? []) {
    const [keyNode, valueNode] = property.children ?? [];
    if (typeof keyNode?.value !== 'string' || !valueNode) {
      throw new Error('Invalid strict JSON object tree.');
    }
    result.set(keyNode.value, valueNode);
  }
  return result;
}

function nodesEqual(left: JsonNode, leftSource: string, right: JsonNode, rightSource: string): boolean {
  if (left.type !== right.type) {
    return false;
  }
  if (left.type === 'number') {
    // RFC 6902 defines numeric equality, but retaining arbitrary-precision JSON
    // lexemes is more important than coercing through JavaScript Number. A
    // lexically different number therefore yields a conservative replace.
    return rawNode(left, leftSource) === rawNode(right, rightSource);
  }
  if (left.type === 'array') {
    const leftItems = left.children ?? [];
    const rightItems = right.children ?? [];
    return leftItems.length === rightItems.length
      && leftItems.every((child, index) => nodesEqual(child, leftSource, rightItems[index], rightSource));
  }
  if (left.type === 'object') {
    const leftProperties = objectChildren(left);
    const rightProperties = objectChildren(right);
    return leftProperties.size === rightProperties.size
      && [...leftProperties].every(([key, child]) => {
        const other = rightProperties.get(key);
        return Boolean(other && nodesEqual(child, leftSource, other, rightSource));
      });
  }
  return left.value === right.value;
}

function pointerSegment(value: string): string {
  return value.replace(/~/g, '~0').replace(/\//g, '~1');
}

function generateJsonPatch(source: string, comparison: string): string {
  const before = parseStrictTree(source);
  const after = parseStrictTree(comparison);
  const operations: JsonPatchOperation[] = [];
  const addOperation = (operation: JsonPatchOperation) => {
    operations.push(operation);
    if (operations.length > MAX_PATCH_OPERATIONS) {
      throw new Error(`JSON Patch generation is limited to ${MAX_PATCH_OPERATIONS.toLocaleString('en-US')} operations.`);
    }
  };
  const visit = (left: JsonNode, right: JsonNode, path: string) => {
    if (nodesEqual(left, source, right, comparison)) {
      return;
    }
    if (left.type === 'object' && right.type === 'object') {
      const leftProperties = objectChildren(left);
      const rightProperties = objectChildren(right);
      for (const key of [...leftProperties.keys()].filter(key => !rightProperties.has(key)).sort()) {
        addOperation({ op: 'remove', path: `${path}/${pointerSegment(key)}` });
      }
      for (const key of [...rightProperties.keys()].sort()) {
        const nextPath = `${path}/${pointerSegment(key)}`;
        const leftValue = leftProperties.get(key);
        const rightValue = rightProperties.get(key)!;
        if (!leftValue) {
          addOperation({ op: 'add', path: nextPath, value: rawNode(rightValue, comparison) });
        }
        else {
          visit(leftValue, rightValue, nextPath);
        }
      }
      return;
    }
    if (left.type === 'array' && right.type === 'array') {
      const leftItems = left.children ?? [];
      const rightItems = right.children ?? [];
      const shared = Math.min(leftItems.length, rightItems.length);
      for (let index = 0; index < shared; index += 1) {
        visit(leftItems[index], rightItems[index], `${path}/${index}`);
      }
      for (let index = leftItems.length - 1; index >= rightItems.length; index -= 1) {
        addOperation({ op: 'remove', path: `${path}/${index}` });
      }
      for (let index = leftItems.length; index < rightItems.length; index += 1) {
        addOperation({ op: 'add', path: `${path}/${index}`, value: rawNode(rightItems[index], comparison) });
      }
      return;
    }
    addOperation({ op: 'replace', path, value: rawNode(right, comparison) });
  };
  visit(before, after, '');
  if (operations.length === 0) {
    return '[]';
  }
  return `[\n${operations.map((operation) => {
    const base = `  { "op": ${JSON.stringify(operation.op)}, "path": ${JSON.stringify(operation.path)}`;
    return operation.value === undefined ? `${base} }` : `${base}, "value": ${operation.value} }`;
  }).join(',\n')}\n]`;
}

export function generateJsonCode(task: JsonCodeTask): string {
  if (!task.source.trim()) {
    throw new Error('Enter a JSON example.');
  }
  if (task.target === 'patch') {
    if (!task.comparison.trim()) {
      throw new Error('Enter the desired strict JSON document.');
    }
    return generateJsonPatch(task.source, task.comparison);
  }
  const value: unknown = JSON5.parse(task.source);
  const stats = inspectGraph(value);
  if (task.target === 'stats') {
    return JSON.stringify({
      utf8Bytes: new TextEncoder().encode(task.source).byteLength,
      ...stats,
    }, null, 2);
  }
  const root = typeName(task.rootName);
  if (task.target === 'typescript') {
    return isUnknownRecord(value) && !Array.isArray(value)
      ? `export interface ${root} ${inferTypeScript(value)}\n`
      : `export type ${root} = ${inferTypeScript(value)};\n`;
  }
  return JSON.stringify({
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    title: root,
    ...inferSchema(value),
  }, null, 2);
}
