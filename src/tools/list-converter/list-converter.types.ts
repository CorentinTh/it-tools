export type SortOrder = 'asc' | 'desc' | null;
export type ConversionDirection = 'column-to-list' | 'list-to-column';

export interface ConvertOptions {
  direction: ConversionDirection
  lowerCase: boolean
  trimItems: boolean
  itemPrefix: string
  itemSuffix: string
  listPrefix: string
  listSuffix: string
  reverseList: boolean
  sortList: SortOrder
  removeDuplicates: boolean
  separator: string
  keepLineBreaks: boolean
}
