export type ListComparisonMode = 'set' | 'multiset' | 'ordered';

export interface ListComparisonTask {
  left: string
  right: string
  mode: ListComparisonMode
  trimItems: boolean
  ignoreCase: boolean
  ignoreEmpty: boolean
}

export const LIST_COMPARISON_MAX_ITEMS = 100_000;
export const LIST_COMPARISON_MAX_LINE_CHARACTERS = 32 * 1024;
export const LIST_COMPARISON_MAX_LCS_CELLS = 250_000;

interface Item {
  key: string
  value: string
}

function parseItems(source: string, task: Pick<ListComparisonTask, 'trimItems' | 'ignoreCase' | 'ignoreEmpty'>): Item[] {
  const values = source.split(/\r?\n|\r/u);
  if (values.length > LIST_COMPARISON_MAX_ITEMS) {
    throw new RangeError('Each side is limited to 100,000 lines.');
  }
  const items: Item[] = [];
  for (const original of values) {
    if (original.length > LIST_COMPARISON_MAX_LINE_CHARACTERS) {
      throw new RangeError('Each line is limited to 32 KiB of text.');
    }
    const value = task.trimItems ? original.trim() : original;
    if (task.ignoreEmpty && value === '') {
      continue;
    }
    const normalized = value.normalize('NFC');
    items.push({ key: task.ignoreCase ? normalized.toLocaleLowerCase('en-US') : normalized, value });
  }
  return items;
}

function renderSection(title: string, rows: string[]): string[] {
  return [
    `${title} (${rows.length.toLocaleString('en-US')})`,
    ...(rows.length ? rows : ['(none)']),
  ];
}

function compareSets(left: Item[], right: Item[]): string {
  const leftByKey = new Map<string, string>();
  const rightByKey = new Map<string, string>();
  left.forEach(item => leftByKey.has(item.key) || leftByKey.set(item.key, item.value));
  right.forEach(item => rightByKey.has(item.key) || rightByKey.set(item.key, item.value));
  const onlyLeft = [...leftByKey].filter(([key]) => !rightByKey.has(key)).map(([, value]) => value);
  const onlyRight = [...rightByKey].filter(([key]) => !leftByKey.has(key)).map(([, value]) => value);
  const shared = [...leftByKey].filter(([key]) => rightByKey.has(key)).map(([, value]) => value);
  return [
    'Mode: set (duplicates collapsed)',
    `Left: ${left.length.toLocaleString('en-US')} lines / ${leftByKey.size.toLocaleString('en-US')} unique`,
    `Right: ${right.length.toLocaleString('en-US')} lines / ${rightByKey.size.toLocaleString('en-US')} unique`,
    '',
    ...renderSection('Only in left', onlyLeft),
    '',
    ...renderSection('Only in right', onlyRight),
    '',
    ...renderSection('In both', shared),
  ].join('\n');
}

interface CountedItem { value: string; count: number }

function countItems(items: Item[]): Map<string, CountedItem> {
  const counts = new Map<string, CountedItem>();
  for (const item of items) {
    const current = counts.get(item.key);
    if (current) {
      current.count += 1;
    }
    else {
      counts.set(item.key, { value: item.value, count: 1 });
    }
  }
  return counts;
}

function compareMultisets(left: Item[], right: Item[]): string {
  const leftCounts = countItems(left);
  const rightCounts = countItems(right);
  const onlyLeft: string[] = [];
  const onlyRight: string[] = [];
  const balanced: string[] = [];
  const keys = new Set([...leftCounts.keys(), ...rightCounts.keys()]);
  for (const key of keys) {
    const leftItem = leftCounts.get(key);
    const rightItem = rightCounts.get(key);
    const leftCount = leftItem?.count ?? 0;
    const rightCount = rightItem?.count ?? 0;
    const value = leftItem?.value ?? rightItem!.value;
    if (leftCount > rightCount) {
      onlyLeft.push(`${value} × ${leftCount - rightCount}`);
    }
    else if (rightCount > leftCount) {
      onlyRight.push(`${value} × ${rightCount - leftCount}`);
    }
    if (leftCount && rightCount) {
      balanced.push(`${value} × ${Math.min(leftCount, rightCount)}`);
    }
  }
  return [
    'Mode: multiset (duplicate counts preserved)',
    `Left: ${left.length.toLocaleString('en-US')} items`,
    `Right: ${right.length.toLocaleString('en-US')} items`,
    '',
    ...renderSection('Excess in left', onlyLeft),
    '',
    ...renderSection('Excess in right', onlyRight),
    '',
    ...renderSection('Matched copies', balanced),
  ].join('\n');
}

function compareOrdered(left: Item[], right: Item[]): string {
  const cells = (left.length + 1) * (right.length + 1);
  if (cells > LIST_COMPARISON_MAX_LCS_CELLS) {
    throw new RangeError('Ordered comparison is limited to 250,000 alignment cells; use set or multiset mode for larger lists.');
  }
  const width = right.length + 1;
  const lengths = new Uint32Array(cells);
  for (let leftIndex = left.length - 1; leftIndex >= 0; leftIndex -= 1) {
    for (let rightIndex = right.length - 1; rightIndex >= 0; rightIndex -= 1) {
      const offset = leftIndex * width + rightIndex;
      lengths[offset] = left[leftIndex].key === right[rightIndex].key
        ? lengths[(leftIndex + 1) * width + rightIndex + 1] + 1
        : Math.max(lengths[(leftIndex + 1) * width + rightIndex], lengths[leftIndex * width + rightIndex + 1]);
    }
  }
  const rows: string[] = [];
  let leftIndex = 0;
  let rightIndex = 0;
  while (leftIndex < left.length || rightIndex < right.length) {
    if (leftIndex < left.length && rightIndex < right.length && left[leftIndex].key === right[rightIndex].key) {
      rows.push(`  ${left[leftIndex].value}`);
      leftIndex += 1;
      rightIndex += 1;
    }
    else if (rightIndex < right.length && (leftIndex >= left.length || lengths[leftIndex * width + rightIndex + 1] >= lengths[(leftIndex + 1) * width + rightIndex])) {
      rows.push(`+ ${right[rightIndex].value}`);
      rightIndex += 1;
    }
    else {
      rows.push(`- ${left[leftIndex].value}`);
      leftIndex += 1;
    }
  }
  return [
    'Mode: ordered (longest-common-subsequence alignment)',
    `Left: ${left.length.toLocaleString('en-US')} items`,
    `Right: ${right.length.toLocaleString('en-US')} items`,
    'Legend: two spaces = shared, - = left only, + = right only',
    '',
    ...rows,
  ].join('\n');
}

export function compareLists(task: ListComparisonTask): string {
  const left = parseItems(task.left, task);
  const right = parseItems(task.right, task);
  if (task.mode === 'set') {
    return compareSets(left, right);
  }
  if (task.mode === 'multiset') {
    return compareMultisets(left, right);
  }
  return compareOrdered(left, right);
}
