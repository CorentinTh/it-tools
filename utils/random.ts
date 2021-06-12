import {randomBytes} from 'crypto'

const random = () => randomBytes(4).readUInt32LE(0) / 0x100000000

const randFromArray = (array: any[]) => array[Math.floor(random() * array.length)]

const randIntFromInterval = (min: number, max: number) => Math.floor(random() * (max - min) + min)

// Durstenfeld shuffle
const shuffleArrayMutate = <T extends unknown>(array: T[]): T[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array
}

const shuffleArray = <T extends unknown>(array: T[]): T[] => shuffleArrayMutate([...array])

const shuffleString = (str: string, delimiter: string = ''): string => shuffleArrayMutate(str.split(delimiter)).join(delimiter)

export {
  randFromArray,
  randIntFromInterval,
  random,
  shuffleArray,
  shuffleArrayMutate,
  shuffleString
}
