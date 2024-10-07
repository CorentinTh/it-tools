export type SortOrder = 'asc' | 'desc' | 'asc-num' | 'desc-num' | 'asc-bin' | 'desc-bin' | 'asc-upper' | 'desc-upper' | null | undefined;

export function byOrder({ order }: { order: SortOrder }) {
  if (order === 'asc-bin' || order === 'desc-bin') {
    return (a: string, b: string) => {
      const compare = a > b ? 1 : (a < b ? -1 : 0); // NOSONAR
      return order === 'asc-bin' ? compare : -compare;
    };
  }
  if (order === 'asc-num' || order === 'desc-num') {
    return (a: string, b: string) => {
      const compare = a.localeCompare(b, undefined, {
        numeric: true,
      });
      return order === 'asc-num' ? compare : -compare;
    };
  }
  if (order === 'asc-upper' || order === 'desc-upper') {
    return (a: string, b: string) => {
      const compare = a.localeCompare(b, undefined, {
        caseFirst: 'upper',
      });
      return order === 'asc-upper' ? compare : -compare;
    };
  }

  return (a: string, b: string) => {
    return order === 'asc' ? a.localeCompare(b) : b.localeCompare(a);
  };
}
