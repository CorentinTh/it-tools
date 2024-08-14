// aspect-ratio-calculator.service.ts

export interface AspectRatio {
  r1: number
  r2: number
}

export interface Dimensions {
  width: number
  height: number
}

export function calculateAspectRatio(width: number, height: number): AspectRatio {
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const divisor = gcd(width, height);
  return {
    r1: width / divisor,
    r2: height / divisor,
  };
}

export function calculateDimensions(
  knownDimension: number,
  ratio: AspectRatio,
  isWidth: boolean,
): Dimensions {
  if (isWidth) {
    const height = Math.round((knownDimension * ratio.r2) / ratio.r1);
    return { width: knownDimension, height };
  }
  else {
    const width = Math.round((knownDimension * ratio.r1) / ratio.r2);
    return { width, height: knownDimension };
  }
}

export function simplifyRatio(r1: number, r2: number): AspectRatio {
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const divisor = gcd(r1, r2);
  return {
    r1: r1 / divisor,
    r2: r2 / divisor,
  };
}
