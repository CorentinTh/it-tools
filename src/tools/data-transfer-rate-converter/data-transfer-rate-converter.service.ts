import { type AllSupportedUnits, convertStorageAndRateUnits } from '../data-storage-unit-converter/data-storage-unit-converter.service';

export function transferTimeSeconds({
  dataSize,
  dataSizeUnit,
  bitRate,
  bitRateUnit,
}: {
  dataSize: number
  dataSizeUnit: AllSupportedUnits
  bitRate: number
  bitRateUnit: AllSupportedUnits
}): number {
  const dataSizeInBytes = convertStorageAndRateUnits({ value: dataSize, fromUnit: dataSizeUnit, toUnit: 'B' });
  const bitRateInBytes = convertStorageAndRateUnits({ value: bitRate, fromUnit: bitRateUnit, toUnit: 'B' });
  return bitRateInBytes > 0 ? dataSizeInBytes / bitRateInBytes : 0;
}

export function transferSpeedRate({
  dataSize,
  dataSizeUnit,
  hours,
  minutes,
  seconds,
  bitRateUnit,
}: {
  dataSize: number
  dataSizeUnit: AllSupportedUnits
  hours: number
  minutes: number
  seconds: number
  bitRateUnit: AllSupportedUnits
}): number {
  const dataSizeInBits = convertStorageAndRateUnits({ value: dataSize, fromUnit: dataSizeUnit, toUnit: 'b' });
  const timeInSeconds = hours * 3600 + minutes * 60 + seconds;
  return convertStorageAndRateUnits({ value: timeInSeconds > 0 ? dataSizeInBits / timeInSeconds : 0, fromUnit: 'b', toUnit: bitRateUnit });
}

export function amountTransferable({
  bitRate,
  bitRateUnit,
  hours,
  minutes,
  seconds,
  dataSizeUnit,
}: {
  bitRate: number
  bitRateUnit: AllSupportedUnits
  hours: number
  minutes: number
  seconds: number
  dataSizeUnit: AllSupportedUnits
}): number {
  const bitRateInBytes = convertStorageAndRateUnits({ value: bitRate, fromUnit: bitRateUnit, toUnit: 'B' });
  const timeInSeconds = hours * 3600 + minutes * 60 + seconds;
  return convertStorageAndRateUnits({ value: bitRateInBytes * timeInSeconds, fromUnit: 'B', toUnit: dataSizeUnit });
}
