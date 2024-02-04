import { defineThemes } from '../theme/theme.models';
import { appThemes } from '../theme/themes';

export const { useTheme } = defineThemes({
  dark: {
    default: {
      textColor: appThemes.dark.primary.color,

      hover: {
        textColor: appThemes.dark.primary.colorHover,
      },

      pressed: {
        textColor: appThemes.dark.primary.colorPressed,
      },

      outline: {
        color: appThemes.dark.primary.color,
      },
    },
  },
  light: {
    default: {
      textColor: appThemes.light.primary.color,

      hover: {
        textColor: appThemes.light.primary.colorHover,
      },

      pressed: {
        textColor: appThemes.light.primary.colorPressed,
      },

      outline: {
        color: appThemes.light.primary.color,
      },
    },
  },
});
