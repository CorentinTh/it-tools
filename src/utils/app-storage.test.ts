import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  MANAGED_STORAGE_KEYS,
  clearManagedStorage,
} from './app-storage';

describe('application storage reset', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('removes every managed key without clearing unrelated same-origin data', () => {
    for (const key of MANAGED_STORAGE_KEYS) {
      localStorage.setItem(key, `stored:${key}`);
    }
    localStorage.setItem('another-app:session', 'keep me');

    const result = clearManagedStorage(localStorage);

    expect(result.failedKeys).toEqual([]);
    expect(new Set(result.removedKeys)).toEqual(new Set(MANAGED_STORAGE_KEYS));
    expect(localStorage.getItem('another-app:session')).toBe('keep me');
  });

  it('reports denied keys and continues clearing the rest', () => {
    const values = new Map<string, string>([
      [MANAGED_STORAGE_KEYS[0], 'first'],
      [MANAGED_STORAGE_KEYS[1], 'second'],
    ]);
    const removeItem = vi.fn((key: string) => {
      if (key === MANAGED_STORAGE_KEYS[0]) {
        throw new DOMException('Denied', 'SecurityError');
      }
      values.delete(key);
    });

    const result = clearManagedStorage({
      getItem: key => values.get(key) ?? null,
      removeItem,
    });

    expect(result.failedKeys).toEqual([MANAGED_STORAGE_KEYS[0]]);
    expect(result.removedKeys).toEqual([MANAGED_STORAGE_KEYS[1]]);
    expect(removeItem).toHaveBeenCalledTimes(2);
  });
});
