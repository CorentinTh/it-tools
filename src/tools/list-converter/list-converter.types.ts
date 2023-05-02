export type SortOrder = 'asc' | 'desc' | null;

export type ConvertOptions = {
  lowerCase: boolean;
  trimItems: boolean;
  itemPrefix: string | undefined;
  itemSuffix: string | undefined;
  listPrefix: string | undefined;
  listSuffix: string | undefined;
  reverseList: boolean;
  sortList: SortOrder;
  removeDuplicates: boolean;
  separator: string | undefined;
  keepLineBreaks: boolean;
};
