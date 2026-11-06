export { byOrder };

function byOrder({ order }: { order: 'asc' | 'desc' | null | undefined }) {
  return (a: string, b: string) => {
    return order === 'asc' ? a.localeCompare(b) : b.localeCompare(a);
  };
}
