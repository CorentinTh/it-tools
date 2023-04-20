import { defineThemes } from '../theme/theme.models';

export const { useTheme } = defineThemes({
  dark: {
    backgroundColor: '#232323',
    borderColor: '#282828',
  },
  light: {
    backgroundColor: '#ffffff',
    borderColor: '#efeff5',
  },
});
