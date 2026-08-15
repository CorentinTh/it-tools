import { describe, expect, it, vi } from 'vitest';

import {
  DEV_PWA_RESET_MARKER,
  clearDevelopmentPwaState,
  configurePwaRuntime,
} from './runtime';

function createWorker(scriptURL: string) {
  return { scriptURL };
}

function createRegistration(scope: string, scriptURL: string) {
  return {
    active: createWorker(scriptURL),
    installing: null,
    scope,
    unregister: vi.fn(async () => true),
    waiting: null,
  };
}

describe('development PWA runtime hygiene', () => {
  it('removes only the IT Tools registration and application-owned caches', async () => {
    const applicationRegistration = createRegistration('http://127.0.0.1:8091/', 'http://127.0.0.1:8091/sw.js');
    const unrelatedRegistration = createRegistration('http://127.0.0.1:8091/other/', 'http://127.0.0.1:8091/other/sw.js');
    const deletedCacheNames: string[] = [];
    const deleteCache = vi.fn(async (cacheName: string) => {
      deletedCacheNames.push(cacheName);
      return true;
    });

    const result = await clearDevelopmentPwaState({
      baseUrl: '/',
      cacheStorage: {
        delete: deleteCache,
        keys: async () => [
          'workbox-precache-v2-http://127.0.0.1:8091/',
          'it-tools-lazy-assets-v1',
          'figlet-fonts-1.7.0',
          'unrelated-cache',
        ],
      },
      origin: 'http://127.0.0.1:8091',
      serviceWorker: {
        controller: createWorker('http://127.0.0.1:8091/sw.js'),
        getRegistrations: async () => [applicationRegistration, unrelatedRegistration],
      },
    });

    expect(applicationRegistration.unregister).toHaveBeenCalledOnce();
    expect(unrelatedRegistration.unregister).not.toHaveBeenCalled();
    expect(deletedCacheNames).toEqual([
      'workbox-precache-v2-http://127.0.0.1:8091/',
      'it-tools-lazy-assets-v1',
      'figlet-fonts-1.7.0',
    ]);
    expect(result).toEqual({ deletedCacheCount: 3, hadController: true, unregisteredCount: 1 });
  });

  it('does not register Workbox in development and reloads a controlled page at most once', async () => {
    const registerServiceWorker = vi.fn();
    const reload = vi.fn();
    const values = new Map<string, string>();
    const sessionStorage = {
      getItem: (key: string) => values.get(key) ?? null,
      removeItem: (key: string) => values.delete(key),
      setItem: (key: string, value: string) => values.set(key, value),
    };
    const options = {
      baseUrl: '/',
      cacheStorage: { delete: async () => true, keys: async () => [] },
      isDevelopment: true,
      origin: 'http://127.0.0.1:8091',
      registerServiceWorker,
      reload,
      serviceWorker: {
        controller: createWorker('http://127.0.0.1:8091/sw.js'),
        getRegistrations: async () => [],
      },
      sessionStorage,
    };

    await configurePwaRuntime(options);
    await configurePwaRuntime(options);

    expect(registerServiceWorker).not.toHaveBeenCalled();
    expect(reload).toHaveBeenCalledOnce();
    expect(values.get(DEV_PWA_RESET_MARKER)).toBe('pending');
  });

  it('registers Workbox only in production', async () => {
    const registerServiceWorker = vi.fn();

    await configurePwaRuntime({
      baseUrl: '/',
      isDevelopment: false,
      origin: 'https://it-tools.example',
      registerServiceWorker,
    });

    expect(registerServiceWorker).toHaveBeenCalledOnce();
  });
});
