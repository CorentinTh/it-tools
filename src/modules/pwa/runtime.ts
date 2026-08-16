interface WorkerLike {
  scriptURL: string
}

interface RegistrationLike {
  scope: string
  active: WorkerLike | null
  installing: WorkerLike | null
  waiting: WorkerLike | null
  unregister: () => Promise<boolean>
}

interface ServiceWorkerContainerLike {
  controller: WorkerLike | null
  getRegistrations: () => Promise<readonly RegistrationLike[]>
}

interface CacheStorageLike {
  delete: (cacheName: string) => Promise<boolean>
  keys: () => Promise<string[]>
}

interface SessionStorageLike {
  getItem: (key: string) => string | null
  removeItem: (key: string) => void
  setItem: (key: string, value: string) => void
}

interface ConfigurePwaRuntimeOptions {
  baseUrl: string
  cacheStorage?: CacheStorageLike
  isDevelopment: boolean
  origin: string
  currentRuntimeCacheNames?: readonly string[]
  registerServiceWorker: () => unknown | Promise<unknown>
  reload?: () => void
  serviceWorker?: ServiceWorkerContainerLike
  sessionStorage?: SessionStorageLike
}

export const DEV_PWA_RESET_MARKER = 'it-tools:dev-pwa-reset:v1';
export const IT_TOOLS_CACHE_PREFIXES = [
  'figlet-fonts-',
  'it-tools-lazy-assets-',
  'workbox-precache-',
] as const;

export const IT_TOOLS_RUNTIME_CACHE_PREFIXES = [
  'figlet-fonts-',
  'it-tools-lazy-assets-',
] as const;

function normalizeBaseUrl(baseUrl: string) {
  return baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
}

function getApplicationUrls(origin: string, baseUrl: string) {
  const scope = new URL(normalizeBaseUrl(baseUrl), origin).href;
  const worker = new URL('sw.js', scope).href;

  return { scope, worker };
}

function isApplicationRegistration(
  registration: RegistrationLike,
  applicationScope: string,
  applicationWorker: string,
) {
  if (registration.scope !== applicationScope) {
    return false;
  }

  return [registration.active, registration.installing, registration.waiting]
    .some(worker => worker?.scriptURL === applicationWorker);
}

function isApplicationCache(cacheName: string) {
  return IT_TOOLS_CACHE_PREFIXES.some(prefix => cacheName.startsWith(prefix));
}

export async function clearStaleProductionCaches(
  cacheStorage: CacheStorageLike | undefined,
  currentCacheNames: readonly string[],
) {
  if (!cacheStorage) {
    return { deletedCacheCount: 0 };
  }

  const cacheNames = await cacheStorage.keys().catch(() => []);
  const current = new Set(currentCacheNames);
  const stale = cacheNames.filter(cacheName => (
    IT_TOOLS_RUNTIME_CACHE_PREFIXES.some(prefix => cacheName.startsWith(prefix))
    && !current.has(cacheName)
  ));
  const deleted = await Promise.allSettled(stale.map(cacheName => cacheStorage.delete(cacheName)));

  return {
    deletedCacheCount: deleted.filter(result => result.status === 'fulfilled' && result.value).length,
  };
}

export async function clearDevelopmentPwaState({
  baseUrl,
  cacheStorage,
  origin,
  serviceWorker,
}: Pick<ConfigurePwaRuntimeOptions, 'baseUrl' | 'cacheStorage' | 'origin' | 'serviceWorker'>) {
  const { scope, worker } = getApplicationUrls(origin, baseUrl);
  const [registrations, cacheNames] = await Promise.all([
    serviceWorker?.getRegistrations().catch(() => []) ?? [],
    cacheStorage?.keys().catch(() => []) ?? [],
  ]);
  const applicationRegistrations = registrations.filter(registration => (
    isApplicationRegistration(registration, scope, worker)
  ));
  const applicationCacheNames = cacheNames.filter(isApplicationCache);
  const [unregistered, deleted] = await Promise.all([
    Promise.allSettled(applicationRegistrations.map(registration => registration.unregister())),
    Promise.allSettled(cacheStorage
      ? applicationCacheNames.map(cacheName => cacheStorage.delete(cacheName))
      : []),
  ]);

  return {
    deletedCacheCount: deleted.filter(result => result.status === 'fulfilled' && result.value).length,
    hadController: serviceWorker?.controller?.scriptURL === worker,
    unregisteredCount: unregistered.filter(result => result.status === 'fulfilled' && result.value).length,
  };
}

export async function configurePwaRuntime(options: ConfigurePwaRuntimeOptions) {
  if (!options.isDevelopment) {
    const cleanup = await clearStaleProductionCaches(
      options.cacheStorage,
      options.currentRuntimeCacheNames ?? [],
    );

    try {
      await options.registerServiceWorker();
      return { cleanup, mode: 'production' as const, registration: 'registered' as const };
    }
    catch {
      // Keep the already loaded application usable if a new worker cannot register.
      return { cleanup, mode: 'production' as const, registration: 'failed' as const };
    }
  }

  const cleanup = await clearDevelopmentPwaState(options);

  if (!cleanup.hadController) {
    options.sessionStorage?.removeItem(DEV_PWA_RESET_MARKER);
    return { cleanup, mode: 'development' as const };
  }

  if (!options.reload || !options.sessionStorage) {
    return { cleanup, mode: 'development' as const };
  }

  try {
    if (options.sessionStorage.getItem(DEV_PWA_RESET_MARKER) !== 'pending') {
      options.sessionStorage.setItem(DEV_PWA_RESET_MARKER, 'pending');
      options.reload();
    }
  }
  catch {
    // Storage denial must not prevent the development application from loading.
  }

  return { cleanup, mode: 'development' as const };
}
