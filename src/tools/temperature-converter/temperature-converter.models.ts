export const temperatureScales = [
  'kelvin',
  'celsius',
  'fahrenheit',
  'rankine',
  'delisle',
  'newton',
  'reaumur',
  'romer',
] as const;

export type TemperatureScale = typeof temperatureScales[number];

export const convertCelsiusToKelvin = (temperature: number) => temperature + 273.15;
export const convertKelvinToCelsius = (temperature: number) => temperature - 273.15;

export const convertFahrenheitToKelvin = (temperature: number) => (temperature + 459.67) * (5 / 9);
export const convertKelvinToFahrenheit = (temperature: number) => temperature * (9 / 5) - 459.67;

export const convertRankineToKelvin = (temperature: number) => temperature * (5 / 9);
export const convertKelvinToRankine = (temperature: number) => temperature * (9 / 5);

export const convertDelisleToKelvin = (temperature: number) => 373.15 - (2 / 3) * temperature;
export const convertKelvinToDelisle = (temperature: number) => (3 / 2) * (373.15 - temperature);

export const convertNewtonToKelvin = (temperature: number) => temperature * (100 / 33) + 273.15;
export const convertKelvinToNewton = (temperature: number) => (temperature - 273.15) * (33 / 100);

export const convertReaumurToKelvin = (temperature: number) => temperature * (5 / 4) + 273.15;
export const convertKelvinToReaumur = (temperature: number) => (temperature - 273.15) * (4 / 5);

export const convertRomerToKelvin = (temperature: number) => (temperature - 7.5) * (40 / 21) + 273.15;
export const convertKelvinToRomer = (temperature: number) => (temperature - 273.15) * (21 / 40) + 7.5;

interface TemperatureBounds {
  min?: number
  max?: number
}

interface TemperatureConverter {
  toKelvin: (temperature: number) => number
  fromKelvin: (temperature: number) => number
}

/**
 * Per-scale values corresponding to 0 K. Delisle is inverted, so its physical
 * limit is a maximum; every other scale has a minimum.
 */
export const temperatureBounds: Readonly<Record<TemperatureScale, Readonly<TemperatureBounds>>> = {
  kelvin: { min: 0 },
  celsius: { min: -273.15 },
  fahrenheit: { min: -459.67 },
  rankine: { min: 0 },
  delisle: { max: 559.725 },
  newton: { min: -90.1395 },
  reaumur: { min: -218.52 },
  romer: { min: -135.90375 },
};

const temperatureConverters: Readonly<Record<TemperatureScale, Readonly<TemperatureConverter>>> = {
  kelvin: {
    toKelvin: temperature => temperature,
    fromKelvin: temperature => temperature,
  },
  celsius: {
    toKelvin: convertCelsiusToKelvin,
    fromKelvin: convertKelvinToCelsius,
  },
  fahrenheit: {
    toKelvin: convertFahrenheitToKelvin,
    fromKelvin: convertKelvinToFahrenheit,
  },
  rankine: {
    toKelvin: convertRankineToKelvin,
    fromKelvin: convertKelvinToRankine,
  },
  delisle: {
    toKelvin: convertDelisleToKelvin,
    fromKelvin: convertKelvinToDelisle,
  },
  newton: {
    toKelvin: convertNewtonToKelvin,
    fromKelvin: convertKelvinToNewton,
  },
  reaumur: {
    toKelvin: convertReaumurToKelvin,
    fromKelvin: convertKelvinToReaumur,
  },
  romer: {
    toKelvin: convertRomerToKelvin,
    fromKelvin: convertKelvinToRomer,
  },
};

export function isTemperaturePhysicallyValid(scale: TemperatureScale, temperature: number) {
  if (!Number.isFinite(temperature)) {
    return false;
  }

  const { min, max } = temperatureBounds[scale];
  return (min === undefined || temperature >= min) && (max === undefined || temperature <= max);
}

/**
 * Round to hundredths using a magnitude-aware tolerance and symmetric half-away-
 * from-zero ties. This avoids binary representation artifacts such as
 * 273.15 * 100 becoming 27314.999999999996.
 */
export function roundTemperature(temperature: number) {
  if (!Number.isFinite(temperature)) {
    return temperature;
  }

  const absoluteScaledTemperature = Math.abs(temperature) * 100;
  if (!Number.isFinite(absoluteScaledTemperature)) {
    return temperature;
  }

  const floatingPointTolerance = Number.EPSILON * Math.max(1, absoluteScaledTemperature);
  const roundedTemperature = Math.floor(absoluteScaledTemperature + 0.5 + floatingPointTolerance) / 100;
  const signedTemperature = Math.sign(temperature) * roundedTemperature;

  return Object.is(signedTemperature, -0) ? 0 : signedTemperature;
}

function isAbsoluteZero(scale: TemperatureScale, temperature: number) {
  const { min, max } = temperatureBounds[scale];
  return temperature === (min ?? max);
}

function keepRoundedTemperatureWithinBounds(scale: TemperatureScale, temperature: number) {
  const { min, max } = temperatureBounds[scale];

  if (min !== undefined && temperature < min) {
    return min;
  }

  if (max !== undefined && temperature > max) {
    return max;
  }

  return temperature;
}

/**
 * Convert a physically valid temperature and round the displayed result. An
 * invalid source is rejected with null instead of producing impossible values.
 */
export function convertTemperature(
  temperature: number,
  sourceScale: TemperatureScale,
  targetScale: TemperatureScale,
): number | null {
  if (!isTemperaturePhysicallyValid(sourceScale, temperature)) {
    return null;
  }

  // Preserve every exact per-scale representation of 0 K. Some limits require
  // more than two decimals and must not be rounded into an impossible value.
  if (isAbsoluteZero(sourceScale, temperature)) {
    const { min, max } = temperatureBounds[targetScale];
    return min ?? max ?? 0;
  }

  const kelvins = temperatureConverters[sourceScale].toKelvin(temperature);
  const convertedTemperature = temperatureConverters[targetScale].fromKelvin(kelvins);

  return keepRoundedTemperatureWithinBounds(targetScale, roundTemperature(convertedTemperature));
}
