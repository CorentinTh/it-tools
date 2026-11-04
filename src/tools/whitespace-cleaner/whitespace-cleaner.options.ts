import type { CleanerOptions } from './whitespace-cleaner.service';

export interface OptionDefinition {
  key: keyof CleanerOptions
  label: string
  hint: string
  defaultValue: boolean
}

// The chips appear in this order. The cleaner core runs its steps in its own fixed order.
export const OPTION_DEFINITIONS: readonly OptionDefinition[] = [
  { key: 'stripLineNumbers', label: 'Line numbers', hint: 'Strip 1│, 2│, 1\\t prefixes', defaultValue: true },
  { key: 'removeAnsi', label: 'ANSI codes', hint: 'Strip color escape sequences', defaultValue: true },
  { key: 'stripBoxDrawing', label: 'Box drawing', hint: 'Remove ─ │ └ ┐ characters', defaultValue: true },
  { key: 'stripBulletMarkers', label: 'Bullet markers', hint: 'Strip ●, ○, ⏺ prefixes', defaultValue: true },
  { key: 'trimTrailing', label: 'Trailing space', hint: 'Remove end-of-line whitespace', defaultValue: true },
  { key: 'collapseBlankLines', label: 'Blank lines', hint: 'Collapse 2+ blank lines into 1', defaultValue: true },
  { key: 'normalizeIndent', label: 'Indent', hint: 'Remove common leading indent', defaultValue: true },
  { key: 'removeDiffMarkers', label: 'Diff markers', hint: 'Strip + - @@ from patches', defaultValue: false },
  { key: 'smartUnwrap', label: 'Smart unwrap', hint: 'Join soft-wrapped paragraphs', defaultValue: false },
  { key: 'markdownMode', label: 'Markdown / Reddit', hint: 'Left-trim lines and rejoin paragraphs for Reddit, Discord, Slack', defaultValue: false },
  { key: 'unifyLineEndings', label: 'LF endings', hint: 'Convert CRLF → LF', defaultValue: true },
];

export const OPTIONS_STORAGE_KEY = 'whitespace-cleaner.options.v1';

export function getDefaultOptions(): CleanerOptions {
  return Object.fromEntries(OPTION_DEFINITIONS.map(({ key, defaultValue }) => [key, defaultValue])) as unknown as CleanerOptions;
}

// Merges the saved options over the defaults.
// Unknown keys and non-boolean values are ignored. Missing keys keep their default.
export function loadOptions(storage: Pick<Storage, 'getItem'> | undefined): CleanerOptions {
  const options = getDefaultOptions();

  try {
    const raw = storage?.getItem(OPTIONS_STORAGE_KEY);
    if (!raw) {
      return options;
    }

    const saved: unknown = JSON.parse(raw);
    if (typeof saved !== 'object' || saved === null || Array.isArray(saved)) {
      return options;
    }

    for (const { key } of OPTION_DEFINITIONS) {
      const value = (saved as Record<string, unknown>)[key];
      if (typeof value === 'boolean') {
        options[key] = value;
      }
    }

    return options;
  }
  catch {
    return getDefaultOptions();
  }
}

export function saveOptions(storage: Pick<Storage, 'setItem'> | undefined, options: CleanerOptions): void {
  try {
    storage?.setItem(OPTIONS_STORAGE_KEY, JSON.stringify(options));
  }
  catch {
    // A failed write only loses the saved options. The cleaner keeps working.
  }
}

// Reading `window.localStorage` throws when the browser blocks site data.
export function getBrowserStorage(): Storage | undefined {
  try {
    return window.localStorage;
  }
  catch {
    return undefined;
  }
}
