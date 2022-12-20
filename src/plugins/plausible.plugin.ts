import { config } from '@/config';
import { createTrackerService } from '@/modules/tracker/tracker.services';
import Plausible from 'plausible-tracker';
import type { App } from 'vue';

export const plausible = {
  install: (app: App) => {
    const plausible = Plausible(config.plausible);
    plausible.enableAutoPageviews();

    app.config.globalProperties.$tracker = createTrackerService({ plausible });
  },
};
