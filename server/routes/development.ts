import { Hono } from 'hono';
import JSON5 from 'json5';
import { format as formatSQL } from 'sql-formatter';
import { composerize } from 'composerize-ts';
import { normalizeEmail } from 'email-normalizer';
import { parse as parseYaml, stringify as stringifyYaml } from 'yaml';
import { formatXml } from '@/tools/xml-formatter/xml-formatter.service.js';
import { convertArrayToCsv } from '@/tools/json-to-csv/json-to-csv.service.js';
import { computeChmodOctalRepresentation, computeChmodSymbolicRepresentation } from '@/tools/chmod-calculator/chmod-calculator.service.js';

const router = new Hono();

// JSON prettify
router.post('/json/prettify', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { json = '', indent = 2 } = body;
  try {
    const parsed = JSON5.parse(json);
    return c.json({ result: JSON.stringify(parsed, null, indent) });
  } catch (e: any) {
    return c.json({ error: `Invalid JSON: ${e.message}` }, 400);
  }
});

// JSON minify
router.post('/json/minify', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { json = '' } = body;
  try {
    const parsed = JSON5.parse(json);
    return c.json({ result: JSON.stringify(parsed) });
  } catch (e: any) {
    return c.json({ error: `Invalid JSON: ${e.message}` }, 400);
  }
});

// JSON → CSV
router.post('/json/to-csv', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { json = '' } = body;
  try {
    const parsed = typeof json === 'string' ? JSON5.parse(json) : json;
    if (!Array.isArray(parsed)) return c.json({ error: 'JSON must be an array of objects' }, 400);
    const result = convertArrayToCsv({ array: parsed });
    return c.json({ result });
  } catch (e: any) {
    return c.json({ error: e.message }, 400);
  }
});

// JSON diff
router.post('/json/diff', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { left = '', right = '' } = body;
  try {
    const leftObj = JSON5.parse(left);
    const rightObj = JSON5.parse(right);
    const leftStr = JSON.stringify(leftObj, null, 2);
    const rightStr = JSON.stringify(rightObj, null, 2);
    return c.json({ result: { left: leftStr, right: rightStr, identical: leftStr === rightStr } });
  } catch (e: any) {
    return c.json({ error: e.message }, 400);
  }
});

// SQL prettify
router.post('/sql/prettify', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { sql = '', language = 'sql', keywordCase = 'upper' } = body;
  try {
    const result = formatSQL(sql, { language: language as any, keywordCase: keywordCase as any });
    return c.json({ result });
  } catch (e: any) {
    return c.json({ error: e.message }, 400);
  }
});

// Chmod calculator
router.post('/chmod/calculate', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const {
    owner = { read: false, write: false, execute: false },
    group = { read: false, write: false, execute: false },
    public: pub,
    others,
  } = body;
  const pubPerms = pub ?? others ?? { read: false, write: false, execute: false };
  const permissions = { owner, group, public: pubPerms };
  const octal = computeChmodOctalRepresentation({ permissions });
  const symbolic = computeChmodSymbolicRepresentation({ permissions });
  return c.json({ result: { octal, symbolic, command: `chmod ${octal}` } });
});

// Docker run → Docker Compose
router.post('/docker/to-compose', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { dockerRun, command } = body;
  const cmd = (dockerRun ?? command ?? '').trim();
  try {
    const { yaml, messages } = composerize(cmd);
    return c.json({ result: { yaml, messages } });
  } catch (e: any) {
    return c.json({ error: e.message }, 400);
  }
});

// XML format
router.post('/xml/format', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { xml = '', indentSize = 2 } = body;
  try {
    const result = formatXml(xml, { indentation: ' '.repeat(indentSize) });
    if (!result && xml.trim()) return c.json({ error: 'Invalid XML' }, 400);
    return c.json({ result });
  } catch (e: any) {
    return c.json({ error: e.message }, 400);
  }
});

// YAML format/validate
router.post('/yaml/format', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { yaml = '' } = body;
  try {
    const parsed = parseYaml(yaml);
    return c.json({ result: stringifyYaml(parsed) });
  } catch (e: any) {
    return c.json({ error: `Invalid YAML: ${e.message}` }, 400);
  }
});

// Email normalizer
router.post('/email/normalize', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { emails = '' } = body;
  const lines = typeof emails === 'string' ? emails.split('\n') : (Array.isArray(emails) ? emails : [emails]);
  const result = lines.map((email: string) => {
    try {
      return { original: email, normalized: normalizeEmail({ email: email.trim() }) };
    } catch {
      return { original: email, normalized: null, error: 'Unable to parse email' };
    }
  });
  return c.json({ result });
});

// Regex tester
router.post('/regex/test', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { pattern = '', flags = 'g', text = '' } = body;
  try {
    const regex = new RegExp(pattern, flags);
    const matches: { match: string; index: number; groups: Record<string, string> | undefined }[] = [];
    let m: RegExpExecArray | null;
    const re = new RegExp(pattern, flags.includes('g') ? flags : flags + 'g');
    while ((m = re.exec(text)) !== null) {
      matches.push({ match: m[0], index: m.index, groups: m.groups });
      if (!flags.includes('g')) break;
    }
    return c.json({ result: { matches, count: matches.length, isValid: true } });
  } catch (e: any) {
    return c.json({ error: `Invalid regex: ${e.message}` }, 400);
  }
});

// Random port
router.get('/port/random', (c) => {
  const port = Math.floor(Math.random() * (65535 - 1024 + 1)) + 1024;
  return c.json({ result: port });
});

export default router;
