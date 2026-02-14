export function decodeSharePointsURL(sharePointsUrl: string) {
  if (!sharePointsUrl.match(/\.sharepoint\.com/)) {
    throw new Error('Invalid SharePoint URL provided');
  }

  const url = new URL(sharePointsUrl);
  return `${url.protocol}//${url.hostname}${url.searchParams.get('id')}`;
}
