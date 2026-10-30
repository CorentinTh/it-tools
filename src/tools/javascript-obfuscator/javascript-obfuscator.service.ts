import { get } from '@vueuse/core';
import { type MaybeRef, computed } from 'vue';

export { obfuscateJavascript, useObfuscateJavascript };

function base64Encode(str: string) {
  // encode UTF-8 to base64
  return btoa(unescape(encodeURIComponent(str)));
}

function rot13Encode(str: string) {
  return str.replace(/[A-Za-z]/g, c => String.fromCharCode((c <= 'Z' ? 65 : 97) + ((c.charCodeAt(0) - (c <= 'Z' ? 65 : 97) + 13) % 26)));
}

function obfuscateJavascript(code: string, method: 'base64' | 'rot13' = 'base64'): string {
  if (!code) {
    return '';
  }

  if (method === 'base64') {
    const b = base64Encode(code);
    return `(function(){eval(atob('${b}'));})();`;
  }

  const r = rot13Encode(code);
  return `(function(s){function r(u){return u.replace(/[A-Za-z]/g,c=>String.fromCharCode((c<='Z'?65:97)+((c.charCodeAt(0)-(c<='Z'?65:97)+13)%26)))};eval(r(s))})('${r}');`;
}

function useObfuscateJavascript(code: MaybeRef<string>, method?: MaybeRef<'base64' | 'rot13'>) {
  return computed(() => obfuscateJavascript(get(code), get(method) || 'base64'));
}
