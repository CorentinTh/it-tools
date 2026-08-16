import { describe, expect, it } from 'vitest';
import { calculateRaidStorage, formatRaidSummary } from './raid-storage-calculator.service';

describe('RAID storage calculator', () => {
  it('distinguishes decimal drive labels from binary display capacity exactly', () => {
    const result = calculateRaidStorage({ level: '5', diskCount: 4, diskCapacity: '4', inputUnitId: 'TB', outputUnitId: 'TiB' });

    expect(result).toMatchObject({
      dataDiskCount: 3,
      overheadDiskCount: 1,
      guaranteedDiskFailures: 1,
      efficiency: '75%',
      usableCapacity: '10.913936… TiB',
      usableBytesFraction: '12000000000000/1 bytes',
    });
  });

  it('models RAID 1, 6, and conditional RAID 10 failure tolerance', () => {
    expect(calculateRaidStorage({ level: '1', diskCount: 3, diskCapacity: '1', inputUnitId: 'TB', outputUnitId: 'TB' }))
      .toMatchObject({ usableCapacity: '1 TB', guaranteedDiskFailures: 2, maximumDiskFailures: 2 });
    expect(calculateRaidStorage({ level: '6', diskCount: 8, diskCapacity: '2', inputUnitId: 'TB', outputUnitId: 'TB' }))
      .toMatchObject({ usableCapacity: '12 TB', guaranteedDiskFailures: 2, maximumDiskFailures: 2 });
    expect(calculateRaidStorage({ level: '10', diskCount: 8, diskCapacity: '2', inputUnitId: 'TB', outputUnitId: 'TB' }))
      .toMatchObject({ usableCapacity: '8 TB', guaranteedDiskFailures: 1, maximumDiskFailures: 4 });
  });

  it('rejects impossible layouts and malformed or zero capacities', () => {
    expect(() => calculateRaidStorage({ level: '5', diskCount: 2, diskCapacity: '1', inputUnitId: 'TB', outputUnitId: 'TB' })).toThrow(/3–128/u);
    expect(() => calculateRaidStorage({ level: '10', diskCount: 5, diskCapacity: '1', inputUnitId: 'TB', outputUnitId: 'TB' })).toThrow(/even/u);
    expect(() => calculateRaidStorage({ level: '0', diskCount: 2, diskCapacity: '0', inputUnitId: 'TB', outputUnitId: 'TB' })).toThrow(/greater than zero/u);
    expect(() => calculateRaidStorage({ level: '0', diskCount: 2, diskCapacity: '1e3', inputUnitId: 'TB', outputUnitId: 'TB' })).toThrow(/positive decimal/u);
  });

  it('produces a portable summary with explicit non-goals', () => {
    const input = { level: '0' as const, diskCount: 2, diskCapacity: '500', inputUnitId: 'GB', outputUnitId: 'GB' };
    const summary = formatRaidSummary(input, calculateRaidStorage(input));
    expect(summary).toContain('Usable capacity: 1000 GB');
    expect(summary).toContain('filesystem, controller, spare, metadata, and rebuild overhead are excluded');
  });
});
