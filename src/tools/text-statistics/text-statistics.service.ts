export function getStringSizeInBytes(text: string) {
  return new TextEncoder().encode(text).buffer.byteLength;
}

export function textStatistics(text: string) {
  return {
    chars: text.length,
    chars_no_spaces: text.replace(/\s+/ug, '').length,
    chars_upper: text.replace(/[^\p{Lu}]/ug, '').length,
    chars_lower: text.replace(/[^\p{Ll}]/ug, '').length,
    chars_digits: text.replace(/\D+/ug, '').length,
    chars_puncts: text.replace(/[^\p{P}]/ug, '').length,
    chars_spaces: text.replace(/\S/ug, '').length,
    words: text.trim().split(/\s+/).length,
    words_no_puncs: text.replace(/\p{P}/ug, '').trim().split(/\s+/).length,
    sentences: (`${text} `).split(/\w\s*[\.!\?][\s\p{P}]*\s/u).filter(s => s && s?.length > 0).length,
    lines: text.split(/\r\n|\r|\n/).length,
  };
}
