export type MarkdownDiffGranularity = 'line' | 'word';

export interface MarkdownDiffTask {
  left: string
  right: string
  granularity: MarkdownDiffGranularity
}

export const MARKDOWN_DIFF_MAX_LINES_PER_SIDE = 4_000;
export const MARKDOWN_DIFF_MAX_UNITS_PER_SIDE = 8_000;
export const MARKDOWN_DIFF_MAX_LINE_CHARACTERS = 64 * 1024;
export const MARKDOWN_DIFF_MAX_ALIGNMENT_CELLS = 1_000_000;

export function isMarkdownDiffTaskStale(completed: MarkdownDiffTask | null, current: MarkdownDiffTask): boolean {
  return completed !== null && (
    completed.left !== current.left
    || completed.right !== current.right
    || completed.granularity !== current.granularity
  );
}

type Operation = 'equal' | 'delete' | 'insert';

interface DiffUnit {
  operation: Operation
  value: string
}

function splitLines(source: string): string[] {
  if (source === '') {
    return [];
  }
  const lines = source.replace(/\r\n?/gu, '\n').split('\n');
  if (lines.length > MARKDOWN_DIFF_MAX_LINES_PER_SIDE) {
    throw new RangeError('Markdown line count exceeds the comparison limit.');
  }
  if (lines.some(line => line.length > MARKDOWN_DIFF_MAX_LINE_CHARACTERS)) {
    throw new RangeError('A Markdown line exceeds the comparison limit.');
  }
  return lines;
}

function splitWords(source: string): string[] {
  const units = source.match(/\s+|[\p{L}\p{M}\p{N}_]+|[^\p{L}\p{M}\p{N}_\s]+/gu) ?? [];
  if (units.length > MARKDOWN_DIFF_MAX_UNITS_PER_SIDE) {
    throw new RangeError('Markdown word-token count exceeds the comparison limit.');
  }
  return units;
}

function alignUnits(left: string[], right: string[]): DiffUnit[] {
  let prefixLength = 0;
  while (prefixLength < left.length && prefixLength < right.length && left[prefixLength] === right[prefixLength]) {
    prefixLength += 1;
  }

  let suffixLength = 0;
  while (
    suffixLength < left.length - prefixLength
    && suffixLength < right.length - prefixLength
    && left[left.length - suffixLength - 1] === right[right.length - suffixLength - 1]
  ) {
    suffixLength += 1;
  }

  const leftMiddle = left.slice(prefixLength, left.length - suffixLength);
  const rightMiddle = right.slice(prefixLength, right.length - suffixLength);
  const cells = (leftMiddle.length + 1) * (rightMiddle.length + 1);
  if (!Number.isSafeInteger(cells) || cells > MARKDOWN_DIFF_MAX_ALIGNMENT_CELLS) {
    throw new RangeError('Markdown diff exceeds the alignment-work limit.');
  }

  const width = rightMiddle.length + 1;
  const lengths = new Uint32Array(cells);
  for (let leftIndex = leftMiddle.length - 1; leftIndex >= 0; leftIndex -= 1) {
    for (let rightIndex = rightMiddle.length - 1; rightIndex >= 0; rightIndex -= 1) {
      const offset = leftIndex * width + rightIndex;
      lengths[offset] = leftMiddle[leftIndex] === rightMiddle[rightIndex]
        ? lengths[(leftIndex + 1) * width + rightIndex + 1] + 1
        : Math.max(lengths[(leftIndex + 1) * width + rightIndex], lengths[leftIndex * width + rightIndex + 1]);
    }
  }

  const operations: DiffUnit[] = left.slice(0, prefixLength).map(value => ({ operation: 'equal', value }));
  let leftIndex = 0;
  let rightIndex = 0;
  while (leftIndex < leftMiddle.length || rightIndex < rightMiddle.length) {
    if (leftIndex < leftMiddle.length && rightIndex < rightMiddle.length && leftMiddle[leftIndex] === rightMiddle[rightIndex]) {
      operations.push({ operation: 'equal', value: leftMiddle[leftIndex] });
      leftIndex += 1;
      rightIndex += 1;
    }
    else if (
      rightIndex < rightMiddle.length
      && (leftIndex >= leftMiddle.length || lengths[leftIndex * width + rightIndex + 1] >= lengths[(leftIndex + 1) * width + rightIndex])
    ) {
      operations.push({ operation: 'insert', value: rightMiddle[rightIndex] });
      rightIndex += 1;
    }
    else {
      operations.push({ operation: 'delete', value: leftMiddle[leftIndex] });
      leftIndex += 1;
    }
  }
  operations.push(...left.slice(left.length - suffixLength).map(value => ({ operation: 'equal' as const, value })));
  return operations;
}

function operationCounts(operations: DiffUnit[]): Record<Operation, number> {
  const counts: Record<Operation, number> = { equal: 0, delete: 0, insert: 0 };
  operations.forEach(({ operation }) => counts[operation] += 1);
  return counts;
}

function renderLineDiff(operations: DiffUnit[], leftCount: number, rightCount: number): string {
  const counts = operationCounts(operations);
  return [
    'Markdown source diff — line granularity',
    `Left: ${leftCount.toLocaleString('en-US')} lines; right: ${rightCount.toLocaleString('en-US')} lines`,
    `Shared: ${counts.equal.toLocaleString('en-US')}; removed: ${counts.delete.toLocaleString('en-US')}; added: ${counts.insert.toLocaleString('en-US')}`,
    'Legend: two spaces = shared, - = left only, + = right only',
    'Line endings are normalized to LF for comparison.',
    '',
    ...operations.map(({ operation, value }) => `${operation === 'equal' ? '  ' : operation === 'delete' ? '- ' : '+ '}${value}`),
  ].join('\n');
}

function renderWordDiff(operations: DiffUnit[], leftCount: number, rightCount: number): string {
  const counts = operationCounts(operations);
  return [
    'Markdown source diff — word/token granularity',
    `Left: ${leftCount.toLocaleString('en-US')} tokens; right: ${rightCount.toLocaleString('en-US')} tokens`,
    `Shared: ${counts.equal.toLocaleString('en-US')}; removed: ${counts.delete.toLocaleString('en-US')}; added: ${counts.insert.toLocaleString('en-US')}`,
    'Legend: = shared, - left only, + right only. JSON strings preserve whitespace and punctuation exactly.',
    '',
    ...operations.map(({ operation, value }) => `${operation === 'equal' ? '=' : operation === 'delete' ? '-' : '+'} ${JSON.stringify(value)}`),
  ].join('\n');
}

export function compareMarkdown(task: MarkdownDiffTask): string {
  const leftUnits = task.granularity === 'line' ? splitLines(task.left) : splitWords(task.left);
  const rightUnits = task.granularity === 'line' ? splitLines(task.right) : splitWords(task.right);
  const operations = alignUnits(leftUnits, rightUnits);
  return task.granularity === 'line'
    ? renderLineDiff(operations, leftUnits.length, rightUnits.length)
    : renderWordDiff(operations, leftUnits.length, rightUnits.length);
}
