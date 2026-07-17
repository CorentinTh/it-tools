import { defineThemes } from '../theme/theme.models';

export const { useTheme } = defineThemes({
  dark: {
    backgroundColor: '#25242c',
    borderColor: '#393643',

    focus: {
      backgroundColor: 'rgba(135, 119, 255, 0.15)',
    },
  },
  light: {
    backgroundColor: '#ffffff',
    borderColor: '#e4e1f1',

    focus: {
      backgroundColor: '#ffffff',
    },
  },
});
