import { compare, hash } from 'bcryptjs';
import { assert, describe, expect, test } from 'vitest';
import { type Update, bcryptWithProgressUpdates } from './bcrypt.models';

// simplified polyfill for https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/fromAsync
async function fromAsync<T>(iter: AsyncIterable<T>) {
  const out: T[] = [];
  for await (const val of iter) {
    out.push(val);
  }
  return out;
}

function checkProgressAndGetResult<T>(updates: Update<T>[]) {
  const first = updates.at(0);
  const penultimate = updates.at(-2);
  const last = updates.at(-1);
  const allExceptLast = updates.slice(0, -1);

  expect(allExceptLast.every(x => x.kind === 'progress')).toBeTruthy();
  expect(first).toEqual({ kind: 'progress', progress: 0 });
  expect(penultimate).toEqual({ kind: 'progress', progress: 1 });

  assert(last != null && last.kind === 'success');

  return last;
}

describe('bcrypt models', () => {
  describe(bcryptWithProgressUpdates.name, () => {
    test('with bcrypt hash function', async () => {
      const updates = await fromAsync(bcryptWithProgressUpdates(hash, ['abc', 5]));
      const result = checkProgressAndGetResult(updates);

      expect(result.value).toMatch(/^\$2a\$05\$.{53}$/);
      expect(result.timeTakenMs).toBeGreaterThan(0);
    });

    test('with bcrypt compare function', async () => {
      const updates = await fromAsync(
        bcryptWithProgressUpdates(compare, ['abc', '$2a$05$FHzYelm8Qn.IhGP.N8V1TOWFlRTK.8cphbxZSvSFo9B6HGscnQdhy']),
      );
      const result = checkProgressAndGetResult(updates);

      expect(result.value).toBe(true);
      expect(result.timeTakenMs).toBeGreaterThan(0);
    });
  });
});
