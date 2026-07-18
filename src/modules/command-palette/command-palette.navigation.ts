import type { PaletteOption } from './command-palette.types';

export function clampPaletteOptionIndex(index: number, optionCount: number) {
  if (optionCount <= 0) {
    return 0;
  }

  return Math.min(Math.max(index, 0), optionCount - 1);
}

export function activateSelectedPaletteOption(
  options: readonly PaletteOption[],
  selectedIndex: number,
  activate: (option: PaletteOption) => void,
) {
  const option = options[selectedIndex];

  if (!option) {
    return false;
  }

  activate(option);
  return true;
}
