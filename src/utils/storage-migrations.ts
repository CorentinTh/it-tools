import {
  CURRENT_STORAGE_SCHEMA_VERSION,
  STORAGE_SCHEMA_KEY,
  TEXT_DIFF_PERSISTENCE_KEYS,
} from './storage-keys';

type MutableStorage = Pick<Storage, 'getItem' | 'removeItem' | 'setItem'>;
type StorageProvider = () => MutableStorage | undefined;

export interface StorageMigrationResult {
  fromVersion: number
  migrated: boolean
  rolledBack: boolean
  status: 'current' | 'migrated' | 'rolled-back' | 'unavailable'
  toVersion: number
}

const browserStorage: StorageProvider = () => (
  typeof window === 'undefined' ? undefined : window.localStorage
);

function parseVersion(value: string | null) {
  if (value === null) {
    return 1;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : 1;
}

function migrateTextDiffContent(serialized: string | null) {
  if (serialized === null) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(serialized);
    if (!parsed || typeof parsed !== 'object') {
      return null;
    }

    const record = parsed as Record<string, unknown>;
    if ((record.version !== 1 && record.version !== 2)
      || typeof record.original !== 'string'
      || typeof record.modified !== 'string') {
      return null;
    }

    return JSON.stringify({
      version: 2,
      original: record.original,
      modified: record.modified,
    });
  }
  catch {
    return null;
  }
}

export function migrateApplicationStorage(
  storageProvider: StorageProvider = browserStorage,
): StorageMigrationResult {
  let storage: MutableStorage | undefined;

  try {
    storage = storageProvider();
  }
  catch {
    return { fromVersion: 1, migrated: false, rolledBack: false, status: 'unavailable', toVersion: CURRENT_STORAGE_SCHEMA_VERSION };
  }

  if (!storage) {
    return { fromVersion: 1, migrated: false, rolledBack: false, status: 'unavailable', toVersion: CURRENT_STORAGE_SCHEMA_VERSION };
  }

  let fromVersion: number;
  let previousContent: string | null;
  let previousMarker: string | null;

  try {
    previousMarker = storage.getItem(STORAGE_SCHEMA_KEY);
    fromVersion = parseVersion(previousMarker);
    previousContent = storage.getItem(TEXT_DIFF_PERSISTENCE_KEYS.content);
  }
  catch {
    return { fromVersion: 1, migrated: false, rolledBack: false, status: 'unavailable', toVersion: CURRENT_STORAGE_SCHEMA_VERSION };
  }

  if (fromVersion >= CURRENT_STORAGE_SCHEMA_VERSION) {
    return { fromVersion, migrated: false, rolledBack: false, status: 'current', toVersion: fromVersion };
  }

  try {
    const migratedContent = migrateTextDiffContent(previousContent);
    if (migratedContent === null) {
      storage.removeItem(TEXT_DIFF_PERSISTENCE_KEYS.content);
    }
    else {
      storage.setItem(TEXT_DIFF_PERSISTENCE_KEYS.content, migratedContent);
    }
    storage.setItem(STORAGE_SCHEMA_KEY, String(CURRENT_STORAGE_SCHEMA_VERSION));
  }
  catch {
    try {
      if (previousContent === null) {
        storage.removeItem(TEXT_DIFF_PERSISTENCE_KEYS.content);
      }
      else {
        storage.setItem(TEXT_DIFF_PERSISTENCE_KEYS.content, previousContent);
      }

      if (previousMarker === null) {
        storage.removeItem(STORAGE_SCHEMA_KEY);
      }
      else {
        storage.setItem(STORAGE_SCHEMA_KEY, previousMarker);
      }
    }
    catch {
      // Best-effort rollback: startup must remain available even if storage is read-only.
    }

    return { fromVersion, migrated: false, rolledBack: true, status: 'rolled-back', toVersion: fromVersion };
  }

  return { fromVersion, migrated: true, rolledBack: false, status: 'migrated', toVersion: CURRENT_STORAGE_SCHEMA_VERSION };
}
