import { describe, expect, it } from 'vitest';
import { CURRENT_STORAGE_SCHEMA_VERSION, STORAGE_SCHEMA_KEY, TEXT_DIFF_PERSISTENCE_KEYS } from './storage-keys';
import { migrateApplicationStorage } from './storage-migrations';

function createStorage(initial: Record<string, string> = {}) {
  const values = new Map(Object.entries(initial));
  return {
    getItem: (key: string) => values.get(key) ?? null,
    removeItem: (key: string) => { values.delete(key); },
    setItem: (key: string, value: string) => { values.set(key, value); },
    values,
  };
}

describe('application storage migrations', () => {
  it('migrates the opt-in Text Diff envelope and commits the marker last', () => {
    const storage = createStorage({
      [TEXT_DIFF_PERSISTENCE_KEYS.content]: JSON.stringify({ version: 1, original: 'a', modified: 'b' }),
    });

    expect(migrateApplicationStorage(() => storage)).toMatchObject({ status: 'migrated', migrated: true });
    expect(JSON.parse(storage.values.get(TEXT_DIFF_PERSISTENCE_KEYS.content)!)).toEqual({
      version: 2,
      original: 'a',
      modified: 'b',
    });
    expect(storage.values.get(STORAGE_SCHEMA_KEY)).toBe(String(CURRENT_STORAGE_SCHEMA_VERSION));
  });

  it('removes a corrupt legacy content envelope without exposing it', () => {
    const storage = createStorage({ [TEXT_DIFF_PERSISTENCE_KEYS.content]: '{broken' });

    expect(migrateApplicationStorage(() => storage).status).toBe('migrated');
    expect(storage.values.has(TEXT_DIFF_PERSISTENCE_KEYS.content)).toBe(false);
  });

  it('rolls back content when committing the schema marker exceeds quota', () => {
    const original = JSON.stringify({ version: 1, original: 'before', modified: 'after' });
    const storage = createStorage({ [TEXT_DIFF_PERSISTENCE_KEYS.content]: original });
    const setItem = storage.setItem;
    storage.setItem = (key, value) => {
      if (key === STORAGE_SCHEMA_KEY) {
        throw new DOMException('full', 'QuotaExceededError');
      }
      setItem(key, value);
    };

    expect(migrateApplicationStorage(() => storage)).toMatchObject({ status: 'rolled-back', rolledBack: true });
    expect(storage.values.get(TEXT_DIFF_PERSISTENCE_KEYS.content)).toBe(original);
    expect(storage.values.has(STORAGE_SCHEMA_KEY)).toBe(false);
  });

  it('treats denied storage as unavailable instead of blocking startup', () => {
    const result = migrateApplicationStorage(() => {
      throw new DOMException('blocked', 'SecurityError');
    });
    expect(result.status).toBe('unavailable');
  });
});
