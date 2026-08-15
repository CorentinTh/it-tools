export type DifferenceStatus = 'added' | 'removed' | 'updated' | 'unchanged' | 'children-updated';
export type DifferenceType = 'object' | 'array' | 'value';
export type ArrayAlignment = 'key' | 'lcs' | 'index';

export interface ObjectDifference {
  key: string | number
  type: 'object'
  children: Difference[]
  nodeCount: number
  status: DifferenceStatus
  oldValue: unknown
  value: unknown
}

export interface ValueDifference {
  key: string | number
  type: 'value'
  nodeCount: number
  value: unknown
  oldValue: unknown
  status: DifferenceStatus
}

export interface ArrayDifference {
  key: number | string
  type: 'array'
  children: Difference[]
  nodeCount: number
  status: DifferenceStatus
  oldValue: unknown
  value: unknown
  alignment: ArrayAlignment
}

export type Difference = ObjectDifference | ValueDifference | ArrayDifference;

export interface DiffAlignmentSummary {
  key: number
  lcs: number
  index: number
}

export interface DiffReport {
  difference: Difference
  inputNodeCount: number
  outputNodeCount: number
  maxDepth: number
  alignments: DiffAlignmentSummary
}
