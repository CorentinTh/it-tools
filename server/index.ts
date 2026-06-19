import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import cryptoRoutes from './routes/crypto.js';
import converterRoutes from './routes/converter.js';
import webRoutes from './routes/web.js';
import developmentRoutes from './routes/development.js';
import networkRoutes from './routes/network.js';
import mathRoutes from './routes/math.js';
import textRoutes from './routes/text.js';
import dataRoutes from './routes/data.js';

const app = new Hono();

app.use('*', cors());
app.use('*', logger());

// Mount route groups
app.route('/api/crypto', cryptoRoutes);
app.route('/api/converter', converterRoutes);
app.route('/api/web', webRoutes);
app.route('/api/development', developmentRoutes);
app.route('/api/network', networkRoutes);
app.route('/api/math', mathRoutes);
app.route('/api/text', textRoutes);
app.route('/api/data', dataRoutes);

// API index — list all available endpoints
app.get('/api', (c) => {
  return c.json({
    name: 'IT-Tools REST API',
    version: '1.0.0',
    description: 'REST API exposing all IT-Tools utilities',
    endpoints: {
      crypto: {
        'POST /api/crypto/token': 'Generate a random token',
        'POST /api/crypto/hash': 'Hash text (MD5, SHA256, etc.)',
        'POST /api/crypto/hmac': 'Generate HMAC (MD5, SHA256, etc.)',
        'POST /api/crypto/bcrypt/hash': 'Bcrypt hash a string',
        'POST /api/crypto/bcrypt/verify': 'Verify a string against a bcrypt hash',
        'POST /api/crypto/uuid': 'Generate UUIDs (v1/v3/v4/v5/NIL)',
        'POST /api/crypto/ulid': 'Generate ULIDs',
        'POST /api/crypto/encrypt': 'Encrypt text (AES/TripleDES/Rabbit/RC4)',
        'POST /api/crypto/decrypt': 'Decrypt text (AES/TripleDES/Rabbit/RC4)',
        'POST /api/crypto/rsa/generate': 'Generate RSA key pair',
        'POST /api/crypto/bip39/generate': 'Generate BIP39 mnemonic',
        'POST /api/crypto/bip39/to-entropy': 'Convert BIP39 mnemonic to entropy',
        'POST /api/crypto/otp/secret': 'Generate OTP secret',
        'POST /api/crypto/otp/totp/generate': 'Generate TOTP code',
        'POST /api/crypto/otp/totp/verify': 'Verify TOTP code',
        'POST /api/crypto/otp/hotp/generate': 'Generate HOTP code',
        'POST /api/crypto/otp/hotp/verify': 'Verify HOTP code',
        'POST /api/crypto/otp/key-uri': 'Build OTP key URI',
        'POST /api/crypto/password-strength': 'Analyse password strength',
      },
      converter: {
        'POST /api/converter/base64/encode': 'Encode text to Base64',
        'POST /api/converter/base64/decode': 'Decode Base64 to text',
        'POST /api/converter/case': 'Convert text to all case formats',
        'POST /api/converter/roman-numeral/to-roman': 'Convert arabic number to roman numeral',
        'POST /api/converter/roman-numeral/to-arabic': 'Convert roman numeral to arabic number',
        'POST /api/converter/yaml-to-json': 'Convert YAML to JSON',
        'POST /api/converter/json-to-yaml': 'Convert JSON to YAML',
        'POST /api/converter/yaml-to-toml': 'Convert YAML to TOML',
        'POST /api/converter/json-to-toml': 'Convert JSON to TOML',
        'POST /api/converter/toml-to-json': 'Convert TOML to JSON',
        'POST /api/converter/toml-to-yaml': 'Convert TOML to YAML',
        'POST /api/converter/xml-to-json': 'Convert XML to JSON',
        'POST /api/converter/json-to-xml': 'Convert JSON to XML',
        'POST /api/converter/markdown-to-html': 'Convert Markdown to HTML',
        'POST /api/converter/color': 'Convert color between formats (hex/rgb/hsl/hsv/hwb/lch/lab)',
        'POST /api/converter/text-to-binary': 'Convert text to ASCII binary',
        'POST /api/converter/binary-to-text': 'Convert ASCII binary to text',
        'POST /api/converter/text-to-unicode': 'Convert text to Unicode entities',
        'POST /api/converter/unicode-to-text': 'Convert Unicode entities to text',
        'POST /api/converter/text-to-nato': 'Convert text to NATO phonetic alphabet',
        'POST /api/converter/integer-base': 'Convert integer between bases (2-64)',
        'POST /api/converter/temperature': 'Convert temperature between scales',
        'POST /api/converter/slugify': 'Slugify a string',
      },
      web: {
        'POST /api/web/url/encode': 'URL encode a string',
        'POST /api/web/url/decode': 'URL decode a string',
        'POST /api/web/url/parse': 'Parse a URL into components',
        'POST /api/web/basic-auth/generate': 'Generate Basic Auth header',
        'POST /api/web/jwt/parse': 'Parse and decode a JWT',
        'POST /api/web/html-entities/encode': 'Encode HTML entities',
        'POST /api/web/html-entities/decode': 'Decode HTML entities',
        'POST /api/web/safelink/decode': 'Decode a Microsoft SafeLinks URL',
        'POST /api/web/user-agent/parse': 'Parse a User-Agent string',
        'POST /api/web/mime-types/lookup': 'Look up MIME type or extension',
        'GET  /api/web/http-status-codes': 'List all HTTP status codes',
        'POST /api/web/http-status-codes/lookup': 'Look up an HTTP status code',
      },
      development: {
        'POST /api/development/json/prettify': 'Prettify JSON',
        'POST /api/development/json/minify': 'Minify JSON',
        'POST /api/development/json/to-csv': 'Convert JSON array to CSV',
        'POST /api/development/json/diff': 'Diff two JSON objects',
        'POST /api/development/sql/prettify': 'Format SQL',
        'POST /api/development/chmod/calculate': 'Calculate chmod octal and symbolic',
        'POST /api/development/docker/to-compose': 'Convert docker run to docker-compose',
        'POST /api/development/xml/format': 'Format XML',
        'POST /api/development/yaml/format': 'Validate and format YAML',
        'POST /api/development/email/normalize': 'Normalize email addresses',
        'POST /api/development/regex/test': 'Test a regex against a string',
        'GET  /api/development/port/random': 'Generate a random port number',
      },
      network: {
        'POST /api/network/ipv4/subnet': 'IPv4 subnet calculator (CIDR)',
        'POST /api/network/ipv4/convert': 'Convert IPv4 to decimal/hex/binary/IPv6',
        'POST /api/network/ipv4/range': 'Expand IPv4 range to CIDR',
        'POST /api/network/mac/generate': 'Generate random MAC addresses',
        'POST /api/network/mac/lookup': 'Look up MAC address vendor (OUI)',
        'POST /api/network/ipv6/ula': 'Generate IPv6 ULA address',
      },
      math: {
        'POST /api/math/evaluate': 'Evaluate a math expression',
        'POST /api/math/percentage': 'Calculate percentages',
      },
      text: {
        'POST /api/text/lorem-ipsum': 'Generate lorem ipsum text',
        'POST /api/text/statistics': 'Get statistics for a text',
        'POST /api/text/numeronym': 'Generate numeronym(s) for words',
        'POST /api/text/obfuscate': 'Obfuscate a string',
        'POST /api/text/diff': 'Diff two text blocks (line-level)',
      },
      data: {
        'POST /api/data/iban/validate': 'Validate and parse an IBAN',
        'POST /api/data/phone/parse': 'Parse and format a phone number',
        'GET  /api/data/phone/countries': 'List supported phone country codes',
      },
    },
  });
});

// Serve built Vue frontend static files (when SERVE_STATIC=true)
if (process.env.SERVE_STATIC === 'true') {
  app.use('/*', serveStatic({ root: './dist' }));
  app.get('/*', serveStatic({ path: './dist/index.html' }));
}

const port = Number(process.env.API_PORT ?? 3000);

serve({ fetch: app.fetch, port }, () => {
  console.log(`IT-Tools API running on http://localhost:${port}`);
  console.log(`Endpoint reference: http://localhost:${port}/api`);
});
