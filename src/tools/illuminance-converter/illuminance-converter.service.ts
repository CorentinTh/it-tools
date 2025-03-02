export const convertNoxToLux = (illuminance: number) => illuminance * 0.001;
export const convertLuxToNox = (illuminance: number) => illuminance * 1000;

export const convertFootCandlesToLux = (illuminance: number) => illuminance * 10.7639104167;
export const convertLuxToFootCandles = (illuminance: number) => illuminance * 0.09290304;

export const convertFlameToLux = (illuminance: number) => illuminance * 43.0556416668;
export const convertLuxToFlame = (illuminance: number) => illuminance * 0.02322576;

export const convertPhotToLux = (illuminance: number) => illuminance * 10000;
export const convertLuxToPhot = (illuminance: number) => illuminance * 0.0001;
