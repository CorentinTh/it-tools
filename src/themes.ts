import type { GlobalThemeOverrides } from 'naive-ui';

export const lightThemeOverrides: GlobalThemeOverrides = {
  Menu: {
    itemHeight: '32px',
  },

  Layout: { color: '#f1f5f9' },
};

export const darkThemeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#1ea54cFF',
    primaryColorHover: '#36AD6AFF',
    primaryColorPressed: '#0C7A43FF',
    primaryColorSuppl: '#36AD6AFF',
  },

  Menu: {
    itemHeight: '32px',
  },

  Layout: {
    color: '#121212',
    siderColor: '#1e1e1e',
    siderBorderColor: 'transparent',
  },

  Card: {
    color: '#1e1e1e',
    borderColor: 'transparent',
  },
};
