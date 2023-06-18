import { defineThemes } from '../theme/theme.models';
import { appThemes } from '../theme/themes';

export const { useTheme } = defineThemes({
  dark: {
    background: appThemes.dark.background,
  },
  light: {
    background: appThemes.light.background,
  },
});
