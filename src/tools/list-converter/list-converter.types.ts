export type SortOrder = 'asc' | 'desc' | null;

export type ConvertOptions = {
  lowerCase: boolean;
  trimItems: boolean;
  itemPrefix: string;
  itemSuffix: string;
  listPrefix: string;
  listSuffix: string;
  reverseList: boolean;
  sortList: SortOrder;
  removeDuplicates: boolean;
  separator: string;
  keepLineBreaks: boolean;
};
