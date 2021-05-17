const randFromArray = (array: any[]) => array[Math.floor(Math.random() * array.length)]

const randIntFromInterval = (min: number, max: number) => Math.floor(Math.random() * (max - min) + min)

export {
  randFromArray,
  randIntFromInterval
}
