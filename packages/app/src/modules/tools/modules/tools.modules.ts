import { defineNuxtModule, extendPages } from '@nuxt/kit';
import { toolDefinitions } from '../tools.registry';

export default defineNuxtModule({
  meta: {
    name: 'tools',
  },
  setup() {
    extendPages((pages) => {
      pages.push(...toolDefinitions.map((tool) => {
        return {
          path: `/${tool.slug}`,
          file: tool.entryFile,
          meta: {
            toolKey: tool.key,
          },
        };
      }));
    });
  },
});
