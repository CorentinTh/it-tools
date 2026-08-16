import type { StorageLike } from '@vueuse/core';

export type StorageFailureKind = 'denied' | 'quota' | 'unknown';

export interface ResilientStorageStatus {
  failure: StorageFailureKind | null
  mode: 'memory' | 'persistent'
}

type StorageProvider = () => StorageLike | undefined;

function classifyStorageFailure(error: unknown): StorageFailureKind {
  if (error instanceof DOMException) {
    if (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
      return 'quota';
    }

    if (error.name === 'SecurityError' || error.name === 'InvalidStateError') {
      return 'denied';
    }
  }

  return 'unknown';
}

export function createResilientStorage(storageProvider: StorageProvider) {
  const memory = new Map<string, string>();
  let backingStorage: StorageLike | undefined;
  let fallbackToMemory = false;
  let failure: StorageFailureKind | null = null;

  function useMemoryFallback(error: unknown) {
    fallbackToMemory = true;
    failure = classifyStorageFailure(error);
  }

  function getBackingStorage() {
    if (fallbackToMemory) {
      return undefined;
    }

    if (backingStorage) {
      return backingStorage;
    }

    try {
      backingStorage = storageProvider();
      return backingStorage;
    }
    catch (error) {
      useMemoryFallback(error);
      return undefined;
    }
  }

  const storage: StorageLike = {
    getItem(key) {
      const backing = getBackingStorage();
      if (!backing) {
        return memory.get(key) ?? null;
      }

      try {
        const value = backing.getItem(key);
        if (value !== null) {
          memory.set(key, value);
        }
        return value;
      }
      catch (error) {
        useMemoryFallback(error);
        return memory.get(key) ?? null;
      }
    },
    removeItem(key) {
      memory.delete(key);
      const backing = getBackingStorage();
      if (!backing) {
        return;
      }

      try {
        backing.removeItem(key);
      }
      catch (error) {
        useMemoryFallback(error);
      }
    },
    setItem(key, value) {
      memory.set(key, value);
      const backing = getBackingStorage();
      if (!backing) {
        return;
      }

      try {
        backing.setItem(key, value);
      }
      catch (error) {
        useMemoryFallback(error);
      }
    },
  };

  return {
    getStatus: (): ResilientStorageStatus => ({
      failure,
      mode: fallbackToMemory ? 'memory' : 'persistent',
    }),
    storage,
  };
}

const browserStorage = createResilientStorage(() => (
  typeof window === 'undefined' ? undefined : window.localStorage
));

export const resilientLocalStorage = browserStorage.storage;
export const getResilientStorageStatus = browserStorage.getStatus;
