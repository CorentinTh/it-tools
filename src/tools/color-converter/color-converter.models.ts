import type { Colord } from 'colord';
import { colord } from 'colord';
import { useValidation } from '@/composable/validation';
import { withDefaultOnError } from '@/utils/defaults';

export { buildColorFormat, removeAlphaChannelWhenOpaque };

function removeAlphaChannelWhenOpaque(hexColor: string) {
  return hexColor.replace(/^(#(?:[0-9a-f]{3}){1,2})ff$/i, '$1');
}

function buildColorFormat({
  label,
  parse = value => colord(value),
  format,
  placeholder,
  invalidMessage = `Invalid ${label.toLowerCase()} format.`,
  type = 'text',
}: {
  label: string
  parse?: (value: string) => Colord
  format: (value: Colord) => string
  placeholder?: string
  invalidMessage?: string
  type?: 'text' | 'color-picker'
}) {
  const value = ref('');

  return {
    type,
    label,
    parse: (v: string) => withDefaultOnError(() => parse(v), undefined),
    format,
    placeholder,
    value,
    validation: useValidation({
      source: value,
      rules: [
        {
          message: invalidMessage,
          validator: v => withDefaultOnError(() => {
            if (v === '') {
              return true;
            }

            return parse(v).isValid();
          }, false),
        },
      ],
    }),

  };
}
