import { describe, expect, it, vi } from 'vitest';
import { createResilientStorage } from './resilient-storage';

describe('resilient storage', () => {
  it('uses persistent storage while it is available', () => {
    const values = new Map<string, string>();
    const { getStatus, storage } = createResilientStorage(() => ({
      getItem: key => values.get(key) ?? null,
      removeItem: key => values.delete(key),
      setItem: (key, value) => values.set(key, value),
    }));

    storage.setItem('theme', 'dark');

    expect(storage.getItem('theme')).toBe('dark');
    expect(getStatus()).toEqual({ failure: null, mode: 'persistent' });
  });

  it('keeps the latest value in memory after a quota failure', () => {
    const backing = new Map([['count', '1']]);
    const quotaError = new DOMException('full', 'QuotaExceededError');
    const { getStatus, storage } = createResilientStorage(() => ({
      getItem: key => backing.get(key) ?? null,
      removeItem: vi.fn(),
      setItem: () => {
        throw quotaError;
      },
    }));

    storage.setItem('count', '2');

    expect(storage.getItem('count')).toBe('2');
    expect(getStatus()).toEqual({ failure: 'quota', mode: 'memory' });
  });

  it('does not break when access to localStorage is denied', () => {
    const denied = new DOMException('blocked', 'SecurityError');
    const { getStatus, storage } = createResilientStorage(() => {
      throw denied;
    });

    storage.setItem('locale', 'en');

    expect(storage.getItem('locale')).toBe('en');
    expect(getStatus()).toEqual({ failure: 'denied', mode: 'memory' });
  });
});
