export function decodeSafeLinksURL(safeLinksUrl: string) {
  if (!/\.safelinks\.protection\.outlook\.com/.test(safeLinksUrl)) {
    throw new Error('Invalid SafeLinks URL provided');
  }

  return new URL(safeLinksUrl).searchParams.get('url');
}
