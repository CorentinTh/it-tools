import { describe, expect, it } from 'vitest';
import { downTimeToSLA, slaToDowntimes } from './sla-calculator.service';

describe('sla-calculator', () => {
  describe('downTimeToSLA', () => {
    it('compute correct values', () => {
      expect(downTimeToSLA({
        downTimeSeconds: 100,
        mondayHours: 16,
        tuesdayHours: 6,
        wednesdayHours: 4,
        thursdayHours: 24,
        fridayHours: 21,
        saturdayHours: 16,
        sundayHours: 13,
      })).to.deep.eq({
        slaForDay: null,
        slaForMonth: 99.99361155031703,
        slaForQuarter: 99.99787051677234,
        slaForWeek: 99.97222222222223,
        slaForYear: 99.99946762919309,
      });
      expect(downTimeToSLA({
        downTimeSeconds: 86400 / 10000,
      })).to.deep.eq({
        slaForDay: 99.99,
        slaForMonth: 99.99967145115916,
        slaForQuarter: 99.99989048371972,
        slaForWeek: 99.99857142857142,
        slaForYear: 99.99997262092992,
      });
      expect(downTimeToSLA({
        downTimeSeconds: 86400 / 2,
      })).to.deep.eq({
        slaForDay: 50,
        slaForMonth: 98.35725579580689,
        slaForQuarter: 99.45241859860229,
        slaForWeek: 92.85714285714286,
        slaForYear: 99.86310464965058,
      });
    });
  });
  describe('slaToDowntimes', () => {
    it('compute correct values', () => {
      expect(slaToDowntimes({
        targetSLA: 99,
        mondayHours: 9,
        tuesdayHours: 24,
        wednesdayHours: 10,
        thursdayHours: 8,
        fridayHours: 3,
        saturdayHours: 24,
        sundayHours: 4,
      })).to.deep.eq({
        secondsPerDay: null,
        secondsPerMonth: 12835.665,
        secondsPerQuarter: 38506.995,
        secondsPerWeek: 2952,
        secondsPerYear: 154027.98,
      });
      expect(slaToDowntimes({
        targetSLA: 99.99,
      })).to.deep.eq({
        secondsPerDay: 8.64,
        secondsPerMonth: 262.9746,
        secondsPerQuarter: 788.9238,
        secondsPerWeek: 60.48,
        secondsPerYear: 3155.6952,
      });
      expect(slaToDowntimes({
        targetSLA: 99,
      })).to.deep.eq({
        secondsPerDay: 864,
        secondsPerMonth: 26297.46,
        secondsPerQuarter: 78892.38,
        secondsPerWeek: 6048,
        secondsPerYear: 315569.52,
      });
    });
  });
});
