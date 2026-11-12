export type PercentageInput = number | null | undefined;

export { computePercentageOf, computeIsWhatPercentOf, computePercentageIncreaseDecrease };

function isMissing(value: PercentageInput): value is null | undefined {
  return value === null || value === undefined;
}

function formatFinite(value: number): string {
  return Number.isFinite(value) ? value.toString() : '';
}

function computePercentageOf(x: PercentageInput, y: PercentageInput): string {
  if (isMissing(x) || isMissing(y)) {
    return '';
  }

  return formatFinite((x / 100) * y);
}

function computeIsWhatPercentOf(x: PercentageInput, y: PercentageInput): string {
  if (isMissing(x) || isMissing(y)) {
    return '';
  }

  return formatFinite((100 * x) / y);
}

function computePercentageIncreaseDecrease(from: PercentageInput, to: PercentageInput): string {
  if (isMissing(from) || isMissing(to)) {
    return '';
  }

  return formatFinite(((to - from) / from) * 100);
}
