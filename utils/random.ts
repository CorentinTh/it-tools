import {randomBytes} from 'crypto'

const random = () => randomBytes(4).readUInt32LE(0) / 0x100000000

const randFromArray = (array: any[]) => array[Math.floor(random() * array.length)]

const randIntFromInterval = (min: number, max: number) => Math.floor(random() * (max - min) + min)

export {
  randFromArray,
  randIntFromInterval,
  random
}
