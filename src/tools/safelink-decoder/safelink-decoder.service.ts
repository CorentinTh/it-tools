export function decodeSafeLinksURL(safeLinksUrl: string) {
  return new URL(safeLinksUrl).searchParams.get('url')
}
