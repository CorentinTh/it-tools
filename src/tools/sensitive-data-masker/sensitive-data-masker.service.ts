import { maskString } from 'data-guardian';

const jwtRegex = /\b([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_\-\+\/=]*)\b/g;
const phoneRegex = /\b(?:(\+\d{1,4})[-.\s]?)?(?:[(](\d{1,3})[)][-.\s]?)?(\d{1,4})[-.\s]?(\d{1,4})[-.\s]?(\d{1,9})\b/g;
const macRegex = /\b([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})\b/g;
const ipv6Regex = /\b(?:(::|[0-9a-fA-F]{1,4}:{1,2})([0-9a-fA-F]{1,4}:{1,2}){0,6}([0-9a-fA-F]{1,4}|::)?)\b/g;
const urlWithOrWithoutPrefixRegex = /\b(https?:\/\/)?(www\\.)?[-a-zA-Z0-9@:%.\_\\+~#=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%\_\\+.~#?&//=]\*)\b/g;

export function maskSensitiveData(value: string, customRegex?: string) {
  return maskString(value, null as never, {
    customRegex: new RegExp((customRegex || '').split('\n').map(line => `(${line})`).join('|'), 'gi'),
    macRegex,
    ipv6Regex,
    urlWithOrWithoutPrefixRegex,
    jwtRegex,
    phoneRegex,
  }, {
    excludeMatchers: [
      'passwordMention', 'password', 'passwordSubstring',
    ],
  });
}
