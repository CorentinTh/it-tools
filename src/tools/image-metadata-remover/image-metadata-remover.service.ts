export type SupportedImageMime = 'image/jpeg' | 'image/png' | 'image/webp';

export interface RemovedMetadataItem {
  type: string
  count: number
  bytes: number
}

export interface MetadataRemovalOutput {
  bytes: Uint8Array
  mimeType: SupportedImageMime
  removedBytes: number
  removedItems: RemovedMetadataItem[]
}

const PNG_SIGNATURE = [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A] as const;
const PNG_RENDERING_CHUNKS = new Set(['cHRM', 'gAMA', 'iCCP', 'sBIT', 'sRGB', 'bKGD', 'hIST', 'sPLT', 'tRNS', 'acTL', 'fcTL', 'fdAT']);
const WEBP_RENDERING_CHUNKS = new Set(['VP8X', 'ICCP', 'ANIM', 'ANMF', 'ALPH', 'VP8 ', 'VP8L']);
const MAX_CONTAINER_ITEMS = 100_000;

function startsWith(bytes: Uint8Array, signature: readonly number[], offset = 0): boolean {
  return signature.every((value, index) => bytes[offset + index] === value);
}

function ascii(bytes: Uint8Array, offset: number, length: number): string {
  let result = '';
  for (let index = 0; index < length; index += 1) {
    result += String.fromCharCode(bytes[offset + index]);
  }
  return result;
}

function addRemoved(items: Map<string, RemovedMetadataItem>, type: string, bytes: number): void {
  const current = items.get(type);
  if (current) {
    current.count += 1;
    current.bytes += bytes;
  }
  else {
    items.set(type, { type, count: 1, bytes });
  }
}

function concatenate(parts: Uint8Array[]): Uint8Array {
  const total = parts.reduce((sum, part) => sum + part.byteLength, 0);
  const output = new Uint8Array(total);
  let offset = 0;
  for (const part of parts) {
    output.set(part, offset);
    offset += part.byteLength;
  }
  return output;
}

function result(bytes: Uint8Array, mimeType: SupportedImageMime, removed: Map<string, RemovedMetadataItem>): MetadataRemovalOutput {
  const removedItems = [...removed.values()].sort((left, right) => left.type.localeCompare(right.type));
  return {
    bytes,
    mimeType,
    removedBytes: removedItems.reduce((sum, item) => sum + item.bytes, 0),
    removedItems,
  };
}

function stripJpeg(bytes: Uint8Array): MetadataRemovalOutput {
  if (!startsWith(bytes, [0xFF, 0xD8, 0xFF])) {
    throw new TypeError('The file does not contain a valid JPEG signature.');
  }
  const parts: Uint8Array[] = [bytes.subarray(0, 2)];
  const removed = new Map<string, RemovedMetadataItem>();
  let cursor = 2;
  let itemCount = 0;
  let sawEnd = false;

  while (cursor < bytes.length) {
    if (++itemCount > MAX_CONTAINER_ITEMS) {
      throw new RangeError('The JPEG contains too many segments.');
    }
    if (bytes[cursor] !== 0xFF) {
      throw new TypeError('The JPEG segment structure is malformed.');
    }
    const markerStart = cursor;
    while (cursor < bytes.length && bytes[cursor] === 0xFF) {
      cursor += 1;
    }
    if (cursor >= bytes.length || bytes[cursor] === 0x00) {
      throw new TypeError('The JPEG marker stream is malformed.');
    }
    const marker = bytes[cursor++];
    const standalone = marker === 0x01 || marker === 0xD8 || marker === 0xD9 || (marker >= 0xD0 && marker <= 0xD7);
    if (standalone) {
      parts.push(bytes.subarray(markerStart, cursor));
      if (marker === 0xD9) {
        sawEnd = true;
        if (cursor < bytes.length) {
          addRemoved(removed, 'trailing data', bytes.length - cursor);
        }
        break;
      }
      continue;
    }
    if (cursor + 2 > bytes.length) {
      throw new TypeError('The JPEG segment length is truncated.');
    }
    const segmentLength = (bytes[cursor] << 8) | bytes[cursor + 1];
    if (segmentLength < 2 || cursor + segmentLength > bytes.length) {
      throw new TypeError('The JPEG segment length is invalid.');
    }
    const segmentEnd = cursor + segmentLength;
    const removable = marker === 0xFE || (marker >= 0xE1 && marker <= 0xEF && marker !== 0xE2 && marker !== 0xEE);
    if (removable) {
      const label = marker === 0xFE ? 'JPEG comment' : `JPEG APP${marker - 0xE0}`;
      addRemoved(removed, label, segmentEnd - markerStart);
    }
    else {
      parts.push(bytes.subarray(markerStart, segmentEnd));
    }
    cursor = segmentEnd;

    if (marker === 0xDA) {
      const scanStart = cursor;
      let scanCursor = cursor;
      let foundMarker = false;
      while (scanCursor < bytes.length) {
        if (bytes[scanCursor] !== 0xFF) {
          scanCursor += 1;
          continue;
        }
        const nextMarkerStart = scanCursor;
        while (scanCursor < bytes.length && bytes[scanCursor] === 0xFF) {
          scanCursor += 1;
        }
        if (scanCursor >= bytes.length) {
          break;
        }
        const code = bytes[scanCursor];
        if (code === 0x00 || (code >= 0xD0 && code <= 0xD7)) {
          scanCursor += 1;
          continue;
        }
        parts.push(bytes.subarray(scanStart, nextMarkerStart));
        cursor = nextMarkerStart;
        foundMarker = true;
        break;
      }
      if (!foundMarker) {
        throw new TypeError('The JPEG scan has no end marker.');
      }
    }
  }

  if (!sawEnd) {
    throw new TypeError('The JPEG has no end-of-image marker.');
  }
  return result(concatenate(parts), 'image/jpeg', removed);
}

function stripPng(bytes: Uint8Array): MetadataRemovalOutput {
  if (!startsWith(bytes, PNG_SIGNATURE)) {
    throw new TypeError('The file does not contain a valid PNG signature.');
  }
  const parts: Uint8Array[] = [bytes.subarray(0, PNG_SIGNATURE.length)];
  const removed = new Map<string, RemovedMetadataItem>();
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  let cursor: number = PNG_SIGNATURE.length;
  let itemCount = 0;
  let sawHeader = false;
  let sawImageData = false;
  let sawEnd = false;

  while (cursor < bytes.length) {
    if (++itemCount > MAX_CONTAINER_ITEMS) {
      throw new RangeError('The PNG contains too many chunks.');
    }
    if (cursor + 12 > bytes.length) {
      throw new TypeError('The PNG chunk header is truncated.');
    }
    const length = view.getUint32(cursor, false);
    const type = ascii(bytes, cursor + 4, 4);
    if (!/^[A-Za-z]{4}$/u.test(type) || length > bytes.length - cursor - 12) {
      throw new TypeError('The PNG chunk structure is malformed.');
    }
    const chunkEnd = cursor + 12 + length;
    if (!sawHeader) {
      if (type !== 'IHDR' || length !== 13) {
        throw new TypeError('The PNG must start with one 13-byte IHDR chunk.');
      }
      sawHeader = true;
    }
    if (type === 'IDAT' || type === 'fdAT') {
      sawImageData = true;
    }
    const ancillary = (type.charCodeAt(0) & 0x20) !== 0;
    const removable = ancillary && !PNG_RENDERING_CHUNKS.has(type);
    if (removable) {
      addRemoved(removed, `PNG ${type}`, chunkEnd - cursor);
    }
    else {
      parts.push(bytes.subarray(cursor, chunkEnd));
    }
    cursor = chunkEnd;
    if (type === 'IEND') {
      if (length !== 0) {
        throw new TypeError('The PNG IEND chunk must be empty.');
      }
      sawEnd = true;
      if (cursor < bytes.length) {
        addRemoved(removed, 'trailing data', bytes.length - cursor);
      }
      break;
    }
  }

  if (!sawHeader || !sawImageData || !sawEnd) {
    throw new TypeError('The PNG is missing IHDR, image data, or IEND.');
  }
  return result(concatenate(parts), 'image/png', removed);
}

function stripWebp(bytes: Uint8Array): MetadataRemovalOutput {
  if (bytes.length < 20 || ascii(bytes, 0, 4) !== 'RIFF' || ascii(bytes, 8, 4) !== 'WEBP') {
    throw new TypeError('The file does not contain a valid WebP RIFF signature.');
  }
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  if (view.getUint32(4, true) !== bytes.length - 8) {
    throw new TypeError('The WebP RIFF length does not match the file size.');
  }
  const parts: Uint8Array[] = [bytes.slice(0, 12)];
  const removed = new Map<string, RemovedMetadataItem>();
  let cursor = 12;
  let itemCount = 0;
  let sawImageData = false;

  while (cursor < bytes.length) {
    if (++itemCount > MAX_CONTAINER_ITEMS) {
      throw new RangeError('The WebP contains too many chunks.');
    }
    if (cursor + 8 > bytes.length) {
      throw new TypeError('The WebP chunk header is truncated.');
    }
    const type = ascii(bytes, cursor, 4);
    const length = view.getUint32(cursor + 4, true);
    const paddedLength = length + (length & 1);
    if (length > bytes.length - cursor - 8 || paddedLength > bytes.length - cursor - 8) {
      throw new TypeError('The WebP chunk length is invalid.');
    }
    const chunkEnd = cursor + 8 + paddedLength;
    if (type === 'VP8 ' || type === 'VP8L' || type === 'ANMF') {
      sawImageData = true;
    }
    if (!WEBP_RENDERING_CHUNKS.has(type)) {
      addRemoved(removed, `WebP ${JSON.stringify(type)}`, chunkEnd - cursor);
    }
    else if (type === 'VP8X') {
      if (length !== 10) {
        throw new TypeError('The WebP VP8X chunk has an invalid length.');
      }
      const copy = bytes.slice(cursor, chunkEnd);
      copy[8] &= 0xF3;
      parts.push(copy);
    }
    else {
      parts.push(bytes.subarray(cursor, chunkEnd));
    }
    cursor = chunkEnd;
  }
  if (!sawImageData) {
    throw new TypeError('The WebP contains no image frame data.');
  }

  const output = concatenate(parts);
  new DataView(output.buffer).setUint32(4, output.byteLength - 8, true);
  return result(output, 'image/webp', removed);
}

export function stripImageMetadata(bytes: Uint8Array): MetadataRemovalOutput {
  if (bytes.byteLength === 0) {
    throw new TypeError('Select a non-empty JPEG, PNG, or WebP image.');
  }
  if (startsWith(bytes, [0xFF, 0xD8, 0xFF])) {
    return stripJpeg(bytes);
  }
  if (startsWith(bytes, PNG_SIGNATURE)) {
    return stripPng(bytes);
  }
  if (bytes.length >= 12 && ascii(bytes, 0, 4) === 'RIFF' && ascii(bytes, 8, 4) === 'WEBP') {
    return stripWebp(bytes);
  }
  throw new TypeError('Only signature-verified JPEG, PNG, and WebP images are supported.');
}
