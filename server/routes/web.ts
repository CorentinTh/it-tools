import { Hono } from 'hono';
import lodash from 'lodash';
const { escape, unescape } = lodash;
import uaParserJs from 'ua-parser-js';
const UAParser = (uaParserJs as any).UAParser ?? uaParserJs;
import mime from 'mime-types';
import { decodeJwt } from '@/tools/jwt-parser/jwt-parser.service.js';
import { decodeSafeLinksURL } from '@/tools/safelink-decoder/safelink-decoder.service.js';
import { textToBase64 } from '@/utils/base64.js';

const router = new Hono();

// HTTP status codes reference
const HTTP_STATUS_CODES: Record<number, string> = {
  100: 'Continue', 101: 'Switching Protocols', 102: 'Processing', 103: 'Early Hints',
  200: 'OK', 201: 'Created', 202: 'Accepted', 203: 'Non-Authoritative Information',
  204: 'No Content', 205: 'Reset Content', 206: 'Partial Content', 207: 'Multi-Status',
  208: 'Already Reported', 226: 'IM Used',
  300: 'Multiple Choices', 301: 'Moved Permanently', 302: 'Found', 303: 'See Other',
  304: 'Not Modified', 305: 'Use Proxy', 307: 'Temporary Redirect', 308: 'Permanent Redirect',
  400: 'Bad Request', 401: 'Unauthorized', 402: 'Payment Required', 403: 'Forbidden',
  404: 'Not Found', 405: 'Method Not Allowed', 406: 'Not Acceptable',
  407: 'Proxy Authentication Required', 408: 'Request Timeout', 409: 'Conflict',
  410: 'Gone', 411: 'Length Required', 412: 'Precondition Failed',
  413: 'Content Too Large', 414: 'URI Too Long', 415: 'Unsupported Media Type',
  416: 'Range Not Satisfiable', 417: 'Expectation Failed', 418: "I'm a Teapot",
  421: 'Misdirected Request', 422: 'Unprocessable Content', 423: 'Locked',
  424: 'Failed Dependency', 425: 'Too Early', 426: 'Upgrade Required',
  428: 'Precondition Required', 429: 'Too Many Requests', 431: 'Request Header Fields Too Large',
  451: 'Unavailable For Legal Reasons',
  500: 'Internal Server Error', 501: 'Not Implemented', 502: 'Bad Gateway',
  503: 'Service Unavailable', 504: 'Gateway Timeout', 505: 'HTTP Version Not Supported',
  506: 'Variant Also Negotiates', 507: 'Insufficient Storage', 508: 'Loop Detected',
  510: 'Not Extended', 511: 'Network Authentication Required',
};

// URL encode
router.post('/url/encode', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { text = '' } = body;
  try {
    return c.json({ result: encodeURIComponent(text) });
  } catch (e: any) {
    return c.json({ error: e.message }, 400);
  }
});

// URL decode
router.post('/url/decode', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { text = '' } = body;
  try {
    return c.json({ result: decodeURIComponent(text) });
  } catch (e: any) {
    return c.json({ error: `Invalid encoded string: ${e.message}` }, 400);
  }
});

// URL parser
router.post('/url/parse', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { url = '' } = body;
  try {
    const parsed = new URL(url);
    const params: Record<string, string> = {};
    parsed.searchParams.forEach((v, k) => { params[k] = v; });
    return c.json({
      result: {
        protocol: parsed.protocol,
        username: parsed.username,
        password: parsed.password,
        hostname: parsed.hostname,
        port: parsed.port,
        pathname: parsed.pathname,
        search: parsed.search,
        params,
        hash: parsed.hash,
        href: parsed.href,
        origin: parsed.origin,
      },
    });
  } catch (e: any) {
    return c.json({ error: `Invalid URL: ${e.message}` }, 400);
  }
});

// Basic auth generator
router.post('/basic-auth/generate', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { username = '', password = '' } = body;
  const encoded = textToBase64(`${username}:${password}`);
  return c.json({
    result: {
      header: `Authorization: Basic ${encoded}`,
      token: encoded,
    },
  });
});

// JWT parser
router.post('/jwt/parse', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { jwt = '' } = body;
  try {
    const result = decodeJwt({ jwt });
    return c.json({ result });
  } catch (e: any) {
    return c.json({ error: `Invalid JWT: ${e.message}` }, 400);
  }
});

// HTML entities encode
router.post('/html-entities/encode', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { text = '' } = body;
  return c.json({ result: escape(text) });
});

// HTML entities decode
router.post('/html-entities/decode', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { text = '' } = body;
  return c.json({ result: unescape(text) });
});

// Safelink decoder
router.post('/safelink/decode', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { url = '' } = body;
  try {
    const result = decodeSafeLinksURL(url);
    return c.json({ result });
  } catch (e: any) {
    return c.json({ error: e.message }, 400);
  }
});

// User agent parser
router.post('/user-agent/parse', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { userAgent = '' } = body;
  if (!userAgent.trim()) {
    return c.json({ result: { ua: '', browser: {}, cpu: {}, device: {}, engine: {}, os: {} } });
  }
  const result = UAParser(userAgent.trim());
  return c.json({ result });
});

// MIME types — lookup
router.post('/mime-types/lookup', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { query = '' } = body;
  const mimeType = mime.lookup(query);
  const ext = mime.extension(query);
  return c.json({ result: { mimeType: mimeType || null, extension: ext || null } });
});

// HTTP status codes — list all
router.get('/http-status-codes', (c) => {
  const result = Object.entries(HTTP_STATUS_CODES).map(([code, message]) => ({
    code: Number(code),
    message,
    category: Math.floor(Number(code) / 100) * 100,
  }));
  return c.json({ result });
});

// HTTP status codes — lookup
router.post('/http-status-codes/lookup', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { code } = body;
  const message = HTTP_STATUS_CODES[code];
  if (!message) return c.json({ error: `Unknown status code: ${code}` }, 404);
  return c.json({ result: { code, message } });
});

export default router;
