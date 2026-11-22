import type { GlobalThemeOverrides } from 'naive-ui';

export const lightThemeOverrides: GlobalThemeOverrides = {
  Menu: {
    itemHeight: '32px',
  },

  Layout: { color: '#f1f5f9' },

  AutoComplete: {
    peers: {
      InternalSelectMenu: { height: '500px' },
    },
  },
};

export const darkThemeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#46f0b4',
    primaryColorHover: '#78f6c9',
    primaryColorPressed: '#28c990',
    primaryColorSuppl: '#46f0b4',
    bodyColor: '#0b1014',
    cardColor: '#0f181d',
    modalColor: '#111c21',
    popoverColor: '#111c21',
    textColorBase: '#eafff8',
  },

  Notification: {
    color: '#111c21',
  },

  AutoComplete: {
    peers: {
      InternalSelectMenu: { height: '500px', color: '#111c21' },
    },
  },

  Menu: {
    itemHeight: '32px',
  },

  Layout: {
    color: '#0b1014',
    siderColor: '#0e161b',
    siderBorderColor: '#203036',
  },

  Card: {
    color: '#0f181d',
    borderColor: '#24363b',
  },

  Table: {
    tdColor: '#232323',
    thColor: '#353535',
  },
};
