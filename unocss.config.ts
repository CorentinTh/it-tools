import {
  defineConfig,
  presetAttributify,
  presetTypography,
  presetUno,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss';

import { presetScrollbar } from 'unocss-preset-scrollbar';

const nativeAttributeNames = [
  // Keep UnoCSS's default Attributify exclusions when adding native HTML
  // attributes that happen to share a utility name.
  'placeholder',
  'fill',
  'opacity',
  'stroke-opacity',
  'size',
];

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify({ ignoreAttributes: nativeAttributeNames }),
    presetTypography(),
    presetScrollbar(),
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
  theme: {
    colors: {
      primary: '#7868f4',
    },
  },
  shortcuts: {
    'pretty-scrollbar': 'scrollbar scrollbar-rounded scrollbar-thumb-color-gray-300 scrollbar-track-color-gray-100 dark:scrollbar-thumb-color-#424242 dark:scrollbar-track-color-#686868',
    'divider': 'h-1px bg-current op-10',
    'bg-surface': 'bg-#ffffff dark:bg-#25242c',
    'bg-background': 'bg-#f7f7fb dark:bg-#1c1b22',
  },
});
