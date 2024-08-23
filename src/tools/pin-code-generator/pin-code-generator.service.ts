export function randomNumber({
  length,
  repeatDigits = false,
}: {
  length: number
  repeatDigits?: boolean
}) {
  const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const result: number[] = [];
  const willRepeat = length > 10 || repeatDigits;

  while (result.length < length) {
    const random = Math.floor(Math.random() * 10); // NOSONAR
    const num = arr[random];
    if (!willRepeat && result.includes(num)) {
      continue;
    }
    result.push(num);
  }

  return result.join('');
}
