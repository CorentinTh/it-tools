import type { CSelectOption } from '../c-select/c-select.types';

export type CButtonSelectOption<T> = CSelectOption<T> & {
  tooltip?: string
};
