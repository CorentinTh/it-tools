export const SAMPLE_INPUT = [
  '   1\t●  function greetUser(name: string) {',
  // eslint-disable-next-line no-template-curly-in-string -- The sample is TypeScript source text.
  '   2\t│    console.log(`Hello, ${name}!`);',
  '   3\t│  }',
  '   4\t│',
  '   5\t│  greetUser("world");',
  '',
  '   ┌─ Done in 0.3s',
  '   └─ 1 file changed',
].join('\n');
