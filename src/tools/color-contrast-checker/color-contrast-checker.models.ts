export interface Rgb {
  r: number
  g: number
  b: number
}

export interface ContrastResult {
  ratio: number
  /** WCAG 2.1 levels for normal and large text. */
  aaNormal: boolean
  aaaNormal: boolean
  aaLarge: boolean
  aaaLarge: boolean
  /** WCAG 1.4.11 non-text UI components requirement. */
  uiComponents: boolean
  lighter: Rgb
  darker: Rgb
}

/** Accepts #rgb, #rrggbb, rgb(...) and rgba(...) (alpha ignored for contrast). */
export function parseColor(input: string): Rgb | undefined {
  const value = input.trim().toLowerCase();

  const hex = value.replace(/^#/, '');
  if (/^[0-9a-f]{3}$/.test(hex) || /^[0-9a-f]{6}$/.test(hex)) {
    const full = hex.length === 3 ? hex.split('').map(ch => ch + ch).join('') : hex;
    return {
      r: Number.parseInt(full.slice(0, 2), 16),
      g: Number.parseInt(full.slice(2, 4), 16),
      b: Number.parseInt(full.slice(4, 6), 16),
    };
  }

  const rgbMatch = value.match(/^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})/);
  if (rgbMatch) {
    const [r, g, b] = [Number(rgbMatch[1]), Number(rgbMatch[2]), Number(rgbMatch[3])];
    if (r <= 255 && g <= 255 && b <= 255) {
      return { r, g, b };
    }
  }

  return undefined;
}

/** WCAG 2.1 relative luminance. */
export function relativeLuminance({ r, g, b }: Rgb): number {
  const channel = (component: number): number => {
    const scaled = component / 255;
    return scaled <= 0.03928 ? scaled / 12.92 : ((scaled + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

export function contrastRatio(a: Rgb, b: Rgb): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const ratio = (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
  return Math.round(ratio * 100) / 100;
}

export function checkContrast(foreground: Rgb, background: Rgb): ContrastResult {
  const ratio = contrastRatio(foreground, background);
  const lighter = relativeLuminance(foreground) >= relativeLuminance(background) ? foreground : background;
  const darker = lighter === foreground ? background : foreground;
  return {
    ratio,
    // thresholds from WCAG 2.1 SC 1.4.3 / 1.4.6 / 1.4.11
    aaNormal: ratio >= 4.5,
    aaaNormal: ratio >= 7,
    aaLarge: ratio >= 3,
    aaaLarge: ratio >= 4.5,
    uiComponents: ratio >= 3,
    lighter,
    darker,
  };
}

export function formatRgb({ r, g, b }: Rgb): string {
  return `rgb(${r}, ${g}, ${b})`;
}
