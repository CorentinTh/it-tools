import { describe, expect, it } from 'vitest';
import { extractId, extractMachineId, extractTimestamp } from './snowflake-id-extractor.service';

describe('snowflake-id-extractor', () => {
  it('extract id from Snowflake ID', () => {
    expect(extractId(1263785187301658678n)).toBe(54);
  });
  it('extract machine id from Snowflake ID', () => {
    expect(extractMachineId(1263785187301658678n)).toBe(65);
  });
  it('extract timestamp from Snowflake ID', () => {
    expect(extractTimestamp(1263785187301658678n, new Date(1420070400000))).toStrictEqual(new Date(1721380268646));
  });
});
