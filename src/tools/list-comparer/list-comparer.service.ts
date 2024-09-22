import _ from 'lodash';
import intersection from 'array-intersection';
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
  const prepareList = (list: string) =>
    _.chain(list ?? '')
      .thru(text => ignoreCase ? text.toLowerCase() : text)
      .split(new RegExp(`[\\n${separator}]`))
      .map(text => trimItems ? text.trim() : text)
      .value();

  const list1Arr = prepareList(list1);
  const list2Arr = prepareList(list2);

  return {
    same: intersection(list1Arr, list2Arr),
    list2Not1: diff(list2Arr, list1Arr),
    list1Not2: diff(list1Arr, list2Arr),
  };
}
