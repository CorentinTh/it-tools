export const LEGACY_SENSITIVE_CONTENT_STORAGE_KEYS = [
  'json-prettify:raw-json',
  'yaml-prettify:raw-yaml',
  'json-diff:raw-left-json',
  'json-diff:raw-right-json',
  'html-wysiwyg-editor--html',
  'benchmark-builder:suites',
  'case-converter:input',
  'regex-tester:regex',
  'ipv4-converter:ip',
  'ipv4-range-expander:startAddress',
  'ipv4-range-expander:endAddress',
  'ipv4-subnet-calculator:ip',
  'mac-address-generator-prefix',
] as const;

type RemovableStorage = Pick<Storage, 'removeItem'>;
type StorageProvider = () => RemovableStorage | undefined;

const browserStorage: StorageProvider = () => {
  if (typeof window === 'undefined') {
    return undefined;
  }

  return window.localStorage;
};

/**
 * Remove raw content written by older releases without making application
 * startup depend on localStorage being available. Browsers can deny access to
 * the storage object itself or to an individual mutation.
 */
export function clearLegacySensitiveContentStorage(
  storageProvider: StorageProvider = browserStorage,
) {
  let storage: RemovableStorage | undefined;

  try {
    storage = storageProvider();
  }
  catch {
    return;
  }

  if (!storage) {
    return;
  }

  for (const key of LEGACY_SENSITIVE_CONTENT_STORAGE_KEYS) {
    try {
      storage.removeItem(key);
    }
    catch {
      // A failed cleanup must not block the rest of application startup.
    }
  }
}
