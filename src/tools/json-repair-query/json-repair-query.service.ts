import JSON5 from 'json5';
import { isUnknownRecord } from '@/utils/worker-protocol';

export type JsonWorkspaceOperation = 'repair' | 'query' | 'unescape';
export interface JsonWorkspaceTask { operation: JsonWorkspaceOperation; source: string; query: string }

type PathStep = { type: 'property'; key: string } | { type: 'index'; index: number } | { type: 'wildcard' };
const MAX_NODES = 100_000;
const MAX_DEPTH = 128;
const MAX_RESULTS = 10_000;

function validateGraph(value: unknown, depth = 0, state = { nodes: 0 }): void {
  state.nodes += 1;
  if (depth > MAX_DEPTH || state.nodes > MAX_NODES) {
    throw new Error('JSON is too deeply nested or contains too many values.');
  }
  if (Array.isArray(value)) {
    value.forEach(child => validateGraph(child, depth + 1, state));
  }
  else if (isUnknownRecord(value)) {
    Object.values(value).forEach(child => validateGraph(child, depth + 1, state));
  }
}

export function repairJson(source: string): string {
  const value: unknown = JSON5.parse(source);
  validateGraph(value);
  const output = JSON.stringify(value, null, 2);
  if (output === undefined) {
    throw new Error('The repaired value cannot be represented as JSON.');
  }
  return output;
}

export function parseJsonPath(query: string): PathStep[] {
  const source = query.trim();
  if (!source.startsWith('$')) {
    throw new Error('A query must start with $.');
  }
  const steps: PathStep[] = [];
  let offset = 1;
  while (offset < source.length) {
    if (source.startsWith('.*', offset)) {
      steps.push({ type: 'wildcard' });
      offset += 2;
      continue;
    }
    if (source[offset] === '.') {
      const match = source.slice(offset + 1).match(/^[A-Za-z_$][A-Za-z0-9_$-]*/);
      if (!match) {
        throw new Error(`Expected a property name at query character ${offset + 1}.`);
      }
      steps.push({ type: 'property', key: match[0] });
      offset += match[0].length + 1;
      continue;
    }
    if (source[offset] === '[') {
      const close = source.indexOf(']', offset + 1);
      if (close < 0) {
        throw new Error('A query bracket is not closed.');
      }
      const value = source.slice(offset + 1, close).trim();
      if (value === '*') {
        steps.push({ type: 'wildcard' });
      }
      else if (/^\d+$/.test(value)) {
        steps.push({ type: 'index', index: Number.parseInt(value, 10) });
      }
      else if ((value.startsWith('\'') && value.endsWith('\'')) || (value.startsWith('"') && value.endsWith('"'))) {
        const quote = value[0];
        const key = value.slice(1, -1).replace(quote === '\'' ? /\\'/g : /\\"/g, quote).replace(/\\\\/g, '\\');
        steps.push({ type: 'property', key });
      }
      else {
        throw new Error('Only numeric indexes, quoted keys, and * wildcards are supported in brackets.');
      }
      offset = close + 1;
      continue;
    }
    throw new Error(`Unsupported JSONPath syntax at character ${offset + 1}.`);
  }
  return steps;
}

export function queryJson(source: string, query: string): string {
  const root: unknown = JSON.parse(source);
  validateGraph(root);
  let values: unknown[] = [root];
  for (const step of parseJsonPath(query)) {
    const next: unknown[] = [];
    for (const value of values) {
      if (step.type === 'property' && isUnknownRecord(value) && Object.prototype.hasOwnProperty.call(value, step.key)) {
        next.push(value[step.key]);
      }
      else if (step.type === 'index' && Array.isArray(value) && step.index < value.length) {
        next.push(value[step.index]);
      }
      else if (step.type === 'wildcard') {
        if (Array.isArray(value)) {
          next.push(...value);
        }
        else if (isUnknownRecord(value)) {
          next.push(...Object.values(value));
        }
      }
      if (next.length > MAX_RESULTS) {
        throw new Error(`A query may return at most ${MAX_RESULTS.toLocaleString('en-US')} results.`);
      }
    }
    values = next;
  }
  return JSON.stringify(values.length === 1 ? values[0] : values, null, 2) ?? 'null';
}

export function unescapeJsonString(source: string): string {
  const decoded: unknown = JSON.parse(source);
  if (typeof decoded !== 'string') {
    throw new TypeError('Escaped JSON import requires one outer JSON string value.');
  }
  const value: unknown = JSON.parse(decoded);
  validateGraph(value);
  return decoded;
}

export function processJsonWorkspace(task: JsonWorkspaceTask): string {
  if (task.source.trim() === '') {
    throw new Error('Enter JSON content.');
  }
  if (task.operation === 'repair') {
    return repairJson(task.source);
  }
  if (task.operation === 'unescape') {
    return unescapeJsonString(task.source);
  }
  return queryJson(task.source, task.query);
}
