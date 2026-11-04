import type { MaybeRef } from 'vue';
import { computed, toValue } from 'vue';

export { obfuscateString, useObfuscateString };

function obfuscateString(
  str: string,
  { replacementChar = '*', keepFirst = 4, keepLast = 0, keepSpace = true }: { replacementChar?: string; keepFirst?: number; keepLast?: number; keepSpace?: boolean } = {},
): string {
  return str
    .split('')
    .map((char, index, array) => {
      if (keepSpace && char === ' ') {
        return char;
      }

      return (index < keepFirst || index >= array.length - keepLast) ? char : replacementChar;
    })
    .join('');
}

function useObfuscateString(
  str: MaybeRef<string>,
  config: { replacementChar?: MaybeRef<string>; keepFirst?: MaybeRef<number>; keepLast?: MaybeRef<number>; keepSpace?: MaybeRef<boolean> } = {},

) {
  return computed(() => obfuscateString(
    toValue(str),
    {
      replacementChar: toValue(config.replacementChar),
      keepFirst: toValue(config.keepFirst),
      keepLast: toValue(config.keepLast),
      keepSpace: toValue(config.keepSpace),
    },
  ));
}
