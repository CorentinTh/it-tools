export function getSmartValue(raw: number) {
  const n = raw.toString(2);
  let bin = '';
  for (let i = 0; i < 64 - n.length; ++i) {
    bin += '0';
  }
  bin += n;
  const lo = Number.parseInt(bin.slice(0, 32), 2);
  const hi = Number.parseInt(bin.slice(32), 2);
  return {
    errors: lo,
    operations: hi,
  };
}
