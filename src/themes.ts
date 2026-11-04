import type { GlobalThemeOverrides } from 'naive-ui';

export const lightThemeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#E95420FF',
    primaryColorHover: '#EC6E41FF',
    primaryColorPressed: '#C34113FF',
    primaryColorSuppl: '#EC6E41FF',
  },

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
    primaryColor: '#E95420FF',
    primaryColorHover: '#EC6E41FF',
    primaryColorPressed: '#C34113FF',
    primaryColorSuppl: '#EC6E41FF',
  },

  Notification: {
    color: '#333333',
  },

  AutoComplete: {
    peers: {
      InternalSelectMenu: { height: '500px', color: '#1e1e1e' },
    },
  },

  Menu: {
    itemHeight: '32px',
  },

  Layout: {
    color: '#1c1c1c',
    siderColor: '#232323',
    siderBorderColor: 'transparent',
  },

  Card: {
    color: '#232323',
    borderColor: '#282828',
  },

  Table: {
    tdColor: '#232323',
    thColor: '#353535',
  },
};
