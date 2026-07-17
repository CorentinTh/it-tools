import { defineThemes } from '../theme/theme.models';

export const { useTheme } = defineThemes({
  dark: {
    backgroundColor: '#25242c',
    borderColor: '#393643',
  },
  light: {
    backgroundColor: '#ffffff',
    borderColor: '#e4e1f1',
  },
});
