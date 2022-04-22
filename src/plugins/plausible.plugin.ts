import Plausible, { type PlausibleOptions } from 'plausible-tracker';
import type { App } from 'vue';

const options: PlausibleOptions = {
  domain: import.meta.env.VITE_PLAUSIBLE_DOMAIN,
  apiHost: import.meta.env.VITE_PLAUSIBLE_API_HOST,
  trackLocalhost: false,
};

export const plausible = {
  install: (app: App) => {
    const plausible = Plausible(options);
    plausible.enableAutoPageviews();

    app.config.globalProperties.$plausible = plausible;
  },
};
