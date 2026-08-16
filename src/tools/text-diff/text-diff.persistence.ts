import { TEXT_DIFF_PERSISTENCE_KEYS } from '@/utils/storage-keys';

export { TEXT_DIFF_PERSISTENCE_KEYS } from '@/utils/storage-keys';

export const MAX_PERSISTED_TEXT_DIFF_SIDE_BYTES = 256 * 1024;

export interface TextDiffContent {
  original: string
  modified: string
}

type TextDiffStorage = Pick<Storage, 'getItem' | 'removeItem' | 'setItem'>;

const textEncoder = new TextEncoder();

function assertBoundedSide(value: string, side: keyof TextDiffContent) {
  const byteLength = textEncoder.encode(value).byteLength;

  if (byteLength > MAX_PERSISTED_TEXT_DIFF_SIDE_BYTES) {
    throw new RangeError(
      `Text Diff ${side} content is ${byteLength} bytes; the persistence limit is ${MAX_PERSISTED_TEXT_DIFF_SIDE_BYTES} bytes per side.`,
    );
  }
}

function isStoredTextDiffContent(value: unknown): value is TextDiffContent & { version: 1 | 2 } {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const record = value as Record<string, unknown>;

  return (record.version === 1 || record.version === 2)
    && typeof record.original === 'string'
    && typeof record.modified === 'string';
}

export function readTextDiffPersistencePreference(storage: TextDiffStorage) {
  return storage.getItem(TEXT_DIFF_PERSISTENCE_KEYS.preference) === 'true';
}

export function writeTextDiffPersistencePreference(storage: TextDiffStorage, enabled: boolean) {
  if (enabled) {
    storage.setItem(TEXT_DIFF_PERSISTENCE_KEYS.preference, 'true');
  }
  else {
    storage.removeItem(TEXT_DIFF_PERSISTENCE_KEYS.preference);
  }
}

export function readPersistedTextDiffContent(storage: TextDiffStorage): TextDiffContent | null {
  const serialized = storage.getItem(TEXT_DIFF_PERSISTENCE_KEYS.content);

  if (serialized === null) {
    return null;
  }

  const parsed: unknown = JSON.parse(serialized);

  if (!isStoredTextDiffContent(parsed)) {
    throw new TypeError('Saved Text Diff content has an unsupported or corrupt schema.');
  }

  assertBoundedSide(parsed.original, 'original');
  assertBoundedSide(parsed.modified, 'modified');

  return {
    original: parsed.original,
    modified: parsed.modified,
  };
}

export function writePersistedTextDiffContent(storage: TextDiffStorage, content: TextDiffContent) {
  assertBoundedSide(content.original, 'original');
  assertBoundedSide(content.modified, 'modified');

  storage.setItem(TEXT_DIFF_PERSISTENCE_KEYS.content, JSON.stringify({
    version: 2,
    ...content,
  }));
}

export function clearPersistedTextDiffContent(storage: TextDiffStorage) {
  storage.removeItem(TEXT_DIFF_PERSISTENCE_KEYS.preference);
  storage.removeItem(TEXT_DIFF_PERSISTENCE_KEYS.content);

  for (const legacyKey of TEXT_DIFF_PERSISTENCE_KEYS.legacyContent) {
    storage.removeItem(legacyKey);
  }
}
