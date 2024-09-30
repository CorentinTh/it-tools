import type { ConfigColorMode } from '@kobalte/core/color-mode';
import { useColorMode } from '@kobalte/core/color-mode';

export function useThemeStore() {
  const { setColorMode, colorMode: getColorMode } = useColorMode();

  return {
    setColorMode: ({ mode }: { mode: ConfigColorMode }) => setColorMode(mode),
    getColorMode,
  };
}
