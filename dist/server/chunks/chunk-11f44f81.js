const random = () => Math.random();
const randFromArray = (array) => array[Math.floor(random() * array.length)];
const randIntFromInterval = (min, max) => Math.floor(random() * (max - min) + min);
function shuffleArrayMutate(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
const shuffleString = (str, delimiter = "") => shuffleArrayMutate(str.split(delimiter)).join(delimiter);
const generateRandomId = () => `id-${random().toString(36).substring(2, 12)}`;

export { randIntFromInterval as a, generateRandomId as g, randFromArray as r, shuffleString as s };
