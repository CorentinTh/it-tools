# IT-Tools REST API Manual

## Overview

The IT-Tools REST API exposes all 86 developer utilities from the it-tools GUI as HTTP endpoints. It runs as a standalone Node.js server using the Hono framework.

---

## Starting the API Server

### Prerequisites

- Node.js 18+
- pnpm installed (`npm install -g pnpm`)

### Install dependencies

```bash
pnpm install
```

### Start the server

**Development mode (with auto-reload):**
```bash
pnpm api:dev
```

**Production mode:**
```bash
pnpm api:start
```

The server starts on **http://localhost:3000** by default.

To use a custom port:
```bash
API_PORT=8080 pnpm api:start
```

### Verify it's running

```bash
curl http://localhost:3000/api
```

This returns a JSON object listing all available endpoints.

---

## API Reference

All endpoints accept and return JSON. POST requests require `Content-Type: application/json`.

- Success responses: `{ "result": ... }`
- Error responses: `{ "error": "message" }` with an appropriate HTTP status code

---

## Crypto Endpoints (`/api/crypto`)

### `POST /api/crypto/token`
Generate a random token.

**Body:**
```json
{
  "length": 64,
  "withUppercase": true,
  "withLowercase": true,
  "withNumbers": true,
  "withSymbols": false,
  "alphabet": "optional custom alphabet"
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/api/crypto/token \
  -H 'Content-Type: application/json' \
  -d '{"length":32}'
```

---

### `POST /api/crypto/hash`
Hash text using a cryptographic algorithm.

**Body:**
```json
{
  "text": "hello world",
  "algorithm": "SHA256",
  "encoding": "Hex"
}
```

**Algorithms:** `MD5`, `SHA1`, `SHA224`, `SHA256`, `SHA384`, `SHA512`, `SHA3`, `RIPEMD160`

**Encodings:** `Hex`, `Base64`, `Latin1`, `Bin`

---

### `POST /api/crypto/hmac`
Generate an HMAC signature.

**Body:**
```json
{
  "text": "message",
  "secret": "my-secret",
  "algorithm": "SHA256",
  "encoding": "Hex"
}
```

**Algorithms:** `MD5`, `SHA1`, `SHA224`, `SHA256`, `SHA384`, `SHA512`, `SHA3`, `RIPEMD160`

**Encodings:** `Hex`, `Base64`

---

### `POST /api/crypto/bcrypt/hash`
Hash a string using bcrypt.

**Body:**
```json
{
  "text": "my-password",
  "saltRounds": 10
}
```

---

### `POST /api/crypto/bcrypt/verify`
Verify a bcrypt hash.

**Body:**
```json
{
  "text": "my-password",
  "hash": "$2a$10$..."
}
```

**Returns:** `{ "result": true/false }`

---

### `POST /api/crypto/uuid`
Generate UUIDs.

**Body:**
```json
{
  "version": "v4",
  "count": 5,
  "namespace": "optional UUID namespace (for v3/v5)",
  "name": "optional name string (for v3/v5)"
}
```

**Versions:** `NIL`, `v1`, `v3`, `v4`, `v5`

---

### `POST /api/crypto/ulid`
Generate ULIDs (Universally Unique Lexicographically Sortable Identifiers).

**Body:**
```json
{ "count": 5 }
```

---

### `POST /api/crypto/encrypt`
Encrypt text.

**Body:**
```json
{
  "text": "secret message",
  "secret": "passphrase",
  "algorithm": "AES"
}
```

**Algorithms:** `AES`, `TripleDES`, `Rabbit`, `RC4`

---

### `POST /api/crypto/decrypt`
Decrypt encrypted text.

**Body:**
```json
{
  "text": "U2FsdGVkX1...",
  "secret": "passphrase",
  "algorithm": "AES"
}
```

---

### `POST /api/crypto/rsa/generate`
Generate an RSA key pair.

**Body:**
```json
{ "bits": 2048 }
```

**Returns:** `{ "result": { "publicKey": "-----BEGIN PUBLIC KEY-----...", "privateKey": "..." } }`

---

### `POST /api/crypto/bip39/generate`
Generate a BIP39 mnemonic phrase.

**Body:**
```json
{ "entropyBits": 128 }
```

**Valid entropyBits values:** `128`, `160`, `192`, `224`, `256` (maps to 12, 15, 18, 21, 24 words)

---

### `POST /api/crypto/bip39/to-entropy`
Convert a BIP39 mnemonic back to its entropy hex.

**Body:**
```json
{ "mnemonic": "word1 word2 word3 ..." }
```

---

### `POST /api/crypto/otp/secret`
Generate a random OTP secret key (base32 encoded).

No body required.

---

### `POST /api/crypto/otp/totp/generate`
Generate a TOTP (time-based OTP) code.

**Body:**
```json
{
  "key": "BASE32SECRET",
  "timeStep": 30
}
```

---

### `POST /api/crypto/otp/totp/verify`
Verify a TOTP code.

**Body:**
```json
{
  "key": "BASE32SECRET",
  "token": "123456",
  "window": 1,
  "timeStep": 30
}
```

---

### `POST /api/crypto/otp/hotp/generate`
Generate an HOTP (counter-based OTP) code.

**Body:**
```json
{
  "key": "BASE32SECRET",
  "counter": 0
}
```

---

### `POST /api/crypto/otp/hotp/verify`
Verify an HOTP code.

**Body:**
```json
{
  "key": "BASE32SECRET",
  "token": "123456",
  "counter": 0,
  "window": 0
}
```

---

### `POST /api/crypto/otp/key-uri`
Build an `otpauth://` URI for use with authenticator apps / QR codes.

**Body:**
```json
{
  "secret": "BASE32SECRET",
  "app": "MyApp",
  "account": "user@example.com",
  "algorithm": "SHA1",
  "digits": 6,
  "period": 30
}
```

---

### `POST /api/crypto/password-strength`
Analyze password strength and estimate crack time.

**Body:**
```json
{ "password": "my-password-123" }
```

---

## Converter Endpoints (`/api/converter`)

### `POST /api/converter/base64/encode`
Encode text to Base64.

**Body:**
```json
{ "text": "Hello World", "urlSafe": false }
```

---

### `POST /api/converter/base64/decode`
Decode Base64 text.

**Body:**
```json
{ "text": "SGVsbG8gV29ybGQ=", "urlSafe": false }
```

Also accepts `data:` URI prefix (e.g., `data:image/png;base64,...`).

---

### `POST /api/converter/case`
Convert text to all case formats.

**Body:**
```json
{ "text": "hello world foo" }
```

**Returns all of:** `lowercase`, `uppercase`, `camelCase`, `capitalCase`, `constantCase`, `dotCase`, `headerCase`, `noCase`, `paramCase`, `pascalCase`, `pathCase`, `sentenceCase`, `snakeCase`

---

### `POST /api/converter/roman-numeral/to-roman`
Convert arabic number to Roman numeral.

**Body:**
```json
{ "number": 42 }
```

---

### `POST /api/converter/roman-numeral/to-arabic`
Convert Roman numeral to arabic number.

**Body:**
```json
{ "roman": "XLII" }
```

---

### `POST /api/converter/yaml-to-json`
Convert YAML to JSON.

**Body:**
```json
{ "yaml": "name: foo\nage: 30" }
```

---

### `POST /api/converter/json-to-yaml`
Convert JSON to YAML.

**Body:**
```json
{ "json": "{\"name\":\"foo\",\"age\":30}" }
```

---

### `POST /api/converter/yaml-to-toml`
Convert YAML to TOML.

**Body:**
```json
{ "yaml": "name: foo\nvalue: 42" }
```

---

### `POST /api/converter/json-to-toml`
Convert JSON to TOML.

**Body:**
```json
{ "json": "{\"name\":\"foo\",\"value\":42}" }
```

---

### `POST /api/converter/toml-to-json`
Convert TOML to JSON.

**Body:**
```json
{ "toml": "name = \"foo\"\nvalue = 42" }
```

---

### `POST /api/converter/toml-to-yaml`
Convert TOML to YAML.

**Body:**
```json
{ "toml": "name = \"foo\"\nvalue = 42" }
```

---

### `POST /api/converter/xml-to-json`
Convert XML to JSON.

**Body:**
```json
{ "xml": "<root><name>test</name></root>" }
```

---

### `POST /api/converter/json-to-xml`
Convert JSON to XML.

**Body:**
```json
{ "json": "{\"root\":{\"name\":\"test\"}}" }
```

---

### `POST /api/converter/markdown-to-html`
Render Markdown to HTML.

**Body:**
```json
{ "markdown": "# Hello\nThis is **bold**." }
```

---

### `POST /api/converter/color`
Convert a color value between formats.

**Body:**
```json
{ "color": "#ff6600" }
```

Accepts: hex (`#ff6600`), rgb (`rgb(255,102,0)`), hsl (`hsl(24,100%,50%)`), CSS color names, etc.

**Returns:** `hex`, `rgb`, `hsl`, `hsv`

---

### `POST /api/converter/text-to-binary`
Convert text to ASCII binary representation.

**Body:**
```json
{ "text": "Hello" }
```

---

### `POST /api/converter/binary-to-text`
Convert ASCII binary back to text.

**Body:**
```json
{ "binary": "01001000 01100101 01101100 01101100 01101111" }
```

---

### `POST /api/converter/text-to-unicode`
Convert text to Unicode escape sequences.

**Body:**
```json
{ "text": "Hello 🌍" }
```

---

### `POST /api/converter/unicode-to-text`
Convert Unicode escape sequences back to text.

**Body:**
```json
{ "unicode": "\\u0048\\u0065\\u006C\\u006C\\u006F" }
```

---

### `POST /api/converter/text-to-nato`
Spell out text using the NATO phonetic alphabet.

**Body:**
```json
{ "text": "SOS" }
```

---

### `POST /api/converter/integer-base`
Convert an integer between numeric bases.

**Body:**
```json
{
  "value": "255",
  "fromBase": 10,
  "toBase": 16
}
```

---

### `POST /api/converter/temperature`
Convert a temperature value between all scales.

**Body:**
```json
{ "value": 100, "from": "celsius" }
```

**Scales:** `celsius`, `fahrenheit`, `kelvin`, `rankine`, `delisle`, `newton`, `reaumur`, `romer`

**Returns all scales** in the result.

---

### `POST /api/converter/slugify`
Convert text to a URL-friendly slug.

**Body:**
```json
{ "text": "Hello World! This is a test." }
```

---

## Web Endpoints (`/api/web`)

### `POST /api/web/url/encode`
URL-encode a string.

**Body:**
```json
{ "text": "hello world & foo=bar" }
```

---

### `POST /api/web/url/decode`
URL-decode a string.

**Body:**
```json
{ "text": "hello%20world%20%26%20foo%3Dbar" }
```

---

### `POST /api/web/url/parse`
Parse a URL into its components.

**Body:**
```json
{ "url": "https://user:pass@example.com:8080/path?foo=bar#hash" }
```

**Returns:** `protocol`, `username`, `password`, `hostname`, `port`, `pathname`, `search`, `params`, `hash`, `href`, `origin`

---

### `POST /api/web/basic-auth/generate`
Generate a Basic Auth header.

**Body:**
```json
{ "username": "admin", "password": "secret" }
```

**Returns:** `{ "header": "Authorization: Basic ...", "token": "..." }`

---

### `POST /api/web/jwt/parse`
Decode and parse a JWT token (without verification).

**Body:**
```json
{ "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
```

---

### `POST /api/web/html-entities/encode`
Encode HTML special characters.

**Body:**
```json
{ "text": "<h1>Hello & World</h1>" }
```

---

### `POST /api/web/html-entities/decode`
Decode HTML entities.

**Body:**
```json
{ "text": "&lt;h1&gt;Hello &amp; World&lt;/h1&gt;" }
```

---

### `POST /api/web/safelink/decode`
Decode a Microsoft Safelinks-wrapped URL.

**Body:**
```json
{ "url": "https://nam12.safelinks.protection.outlook.com/?url=https%3A%2F%2Fexample.com&data=..." }
```

---

### `POST /api/web/user-agent/parse`
Parse a User-Agent string.

**Body:**
```json
{ "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" }
```

**Returns:** `ua`, `browser`, `engine`, `os`, `device`, `cpu`

---

### `POST /api/web/mime-types/lookup`
Look up a MIME type by extension or vice versa.

**Body:**
```json
{ "query": "json" }
```

Also accepts MIME types as input (e.g., `"application/json"`).

---

### `GET /api/web/http-status-codes`
List all HTTP status codes.

No body. Returns array of `{ code, message, category }`.

---

### `POST /api/web/http-status-codes/lookup`
Look up a specific HTTP status code.

**Body:**
```json
{ "code": 404 }
```

---

## Development Endpoints (`/api/development`)

### `POST /api/development/json/prettify`
Pretty-print JSON.

**Body:**
```json
{ "json": "{\"a\":1,\"b\":2}", "indent": 2 }
```

---

### `POST /api/development/json/minify`
Minify JSON.

**Body:**
```json
{ "json": "{\n  \"a\": 1\n}" }
```

---

### `POST /api/development/json/to-csv`
Convert a JSON array to CSV.

**Body:**
```json
{ "json": "[{\"name\":\"Alice\",\"age\":30},{\"name\":\"Bob\",\"age\":25}]" }
```

---

### `POST /api/development/json/diff`
Compare two JSON values (pretty-printed for comparison).

**Body:**
```json
{ "left": "{\"a\":1}", "right": "{\"a\":2}" }
```

**Returns:** `{ "left": "...", "right": "...", "identical": false }`

---

### `POST /api/development/sql/prettify`
Format and prettify SQL.

**Body:**
```json
{
  "sql": "SELECT id,name FROM users WHERE active=1",
  "language": "sql",
  "keywordCase": "upper"
}
```

**Languages:** `sql`, `mysql`, `postgresql`, `sqlite`, `tsql`

**keywordCase:** `upper`, `lower`, `preserve`

---

### `POST /api/development/chmod/calculate`
Calculate chmod permissions.

**Body:**
```json
{
  "owner":  { "read": true,  "write": true,  "execute": false },
  "group":  { "read": true,  "write": false, "execute": false },
  "public": { "read": true,  "write": false, "execute": false }
}
```

Note: `others` is accepted as an alias for `public`.

**Returns:** `{ "octal": "644", "symbolic": "rw-r--r--", "command": "chmod 644" }`

---

### `POST /api/development/docker/to-compose`
Convert a `docker run` command to Docker Compose YAML.

**Body:**
```json
{ "dockerRun": "docker run -d -p 8080:80 --name myapp nginx" }
```

Note: `command` is accepted as an alias for `dockerRun`.

---

### `POST /api/development/xml/format`
Format/prettify XML.

**Body:**
```json
{ "xml": "<root><child>text</child></root>", "indentSize": 2 }
```

---

### `POST /api/development/yaml/format`
Validate and re-format YAML.

**Body:**
```json
{ "yaml": "name: foo\nage: 30" }
```

---

### `POST /api/development/email/normalize`
Normalize email addresses (removes dots, tags, etc.).

**Body:**
```json
{ "emails": "User.Name+tag@gmail.com" }
```

Also accepts newline-separated list of emails or an array.

---

### `POST /api/development/regex/test`
Test a regular expression against a string.

**Body:**
```json
{
  "pattern": "\\d+",
  "flags": "g",
  "text": "abc 123 def 456"
}
```

**Returns:** `{ "matches": [{ "match": "123", "index": 4 }, ...], "count": 2, "isValid": true }`

---

### `GET /api/development/port/random`
Generate a random available port number (1024–65535).

No body.

---

## Network Endpoints (`/api/network`)

### `POST /api/network/ipv4/subnet`
Calculate IPv4 subnet information from a CIDR.

**Body:**
```json
{ "cidr": "192.168.1.0/24" }
```

**Returns:** `networkAddress`, `broadcastAddress`, `subnetMask`, `wildcardMask`, `firstHost`, `lastHost`, `totalHosts`, `usableHosts`, `ipClass`, `cidr`

---

### `POST /api/network/ipv4/convert`
Convert an IPv4 address to multiple formats.

**Body:**
```json
{ "ip": "192.168.1.1" }
```

**Returns:** `dotDecimal`, `decimal`, `hex`, `binary`, `ipv6`

---

### `POST /api/network/ipv4/range`
Calculate the CIDR block for a range of IPs.

**Body:**
```json
{ "startIp": "192.168.1.0", "endIp": "192.168.1.255" }
```

---

### `POST /api/network/mac/generate`
Generate random MAC addresses.

**Body:**
```json
{
  "count": 3,
  "prefix": "00:50:56",
  "separator": ":"
}
```

---

### `POST /api/network/mac/lookup`
Look up the vendor for a MAC address (OUI lookup).

**Body:**
```json
{ "mac": "00:50:56:AB:CD:EF" }
```

**Returns:** `{ "mac": "...", "vendor": "VMware, Inc.", "found": true }`

---

### `POST /api/network/ipv6/ula`
Generate an IPv6 Unique Local Address (ULA).

**Body:**
```json
{ "mac": "00:50:56:AB:CD:EF" }
```

**Returns:** `ula`, `firstRoutableBlock`, `lastRoutableBlock`

---

## Math Endpoints (`/api/math`)

### `POST /api/math/evaluate`
Evaluate a mathematical expression.

**Body:**
```json
{ "expression": "2 + 3 * 4" }
```

Supports arithmetic, trigonometry, units, matrices, and more (powered by mathjs).

---

### `POST /api/math/percentage`
Calculate percentages.

**Body:**
```json
{ "x": 25, "y": 200 }
```

Optionally specify `type`:
- `"percent-of"` → What is x% of y?
- `"is-what-percent"` → x is what % of y?
- `"percent-change"` → % change from x to y

Without `type`, all three are returned.

---

## Text Endpoints (`/api/text`)

### `POST /api/text/lorem-ipsum`
Generate Lorem Ipsum placeholder text.

**Body:**
```json
{
  "paragraphCount": 2,
  "sentencePerParagraph": 3,
  "wordCount": 10,
  "startWithLoremIpsum": true,
  "asHTML": false
}
```

---

### `POST /api/text/statistics`
Analyze text statistics.

**Body:**
```json
{ "text": "Hello world. This is a test.\nSecond line." }
```

**Returns:** `characters`, `charactersNoSpaces`, `words`, `sentences`, `lines`, `paragraphs`, `bytes`

---

### `POST /api/text/numeronym`
Generate a numeronym for a word or phrase (e.g., `i18n` for `internationalization`).

**Body:**
```json
{ "text": "internationalization" }
```

---

### `POST /api/text/obfuscate`
Obfuscate a string (e.g., for displaying API keys).

**Body:**
```json
{
  "text": "my-secret-api-key",
  "keepFirst": 4,
  "keepLast": 0,
  "keepSpace": true,
  "replacementChar": "*"
}
```

---

### `POST /api/text/diff`
Compare two texts line-by-line.

**Body:**
```json
{
  "left": "foo\nbar\nbaz",
  "right": "foo\nbaz\nqux"
}
```

**Returns:** `{ "identical": false, "addedLines": 1, "removedLines": 1 }`

---

## Data Endpoints (`/api/data`)

### `POST /api/data/iban/validate`
Validate and parse an IBAN.

**Body:**
```json
{ "iban": "GB82WEST12345698765432" }
```

**Returns:** `isValid`, `errors`, `electronicFormat`, `friendlyFormat`, `bban`, `countryCode`

---

### `POST /api/data/phone/parse`
Parse and validate a phone number.

**Body:**
```json
{
  "phone": "+14155552671",
  "defaultCountry": "US"
}
```

**Returns:** `isValid`, `isPossible`, `country`, `countryCallingCode`, `nationalNumber`, `number`, `e164`, `international`, `national`, `type`

---

### `GET /api/data/phone/countries`
List all supported countries with calling codes.

No body. Returns array of `{ code, callingCode }`.

---

## Error Handling

All endpoints follow a consistent error response format:

```json
{ "error": "Description of what went wrong" }
```

Common HTTP status codes:
- `400` — Invalid input or unsupported value
- `404` — Not found (e.g., unknown status code)
- `500` — Internal server error

---

## CORS

The API has CORS enabled and accepts requests from any origin. It is suitable for use as a local backend or in development environments.
