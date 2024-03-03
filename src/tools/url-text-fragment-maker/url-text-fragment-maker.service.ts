export function getUrlWithTextFragment(
  { url, textStartSearch, textStopSearch, prefixSearch, suffixSearch }:
  { url: string
    textStartSearch: string
    textStopSearch?: string
    prefixSearch?: string
    suffixSearch?: string
  },
) {
  const isValidUrl = (urlString: string) => {
    try {
      return Boolean(new URL(urlString));
    }
    catch (e) {
      return false;
    }
  };
  if (!isValidUrl(url)) {
    throw new Error('Invalid url');
  }

  if (!url.match(/^https?:\/\//)) {
    throw new Error('Url must have http:// or https:// prefix');
  }

  const [textStartSearchFirstText, ...textStartSearchOtherTexts] = textStartSearch.split(',');
  const text = `${encodeURIComponent(prefixSearch ?? '')}-,${encodeURIComponent(textStartSearchFirstText.trim())},${encodeURIComponent(textStopSearch ?? '')},-${encodeURIComponent(suffixSearch ?? '')}`
    .replace(/^-,|,(?=,)|,-$/g, '')
    .replace(/,+/g, ',');
  let textStartSearchOtherTextEncoded = textStartSearchOtherTexts.map(t => `text=${encodeURIComponent(t.trim())}`).join('&');
  if (textStartSearchOtherTextEncoded.length) {
    textStartSearchOtherTextEncoded = `&${textStartSearchOtherTextEncoded}`;
  }
  return `${url.trim()}#:~:text=${text}${textStartSearchOtherTextEncoded}`;
}
