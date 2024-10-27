import { computeDuration } from '../duration-calculator/duration-calculator.service';

export function addToDate(date: Date, durations: string) {
  const { total, errors } = computeDuration(durations);

  return {
    errors,
    date: new Date(date.getTime() + total.milliseconds),
    durationSeconds: total.seconds,
    durationPretty: total.prettified,
  };
}
