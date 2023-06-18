import {
  defineConfig,
  presetAttributify,
  presetTypography,
  presetUno,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss';

export default defineConfig({
  presets: [presetUno(), presetAttributify(), presetTypography()],
  transformers: [transformerDirectives(), transformerVariantGroup()],
  theme: {
    colors: {
      primary: '#1ea54c',
    },
  },
});
