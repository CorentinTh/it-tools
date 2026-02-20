import { describe, expect, it } from 'vitest';
import { getRealSize } from './hdd-calculator.service';

describe('hdd-calculator', () => {
  it('Convert Claimed Size to Real Size', async () => {
    expect(getRealSize(10, 'gb', 'tb')).to.equal(0.009094947017729282);
    expect(getRealSize(10, 'pb', 'mb')).to.equal(9536743164.0625);
    expect(getRealSize(100, 'tb', 'gb')).to.equal(93132.25746154785);
    expect(getRealSize(1, 'pb', 'gb')).to.equal(931322.5746154785);
    expect(getRealSize(1000, 'tb', 'gb')).to.equal(931322.5746154785);
  });
});
