export interface CKeyValueListItem {
  label: string
  value: string | string[] | number | boolean | undefined | null
  hideOnNil?: boolean
  placeholder?: string
  showCopyButton?: boolean
}

export type CKeyValueListItems = CKeyValueListItem[];
