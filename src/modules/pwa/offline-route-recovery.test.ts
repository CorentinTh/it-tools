import { afterEach, describe, expect, it, vi } from 'vitest';
import { createMemoryHistory, createRouter } from 'vue-router';
import {
  clearOfflineRouteFailure,
  installOfflineRouteRecovery,
  isLazyToolLoadCandidate,
  offlineRouteFailure,
  probeAppOrigin,
  toOfflineRouteFailure,
} from './offline-route-recovery';

const knownNetworkErrors = [
  'Failed to fetch dynamically imported module: https://example.test/assets/tool.js',
  'error loading dynamically imported module',
  'Importing a module script failed.',
  'Failed to load module script: expected a JavaScript module script.',
  'Unable to preload CSS for /assets/tool.css',
];

afterEach(() => clearOfflineRouteFailure());

describe('offline route recovery', () => {
  it.each(knownNetworkErrors)('classifies an offline lazy-tool failure: %s', (message) => {
    expect(isLazyToolLoadCandidate(new TypeError(message), {
      hasLazyComponent: true,
      isTool: true,
    })).toBe(true);
  });

  it('does not classify eager, non-tool, or unrelated application errors', () => {
    const dynamicImportError = new TypeError(knownNetworkErrors[0]);

    expect(isLazyToolLoadCandidate(dynamicImportError, {
      hasLazyComponent: false,
      isTool: true,
    })).toBe(false);
    expect(isLazyToolLoadCandidate(dynamicImportError, {
      hasLazyComponent: true,
      isTool: false,
    })).toBe(false);
    expect(isLazyToolLoadCandidate(new TypeError('Application setup failed'), {
      hasLazyComponent: true,
      isTool: true,
    })).toBe(false);
  });

  it('treats any HTTP response as reachable and network rejection as effective-offline', async () => {
    const reachableFetch = vi.fn(async () => ({} as Response));
    const unavailableFetch = vi.fn(async () => Promise.reject(new TypeError('network unavailable')));

    await expect(probeAppOrigin(reachableFetch)).resolves.toBe(true);
    await expect(probeAppOrigin(unavailableFetch)).resolves.toBe(false);
    expect(reachableFetch).toHaveBeenCalledWith(
      expect.stringMatching(/^\/healthz\?probe=\d+$/),
      expect.objectContaining({ cache: 'no-store', credentials: 'same-origin' }),
    );
  });

  it('keeps the retry target in memory while exposing only a query-free display path', () => {
    expect(toOfflineRouteFailure({
      fullPath: '/regex-tester?regex=private-token#diagram',
      path: '/regex-tester',
      meta: { isTool: true, name: 'Regex Tester' },
    })).toEqual({
      displayPath: '/regex-tester',
      fullPath: '/regex-tester?regex=private-token#diagram',
      toolName: 'Regex Tester',
    });
  });

  it('records a failed lazy route and clears it after successful navigation', async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', component: { template: '<div>Home</div>' } },
        {
          path: '/offline-tool',
          component: async () => Promise.reject(new TypeError(knownNetworkErrors[0])),
          meta: { isTool: true, name: 'Offline tool' },
        },
      ],
    });
    const probeOrigin = vi.fn(async () => true);
    const uninstall = installOfflineRouteRecovery(router, {
      isOnline: () => false,
      probeOrigin,
    });

    await expect(router.push('/offline-tool?secret=value')).rejects.toThrow('dynamically imported');
    expect(offlineRouteFailure.value).toEqual({
      displayPath: '/offline-tool',
      fullPath: '/offline-tool?secret=value',
      toolName: 'Offline tool',
    });
    expect(probeOrigin).not.toHaveBeenCalled();

    await router.push('/');
    expect(offlineRouteFailure.value).toBeUndefined();
    uninstall();
  });

  it('uses an origin probe when the network interface claims to be online', async () => {
    const createTestRouter = () => createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', component: { template: '<div>Home</div>' } },
        {
          path: '/lazy-tool',
          component: async () => Promise.reject(new TypeError(knownNetworkErrors[0])),
          meta: { isTool: true, name: 'Lazy tool' },
        },
      ],
    });

    const unavailableRouter = createTestRouter();
    const unavailableProbe = vi.fn(async () => false);
    const uninstallUnavailable = installOfflineRouteRecovery(unavailableRouter, {
      isOnline: () => true,
      probeOrigin: unavailableProbe,
    });
    await expect(unavailableRouter.push('/lazy-tool')).rejects.toThrow('dynamically imported');
    await Promise.resolve();
    expect(offlineRouteFailure.value?.displayPath).toBe('/lazy-tool');
    expect(unavailableProbe).toHaveBeenCalledOnce();
    uninstallUnavailable();

    const reachableRouter = createTestRouter();
    const reachableProbe = vi.fn(async () => true);
    const uninstallReachable = installOfflineRouteRecovery(reachableRouter, {
      isOnline: () => true,
      probeOrigin: reachableProbe,
    });
    await expect(reachableRouter.push('/lazy-tool')).rejects.toThrow('dynamically imported');
    await Promise.resolve();
    expect(reachableProbe).toHaveBeenCalledOnce();
    expect(offlineRouteFailure.value).toBeUndefined();
    uninstallReachable();
  });

  it('does not commit a stale effective-offline probe after successful navigation', async () => {
    let resolveProbe: ((reachable: boolean) => void) | undefined;
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', component: { template: '<div>Home</div>' } },
        { path: '/safe', component: { template: '<div>Safe</div>' } },
        {
          path: '/lazy-tool',
          component: async () => Promise.reject(new TypeError(knownNetworkErrors[0])),
          meta: { isTool: true, name: 'Lazy tool' },
        },
      ],
    });
    const uninstall = installOfflineRouteRecovery(router, {
      isOnline: () => true,
      probeOrigin: () => new Promise((resolve) => {
        resolveProbe = resolve;
      }),
    });

    await expect(router.push('/lazy-tool')).rejects.toThrow('dynamically imported');
    await router.push('/safe');
    resolveProbe?.(false);
    await Promise.resolve();

    expect(offlineRouteFailure.value).toBeUndefined();
    uninstall();
  });
});
