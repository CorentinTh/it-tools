<script setup lang="ts">
import { useOnline } from '@vueuse/core';
import { clearOfflineRouteFailure, offlineRouteFailure, probeAppOrigin } from './offline-route-recovery';

const props = withDefaults(defineProps<{
  navigateDocument?: (href: string) => void
  probeOrigin?: () => Promise<boolean>
}>(), {
  navigateDocument: (href: string) => globalThis.location.assign(href),
  probeOrigin: () => probeAppOrigin(),
});

const router = useRouter();
const isOnline = useOnline();
const isRetrying = ref(false);
const retryError = ref('');

async function retryRoute() {
  const failure = offlineRouteFailure.value;
  if (!failure || !isOnline.value || isRetrying.value) {
    return;
  }

  isRetrying.value = true;
  retryError.value = '';
  try {
    if (!await props.probeOrigin()) {
      retryError.value = 'The application is still unreachable. Check your connection and try again.';
      isRetrying.value = false;
      return;
    }

    if (offlineRouteFailure.value?.fullPath !== failure.fullPath) {
      isRetrying.value = false;
      return;
    }

    // Browsers cache a failed dynamic import for the lifetime of the document.
    // Start a fresh document, but deliberately omit query/hash so an in-memory
    // retry target can never leak tool content into the server access log.
    props.navigateDocument(router.resolve({ path: failure.displayPath }).href);
  }
  catch {
    retryError.value = 'The application is still unreachable. Check your connection and try again.';
    isRetrying.value = false;
  }
}

async function goHome() {
  if (isRetrying.value) {
    return;
  }

  await router.push('/');
  if (router.currentRoute.value.path === '/') {
    clearOfflineRouteFailure();
  }
}
</script>

<template>
  <section
    v-if="offlineRouteFailure"
    data-test-id="offline-route-unavailable"
    role="alert"
    aria-live="assertive"
    my-8
    rounded
    border="1 solid gray-300 dark:gray-700"
    p-6
  >
    <h2 mt-0 text-xl font-semibold>
      This tool is not available offline yet
    </h2>
    <p>
      <code>{{ offlineRouteFailure.displayPath }}</code> has not been cached on this device.
      Reconnect to the network, then try again.
      Query and fragment values are not restored during retry, so private URL content stays out of server logs.
    </p>
    <p v-if="retryError" data-test-id="offline-route-retry-error" role="status">
      {{ retryError }}
    </p>
    <div flex flex-wrap gap-3>
      <c-button
        data-test-id="retry-offline-route"
        :disabled="!isOnline || isRetrying"
        @click="retryRoute"
      >
        {{ isRetrying ? 'Trying again…' : 'Try again' }}
      </c-button>
      <c-button secondary :disabled="isRetrying" @click="goHome">
        Back home
      </c-button>
    </div>
  </section>
</template>
