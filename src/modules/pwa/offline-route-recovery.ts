import { shallowRef } from 'vue';
import type { RouteLocationNormalized, Router } from 'vue-router';

export interface OfflineRouteFailure {
  displayPath: string
  fullPath: string
  toolName?: string
}

export interface OfflineRouteErrorContext {
  hasLazyComponent: boolean
  isTool: boolean
}

export interface OfflineRouteRecoveryOptions {
  isOnline?: () => boolean
  probeOrigin?: () => Promise<boolean>
}

const OFFLINE_MODULE_ERROR_PATTERNS = [
  /failed to fetch dynamically imported module/i,
  /error loading dynamically imported module/i,
  /importing a module script failed/i,
  /failed to load module script/i,
  /unable to preload css/i,
];

export const offlineRouteFailure = shallowRef<OfflineRouteFailure>();

const ORIGIN_PROBE_TIMEOUT_MS = 1_500;
let originProbeId = 0;

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return typeof error === 'string' ? error : '';
}

export function isLazyToolLoadCandidate(error: unknown, context: OfflineRouteErrorContext): boolean {
  if (!context.isTool || !context.hasLazyComponent) {
    return false;
  }

  const message = getErrorMessage(error);
  return OFFLINE_MODULE_ERROR_PATTERNS.some(pattern => pattern.test(message));
}

export async function probeAppOrigin(
  fetcher: typeof fetch = globalThis.fetch,
  timeoutMs = ORIGIN_PROBE_TIMEOUT_MS,
): Promise<boolean> {
  const controller = new AbortController();
  const timeout = globalThis.setTimeout(() => controller.abort(), timeoutMs);
  originProbeId = originProbeId === Number.MAX_SAFE_INTEGER ? 1 : originProbeId + 1;

  try {
    await fetcher(`/healthz?probe=${originProbeId}`, {
      cache: 'no-store',
      credentials: 'same-origin',
      signal: controller.signal,
    });
    return true;
  }
  catch {
    return false;
  }
  finally {
    globalThis.clearTimeout(timeout);
  }
}

export function toOfflineRouteFailure(
  target: Pick<RouteLocationNormalized, 'fullPath' | 'meta' | 'path'>,
): OfflineRouteFailure {
  return {
    displayPath: target.path,
    fullPath: target.fullPath,
    toolName: typeof target.meta.name === 'string' ? target.meta.name : undefined,
  };
}

function hasLazyComponent(target: RouteLocationNormalized): boolean {
  return target.matched.some(record => Object.values(record.components ?? {})
    .some(component => typeof component === 'function'));
}

export function clearOfflineRouteFailure(): void {
  offlineRouteFailure.value = undefined;
}

export function installOfflineRouteRecovery(
  router: Router,
  {
    isOnline = () => navigator.onLine,
    probeOrigin = () => probeAppOrigin(),
  }: OfflineRouteRecoveryOptions = {},
): () => void {
  let recoveryRevision = 0;

  const removeErrorHandler = router.onError((error, target) => {
    const revision = ++recoveryRevision;
    if (!isLazyToolLoadCandidate(error, {
      hasLazyComponent: hasLazyComponent(target),
      isTool: target.meta.isTool === true,
    })) {
      return;
    }

    if (!isOnline()) {
      offlineRouteFailure.value = toOfflineRouteFailure(target);
      return;
    }

    void probeOrigin().then((originIsReachable) => {
      if (revision !== recoveryRevision) {
        return;
      }

      if (originIsReachable) {
        if (offlineRouteFailure.value?.fullPath === target.fullPath) {
          clearOfflineRouteFailure();
        }
        return;
      }

      offlineRouteFailure.value = toOfflineRouteFailure(target);
    });
  });
  const removeAfterEach = router.afterEach((_target, _source, failure) => {
    if (!failure) {
      recoveryRevision += 1;
      clearOfflineRouteFailure();
    }
  });

  return () => {
    recoveryRevision += 1;
    removeErrorHandler();
    removeAfterEach();
    clearOfflineRouteFailure();
  };
}
