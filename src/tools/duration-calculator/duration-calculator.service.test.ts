import { describe, expect, it } from 'vitest';
import { computeDuration } from './duration-calculator.service';

const zeroResult = {
  errors: [],
  total: {
    days: 0,
    hours: 0,
    iso8601Duration: 'P0Y0M0DT0H0M0S',
    milliseconds: 0,
    minutes: 0,
    prettified: '0ms',
    prettifiedColonNotation: '0:00',
    prettifiedDaysColon: '00:00:00',
    prettifiedHoursColon: '00:00:00',
    prettifiedVerbose: '0 milliseconds',
    seconds: 0,
    weeks: 0,
    years: 0,
  },
};

describe('duration-calculator', () => {
  describe('computeDuration', () => {
    it('should compute correct sum/values', () => {
      expect(computeDuration('')).to.deep.eq(zeroResult);
      expect(computeDuration('00:00:00')).to.deep.eq(zeroResult);
      expect(computeDuration('0h')).to.deep.eq(zeroResult);
      expect(computeDuration('0s')).to.deep.eq(zeroResult);
      expect(computeDuration('3600s')).to.deep.eq({
        errors: [],
        total: {
          days: 0.041666666666666664,
          hours: 1,
          iso8601Duration: 'P0Y0M0DT1H0M0S',
          milliseconds: 3600000,
          minutes: 60,
          prettified: '1h',
          prettifiedColonNotation: '1:00:00',
          prettifiedDaysColon: '01:00:00',
          prettifiedHoursColon: '01:00:00',
          prettifiedVerbose: '1 hour',
          seconds: 3600,
          weeks: 0.005952380952380952,
          years: 0.00011415525114155251,
        },
      });
      expect(computeDuration('1h 20m')).to.deep.eq({
        errors: [],
        total: {
          days: 0.05555555555555555,
          hours: 1.3333333333333333,
          iso8601Duration: 'P0Y0M0DT1H20M0S',
          milliseconds: 4800000,
          minutes: 80,
          prettified: '1h 20m',
          prettifiedColonNotation: '1:20:00',
          prettifiedDaysColon: '01:20:00',
          prettifiedHoursColon: '01:20:00',
          prettifiedVerbose: '1 hour 20 minutes',
          seconds: 4800,
          weeks: 0.007936507936507936,
          years: 0.00015220700152207003,
        },
      });
      expect(computeDuration('01:02:03')).to.deep.eq({
        errors: [],
        total: {
          days: 0.043090277777777776,
          hours: 1.0341666666666667,
          iso8601Duration: 'P0Y0M0DT1H2M3S',
          milliseconds: 3723000,
          minutes: 62.05,
          prettified: '1h 2m 3s',
          prettifiedColonNotation: '1:02:03',
          prettifiedDaysColon: '01:02:03',
          prettifiedHoursColon: '01:02:03',
          prettifiedVerbose: '1 hour 2 minutes 3 seconds',
          seconds: 3723,
          weeks: 0.006155753968253968,
          years: 0.00011805555555555556,
        },
      });
      expect(computeDuration('-01:02:03')).to.deep.eq({
        errors: [],
        total: {
          days: -0.043090277777777776,
          hours: -1.0341666666666667,
          iso8601Duration: 'P0Y0M0DT1H2M3S',
          milliseconds: -3723000,
          minutes: -62.05,
          prettified: '-1h 2m 3s',
          prettifiedColonNotation: '-1:02:03',
          prettifiedDaysColon: '-2:-3:-3',
          prettifiedHoursColon: '-2:-3:-3',
          prettifiedVerbose: '-1 hour 2 minutes 3 seconds',
          seconds: -3723,
          weeks: -0.006155753968253968,
          years: -0.00011805555555555556,
        },
      });
      expect(computeDuration('+01:02:05')).to.deep.eq({
        errors: [],
        total: {
          days: 0.04311342592592592,
          hours: 1.0347222222222223,
          iso8601Duration: 'P0Y0M0DT1H2M5S',
          milliseconds: 3725000,
          minutes: 62.083333333333336,
          prettified: '1h 2m 5s',
          prettifiedColonNotation: '1:02:05',
          prettifiedDaysColon: '01:02:05',
          prettifiedHoursColon: '01:02:05',
          prettifiedVerbose: '1 hour 2 minutes 5 seconds',
          seconds: 3725,
          weeks: 0.006159060846560847,
          years: 0.00011811897513952308,
        },
      });
      expect(computeDuration('25s\n+02:40:00.125\n-10s')).to.deep.eq({
        errors: [],
        total: {
          days: 0.11128616898148148,
          hours: 2.6708680555555557,
          iso8601Duration: 'P0Y0M0DT2H40M15.125S',
          milliseconds: 9615125,
          minutes: 160.25208333333333,
          prettified: '2h 40m 15s 125ms',
          prettifiedColonNotation: '2:40:15.1',
          prettifiedDaysColon: '02:40:15.125',
          prettifiedHoursColon: '02:40:15.125',
          prettifiedVerbose: '2 hours 40 minutes 15 seconds 125 milliseconds',
          seconds: 9615.125,
          weeks: 0.01589802414021164,
          years: 0.00030489361364789447,
        },
      });
      expect(computeDuration('3d 25s\n+00:40:00\n-10s')).to.deep.eq({
        errors: [],
        total: {
          days: 3.027951388888889,
          hours: 72.67083333333333,
          iso8601Duration: 'P0Y0M3DT0H40M15S',
          milliseconds: 261615000,
          minutes: 4360.25,
          prettified: '3d 40m 15s',
          prettifiedColonNotation: '3:00:40:15',
          prettifiedDaysColon: '3d 00:40:15',
          prettifiedHoursColon: '72:40:15',
          prettifiedVerbose: '3 days 40 minutes 15 seconds',
          seconds: 261615,
          weeks: 0.4325644841269841,
          years: 0.008295757229832572,
        },
      });
      expect(computeDuration('25s\n+12:40\n-10s')).to.deep.eq({
        errors: [],
        total: {
          days: 0.5279513888888889,
          hours: 12.670833333333333,
          iso8601Duration: 'P0Y0M0DT12H40M15S',
          milliseconds: 45615000,
          minutes: 760.25,
          prettified: '12h 40m 15s',
          prettifiedColonNotation: '12:40:15',
          prettifiedDaysColon: '12:40:15',
          prettifiedHoursColon: '12:40:15',
          prettifiedVerbose: '12 hours 40 minutes 15 seconds',
          seconds: 45615,
          weeks: 0.07542162698412698,
          years: 0.0014464421613394217,
        },
      });

      expect(computeDuration('P4DT12H20M20.3S')).to.deep.eq({
        errors: [],
        total: {
          days: 4.514123842592593,
          hours: 108.33897222222222,
          iso8601Duration: 'P0Y0M4DT12H20M20.3S',
          milliseconds: 390020300,
          minutes: 6500.338333333333,
          prettified: '4d 12h 20m 20s 300ms',
          prettifiedColonNotation: '4:12:20:20.3',
          prettifiedDaysColon: '4d 12:20:20.300',
          prettifiedHoursColon: '108:20:20.300',
          prettifiedVerbose: '4 days 12 hours 20 minutes 20 seconds 300 milliseconds',
          seconds: 390020.3,
          weeks: 0.6448748346560846,
          years: 0.012367462582445459,
        },
      });
      expect(computeDuration('25s\n+PT20H\n-10s')).to.deep.eq({
        errors: [],
        total: {
          days: 0.8335069444444444,
          hours: 20.004166666666666,
          iso8601Duration: 'P0Y0M0DT20H0M15S',
          milliseconds: 72015000,
          minutes: 1200.25,
          prettified: '20h 15s',
          prettifiedColonNotation: '20:00:15',
          prettifiedDaysColon: '20:00:15',
          prettifiedHoursColon: '20:00:15',
          prettifiedVerbose: '20 hours 15 seconds',
          seconds: 72015,
          weeks: 0.11907242063492063,
          years: 0.0022835806697108067,
        },
      });
    });
    it('should report invalid lines', () => {
      expect(computeDuration('azerr')).to.deep.eq({
        errors: [
          'azerr',
        ],
        total: {
          days: 0,
          hours: 0,
          iso8601Duration: 'P0Y0M0DT0H0M0S',
          milliseconds: 0,
          minutes: 0,
          prettified: '0ms',
          prettifiedColonNotation: '0:00',
          prettifiedDaysColon: '00:00:00',
          prettifiedHoursColon: '00:00:00',
          prettifiedVerbose: '0 milliseconds',
          seconds: 0,
          weeks: 0,
          years: 0,
        },
      });
      expect(computeDuration('25s\ner\n-10s')).to.deep.eq({
        errors: [
          'er',
        ],
        total: {
          days: 0.00017361111111111112,
          hours: 0.004166666666666667,
          iso8601Duration: 'P0Y0M0DT0H0M15S',
          milliseconds: 15000,
          minutes: 0.25,
          prettified: '15s',
          prettifiedColonNotation: '0:15',
          prettifiedDaysColon: '00:00:15',
          prettifiedHoursColon: '00:00:15',
          prettifiedVerbose: '15 seconds',
          seconds: 15,
          weeks: 0.0000248015873015873,
          years: 4.756468797564688e-7,
        },
      });
      expect(computeDuration('25s\n+00:40:00\ner')).to.deep.eq({
        errors: [
          'er',
        ],
        total: {
          days: 0.02806712962962963,
          hours: 0.6736111111111112,
          iso8601Duration: 'P0Y0M0DT0H40M25S',
          milliseconds: 2425000,
          minutes: 40.416666666666664,
          prettified: '40m 25s',
          prettifiedColonNotation: '40:25',
          prettifiedDaysColon: '00:40:25',
          prettifiedHoursColon: '00:40:25',
          prettifiedVerbose: '40 minutes 25 seconds',
          seconds: 2425,
          weeks: 0.004009589947089947,
          years: 0.00007689624556062913,
        },
      });
      expect(computeDuration('ty\n+12:40\n-10s')).to.deep.eq({
        errors: [
          'ty',
        ],
        total: {
          days: 0.5276620370370371,
          hours: 12.66388888888889,
          iso8601Duration: 'P0Y0M0DT12H39M50S',
          milliseconds: 45590000,
          minutes: 759.8333333333334,
          prettified: '12h 39m 50s',
          prettifiedColonNotation: '12:39:50',
          prettifiedDaysColon: '12:39:50',
          prettifiedHoursColon: '12:39:50',
          prettifiedVerbose: '12 hours 39 minutes 50 seconds',
          seconds: 45590,
          weeks: 0.075380291005291,
          years: 0.0014456494165398274,
        },
      });
    });
    it('support comment lines (#)', () => {
      expect(computeDuration('25s\n # comment\n-10s')).to.deep.eq({
        errors: [],
        total: {
          days: 0.00017361111111111112,
          hours: 0.004166666666666667,
          iso8601Duration: 'P0Y0M0DT0H0M15S',
          milliseconds: 15000,
          minutes: 0.25,
          prettified: '15s',
          prettifiedColonNotation: '0:15',
          prettifiedDaysColon: '00:00:15',
          prettifiedHoursColon: '00:00:15',
          prettifiedVerbose: '15 seconds',
          seconds: 15,
          weeks: 0.0000248015873015873,
          years: 4.756468797564688e-7,
        },
      });
    });
    it('support timespan format d.hh:mm:ss.fff', () => {
      expect(computeDuration('3.12:12:12\n-1.12:12:12\n+0:0:0.125')).to.deep.eq({
        errors: [],
        total: {
          days: 2.000001446759259,
          hours: 48.000034722222225,
          iso8601Duration: 'P0Y0M2DT0H0M0.125S',
          milliseconds: 172800125,
          minutes: 2880.0020833333333,
          prettified: '2d 125ms',
          prettifiedColonNotation: '2:00:00:00.1',
          prettifiedDaysColon: '2d 00:00:00.125',
          prettifiedHoursColon: '48:00:00.125',
          prettifiedVerbose: '2 days 125 milliseconds',
          seconds: 172800.125,
          weeks: 0.2857144923941799,
          years: 0.005479456018518519,
        },
      });
      expect(computeDuration('12:12:12.1')).to.deep.eq({
        errors: [],
        total: {
          days: 0.5084733796296297,
          hours: 12.20336111111111,
          iso8601Duration: 'P0Y0M0DT12H12M12.1S',
          milliseconds: 43932100,
          minutes: 732.2016666666667,
          prettified: '12h 12m 12s 100ms',
          prettifiedColonNotation: '12:12:12.1',
          prettifiedDaysColon: '12:12:12.100',
          prettifiedHoursColon: '12:12:12.100',
          prettifiedVerbose: '12 hours 12 minutes 12 seconds 100 milliseconds',
          seconds: 43932.1,
          weeks: 0.07263905423280423,
          years: 0.0013930777524099442,
        },
      });
      expect(computeDuration('12:12:12.12')).to.deep.eq({
        errors: [],
        total: {
          days: 0.5084736111111111,
          hours: 12.203366666666666,
          iso8601Duration: 'P0Y0M0DT12H12M12.12S',
          milliseconds: 43932120,
          minutes: 732.202,
          prettified: '12h 12m 12s 120ms',
          prettifiedColonNotation: '12:12:12.1',
          prettifiedDaysColon: '12:12:12.120',
          prettifiedHoursColon: '12:12:12.120',
          prettifiedVerbose: '12 hours 12 minutes 12 seconds 120 milliseconds',
          seconds: 43932.12,
          weeks: 0.0726390873015873,
          years: 0.001393078386605784,
        },
      });
    });
  });
});
