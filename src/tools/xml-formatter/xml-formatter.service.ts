import xmlFormat, { type XMLFormatterOptions } from 'xml-formatter';
import { withDefaultOnError } from '@/utils/defaults';

export { formatXml, isValidXML };

function cleanRawXml(rawXml: string): string {
  return rawXml.trim();
}

function formatXml(rawXml: string, options?: XMLFormatterOptions): string {
  return withDefaultOnError(() => xmlFormat(cleanRawXml(rawXml), options) ?? '', '');
}

function isValidXML(rawXml: string): boolean {
  const cleanedRawXml = cleanRawXml(rawXml);

  if (cleanedRawXml === '') {
    return true;
  }

  try {
    xmlFormat(cleanedRawXml);
    return true;
  }
  catch (e) {
    return false;
  }
}
