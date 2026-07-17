import type { GlobalThemeOverrides } from 'naive-ui';

const sharedThemeOverrides: GlobalThemeOverrides = {
  Menu: {
    itemHeight: '32px',
  },
  AutoComplete: {
    peers: {
      InternalSelectMenu: { height: '500px' },
    },
  },
};

export const lightThemeOverrides: GlobalThemeOverrides = {
  ...sharedThemeOverrides,
  common: {
    primaryColor: 'rgb(120, 104, 244)',
    primaryColorHover: 'rgb(104, 92, 216)',
    primaryColorPressed: 'rgb(92, 80, 184)',
    primaryColorSuppl: 'rgb(104, 92, 216)',
  },
  Layout: {
    color: '#f7f7fb',
    siderColor: '#ffffff',
  },
};

export const darkThemeOverrides: GlobalThemeOverrides = {
  ...sharedThemeOverrides,
  common: {
    primaryColor: 'rgb(135, 119, 255)',
    primaryColorHover: 'rgb(115, 104, 208)',
    primaryColorPressed: 'rgb(128, 117, 208)',
    primaryColorSuppl: 'rgb(115, 104, 208)',
  },
  Notification: {
    color: '#25242c',
  },
  AutoComplete: {
    peers: {
      InternalSelectMenu: { height: '500px', color: '#25242c' },
    },
  },
  Layout: {
    color: '#1c1b22',
    siderColor: '#25242c',
    siderBorderColor: 'transparent',
  },
  Card: {
    color: '#25242c',
    borderColor: '#393643',
  },
  Table: {
    tdColor: '#25242c',
    thColor: '#34313f',
  },
};
