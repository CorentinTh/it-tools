import { defineThemes } from './theme.models';

export const { themes: appThemes, useTheme: useAppTheme } = defineThemes({
  light: {
    text: {
      baseColor: 'rgb(51, 54, 57)',
    },

    primary: {
      color: '#18a058',
      colorHover: '#1ea54c',
      colorPressed: '#0C7A43',
    },

    warning: {
      color: '#f59e0b',
      colorHover: '#f59e0b',
      colorPressed: '#f59e0b',
    },
  },
  dark: {
    text: {
      baseColor: 'rgba(255, 255, 255, 0.82)',
    },

    primary: {
      color: '#1ea54c',
      colorHover: '#36AD6A',
      colorPressed: '#0C7A43',
    },
    warning: {
      color: '#f59e0b',
      colorHover: '#f59e0b',
      colorPressed: '#f59e0b',
    },
  },
});
