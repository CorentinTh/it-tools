import { darken, lighten } from '../color/color.models';
import { defineThemes } from '../theme/theme.models';
import { appThemes } from '../theme/themes';

const createState = ({
  textColor,
  backgroundColor,
  hoverBackground,
  hoveredTextColor = textColor,
  pressedBackground,
  pressedTextColor = textColor,
}: {
  textColor: string;
  backgroundColor: string;
  hoverBackground: string;
  hoveredTextColor?: string;
  pressedBackground: string;
  pressedTextColor?: string;
}) => ({
  textColor,
  backgroundColor,
  hover: { textColor: hoveredTextColor, backgroundColor: hoverBackground },
  pressed: { textColor: pressedTextColor, backgroundColor: pressedBackground },
});

const createTheme = ({ style }: { style: 'light' | 'dark' }) => {
  const theme = appThemes[style];

  return {
    basic: {
      default: createState({
        textColor: theme.text.baseColor,
        backgroundColor: theme.default.color,
        hoverBackground: theme.default.colorHover,
        pressedBackground: theme.default.colorPressed,
      }),
      primary: createState({
        textColor: theme.primary.color,
        backgroundColor: theme.primary.colorFaded,
        hoverBackground: lighten(theme.primary.colorFaded, 30),
        pressedBackground: darken(theme.primary.colorFaded, 30),
      }),
      warning: createState({
        textColor: theme.text.baseColor,
        backgroundColor: theme.warning.color,
        hoverBackground: theme.warning.colorHover,
        pressedBackground: theme.warning.colorPressed,
      }),
    },
    text: {
      default: createState({
        textColor: theme.text.baseColor,
        backgroundColor: 'transparent',
        hoverBackground: theme.default.colorHover,
        pressedBackground: theme.default.colorPressed,
      }),
      primary: createState({
        textColor: theme.primary.color,
        backgroundColor: 'transparent',
        hoverBackground: theme.primary.colorFaded,
        pressedBackground: darken(theme.primary.colorFaded, 30),
      }),
      warning: createState({
        textColor: theme.text.baseColor,
        backgroundColor: theme.warning.color,
        hoverBackground: theme.warning.colorHover,
        pressedBackground: theme.warning.colorPressed,
      }),
    },
  };
};

export const { useTheme } = defineThemes({
  dark: createTheme({ style: 'dark' }),
  light: createTheme({ style: 'light' }),
});
