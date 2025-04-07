const unitsConversion = {
  kb: { dec: 1_000, bin: 1024 },
  mb: { dec: 1_000_000, bin: 1024 * 1024 },
  gb: { dec: 1_000_000_000, bin: 1024 * 1024 * 1024 },
  tb: { dec: 1_000_000_000_000, bin: 1024 * 1024 * 1024 * 1024 },
  pb: { dec: 1_000_000_000_000_000, bin: 1024 * 1024 * 1024 * 1024 * 1024 },
};

export type Units = 'kb' | 'mb' | 'gb' | 'tb' | 'pb';
export function getRealSize(claimedCapacity: number, claimedUnit: Units, toUnit: Units) {
  const fromUnit = unitsConversion[claimedUnit];
  const toUnitBin = unitsConversion[toUnit].bin;
  return claimedCapacity * fromUnit.dec / toUnitBin;
};
