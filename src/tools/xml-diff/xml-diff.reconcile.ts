export { reconcileArrayShapes };

/**
 * XML has no way to know, from a single document, whether a repeated element
 * could also legitimately appear once. `xml-diff.parser` therefore represents
 * a single occurrence as a plain value and 2+ occurrences as an array, which
 * means the same element key can land on different shapes on each side of the
 * diff (e.g. `item: {...}` on the left, `item: [{...}, {...}]` on the right).
 * Diffing an object against an array directly produces nonsense, so before
 * calling the generic diff we walk both trees together and wrap the
 * non-array side in a single-element array wherever the two sides disagree.
 */
function reconcileArrayShapes(left: unknown, right: unknown): [unknown, unknown] {
  if (Array.isArray(left) || Array.isArray(right)) {
    return reconcileArrays(
      Array.isArray(left) ? left : left === undefined ? [] : [left],
      Array.isArray(right) ? right : right === undefined ? [] : [right],
    );
  }

  if (isPlainObject(left) && isPlainObject(right)) {
    return reconcileObjects(left, right);
  }

  return [left, right];
}

function reconcileArrays(left: unknown[], right: unknown[]): [unknown[], unknown[]] {
  const maxLength = Math.max(left.length, right.length);
  const reconciledLeft: unknown[] = [];
  const reconciledRight: unknown[] = [];

  for (let i = 0; i < maxLength; i++) {
    const [reconciledLeftItem, reconciledRightItem] = reconcileArrayShapes(left[i], right[i]);
    reconciledLeft.push(reconciledLeftItem);
    reconciledRight.push(reconciledRightItem);
  }

  return [reconciledLeft, reconciledRight];
}

function reconcileObjects(
  left: Record<string, unknown>,
  right: Record<string, unknown>,
): [Record<string, unknown>, Record<string, unknown>] {
  const reconciledLeft: Record<string, unknown> = { ...left };
  const reconciledRight: Record<string, unknown> = { ...right };

  for (const key of new Set([...Object.keys(left), ...Object.keys(right)])) {
    const [reconciledLeftValue, reconciledRightValue] = reconcileArrayShapes(left[key], right[key]);
    reconciledLeft[key] = reconciledLeftValue;
    reconciledRight[key] = reconciledRightValue;
  }

  return [reconciledLeft, reconciledRight];
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
