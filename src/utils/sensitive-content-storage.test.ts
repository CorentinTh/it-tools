import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  LEGACY_SENSITIVE_CONTENT_STORAGE_KEYS,
  clearLegacySensitiveContentStorage,
} from './sensitive-content-storage';

describe('legacy sensitive content storage cleanup', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('removes every classified content key and preserves unrelated preferences', () => {
    for (const key of LEGACY_SENSITIVE_CONTENT_STORAGE_KEYS) {
      localStorage.setItem(key, `private:${key}`);
    }
    localStorage.setItem('json-prettify:indent-size', '4');
    localStorage.setItem('json-prettify:sort-keys', 'true');
    localStorage.setItem('benchmark-builder:unit', 'ms');

    clearLegacySensitiveContentStorage(() => localStorage);

    for (const key of LEGACY_SENSITIVE_CONTENT_STORAGE_KEYS) {
      expect(localStorage.getItem(key)).toBeNull();
    }
    expect(localStorage.getItem('json-prettify:indent-size')).toBe('4');
    expect(localStorage.getItem('json-prettify:sort-keys')).toBe('true');
    expect(localStorage.getItem('benchmark-builder:unit')).toBe('ms');
  });

  it('does not fail startup when access to the storage object is denied', () => {
    expect(() => clearLegacySensitiveContentStorage(() => {
      throw new DOMException('Storage is disabled', 'SecurityError');
    })).not.toThrow();
  });

  it('continues cleanup when removing an individual key is denied', () => {
    const removeItem = vi.fn((key: string) => {
      if (key === LEGACY_SENSITIVE_CONTENT_STORAGE_KEYS[1]) {
        throw new DOMException('Mutation is disabled', 'SecurityError');
      }
    });

    expect(() => clearLegacySensitiveContentStorage(() => ({ removeItem }))).not.toThrow();
    expect(removeItem).toHaveBeenCalledTimes(LEGACY_SENSITIVE_CONTENT_STORAGE_KEYS.length);
  });
});
