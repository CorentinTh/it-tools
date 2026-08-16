import { type Colord, colord } from 'colord';
import { withDefaultOnError } from '@/utils/defaults';
import { useValidation } from '@/composable/validation';

export { removeAlphaChannelWhenOpaque, buildColorFormat, parseOklch, formatOklch, srgbToOklch, oklchToSrgb, mapOklchToSrgb };

export interface OklchColor { l: number; c: number; h: number; alpha: number }

function srgbTransfer(value: number) {
  const normalized = value / 255;
  return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
}

function inverseSrgbTransfer(value: number) {
  const encoded = value <= 0.0031308 ? 12.92 * value : 1.055 * value ** (1 / 2.4) - 0.055;
  return encoded * 255;
}

function srgbToOklch({ r, g, b, alpha = 1 }: { r: number; g: number; b: number; alpha?: number }): OklchColor {
  const red = srgbTransfer(r);
  const green = srgbTransfer(g);
  const blue = srgbTransfer(b);
  const l = Math.cbrt(0.4122214708 * red + 0.5363325363 * green + 0.0514459929 * blue);
  const m = Math.cbrt(0.2119034982 * red + 0.6806995451 * green + 0.1073969566 * blue);
  const s = Math.cbrt(0.0883024619 * red + 0.2817188376 * green + 0.6299787005 * blue);
  const lightness = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const bAxis = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  const hue = (Math.atan2(bAxis, a) * 180 / Math.PI + 360) % 360;
  return { l: lightness, c: Math.hypot(a, bAxis), h: hue, alpha };
}

function oklchToSrgb({ l, c, h, alpha }: OklchColor) {
  const radians = h * Math.PI / 180;
  const a = c * Math.cos(radians);
  const b = c * Math.sin(radians);
  const lRoot = l + 0.3963377774 * a + 0.2158037573 * b;
  const mRoot = l - 0.1055613458 * a - 0.0638541728 * b;
  const sRoot = l - 0.0894841775 * a - 1.291485548 * b;
  const lCube = lRoot ** 3;
  const mCube = mRoot ** 3;
  const sCube = sRoot ** 3;
  const red = inverseSrgbTransfer(+4.0767416621 * lCube - 3.3077115913 * mCube + 0.2309699292 * sCube);
  const green = inverseSrgbTransfer(-1.2684380046 * lCube + 2.6097574011 * mCube - 0.3413193965 * sCube);
  const blue = inverseSrgbTransfer(-0.0041960863 * lCube - 0.7034186147 * mCube + 1.707614701 * sCube);
  const inGamut = [red, green, blue].every(value => value >= -0.0001 && value <= 255.0001);
  return { r: red, g: green, b: blue, alpha, inGamut };
}

function mapOklchToSrgb(color: OklchColor) {
  if (color.l <= 0) {
    return { color: { ...color, l: 0, c: 0 }, rgb: { r: 0, g: 0, b: 0, alpha: color.alpha, inGamut: true } };
  }
  if (color.l >= 1) {
    return { color: { ...color, l: 1, c: 0 }, rgb: { r: 255, g: 255, b: 255, alpha: color.alpha, inGamut: true } };
  }
  const direct = oklchToSrgb(color);
  if (direct.inGamut) {
    return { color, rgb: direct };
  }
  let low = 0;
  let high = color.c;
  for (let index = 0; index < 24; index += 1) {
    const candidate = { ...color, c: (low + high) / 2 };
    if (oklchToSrgb(candidate).inGamut) {
      low = candidate.c;
    }
    else {
      high = candidate.c;
    }
  }
  const mapped = { ...color, c: low };
  return { color: mapped, rgb: oklchToSrgb(mapped) };
}

function parseOklch(value: string): OklchColor {
  const match = value.trim().match(/^oklch\(\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+))(%?)\s+([+-]?(?:\d+(?:\.\d+)?|\.\d+))\s+([+-]?(?:\d+(?:\.\d+)?|\.\d+))(?:deg)?(?:\s*\/\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+))(%?))?\s*\)$/iu);
  if (!match) {
    throw new TypeError('Use CSS oklch(L C H / alpha) syntax.');
  }
  const lightness = Number(match[1]) / (match[2] ? 100 : 1);
  const chroma = Number(match[3]);
  const hue = Number(match[4]);
  const alpha = match[5] === undefined ? 1 : Number(match[5]) / (match[6] ? 100 : 1);
  if (![lightness, chroma, hue, alpha].every(Number.isFinite) || lightness < 0 || lightness > 1 || chroma < 0 || alpha < 0 || alpha > 1) {
    throw new RangeError('OKLCH requires L 0–1 (or 0%–100%), non-negative C, finite H, and alpha 0–1.');
  }
  return { l: lightness, c: chroma, h: ((hue % 360) + 360) % 360, alpha };
}

function formatOklch(color: OklchColor) {
  const base = `oklch(${(color.l * 100).toFixed(3)}% ${color.c.toFixed(5)} ${color.h.toFixed(3)}`;
  return color.alpha < 1 ? `${base} / ${color.alpha.toFixed(3)})` : `${base})`;
}

function removeAlphaChannelWhenOpaque(hexColor: string) {
  return hexColor.replace(/^(#(?:[0-9a-f]{3}){1,2})ff$/i, '$1');
}

function buildColorFormat({
  label,
  parse = value => colord(value),
  format,
  placeholder,
  invalidMessage = `Invalid ${label.toLowerCase()} format.`,
  type = 'text',
}: {
  label: string
  parse?: (value: string) => Colord
  format: (value: Colord) => string
  placeholder?: string
  invalidMessage?: string
  type?: 'text' | 'color-picker'
}) {
  const value = ref('');

  return {
    type,
    label,
    parse: (v: string) => withDefaultOnError(() => parse(v), undefined),
    format,
    placeholder,
    value,
    validation: useValidation({
      source: value,
      rules: [
        {
          message: invalidMessage,
          validator: v => withDefaultOnError(() => {
            if (v === '') {
              return true;
            }

            return parse(v).isValid();
          }, false),
        },
      ],
    }),

  };
}
