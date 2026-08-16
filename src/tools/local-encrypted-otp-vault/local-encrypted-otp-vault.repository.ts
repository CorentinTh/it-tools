import { OTP_VAULT_SCHEMA_VERSION } from './local-encrypted-otp-vault.service';

export const OTP_VAULT_DATABASE_NAME = 'it-tools-otp-vault';
const DATABASE_VERSION = 1;
const STORE_NAME = 'vault';
const PRIMARY_RECORD_ID = 'primary';
const MAX_ENVELOPE_CHARACTERS = 2 * 1024 * 1024;

interface StoredOtpVaultRecord {
  envelope: string
  id: 'primary'
  schemaVersion: 1
  updatedAt: string
}

function requestResult<T>(request: IDBRequest<T>) {
  return new Promise<T>((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('IndexedDB request failed.'));
  });
}

function transactionComplete(transaction: IDBTransaction) {
  return new Promise<void>((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onabort = () => reject(transaction.error ?? new Error('IndexedDB transaction was aborted.'));
    transaction.onerror = () => reject(transaction.error ?? new Error('IndexedDB transaction failed.'));
  });
}

function openDatabase(factory: IDBFactory) {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = factory.open(OTP_VAULT_DATABASE_NAME, DATABASE_VERSION);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE_NAME)) {
        request.result.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('The OTP vault database could not be opened.'));
    request.onblocked = () => reject(new Error('The OTP vault database upgrade is blocked by another tab.'));
  });
}

function validateRecord(value: unknown): StoredOtpVaultRecord | undefined {
  if (value === undefined) {
    return undefined;
  }
  if (!value || typeof value !== 'object') {
    throw new TypeError('The saved OTP vault record is corrupt.');
  }
  const record = value as Record<string, unknown>;
  if (record.id !== PRIMARY_RECORD_ID
    || record.schemaVersion !== OTP_VAULT_SCHEMA_VERSION
    || typeof record.envelope !== 'string'
    || record.envelope.length === 0
    || record.envelope.length > MAX_ENVELOPE_CHARACTERS
    || typeof record.updatedAt !== 'string') {
    throw new TypeError('The saved OTP vault record schema is unsupported or corrupt.');
  }
  return record as unknown as StoredOtpVaultRecord;
}

export class OtpVaultRepository {
  constructor(private readonly factory: IDBFactory | undefined = globalThis.indexedDB) {}

  private async open() {
    if (!this.factory) {
      throw new TypeError('IndexedDB is not available in this browser.');
    }
    return openDatabase(this.factory);
  }

  async read() {
    const database = await this.open();
    try {
      const transaction = database.transaction(STORE_NAME, 'readonly');
      const value = await requestResult(transaction.objectStore(STORE_NAME).get(PRIMARY_RECORD_ID));
      return validateRecord(value)?.envelope;
    }
    finally {
      database.close();
    }
  }

  async write(envelope: string) {
    if (!envelope || envelope.length > MAX_ENVELOPE_CHARACTERS) {
      throw new RangeError('The encrypted OTP vault exceeds its storage limit.');
    }
    const database = await this.open();
    try {
      const transaction = database.transaction(STORE_NAME, 'readwrite');
      transaction.objectStore(STORE_NAME).put({
        id: PRIMARY_RECORD_ID,
        schemaVersion: OTP_VAULT_SCHEMA_VERSION,
        envelope,
        updatedAt: new Date().toISOString(),
      } satisfies StoredOtpVaultRecord);
      await transactionComplete(transaction);
    }
    finally {
      database.close();
    }
  }

  async clear() {
    const database = await this.open();
    try {
      const transaction = database.transaction(STORE_NAME, 'readwrite');
      transaction.objectStore(STORE_NAME).delete(PRIMARY_RECORD_ID);
      await transactionComplete(transaction);
    }
    finally {
      database.close();
    }
  }
}

export async function deleteOtpVaultDatabase(factory: IDBFactory | undefined = globalThis.indexedDB) {
  if (!factory) {
    return false;
  }
  return new Promise<boolean>((resolve, reject) => {
    const request = factory.deleteDatabase(OTP_VAULT_DATABASE_NAME);
    request.onsuccess = () => resolve(true);
    request.onerror = () => reject(request.error ?? new Error('The OTP vault database could not be deleted.'));
    request.onblocked = () => reject(new Error('The OTP vault database is open in another tab.'));
  });
}
