import { IconAlertCircle, IconCircleX } from '@tabler/icons-vue';
import { darken } from '../color/color.models';
import { defineThemes } from '../theme/theme.models';
import { appThemes } from '../theme/themes';

export const { useTheme } = defineThemes({
  dark: {
    warning: {
      backgroundColor: appThemes.dark.warning.colorFaded,
      borderColor: appThemes.dark.warning.color,
      textColor: appThemes.dark.warning.color,
      icon: IconAlertCircle,
    },
    error: {
      backgroundColor: appThemes.dark.error.colorFaded,
      borderColor: appThemes.dark.error.color,
      textColor: appThemes.dark.error.color,
      icon: IconCircleX,
    },
  },
  light: {
    warning: {
      backgroundColor: appThemes.light.warning.colorFaded,
      borderColor: appThemes.light.warning.color,
      textColor: darken(appThemes.light.warning.color, 40),
      icon: IconAlertCircle,
    },
    error: {
      backgroundColor: appThemes.light.error.colorFaded,
      borderColor: appThemes.light.error.color,
      textColor: darken(appThemes.light.error.color, 40),
      icon: IconCircleX,
    },
  },
});
