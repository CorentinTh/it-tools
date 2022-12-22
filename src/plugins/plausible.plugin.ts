import { config } from '@/config';

import Plausible from 'plausible-tracker';
import type { App } from 'vue';

export const plausible = {
  install: (app: App) => {
    const plausible = Plausible(config.plausible);
    plausible.enableAutoPageviews();

    app.provide('plausible', plausible);
  },
};
