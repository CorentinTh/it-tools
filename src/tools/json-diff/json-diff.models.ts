import type {
  ArrayAlignment,
  DiffAlignmentSummary,
  DiffReport,
  Difference,
  DifferenceStatus,
  DifferenceType,
} from './json-diff.types';

export interface DiffOptions {
  alignArrays?: boolean
  maxDepth?: number
  maxInputNodes?: number
  maxOutputNodes?: number
  maxLcsCells?: number
  onlyShowDifferences?: boolean
}

export type DiffLimitCode = 'depth' | 'input-nodes' | 'output-nodes';

export class DiffLimitError extends Error {
  override readonly name = 'DiffLimitError';

  constructor(public readonly code: DiffLimitCode, message: string) {
    super(message);
  }
}

interface DiffContext {
  alignArrays: boolean
  alignments: DiffAlignmentSummary
  maxLcsCells: number
  maxOutputNodes: number
  options: DiffOptions
  outputNodes: number
}

interface InputMetrics {
  maxDepth: number
  nodeCount: number
}

interface ArrayDiffResult {
  alignment: ArrayAlignment
  children: Difference[]
}

const DEFAULT_MAX_DEPTH = 128;
const DEFAULT_MAX_INPUT_NODES = 100_000;
const DEFAULT_MAX_OUTPUT_NODES = 100_000;
const DEFAULT_MAX_LCS_CELLS = 250_000;
const ALIGNMENT_KEYS = ['id', 'key', 'name'] as const;

export function diff(
  oldValue: unknown,
  value: unknown,
  options: DiffOptions = {},
): Difference {
  return diffWithReport(oldValue, value, options).difference;
}

export function diffWithReport(
  oldValue: unknown,
  value: unknown,
  options: DiffOptions = {},
): DiffReport {
  const maxDepth = options.maxDepth ?? DEFAULT_MAX_DEPTH;
  const maxInputNodes = options.maxInputNodes ?? DEFAULT_MAX_INPUT_NODES;
  const leftMetrics = inspectInput(oldValue, maxDepth, maxInputNodes, maxInputNodes);
  const rightMetrics = inspectInput(value, maxDepth, maxInputNodes - leftMetrics.nodeCount, maxInputNodes);
  const context: DiffContext = {
    alignArrays: options.alignArrays ?? true,
    alignments: { key: 0, lcs: 0, index: 0 },
    maxLcsCells: options.maxLcsCells ?? DEFAULT_MAX_LCS_CELLS,
    maxOutputNodes: options.maxOutputNodes ?? DEFAULT_MAX_OUTPUT_NODES,
    options,
    outputNodes: 0,
  };
  const difference = createDifference(oldValue, value, '', context);

  return {
    difference,
    inputNodeCount: leftMetrics.nodeCount + rightMetrics.nodeCount,
    outputNodeCount: context.outputNodes,
    maxDepth: Math.max(leftMetrics.maxDepth, rightMetrics.maxDepth),
    alignments: context.alignments,
  };
}

function createDifference(
  oldValue: unknown,
  value: unknown,
  key: string | number,
  context: DiffContext,
): Difference {
  countOutputNode(context);
  const oldType = getType(oldValue);
  const newType = getType(value);

  if (oldValue === undefined && (newType === 'object' || newType === 'array')) {
    return createContainerDifference(undefined, value, key, newType, 'added', context);
  }

  if (value === undefined && (oldType === 'object' || oldType === 'array')) {
    return createContainerDifference(oldValue, undefined, key, oldType, 'removed', context);
  }

  if (oldType === newType && (oldType === 'object' || oldType === 'array')) {
    return createContainerDifference(oldValue, value, key, oldType, undefined, context);
  }

  return {
    key,
    type: 'value',
    nodeCount: 1,
    oldValue,
    value,
    status: getLeafStatus(oldValue, value),
  };
}

function createContainerDifference(
  oldValue: unknown,
  value: unknown,
  key: string | number,
  type: 'object' | 'array',
  forcedStatus: 'added' | 'removed' | undefined,
  context: DiffContext,
): Difference {
  const arrayResult = type === 'array'
    ? diffArrays(
      Array.isArray(oldValue) ? oldValue : [],
      Array.isArray(value) ? value : [],
      context,
    )
    : undefined;
  const children = arrayResult?.children ?? diffObjects(
    isObject(oldValue) ? oldValue : {},
    isObject(value) ? value : {},
    context,
  );
  const status: DifferenceStatus = forcedStatus
    ?? (children.every(child => child.status === 'unchanged') ? 'unchanged' : 'children-updated');

  const nodeCount = 1 + children.reduce((total, child) => total + child.nodeCount, 0);
  if (type === 'array') {
    return {
      key,
      type,
      children,
      nodeCount,
      oldValue,
      value,
      status,
      alignment: arrayResult?.alignment ?? 'index',
    };
  }

  return { key, type, children, nodeCount, oldValue, value, status };
}

function diffObjects(
  oldValue: Record<string, unknown>,
  value: Record<string, unknown>,
  context: DiffContext,
): Difference[] {
  const keys = [...new Set([...Object.keys(oldValue), ...Object.keys(value)])];
  return filterDifferences(
    keys.map(key => createDifference(oldValue[key], value[key], key, context)),
    context.options,
  );
}

function diffArrays(
  oldValue: unknown[],
  value: unknown[],
  context: DiffContext,
): ArrayDiffResult {
  const alignment = selectArrayAlignment(oldValue, value, context);
  context.alignments[alignment] += 1;

  if (alignment === 'key') {
    return { alignment, children: diffKeyedArrays(oldValue, value, context) };
  }

  if (alignment === 'lcs') {
    return { alignment, children: diffPrimitiveArraysWithLcs(oldValue, value, context) };
  }

  const length = Math.max(oldValue.length, value.length);
  return {
    alignment,
    children: filterDifferences(
      Array.from(
        { length },
        (_, index) => createDifference(oldValue[index], value[index], index, context),
      ),
      context.options,
    ),
  };
}

function diffKeyedArrays(oldValue: unknown[], value: unknown[], context: DiffContext): Difference[] {
  const key = findAlignmentKey(oldValue, value);
  if (key === undefined) {
    throw new Error('Key alignment was selected without a stable key.');
  }

  const oldByKey = new Map(oldValue.map(item => [getAlignmentValue(item, key), item]));
  const newKeys = new Set(value.map(item => getAlignmentValue(item, key)));
  const differences = value.map((item, index) => {
    const alignmentValue = getAlignmentValue(item, key);
    return createDifference(oldByKey.get(alignmentValue), item, index, context);
  });

  for (const oldItem of oldValue) {
    const alignmentValue = getAlignmentValue(oldItem, key);
    if (!newKeys.has(alignmentValue)) {
      differences.push(createDifference(oldItem, undefined, differences.length, context));
    }
  }

  return filterDifferences(differences, context.options);
}

function diffPrimitiveArraysWithLcs(oldValue: unknown[], value: unknown[], context: DiffContext): Difference[] {
  const width = value.length + 1;
  const table = new Uint32Array((oldValue.length + 1) * width);

  for (let oldIndex = oldValue.length - 1; oldIndex >= 0; oldIndex -= 1) {
    for (let newIndex = value.length - 1; newIndex >= 0; newIndex -= 1) {
      const offset = oldIndex * width + newIndex;
      table[offset] = Object.is(oldValue[oldIndex], value[newIndex])
        ? table[(oldIndex + 1) * width + newIndex + 1] + 1
        : Math.max(table[(oldIndex + 1) * width + newIndex], table[offset + 1]);
    }
  }

  const differences: Difference[] = [];
  let oldIndex = 0;
  let newIndex = 0;
  while (oldIndex < oldValue.length || newIndex < value.length) {
    if (
      oldIndex < oldValue.length
      && newIndex < value.length
      && Object.is(oldValue[oldIndex], value[newIndex])
    ) {
      differences.push(createDifference(oldValue[oldIndex], value[newIndex], newIndex, context));
      oldIndex += 1;
      newIndex += 1;
    }
    else if (
      newIndex < value.length
      && (oldIndex === oldValue.length
        || table[oldIndex * width + newIndex + 1] >= table[(oldIndex + 1) * width + newIndex])
    ) {
      differences.push(createDifference(undefined, value[newIndex], newIndex, context));
      newIndex += 1;
    }
    else {
      differences.push(createDifference(oldValue[oldIndex], undefined, oldIndex, context));
      oldIndex += 1;
    }
  }

  return filterDifferences(differences, context.options);
}

function selectArrayAlignment(oldValue: unknown[], value: unknown[], context: DiffContext): ArrayAlignment {
  if (!context.alignArrays) {
    return 'index';
  }
  if (findAlignmentKey(oldValue, value) !== undefined) {
    return 'key';
  }
  if (
    oldValue.every(isPrimitive)
    && value.every(isPrimitive)
    && oldValue.length * value.length <= context.maxLcsCells
  ) {
    return 'lcs';
  }
  return 'index';
}

function findAlignmentKey(oldValue: unknown[], value: unknown[]): typeof ALIGNMENT_KEYS[number] | undefined {
  if (oldValue.length === 0 || value.length === 0 || !oldValue.every(isObject) || !value.every(isObject)) {
    return undefined;
  }

  return ALIGNMENT_KEYS.find((key) => {
    const oldKeys = oldValue.map(item => getAlignmentValue(item, key));
    const newKeys = value.map(item => getAlignmentValue(item, key));
    return oldKeys.every(isAlignmentValue)
      && newKeys.every(isAlignmentValue)
      && new Set(oldKeys).size === oldKeys.length
      && new Set(newKeys).size === newKeys.length;
  });
}

function getAlignmentValue(value: unknown, key: string): unknown {
  return isObject(value) ? value[key] : undefined;
}

function isAlignmentValue(value: unknown): value is string | number {
  return typeof value === 'string' || (typeof value === 'number' && Number.isFinite(value));
}

function isPrimitive(value: unknown): boolean {
  return value === null || typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean';
}

function inspectInput(
  value: unknown,
  maxDepth: number,
  remainingNodes: number,
  maxInputNodes: number,
): InputMetrics {
  const stack: Array<{ depth: number; value: unknown }> = [{ depth: 0, value }];
  let maxObservedDepth = 0;
  let nodeCount = 0;

  while (stack.length > 0) {
    const current = stack.pop();
    if (current === undefined) {
      continue;
    }
    nodeCount += 1;
    if (nodeCount > remainingNodes) {
      throw new DiffLimitError('input-nodes', `JSON comparison is limited to ${maxInputNodes.toLocaleString('en')} total input nodes.`);
    }
    if (current.depth > maxDepth) {
      throw new DiffLimitError('depth', `JSON comparison is limited to ${maxDepth} levels of nesting.`);
    }
    maxObservedDepth = Math.max(maxObservedDepth, current.depth);

    if (Array.isArray(current.value)) {
      for (let index = current.value.length - 1; index >= 0; index -= 1) {
        stack.push({ depth: current.depth + 1, value: current.value[index] });
      }
    }
    else if (isObject(current.value)) {
      for (const child of Object.values(current.value)) {
        stack.push({ depth: current.depth + 1, value: child });
      }
    }
  }

  return { maxDepth: maxObservedDepth, nodeCount };
}

function countOutputNode(context: DiffContext): void {
  context.outputNodes += 1;
  if (context.outputNodes > context.maxOutputNodes) {
    throw new DiffLimitError('output-nodes', `JSON comparison output is limited to ${context.maxOutputNodes.toLocaleString('en')} nodes.`);
  }
}

function filterDifferences(differences: Difference[], { onlyShowDifferences = false }: DiffOptions): Difference[] {
  return onlyShowDifferences
    ? differences.filter(difference => difference.status !== 'unchanged')
    : differences;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function getType(value: unknown): DifferenceType {
  if (Array.isArray(value)) {
    return 'array';
  }
  if (isObject(value)) {
    return 'object';
  }
  return 'value';
}

function getLeafStatus(oldValue: unknown, value: unknown): DifferenceStatus {
  if (oldValue === undefined) {
    return 'added';
  }
  if (value === undefined) {
    return 'removed';
  }
  return Object.is(oldValue, value) ? 'unchanged' : 'updated';
}
