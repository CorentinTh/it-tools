export interface FileSignature {
  name: string
  mime: string
  extensions: string[]
  evidence: string
}

interface SignatureRule extends FileSignature {
  matches: (bytes: Uint8Array) => boolean
}

function startsWith(bytes: Uint8Array, signature: readonly number[], offset = 0): boolean {
  return signature.every((value, index) => bytes[offset + index] === value);
}

function ascii(bytes: Uint8Array, offset: number, length: number): string {
  return String.fromCharCode(...bytes.slice(offset, offset + length));
}

const SIGNATURES: SignatureRule[] = [
  { name: 'PNG image', mime: 'image/png', extensions: ['png'], evidence: '89 50 4E 47 0D 0A 1A 0A', matches: bytes => startsWith(bytes, [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]) },
  { name: 'JPEG image', mime: 'image/jpeg', extensions: ['jpg', 'jpeg'], evidence: 'FF D8 FF', matches: bytes => startsWith(bytes, [0xFF, 0xD8, 0xFF]) },
  { name: 'GIF image', mime: 'image/gif', extensions: ['gif'], evidence: 'GIF87a/GIF89a', matches: bytes => ['GIF87a', 'GIF89a'].includes(ascii(bytes, 0, 6)) },
  { name: 'WebP image', mime: 'image/webp', extensions: ['webp'], evidence: 'RIFF….WEBP', matches: bytes => ascii(bytes, 0, 4) === 'RIFF' && ascii(bytes, 8, 4) === 'WEBP' },
  { name: 'PDF document', mime: 'application/pdf', extensions: ['pdf'], evidence: '%PDF-', matches: bytes => ascii(bytes, 0, 5) === '%PDF-' },
  { name: 'ZIP-compatible archive', mime: 'application/zip', extensions: ['zip', 'jar', 'docx', 'xlsx', 'pptx', 'apk'], evidence: 'PK header', matches: bytes => startsWith(bytes, [0x50, 0x4B, 0x03, 0x04]) || startsWith(bytes, [0x50, 0x4B, 0x05, 0x06]) || startsWith(bytes, [0x50, 0x4B, 0x07, 0x08]) },
  { name: 'GZIP archive', mime: 'application/gzip', extensions: ['gz'], evidence: '1F 8B', matches: bytes => startsWith(bytes, [0x1F, 0x8B]) },
  { name: '7-Zip archive', mime: 'application/x-7z-compressed', extensions: ['7z'], evidence: '37 7A BC AF 27 1C', matches: bytes => startsWith(bytes, [0x37, 0x7A, 0xBC, 0xAF, 0x27, 0x1C]) },
  { name: 'RAR archive', mime: 'application/vnd.rar', extensions: ['rar'], evidence: '52 61 72 21 1A 07', matches: bytes => startsWith(bytes, [0x52, 0x61, 0x72, 0x21, 0x1A, 0x07]) },
  { name: 'ELF executable', mime: 'application/x-elf', extensions: ['elf', 'so'], evidence: '7F 45 4C 46', matches: bytes => startsWith(bytes, [0x7F, 0x45, 0x4C, 0x46]) },
  { name: 'Windows PE executable', mime: 'application/vnd.microsoft.portable-executable', extensions: ['exe', 'dll'], evidence: 'MZ header', matches: bytes => startsWith(bytes, [0x4D, 0x5A]) },
  { name: 'WebAssembly module', mime: 'application/wasm', extensions: ['wasm'], evidence: '00 61 73 6D', matches: bytes => startsWith(bytes, [0x00, 0x61, 0x73, 0x6D]) },
  { name: 'SQLite database', mime: 'application/vnd.sqlite3', extensions: ['sqlite', 'sqlite3', 'db'], evidence: 'SQLite format 3', matches: bytes => ascii(bytes, 0, 16) === 'SQLite format 3\0' },
  { name: 'Ogg container', mime: 'application/ogg', extensions: ['ogg', 'oga', 'ogv'], evidence: 'OggS', matches: bytes => ascii(bytes, 0, 4) === 'OggS' },
  { name: 'ISO Base Media / MP4', mime: 'video/mp4', extensions: ['mp4', 'm4a', 'mov', 'heic'], evidence: 'ftyp box at offset 4', matches: bytes => ascii(bytes, 4, 4) === 'ftyp' },
  { name: 'Java class', mime: 'application/java-vm', extensions: ['class'], evidence: 'CA FE BA BE', matches: bytes => startsWith(bytes, [0xCA, 0xFE, 0xBA, 0xBE]) },
];

export function detectFileSignature(bytes: Uint8Array): FileSignature {
  const match = SIGNATURES.find(rule => rule.matches(bytes));
  return match
    ? { name: match.name, mime: match.mime, extensions: [...match.extensions], evidence: match.evidence }
    : { name: 'Unknown binary or text file', mime: 'application/octet-stream', extensions: [], evidence: 'No known signature matched the bounded header.' };
}

export function updateCrc32(state: number, bytes: Uint8Array): number {
  let crc = state >>> 0;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ (0xEDB8_8320 & -(crc & 1));
    }
  }
  return crc >>> 0;
}

export function finalizeCrc32(state: number): string {
  return ((state ^ 0xFFFF_FFFF) >>> 0).toString(16).padStart(8, '0');
}

export function formatHexPreview(bytes: Uint8Array): string {
  const lines: string[] = [];
  for (let offset = 0; offset < bytes.length; offset += 16) {
    const row = bytes.slice(offset, offset + 16);
    const hex = Array.from(row, byte => byte.toString(16).padStart(2, '0')).join(' ').padEnd(47, ' ');
    const printable = Array.from(row, byte => byte >= 0x20 && byte <= 0x7E ? String.fromCharCode(byte) : '.').join('');
    lines.push(`${offset.toString(16).padStart(8, '0')}  ${hex}  |${printable}|`);
  }
  return lines.join('\n');
}
