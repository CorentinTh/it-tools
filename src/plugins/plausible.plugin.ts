import Plausible from 'plausible-tracker';
import type { App } from 'vue';
import { config } from '@/config';
import router from '@/router';

type PlausibleClient = Pick<ReturnType<typeof Plausible>, 'trackEvent' | 'enableAutoPageviews'>;

function createFakePlausibleInstance(): PlausibleClient {
  const noop = () => undefined;
  return {
    trackEvent: noop,
    enableAutoPageviews: () => noop,
  };
}

export function sanitizeAnalyticsUrl(value: string): string | null {
  if (!value) {
    return null;
  }

  try {
    const url = new URL(value, window.location.origin);
    return `${url.origin}${url.pathname}`;
  }
  catch {
    return null;
  }
}

function getPrivacySafeEventData() {
  return {
    url: sanitizeAnalyticsUrl(window.location.href) ?? `${window.location.origin}${window.location.pathname}`,
    referrer: sanitizeAnalyticsUrl(document.referrer),
  };
}

export function createPlausibleInstance({
  config,
}: {
  config: {
    isTrackerEnabled: boolean
    domain: string
    apiHost: string
    trackLocalhost: boolean
  }
}) {
  if (!config.isTrackerEnabled) {
    return createFakePlausibleInstance();
  }

  const tracker = Plausible(config);
  const trackEvent: PlausibleClient['trackEvent'] = (eventName, options, eventData) => {
    tracker.trackEvent(eventName, options, {
      ...eventData,
      ...getPrivacySafeEventData(),
    });
  };

  return {
    trackEvent,
    enableAutoPageviews: () => {
      const trackPageview = () => tracker.trackPageview(getPrivacySafeEventData());
      const removeRouteHook = router.afterEach(trackPageview);
      trackPageview();
      return removeRouteHook;
    },
  };
}

export const plausible = {
  install: (app: App) => {
    const plausible = createPlausibleInstance({ config: config.plausible });
    plausible.enableAutoPageviews();

    app.provide('plausible', plausible);
  },
};
