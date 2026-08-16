export const TEXT_DIFF_PERSISTENCE_KEYS = {
  preference: 'it-tools:v1:preferences:text-diff:persist',
  content: 'it-tools:v1:content:text-diff',
  legacyContent: ['text-diff:original', 'text-diff:modified'],
} as const;

export const STORAGE_SCHEMA_KEY = 'it-tools:storage-schema';
export const CURRENT_STORAGE_SCHEMA_VERSION = 2;
