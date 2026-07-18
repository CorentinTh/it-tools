/**
 * Return as soon as a string's UTF-8 representation exceeds a byte limit.
 * This avoids allocating the complete encoded payload merely to select a safe
 * rendering path for large tool output.
 */
export function exceedsUtf8ByteLimit(value: string, maxBytes: number): boolean {
  if (!Number.isSafeInteger(maxBytes) || maxBytes < 0) {
    throw new RangeError('maxBytes must be a non-negative safe integer.');
  }

  let byteLength = 0;

  for (let index = 0; index < value.length; index += 1) {
    const codeUnit = value.charCodeAt(index);

    if (codeUnit <= 0x007F) {
      byteLength += 1;
    }
    else if (codeUnit <= 0x07FF) {
      byteLength += 2;
    }
    else if (
      codeUnit >= 0xD800
      && codeUnit <= 0xDBFF
      && value.charCodeAt(index + 1) >= 0xDC00
      && value.charCodeAt(index + 1) <= 0xDFFF
    ) {
      byteLength += 4;
      index += 1;
    }
    else {
      // TextEncoder replaces unmatched UTF-16 surrogates with U+FFFD.
      byteLength += 3;
    }

    if (byteLength > maxBytes) {
      return true;
    }
  }

  return false;
}

/**
 * Validate byte metadata produced by a worker without re-encoding the complete
 * result on the main thread. UTF-8 needs between one and three bytes per
 * UTF-16 code unit (a surrogate pair uses four bytes for two code units).
 */
export function hasPlausibleUtf8ByteLength(
  value: string,
  byteLength: unknown,
  maxBytes: number,
): byteLength is number {
  if (!Number.isSafeInteger(maxBytes) || maxBytes < 0) {
    throw new RangeError('maxBytes must be a non-negative safe integer.');
  }

  return typeof byteLength === 'number'
    && Number.isSafeInteger(byteLength)
    && byteLength >= value.length
    && byteLength <= Math.min(maxBytes, value.length * 3);
}

/**
 * Return the longest prefix whose UTF-8 representation fits within maxBytes.
 * Surrogate pairs are kept intact, and unmatched surrogates use the same
 * replacement-character byte accounting as TextEncoder.
 */
export function truncateUtf8ToByteLimit(value: string, maxBytes: number): string {
  if (!Number.isSafeInteger(maxBytes) || maxBytes < 0) {
    throw new RangeError('maxBytes must be a non-negative safe integer.');
  }

  let byteLength = 0;
  let end = 0;

  for (let index = 0; index < value.length; index += 1) {
    const codeUnit = value.charCodeAt(index);
    let characterBytes: number;
    let codeUnits = 1;

    if (codeUnit <= 0x007F) {
      characterBytes = 1;
    }
    else if (codeUnit <= 0x07FF) {
      characterBytes = 2;
    }
    else if (
      codeUnit >= 0xD800
      && codeUnit <= 0xDBFF
      && value.charCodeAt(index + 1) >= 0xDC00
      && value.charCodeAt(index + 1) <= 0xDFFF
    ) {
      characterBytes = 4;
      codeUnits = 2;
    }
    else {
      characterBytes = 3;
    }

    if (byteLength + characterBytes > maxBytes) {
      break;
    }

    byteLength += characterBytes;
    end = index + codeUnits;
    index += codeUnits - 1;
  }

  return value.slice(0, end);
}
