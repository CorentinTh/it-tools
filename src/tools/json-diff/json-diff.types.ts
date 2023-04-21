export type DifferenceStatus = 'added' | 'removed' | 'updated' | 'unchanged' | 'children-updated';

export type ObjectDifference = {
  key: string | number;
  type: 'object';
  children: Difference[];
  status: DifferenceStatus;
  oldValue: unknown;
  value: unknown;
};

export type ValueDifference = {
  key: string | number;
  type: 'value';
  value: unknown;
  oldValue: unknown;
  status: DifferenceStatus;
};

export type ArrayDifference = {
  key: number | string;
  type: 'array';
  children: Difference[];
  status: DifferenceStatus;
  oldValue: unknown;
  value: unknown;
};

export type Difference = ObjectDifference | ValueDifference | ArrayDifference;
