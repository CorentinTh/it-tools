import { Hono } from 'hono';
import { Base64 } from 'js-base64';
import {
  camelCase, capitalCase, constantCase, dotCase,
  headerCase, noCase, paramCase, pascalCase,
  pathCase, sentenceCase, snakeCase,
} from 'change-case';
import { parse as parseYaml, stringify as stringifyYaml } from 'yaml';
import JSON5 from 'json5';
import { parse as parseToml, stringify as stringifyToml } from 'smol-toml';
import convert from 'xml-js';
import markdownit from 'markdown-it';
import { colord } from 'colord';
import slugify from '@sindresorhus/slugify';
import {
  arabicToRoman,
  romanToArabic,
} from '@/tools/roman-numeral-converter/roman-numeral-converter.service.js';
import { convertBase } from '@/tools/integer-base-converter/integer-base-converter.model.js';
import {
  convertTextToAsciiBinary,
  convertAsciiBinaryToText,
} from '@/tools/text-to-binary/text-to-binary.models.js';
import {
  convertTextToUnicode,
  convertUnicodeToText,
} from '@/tools/text-to-unicode/text-to-unicode.service.js';
import { textToNatoAlphabet } from '@/tools/text-to-nato-alphabet/text-to-nato-alphabet.service.js';
import {
  convertCelsiusToKelvin, convertKelvinToCelsius,
  convertFahrenheitToKelvin, convertKelvinToFahrenheit,
  convertRankineToKelvin, convertKelvinToRankine,
  convertDelisleToKelvin, convertKelvinToDelisle,
  convertNewtonToKelvin, convertKelvinToNewton,
  convertReaumurToKelvin, convertKelvinToReaumur,
  convertRomerToKelvin, convertKelvinToRomer,
} from '@/tools/temperature-converter/temperature-converter.models.js';

const router = new Hono();

// Base64 encode
router.post('/base64/encode', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { text = '', urlSafe = false } = body;
  let result = Base64.encode(text);
  if (urlSafe) result = result.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  return c.json({ result });
});

// Base64 decode
router.post('/base64/decode', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { text = '', urlSafe = false } = body;
  try {
    let clean = text.replace(/^data:.*?;base64,/, '');
    if (urlSafe) clean = clean.replace(/-/g, '+').replace(/_/g, '/');
    const result = Base64.decode(clean);
    return c.json({ result });
  } catch (e: any) {
    return c.json({ error: `Invalid base64: ${e.message}` }, 400);
  }
});

// Case converter
router.post('/case', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { text = '' } = body;
  const cfg = { stripRegexp: /[^A-Za-zÀ-ÖØ-öø-ÿ]+/gi };
  return c.json({
    result: {
      lowercase: text.toLocaleLowerCase(),
      uppercase: text.toLocaleUpperCase(),
      camelCase: camelCase(text, cfg),
      capitalCase: capitalCase(text, cfg),
      constantCase: constantCase(text, cfg),
      dotCase: dotCase(text, cfg),
      headerCase: headerCase(text, cfg),
      noCase: noCase(text, cfg),
      paramCase: paramCase(text, cfg),
      pascalCase: pascalCase(text, cfg),
      pathCase: pathCase(text, cfg),
      sentenceCase: sentenceCase(text, cfg),
      snakeCase: snakeCase(text, cfg),
    },
  });
});

// Roman numeral: arabic → roman
router.post('/roman-numeral/to-roman', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { number } = body;
  if (typeof number !== 'number') return c.json({ error: 'Provide a numeric "number" field' }, 400);
  const result = arabicToRoman(number);
  if (!result) return c.json({ error: 'Number must be between 1 and 3999' }, 400);
  return c.json({ result });
});

// Roman numeral: roman → arabic
router.post('/roman-numeral/to-arabic', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { roman = '' } = body;
  const result = romanToArabic(roman.toUpperCase());
  if (result === null) return c.json({ error: 'Invalid roman numeral' }, 400);
  return c.json({ result });
});

// YAML → JSON
router.post('/yaml-to-json', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { yaml = '' } = body;
  try {
    const obj = parseYaml(yaml, { merge: true });
    return c.json({ result: obj });
  } catch (e: any) {
    return c.json({ error: `Invalid YAML: ${e.message}` }, 400);
  }
});

// JSON → YAML
router.post('/json-to-yaml', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { json = '' } = body;
  try {
    const obj = JSON5.parse(json);
    return c.json({ result: stringifyYaml(obj) });
  } catch (e: any) {
    return c.json({ error: `Invalid JSON: ${e.message}` }, 400);
  }
});

// YAML → TOML
router.post('/yaml-to-toml', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { yaml = '' } = body;
  try {
    const obj = parseYaml(yaml, { merge: true });
    return c.json({ result: stringifyToml(obj as any) });
  } catch (e: any) {
    return c.json({ error: e.message }, 400);
  }
});

// JSON → TOML
router.post('/json-to-toml', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { json = '' } = body;
  try {
    const obj = JSON5.parse(json);
    return c.json({ result: stringifyToml(obj) });
  } catch (e: any) {
    return c.json({ error: `Invalid JSON: ${e.message}` }, 400);
  }
});

// TOML → JSON
router.post('/toml-to-json', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { toml = '' } = body;
  try {
    const obj = parseToml(toml);
    return c.json({ result: obj });
  } catch (e: any) {
    return c.json({ error: `Invalid TOML: ${e.message}` }, 400);
  }
});

// TOML → YAML
router.post('/toml-to-yaml', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { toml = '' } = body;
  try {
    const obj = parseToml(toml);
    return c.json({ result: stringifyYaml(obj as any) });
  } catch (e: any) {
    return c.json({ error: `Invalid TOML: ${e.message}` }, 400);
  }
});

// XML → JSON
router.post('/xml-to-json', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { xml = '' } = body;
  try {
    const result = JSON.parse(convert.xml2json(xml, { compact: true, spaces: 2 }));
    return c.json({ result });
  } catch (e: any) {
    return c.json({ error: `Invalid XML: ${e.message}` }, 400);
  }
});

// JSON → XML
router.post('/json-to-xml', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { json = '' } = body;
  try {
    const obj = typeof json === 'string' ? JSON5.parse(json) : json;
    const result = convert.json2xml(JSON.stringify(obj), { compact: true, spaces: 2 });
    return c.json({ result });
  } catch (e: any) {
    return c.json({ error: `Invalid JSON: ${e.message}` }, 400);
  }
});

// Markdown → HTML
router.post('/markdown-to-html', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { markdown = '' } = body;
  const md = markdownit();
  return c.json({ result: md.render(markdown) });
});

// Color converter
router.post('/color', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { color = '' } = body;
  try {
    const parsed = colord(color);
    if (!parsed.isValid()) return c.json({ error: 'Invalid color value' }, 400);
    return c.json({
      result: {
        hex: parsed.toHex(),
        rgb: parsed.toRgb(),
        hsl: parsed.toHsl(),
        hsv: parsed.toHsv(),
      },
    });
  } catch (e: any) {
    return c.json({ error: e.message }, 400);
  }
});

// Text → Binary
router.post('/text-to-binary', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { text = '' } = body;
  return c.json({ result: convertTextToAsciiBinary(text) });
});

// Binary → Text
router.post('/binary-to-text', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { binary = '' } = body;
  try {
    return c.json({ result: convertAsciiBinaryToText(binary) });
  } catch (e: any) {
    return c.json({ error: e.message }, 400);
  }
});

// Text → Unicode
router.post('/text-to-unicode', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { text = '' } = body;
  return c.json({ result: convertTextToUnicode(text) });
});

// Unicode → Text
router.post('/unicode-to-text', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { unicode = '' } = body;
  return c.json({ result: convertUnicodeToText(unicode) });
});

// Text → NATO alphabet
router.post('/text-to-nato', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { text = '' } = body;
  return c.json({ result: textToNatoAlphabet({ text }) });
});

// Integer base converter
router.post('/integer-base', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { value = '0', fromBase = 10, toBase = 2 } = body;
  try {
    const result = convertBase({ value: String(value), fromBase, toBase });
    return c.json({ result });
  } catch (e: any) {
    return c.json({ error: e.message }, 400);
  }
});

// Temperature converter
router.post('/temperature', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { value, from = 'celsius' } = body;
  if (typeof value !== 'number') return c.json({ error: 'Provide a numeric "value" field' }, 400);

  const toKelvin: Record<string, (v: number) => number> = {
    celsius: convertCelsiusToKelvin,
    fahrenheit: convertFahrenheitToKelvin,
    kelvin: (v) => v,
    rankine: convertRankineToKelvin,
    delisle: convertDelisleToKelvin,
    newton: convertNewtonToKelvin,
    reaumur: convertReaumurToKelvin,
    romer: convertRomerToKelvin,
  };

  const fromKelvin: Record<string, (v: number) => number> = {
    celsius: convertKelvinToCelsius,
    fahrenheit: convertKelvinToFahrenheit,
    kelvin: (v) => v,
    rankine: convertKelvinToRankine,
    delisle: convertKelvinToDelisle,
    newton: convertKelvinToNewton,
    reaumur: convertKelvinToReaumur,
    romer: convertKelvinToRomer,
  };

  const scale = from.toLowerCase();
  if (!toKelvin[scale]) {
    return c.json({ error: `Unknown unit "${from}". Use: ${Object.keys(toKelvin).join(', ')}` }, 400);
  }

  const kelvin = toKelvin[scale](value);
  const result: Record<string, number> = {};
  for (const unit of Object.keys(fromKelvin)) {
    result[unit] = fromKelvin[unit](kelvin);
  }

  return c.json({ result });
});

// Slugify
router.post('/slugify', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { text = '' } = body;
  return c.json({ result: slugify(text) });
});

export default router;
