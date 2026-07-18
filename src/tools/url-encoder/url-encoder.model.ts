export type UrlEncodingMode = 'component' | 'rfc3986' | 'rfc5987' | 'form';

export interface UrlEncodingModeDefinition {
  value: UrlEncodingMode
  label: string
  description: string
}

export const urlEncodingModes: UrlEncodingModeDefinition[] = [
  {
    value: 'component',
    label: 'URI component (encodeURIComponent)',
    description: 'JavaScript URI-component behavior. It leaves ! \' ( ) * and ~ unescaped.',
  },
  {
    value: 'rfc3986',
    label: 'Strict RFC 3986 component',
    description: 'Leaves only RFC 3986 unreserved characters (letters, digits, - . _ ~) unescaped.',
  },
  {
    value: 'rfc5987',
    label: 'RFC 5987 value (UTF-8)',
    description: 'Encodes only the value-chars part of an extended HTTP parameter; no UTF-8\'\' prefix is added.',
  },
  {
    value: 'form',
    label: 'Form URL encoded (UTF-8)',
    description: 'application/x-www-form-urlencoded value behavior: spaces become + and literal + becomes %2B.',
  },
];

function percentEncodeAsciiCharacter(character: string): string {
  return `%${character.charCodeAt(0).toString(16).toUpperCase()}`;
}

function decodePercentEncodedAsciiCharacter(sequence: string): string {
  return String.fromCharCode(Number.parseInt(sequence.slice(1), 16));
}

function encodeStrictRfc3986(value: string): string {
  return encodeURIComponent(value).replace(/[!'()*]/g, percentEncodeAsciiCharacter);
}

function encodeRfc5987Value(value: string): string {
  return encodeURIComponent(value)
    .replace(/['()*]/g, percentEncodeAsciiCharacter)
    .replace(/%(?:23|24|26|2B|5E|60|7C)/g, decodePercentEncodedAsciiCharacter);
}

function encodeFormValue(value: string): string {
  return encodeURIComponent(value)
    .replace(/[!'()~]/g, percentEncodeAsciiCharacter)
    .replace(/%20/g, '+');
}

const encoders: Record<UrlEncodingMode, (value: string) => string> = {
  component: encodeURIComponent,
  rfc3986: encodeStrictRfc3986,
  rfc5987: encodeRfc5987Value,
  form: encodeFormValue,
};

export function encodeUrlText(value: string, mode: UrlEncodingMode): string {
  return encoders[mode](value);
}

export function decodeUrlText(value: string, mode: UrlEncodingMode): string {
  const encodedValue = mode === 'form' ? value.replace(/\+/g, ' ') : value;

  return decodeURIComponent(encodedValue);
}
