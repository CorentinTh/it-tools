export interface TextStatistics {
  characterCount: number
  wordCount: number
  lineCount: number
  byteSize: number
}

function isWhitespace(codeUnit: number) {
  return (
    (codeUnit >= 0x0009 && codeUnit <= 0x000D)
    || codeUnit === 0x0020
    || codeUnit === 0x00A0
    || codeUnit === 0x1680
    || (codeUnit >= 0x2000 && codeUnit <= 0x200A)
    || codeUnit === 0x2028
    || codeUnit === 0x2029
    || codeUnit === 0x202F
    || codeUnit === 0x205F
    || codeUnit === 0x3000
    || codeUnit === 0xFEFF
  );
}

/**
 * Computes the displayed statistics in one linear pass with constant
 * additional memory. Character count deliberately follows String#length so
 * the UI keeps its existing UTF-16 code-unit semantics.
 */
export function getTextStatistics(text: string): TextStatistics {
  const characterCount = text.length;

  if (characterCount === 0) {
    return {
      characterCount,
      wordCount: 0,
      lineCount: 0,
      byteSize: 0,
    };
  }

  let wordCount = 0;
  let lineCount = 1;
  let byteSize = 0;
  let isInsideWord = false;

  for (let index = 0; index < characterCount; index += 1) {
    const codeUnit = text.charCodeAt(index);

    if (isWhitespace(codeUnit)) {
      isInsideWord = false;
    }
    else if (!isInsideWord) {
      wordCount += 1;
      isInsideWord = true;
    }

    if (codeUnit === 0x000D) {
      lineCount += 1;
    }
    else if (codeUnit === 0x000A && text.charCodeAt(index - 1) !== 0x000D) {
      lineCount += 1;
    }

    if (codeUnit <= 0x007F) {
      byteSize += 1;
    }
    else if (codeUnit <= 0x07FF) {
      byteSize += 2;
    }
    else if (
      codeUnit >= 0xD800
      && codeUnit <= 0xDBFF
      && text.charCodeAt(index + 1) >= 0xDC00
      && text.charCodeAt(index + 1) <= 0xDFFF
    ) {
      byteSize += 4;
      index += 1;
    }
    else {
      // BMP characters use three bytes. TextEncoder also replaces unmatched
      // UTF-16 surrogates with U+FFFD, which is encoded as three bytes.
      byteSize += 3;
    }
  }

  return {
    characterCount,
    wordCount,
    lineCount,
    byteSize,
  };
}

export function getStringSizeInBytes(text: string) {
  return getTextStatistics(text).byteSize;
}
