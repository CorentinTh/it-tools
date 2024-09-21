export type SortOrder = 'asc' | 'desc' | null;

export interface ConvertOptions {
  lowerCase: boolean
  trimItems: boolean
  itemPrefix: string
  itemSuffix: string
  removeItemPrefix: string
  removeItemSuffix: string
  listPrefix: string
  listSuffix: string
  reverseList: boolean
  sortList: SortOrder
  removeDuplicates: boolean
  separator: string
  keepLineBreaks: boolean
}
