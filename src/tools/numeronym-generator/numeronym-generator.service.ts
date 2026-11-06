export { generateNumeronym };

function generateNumeronym(word: string): string {
  const wordLength = word.length;

  if (wordLength <= 3) {
    return word;
  }

  return `${word.at(0)}${wordLength - 2}${word.at(-1)}`;
}
