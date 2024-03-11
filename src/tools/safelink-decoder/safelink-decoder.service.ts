import { translate as t } from '@/plugins/i18n.plugin';

export function decodeSafeLinksURL(safeLinksUrl: string) {
  if (!safeLinksUrl.match(/\.safelinks\.protection\.outlook\.com/)) {
    throw new Error(t('tools.safelink-decoder.invalidMessage'));
  }

  return new URL(safeLinksUrl).searchParams.get('url');
}
