import type Plausible from 'plausible-tracker';

export { createTrackerService };

function createTrackerService({ plausible }: { plausible: ReturnType<typeof Plausible> }) {
  return {
    trackEvent({ eventName }: { eventName: string }) {
      plausible.trackEvent(eventName);
    },
  };
}
