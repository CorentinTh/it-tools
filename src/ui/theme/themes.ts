import { defineThemes } from './theme.models';

export const { themes: appThemes, useTheme: useAppTheme } = defineThemes({
  light: {
    text: {
      baseColor: 'rgb(51, 54, 57)',
      mutedColor: 'rgba(118, 124, 130)',
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
    success: {
      color: '#18a058',
      colorHover: '#36ad6a',
      colorPressed: '#0c7a43',
      colorFaded: '#18a0582f',
    },
    error: {
      color: '#d03050',
      colorHover: '#de576d',
      colorPressed: '#ab1f3f',
      colorFaded: '#d030502a',
    },
  },
  dark: {
    text: {
      baseColor: 'rgba(255, 255, 255, 0.82)',
      mutedColor: 'rgba(255, 255, 255, 0.5)',
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
    success: {
      color: '#18a058',
      colorHover: '#36ad6a',
      colorPressed: '#0c7a43',
      colorFaded: '#18a0582f',
    },
    error: {
      color: '#e88080',
      colorHover: '#e98b8b',
      colorPressed: '#e57272',
      colorFaded: '#e8808029',
    },
  },
});
