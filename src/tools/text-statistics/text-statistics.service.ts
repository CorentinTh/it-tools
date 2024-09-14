export function getStringSizeInBytes(text: string) {
  return new TextEncoder().encode(text).buffer.byteLength;
}

export function textStatistics(text: string) {
  const words_no_puncts = text.replace(/\p{P}/ug, '').trim().split(/\s+/);
  const read_word_per_minutes = 200;
  return {
    chars: text.length,
    chars_no_spaces: text.replace(/\s+/ug, '').length,
    chars_upper: text.replace(/[^\p{Lu}]/ug, '').length,
    chars_lower: text.replace(/[^\p{Ll}]/ug, '').length,
    chars_digits: text.replace(/\D+/ug, '').length,
    chars_puncts: text.replace(/[^\p{P}]/ug, '').length,
    chars_spaces: text.replace(/\S/ug, '').length,
    words: text.trim().split(/\s+/).length,
    read_time: words_no_puncts.length / read_word_per_minutes * 60,
    words_no_puncs: words_no_puncts.length,
    words_uniques: (new Set(words_no_puncts)).size,
    words_uniques_ci: (new Set(words_no_puncts.map(s => s.toLowerCase()))).size,
    sentences: (`${text} `).split(/\w\s*[\.!\?][\s\p{P}]*\s/u).filter(s => s && s?.length > 0).length,
    lines: text.split(/\r\n|\r|\n/).length,
  };
}
