import { parseExpression } from 'cron-parser';
import EventCronParser from 'event-cron-parser';

export function getLastExecutionTimes(cronExpression: string, tz: string | undefined = undefined, count: number = 5) {
  if (getCronType(cronExpression) === 'standard') {
    const interval = parseExpression(cronExpression, { tz });
    const times = [];
    for (let i = 0; i < count; i++) {
      times.push(interval.next().toJSON());
    }
    return times;
  }
  if (getCronType(cronExpression) === 'aws') {
    const parsed = new EventCronParser(cronExpression);
    const times = [];
    for (let i = 0; i < count; i++) {
      times.push(JSON.stringify(parsed.next()));
    }
    return times;
  }

  return [];
}

export function isCronValid(v: string) {
  return !!getCronType(v);
}

export function getCronType(v: string) {
  try {
    parseExpression(v);
    return 'standard';
  }
  catch (_) {
    try {
      const parsed = new EventCronParser(v);
      parsed.validate();
      return 'aws';
    }
    catch (_) {
    }
  }
  return false;
}
