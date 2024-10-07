export type SortOrder = null | 'asc' | 'desc' | 'asc-num' | 'desc-num' | 'asc-bin' | 'desc-bin' | 'asc-upper' | 'desc-upper';

export interface ConvertOptions {
  lowerCase?: boolean
  trimItems?: boolean
  itemPrefix?: string
  itemSuffix?: string
  removeItemPrefix?: string
  removeItemSuffix?: string
  listPrefix?: string
  listSuffix?: string
  reverseList?: boolean
  sortList?: SortOrder
  removeDuplicates?: boolean
  itemsSeparator?: string
  splitBySeparator?: string
  keepLineBreaks?: boolean
}
