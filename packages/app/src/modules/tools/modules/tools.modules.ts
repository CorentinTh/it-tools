import { defineNuxtModule, extendPages } from '@nuxt/kit';
import { toolDefinitions } from '../tools.registry';

export default defineNuxtModule({
  meta: {
    name: 'tools',
  },
  setup(options, nuxt) {
    nuxt.hook('pages:extend', (pages) => {
      pages.push(...toolDefinitions.map((tool) => {
        return {
          path: `/${tool.slug}`,
          file: tool.entryFile,
          name: tool.slug,
          meta: {
            toolKey: tool.key,
          },
        };
      }));
    });
  },
});
