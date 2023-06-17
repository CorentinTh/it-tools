import xmlFormat, { type XMLFormatterOptions } from 'xml-formatter';

export function formatXml(value: string, options?: XMLFormatterOptions): string {
  return xmlFormat(value, options) || '';
}
