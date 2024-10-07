import _ from 'lodash';
import intersect from 'fast_array_intersect';
import diff from 'arr-diff';

export function compareLists({
  list1,
  list2,
  ignoreCase = false,
  trimItems = true,
  separator = '',
}: {
  list1: string
  list2: string
  separator?: string
  ignoreCase?: boolean
  trimItems?: boolean
}) {
  const splitSep = separator ? `${separator}|` : '';
  const splitRegExp = new RegExp(`(?:${splitSep}\\n)`, 'g');

  const prepareList = (list: string) =>
    _.chain(list ?? '')
      .thru(text => ignoreCase ? text.toLowerCase() : text)
      .split(splitRegExp)
      .map(text => trimItems ? text.trim() : text)
      .value();

  const list1Arr = prepareList(list1);
  const list2Arr = prepareList(list2);

  return {
    same: [...new Set(intersect([list1Arr, list2Arr]))],
    list2Not1: [...new Set(diff(list2Arr, list1Arr))],
    list1Not2: [...new Set(diff(list1Arr, list2Arr))],
  };
}
