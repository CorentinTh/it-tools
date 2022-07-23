export function formatChronometerTime({ elapsed, msPerUnit = 1 }: { elapsed: number; msPerUnit?: number }) {
  const elapsedMs = elapsed * msPerUnit;

  const ms = elapsedMs % 1000;
  const secs = ((elapsedMs - ms) / 1000) % 60;
  const mins = (((elapsedMs - ms) / 1000 - secs) / 60) % 60;
  const hrs = (((elapsedMs - ms) / 1000 - secs) / 60 - mins) / 60;
  const hrsString = hrs > 0 ? `${hrs.toString().padStart(2, '0')}:` : '';

  return `${hrsString}${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms
    .toString()
    .padStart(3, '0')}`;
}
