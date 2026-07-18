import { describe, expect, it, vi } from 'vitest';
import {
  activateSelectedPaletteOption,
  clampPaletteOptionIndex,
} from './command-palette.navigation';
import type { PaletteOption } from './command-palette.types';

const options: PaletteOption[] = [
  { name: 'First', category: 'Tools' },
  { name: 'Second', category: 'Tools' },
];

describe('command palette keyboard navigation', () => {
  it('keeps the selected index inside the current result list', () => {
    expect(clampPaletteOptionIndex(-1, options.length)).toBe(0);
    expect(clampPaletteOptionIndex(1, options.length)).toBe(1);
    expect(clampPaletteOptionIndex(10, options.length)).toBe(1);
    expect(clampPaletteOptionIndex(10, 0)).toBe(0);
  });

  it('does not activate anything when the result list is empty', () => {
    const activate = vi.fn();

    expect(activateSelectedPaletteOption([], 0, activate)).toBe(false);
    expect(activate).not.toHaveBeenCalled();
  });

  it('does not activate a stale selection after the result list shrinks', () => {
    const activate = vi.fn();

    expect(activateSelectedPaletteOption(options.slice(0, 1), 1, activate)).toBe(false);
    expect(activate).not.toHaveBeenCalled();
  });

  it('activates the selected option when it exists', () => {
    const activate = vi.fn();

    expect(activateSelectedPaletteOption(options, 1, activate)).toBe(true);
    expect(activate).toHaveBeenCalledWith(options[1]);
  });
});
