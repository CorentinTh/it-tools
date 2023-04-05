import { config } from '@/config';
import { noop } from 'lodash';

import Plausible from 'plausible-tracker';
import type { App } from 'vue';

function createFakePlausibleInstance(): Pick<ReturnType<typeof Plausible>, 'trackEvent' | 'enableAutoPageviews'> {
  return {
    trackEvent: noop,
    enableAutoPageviews: () => noop,
  };
}

function createPlausibleInstance({
  config,
}: {
  config: {
    isTrackerEnabled: boolean;
    domain: string;
    apiHost: string;
    trackLocalhost: boolean;
  };
}) {
  if (config.isTrackerEnabled) {
    return Plausible(config);
  }

  return createFakePlausibleInstance();
}

export const plausible = {
  install: (app: App) => {
    const plausible = createPlausibleInstance({ config: config.plausible });
    plausible.enableAutoPageviews();

    app.provide('plausible', plausible);
  },
};
