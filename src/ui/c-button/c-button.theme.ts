import { defineThemes } from '../theme/theme.models';
import { appThemes } from '../theme/themes';

export const { useTheme } = defineThemes({
  dark: {
    basic: {
      default: {
        textColor: appThemes.dark.text.baseColor,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',

        hover: {
          textColor: appThemes.dark.text.baseColor,
          backgroundColor: 'rgba(255, 255, 255, 0.12)',
        },

        pressed: {
          textColor: appThemes.dark.text.baseColor,
          backgroundColor: 'rgba(255, 255, 255, 0.24)',
        },

        outline: {
          color: appThemes.dark.primary.color,
        },
      },

      primary: {
        textColor: appThemes.dark.text.baseColor,
        backgroundColor: appThemes.dark.primary.color,

        hover: {
          textColor: appThemes.dark.text.baseColor,
          backgroundColor: appThemes.dark.primary.colorHover,
        },

        pressed: {
          textColor: appThemes.dark.text.baseColor,
          backgroundColor: appThemes.dark.primary.colorPressed,
        },

        outline: {
          color: appThemes.dark.primary.color,
        },
      },

      warning: {
        textColor: appThemes.dark.text.baseColor,
        backgroundColor: appThemes.dark.warning.color,

        hover: {
          textColor: appThemes.dark.text.baseColor,
          backgroundColor: appThemes.dark.warning.colorHover,
        },

        pressed: {
          textColor: appThemes.dark.text.baseColor,
          backgroundColor: appThemes.dark.warning.colorPressed,
        },

        outline: {
          color: appThemes.dark.warning.color,
        },
      },
    },

    text: {
      default: {
        textColor: appThemes.dark.text.baseColor,
        backgroundColor: 'transparent',

        hover: {
          textColor: appThemes.dark.text.baseColor,
          backgroundColor: 'rgba(255, 255, 255, 0.12)',
        },

        pressed: {
          textColor: appThemes.dark.text.baseColor,
          backgroundColor: 'rgba(255, 255, 255, 0.82)',
        },

        outline: {
          color: appThemes.dark.primary.color,
        },
      },

      primary: {
        textColor: appThemes.dark.text.baseColor,
        backgroundColor: appThemes.dark.primary.color,

        hover: {
          textColor: appThemes.dark.text.baseColor,
          backgroundColor: appThemes.dark.primary.colorHover,
        },

        pressed: {
          textColor: appThemes.dark.text.baseColor,
          backgroundColor: appThemes.dark.primary.colorPressed,
        },

        outline: {
          color: appThemes.dark.primary.color,
        },
      },

      warning: {
        textColor: appThemes.dark.text.baseColor,
        backgroundColor: appThemes.dark.warning.color,

        hover: {
          textColor: appThemes.dark.text.baseColor,
          backgroundColor: appThemes.dark.warning.colorHover,
        },

        pressed: {
          textColor: appThemes.dark.text.baseColor,
          backgroundColor: appThemes.dark.warning.colorPressed,
        },

        outline: {
          color: appThemes.dark.warning.color,
        },
      },
    },
  },
  light: {
    basic: {
      default: {
        textColor: appThemes.light.text.baseColor,
        backgroundColor: 'rgba(46, 51, 56, 0.05)',

        hover: {
          textColor: appThemes.light.text.baseColor,
          backgroundColor: 'rgba(46, 51, 56, 0.09)',
        },

        pressed: {
          textColor: appThemes.light.text.baseColor,
          backgroundColor: 'rgba(46, 51, 56, 0.22)',
        },

        outline: {
          color: appThemes.light.primary.color,
        },
      },

      primary: {
        textColor: appThemes.dark.text.baseColor,
        backgroundColor: appThemes.light.primary.color,

        hover: {
          textColor: appThemes.dark.text.baseColor,
          backgroundColor: appThemes.light.primary.colorHover,
        },

        pressed: {
          textColor: appThemes.dark.text.baseColor,
          backgroundColor: appThemes.light.primary.colorPressed,
        },

        outline: {
          color: appThemes.light.primary.color,
        },
      },

      warning: {
        textColor: appThemes.dark.text.baseColor,
        backgroundColor: appThemes.light.warning.color,

        hover: {
          textColor: appThemes.dark.text.baseColor,
          backgroundColor: appThemes.light.warning.colorHover,
        },

        pressed: {
          textColor: appThemes.dark.text.baseColor,
          backgroundColor: appThemes.light.warning.colorPressed,
        },

        outline: {
          color: appThemes.light.warning.color,
        },
      },
    },
    text: {
      default: {
        textColor: appThemes.light.text.baseColor,
        backgroundColor: 'transparent',

        hover: {
          textColor: appThemes.light.text.baseColor,
          backgroundColor: 'rgba(46, 51, 56, 0.09)',
        },

        pressed: {
          textColor: appThemes.light.text.baseColor,
          backgroundColor: 'rgba(46, 51, 56, 0.13)',
        },

        outline: {
          color: appThemes.light.primary.color,
        },
      },
      primary: {
        textColor: appThemes.light.primary.color,
        backgroundColor: 'transparent',

        hover: {
          textColor: appThemes.light.primary.colorHover,
          backgroundColor: 'rgba(46, 51, 56, 0.09)',
        },

        pressed: {
          textColor: appThemes.light.primary.colorPressed,
          backgroundColor: 'rgba(46, 51, 56, 0.13)',
        },

        outline: {
          color: appThemes.light.primary.color,
        },
      },
      warning: {
        textColor: appThemes.light.warning.color,
        backgroundColor: 'transparent',

        hover: {
          textColor: appThemes.light.warning.colorHover,
          backgroundColor: 'rgba(46, 51, 56, 0.09)',
        },

        pressed: {
          textColor: appThemes.light.warning.colorPressed,
          backgroundColor: 'rgba(46, 51, 56, 0.13)',
        },

        outline: {
          color: appThemes.light.warning.color,
        },
      },
    },
  },
});
