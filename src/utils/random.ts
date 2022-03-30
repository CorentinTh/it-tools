const random = () => Math.random();

const randFromArray = (array: unknown[]) => array[Math.floor(random() * array.length)];

const randIntFromInterval = (min: number, max: number) => Math.floor(random() * (max - min) + min);

// Durstenfeld shuffle
const shuffleArrayMutate = <T>(array: T[]): T[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
};

const shuffleArray = <T>(array: T[]): T[] => shuffleArrayMutate([...array]);

const shuffleString = (str: string, delimiter = ''): string => shuffleArrayMutate(str.split(delimiter)).join(delimiter);

export { randFromArray, randIntFromInterval, random, shuffleArray, shuffleArrayMutate, shuffleString };
