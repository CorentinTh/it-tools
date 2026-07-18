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
