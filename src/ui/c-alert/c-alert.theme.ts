import { darken } from '../color/color.models';
import { defineThemes } from '../theme/theme.models';
import { appThemes } from '../theme/themes';

import WarningIcon from '~icons/mdi/alert-circle-outline';
import ErrorIcon from '~icons/mdi/close-circle-outline';

export const { useTheme } = defineThemes({
  dark: {
    warning: {
      backgroundColor: appThemes.dark.warning.colorFaded,
      borderColor: appThemes.dark.warning.color,
      textColor: appThemes.dark.warning.color,
      icon: WarningIcon,
    },
    error: {
      backgroundColor: appThemes.dark.error.colorFaded,
      borderColor: appThemes.dark.error.color,
      textColor: appThemes.dark.error.color,
      icon: ErrorIcon,
    },
  },
  light: {
    warning: {
      backgroundColor: appThemes.light.warning.colorFaded,
      borderColor: appThemes.light.warning.color,
      textColor: darken(appThemes.light.warning.color, 40),
      icon: WarningIcon,
    },
    error: {
      backgroundColor: appThemes.light.error.colorFaded,
      borderColor: appThemes.light.error.color,
      textColor: darken(appThemes.light.error.color, 40),
      icon: ErrorIcon,
    },
  },
});
