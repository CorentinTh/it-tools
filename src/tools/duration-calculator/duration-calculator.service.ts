import parse from 'parse-duration';
import prettyMilliseconds from 'pretty-ms';
import { formatISODuration, intervalToDuration } from 'date-fns';
import * as iso8601Duration from 'duration-fns';

interface ConvertedDuration {
  prettified: string
  prettifiedVerbose: string
  prettifiedColonNotation: string
  prettifiedDaysColon: string
  prettifiedHoursColon: string
  iso8601Duration: string
  milliseconds: number
  seconds: number
  minutes: number
  hours: number
  days: number
  weeks: number
  years: number
}

interface DurationLine {
  rawLine: string
  cleanedDuration: string
  sign: number
  durationMS: number | undefined
  isValid: boolean
}

export function computeDuration(s: string): {
  total: ConvertedDuration
  errors: string[]
} {
  const lines: DurationLine[] = s.split('\n').filter(l => l && !/^\s*#/.test(l)).map((l) => {
    const isNeg = /^\s*-/.test(l);
    const cleanedDuration = l.replace(/^\s*[+-]\s*/, '');
    const durationMS = convertDurationMS(cleanedDuration);
    return {
      rawLine: l,
      cleanedDuration,
      sign: isNeg ? -1 : 1,
      durationMS,
      isValid: typeof durationMS !== 'undefined',
    };
  });

  const sumMS = lines.map(l => ({ durationMS: l.durationMS || 0, sign: l.sign })).reduce(
    (prev, curr) => ({
      durationMS: prev.durationMS + curr.durationMS * curr.sign,
      sign: 1,
    }),
    {
      sign: 1,
      durationMS: 0,
    });

  return {
    total: prepareDurationResult(sumMS.durationMS),
    errors: lines.filter(l => !l.isValid).map(l => l.rawLine),
  };
}

function convertDurationMS(s: string): number | undefined {
  const hoursHandled = s.replace(/\b(\d+):(\d+)(?::(\d+)(?:\.(\d+))?)?/g, (_, h, m, s, ms) => {
    const timeArr: string[] = [];
    const addPart = (part: string, unit: string) => {
      const num = Number.parseInt(part, 10);
      if (Number.isNaN(num)) {
        return;
      }

      timeArr.push(`${num}${unit}`);
    };
    addPart(h, 'h');
    addPart(m, 'm');
    addPart(s, 's');
    addPart(ms, 'ms');
    return timeArr.join(' ');
  });
  if (!hoursHandled) {
    return 0;
  }

  let parsedDuration = parse(hoursHandled);
  if (parsedDuration !== 0 && !parsedDuration) {
    try {
      parsedDuration = iso8601Duration.toMilliseconds(iso8601Duration.parse(hoursHandled));
    }
    catch (_) {
      return undefined;
    }
  }
  return parsedDuration;
}
function prepareDurationResult(durationMS: any): ConvertedDuration {
  const dateFnsDuration = intervalToDuration({ start: 0, end: durationMS });
  return {
    prettified: prettyMilliseconds(durationMS),
    prettifiedVerbose: prettyMilliseconds(durationMS, { verbose: true }),
    prettifiedColonNotation: prettyMilliseconds(durationMS, { colonNotation: true }),
    prettifiedDaysColon: hhmmss(durationMS, true),
    prettifiedHoursColon: hhmmss(durationMS, false),
    iso8601Duration: formatISODuration(dateFnsDuration),
    milliseconds: durationMS,
    seconds: durationMS / 1000,
    minutes: durationMS / (1000 * 60),
    hours: durationMS / (1000 * 3600),
    days: durationMS / (1000 * 86400),
    weeks: durationMS / (1000 * 86400 * 7),
    years: durationMS / (1000 * 86400 * 365),
  };
}

function hhmmss(milliseconds: number, days: boolean) {
  const padNumber = (n: number) => n.toString().padStart(2, '0');
  const ms = milliseconds % 1000;
  const seconds = milliseconds / 1000;
  let h = Math.floor(seconds / 3600);
  const m = Math.floor(seconds % 3600 / 60);
  const s = Math.floor(seconds % 3600 % 60);
  let d = 0;
  if (days) {
    d = Math.floor(h / 24);
    h = h % 24;
  }
  const formatted_d = d > 0 ? `${d}d ` : '';
  const formatted_ms = ms > 0 ? `.${ms}` : '';
  return `${formatted_d}${padNumber(h)}:${padNumber(m)}:${padNumber(s)}${formatted_ms}`;
}
