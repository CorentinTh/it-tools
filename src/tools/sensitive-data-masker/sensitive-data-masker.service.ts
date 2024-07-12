import { type SensitiveContentKey, maskString } from 'data-guardian';
import ipRegex from 'ip-regex';

const jwtRegex = /\b([a-zA-Z0-9_=]{5,})\.([a-zA-Z0-9_=]{5,})\.([a-zA-Z0-9_\-\+\/=]{5,})\b/g;
const phoneRegex = /(?:(\+\d{1,4})[-.\s]?)(?:[(](\d{1,3})[)][-.\s]?)?(\d{1,4})[-.\s]?(\d{1,4})[-.\s]?(\d{1,9})\b/g;
const macRegex = /\b([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})\b/g;
const urlWithOrWithoutPrefixRegex = /\b(https?:\/\/)?(www\.)?[a-zA-Z0-9@:%._+~#=-]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&\/=]*)\b/g;

export type MatcherNames = 'uuid' | 'creditCard' | 'ssn' | 'url' | 'ipv4' | 'email' | 'passwordInUri' | 'mac' | 'ipv6' | 'urlWithOrWithoutPrefix' | 'jwt' | 'phone';

export function maskSensitiveData({
  value,
  customRegex = '',
  excludedMatchers = [],
}: {
  value: string
  customRegex?: string
  excludedMatchers?: Array<MatcherNames>
}) {
  excludedMatchers = excludedMatchers || [];
  const emptyRegex = /(?:)/g;
  return maskString(value, null as never, {
    customRegex: new RegExp((customRegex || '').split('\n').map(line => `(${line})`).join('|'), 'gi'),
    macRegex: excludedMatchers.includes('mac') ? emptyRegex : macRegex,
    ipv6Regex: excludedMatchers.includes('ipv6') ? emptyRegex : ipRegex.v6({ includeBoundaries: false }),
    urlWithOrWithoutPrefixRegex: excludedMatchers.includes('urlWithOrWithoutPrefix') ? emptyRegex : urlWithOrWithoutPrefixRegex,
    jwtRegex: excludedMatchers.includes('jwt') ? emptyRegex : jwtRegex,
    phoneRegex: excludedMatchers.includes('phone') ? emptyRegex : phoneRegex,
  }, {
    excludeMatchers: [...excludedMatchers, ...[
      'passwordMention', 'password', 'passwordSubstring',
    ]] as SensitiveContentKey[],
  });
}
