import { LEGACY_SENSITIVE_CONTENT_STORAGE_KEYS } from './sensitive-content-storage';
import { STORAGE_SCHEMA_KEY, TEXT_DIFF_PERSISTENCE_KEYS } from './storage-keys';

export const PERSISTED_PREFERENCE_STORAGE_KEYS = [
  'locale',
  'vueuse-color-scheme',
  'isMenuCollapsed',
  'menu-tool-option:collapsed-categories',
  'favoriteToolsName',
  'json-prettify:indent-size',
  'json-prettify:sort-keys',
  'yaml-prettify:indent-size',
  'yaml-prettify:sort-keys',
  'xml-formatter:indent-size',
  'xml-formatter:collapse-content',
  'base64-string-converter--encode-url-safe',
  'base64-string-converter--decode-url-safe',
  'list-converter:conversionConfig',
  'benchmark-builder:unit',
  'uuid-generator:version',
  'uuid-generator:quantity',
  'ulid-generator-amount',
  'ulid-generator-format',
  'mac-address-generator-amount',
  'mac-address-generator-separator',
  'ascii-text-drawer:font',
  'ascii-text-drawer:width',
  'token-generator:v1:length',
  'token-generator:v1:quantity',
  'token-generator:v1:uppercase',
  'token-generator:v1:lowercase',
  'token-generator:v1:numbers',
  'token-generator:v1:symbols',
] as const;

export const MANAGED_STORAGE_KEYS = [
  STORAGE_SCHEMA_KEY,
  ...PERSISTED_PREFERENCE_STORAGE_KEYS,
  TEXT_DIFF_PERSISTENCE_KEYS.preference,
  TEXT_DIFF_PERSISTENCE_KEYS.content,
  ...TEXT_DIFF_PERSISTENCE_KEYS.legacyContent,
  ...LEGACY_SENSITIVE_CONTENT_STORAGE_KEYS,
] as const;

type ClearableStorage = Pick<Storage, 'getItem' | 'removeItem'>;

export interface ClearManagedStorageResult {
  removedKeys: string[]
  failedKeys: string[]
}

/** Remove only storage owned by this application, preserving same-origin data from other apps. */
export function clearManagedStorage(storage: ClearableStorage): ClearManagedStorageResult {
  const removedKeys: string[] = [];
  const failedKeys: string[] = [];

  for (const key of new Set<string>(MANAGED_STORAGE_KEYS)) {
    try {
      if (storage.getItem(key) === null) {
        continue;
      }

      storage.removeItem(key);
      removedKeys.push(key);
    }
    catch {
      failedKeys.push(key);
    }
  }

  return { removedKeys, failedKeys };
}
