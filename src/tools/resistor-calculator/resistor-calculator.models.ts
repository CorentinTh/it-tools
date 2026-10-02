export interface ResistorBandColor {
  /** CSS color used for the resistor graphic. */
  color: string
  /** Human readable color name. */
  label: string
}

export const DIGIT_COLORS: (ResistorBandColor & { digit: number })[] = [
  { label: 'Black', color: '#000000', digit: 0 },
  { label: 'Brown', color: '#8B4513', digit: 1 },
  { label: 'Red', color: '#E53935', digit: 2 },
  { label: 'Orange', color: '#FB8C00', digit: 3 },
  { label: 'Yellow', color: '#FDD835', digit: 4 },
  { label: 'Green', color: '#43A047', digit: 5 },
  { label: 'Blue', color: '#1E88E5', digit: 6 },
  { label: 'Violet', color: '#8E24AA', digit: 7 },
  { label: 'Grey', color: '#9E9E9E', digit: 8 },
  { label: 'White', color: '#FFFFFF', digit: 9 },
];

export interface MultiplierBand {
  label: string
  color: string
  multiplier: number
  /** Display suffix of the multiplier, e.g. '× 1 kΩ'. */
  display: string
}

export const MULTIPLIER_BANDS: MultiplierBand[] = [
  { label: 'Black', color: '#000000', multiplier: 1, display: '× 1 Ω' },
  { label: 'Brown', color: '#8B4513', multiplier: 10, display: '× 10 Ω' },
  { label: 'Red', color: '#E53935', multiplier: 100, display: '× 100 Ω' },
  { label: 'Orange', color: '#FB8C00', multiplier: 1e3, display: '× 1 kΩ' },
  { label: 'Yellow', color: '#FDD835', multiplier: 1e4, display: '× 10 kΩ' },
  { label: 'Green', color: '#43A047', multiplier: 1e5, display: '× 100 kΩ' },
  { label: 'Blue', color: '#1E88E5', multiplier: 1e6, display: '× 1 MΩ' },
  { label: 'Violet', color: '#8E24AA', multiplier: 1e7, display: '× 10 MΩ' },
  { label: 'Grey', color: '#9E9E9E', multiplier: 1e8, display: '× 100 MΩ' },
  { label: 'White', color: '#FFFFFF', multiplier: 1e9, display: '× 1 GΩ' },
  { label: 'Gold', color: '#C9A227', multiplier: 0.1, display: '× 0.1 Ω' },
  { label: 'Silver', color: '#C0C0C0', multiplier: 0.01, display: '× 0.01 Ω' },
];

export interface ToleranceBand {
  label: string
  color: string
  tolerance: number
}

export const TOLERANCE_BANDS: ToleranceBand[] = [
  { label: 'Brown', color: '#8B4513', tolerance: 1 },
  { label: 'Red', color: '#E53935', tolerance: 2 },
  { label: 'Green', color: '#43A047', tolerance: 0.5 },
  { label: 'Blue', color: '#1E88E5', tolerance: 0.25 },
  { label: 'Violet', color: '#8E24AA', tolerance: 0.1 },
  { label: 'Grey', color: '#9E9E9E', tolerance: 0.05 },
  { label: 'Gold', color: '#C9A227', tolerance: 5 },
  { label: 'Silver', color: '#C0C0C0', tolerance: 10 },
  { label: 'None (20%)', color: 'transparent', tolerance: 20 },
];

function formatOhms(value: number): string {
  const units: [number, string][] = [
    [1e9, 'GΩ'],
    [1e6, 'MΩ'],
    [1e3, 'kΩ'],
    [1, 'Ω'],
  ];
  for (const [factor, suffix] of units) {
    if (value >= factor) {
      const scaled = value / factor;
      const rounded = scaled >= 100 ? Math.round(scaled) : Number(scaled.toPrecision(3));
      return `${rounded} ${suffix}`;
    }
  }
  return `${Number(value.toPrecision(3))} Ω`;
}

export interface DecodeOptions {
  bandCount: 4 | 5
  /** Digit band colors in order (2 for 4-band, 3 for 5-band). */
  digits: string[]
  multiplier: string
  tolerance: string
}

export interface DecodedResistor {
  ohms: number
  formatted: string
  tolerance: number
  bandColors: string[]
}

function colorByLabel<T extends { label: string }>(list: T[], label: string): T {
  const found = list.find(item => item.label === label);
  if (!found) {
    throw new Error(`Unknown band color: ${label}`);
  }
  return found;
}

export function decodeResistor({ bandCount, digits, multiplier, tolerance }: DecodeOptions): DecodedResistor {
  const digitCount = bandCount - 2;
  if (digits.length !== digitCount) {
    throw new Error(`${bandCount}-band resistor needs ${digitCount} digit bands`);
  }

  const digitValues = digits.map(label => colorByLabel(DIGIT_COLORS, label).digit);
  const multiplierBand = colorByLabel(MULTIPLIER_BANDS, multiplier);
  const toleranceBand = colorByLabel(TOLERANCE_BANDS, tolerance);

  const significant = digitValues.reduce((acc, digit) => acc * 10 + digit, 0);
  const ohms = significant * multiplierBand.multiplier;

  const bandColors = bandCount === 4
    ? [digits[0], digits[1], multiplierBand.label, toleranceBand.label]
    : [digits[0], digits[1], digits[2], multiplierBand.label, toleranceBand.label];

  return {
    ohms,
    formatted: formatOhms(ohms),
    tolerance: toleranceBand.tolerance,
    bandColors,
  };
}
