import { beforeEach, describe, expect, it } from 'vitest';
import {
  MAX_PERSISTED_TEXT_DIFF_SIDE_BYTES,
  TEXT_DIFF_PERSISTENCE_KEYS,
  clearPersistedTextDiffContent,
  readPersistedTextDiffContent,
  readTextDiffPersistencePreference,
  writePersistedTextDiffContent,
  writeTextDiffPersistencePreference,
} from './text-diff.persistence';

describe('Text Diff persistence', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('is opt-in and round-trips versioned Unicode content', () => {
    expect(readTextDiffPersistencePreference(localStorage)).toBe(false);
    expect(readPersistedTextDiffContent(localStorage)).toBeNull();

    writeTextDiffPersistencePreference(localStorage, true);
    writePersistedTextDiffContent(localStorage, {
      original: 'before 💩',
      modified: 'after 今天',
    });

    expect(readTextDiffPersistencePreference(localStorage)).toBe(true);
    expect(readPersistedTextDiffContent(localStorage)).toEqual({
      original: 'before 💩',
      modified: 'after 今天',
    });
    expect(JSON.parse(localStorage.getItem(TEXT_DIFF_PERSISTENCE_KEYS.content)!)).toMatchObject({ version: 2 });
  });

  it('checks UTF-8 byte limits before writing', () => {
    const oversizedUnicode = '💩'.repeat(MAX_PERSISTED_TEXT_DIFF_SIDE_BYTES / 4 + 1);

    expect(() => writePersistedTextDiffContent(localStorage, {
      original: oversizedUnicode,
      modified: '',
    })).toThrow(RangeError);
    expect(localStorage.getItem(TEXT_DIFF_PERSISTENCE_KEYS.content)).toBeNull();
  });

  it('rejects corrupt and oversized saved content without returning it', () => {
    localStorage.setItem(TEXT_DIFF_PERSISTENCE_KEYS.content, '{"version":3}');
    expect(() => readPersistedTextDiffContent(localStorage)).toThrow(TypeError);

    localStorage.setItem(TEXT_DIFF_PERSISTENCE_KEYS.content, JSON.stringify({
      version: 1,
      original: 'a'.repeat(MAX_PERSISTED_TEXT_DIFF_SIDE_BYTES + 1),
      modified: '',
    }));
    expect(() => readPersistedTextDiffContent(localStorage)).toThrow(RangeError);
  });

  it('clears current, preference, and legacy keys only on explicit request', () => {
    localStorage.setItem(TEXT_DIFF_PERSISTENCE_KEYS.preference, 'true');
    localStorage.setItem(TEXT_DIFF_PERSISTENCE_KEYS.content, 'saved');
    for (const legacyKey of TEXT_DIFF_PERSISTENCE_KEYS.legacyContent) {
      localStorage.setItem(legacyKey, 'legacy sensitive text');
    }

    clearPersistedTextDiffContent(localStorage);

    expect(localStorage).toHaveLength(0);
  });
});
