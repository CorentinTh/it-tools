import type Plausible from 'plausible-tracker';
import { inject } from 'vue';

export { createTrackerService, useTracker };

function createTrackerService({ plausible }: { plausible: ReturnType<typeof Plausible> }) {
  return {
    trackEvent({ eventName }: { eventName: string }) {
      plausible.trackEvent(eventName);
    },
  };
}

function useTracker() {
  const plausible: ReturnType<typeof Plausible> | undefined = inject('plausible');

  if (plausible === undefined) {
    throw new TypeError('Plausible must be instantiated');
  }

  const tracker = createTrackerService({ plausible });

  return {
    tracker,
  };
}
