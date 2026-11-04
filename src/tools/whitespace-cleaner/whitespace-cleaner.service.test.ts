import { describe, expect, it } from 'vitest';
import { type CleanerOptions, cleanText, computeStats } from './whitespace-cleaner.service';
import { getDefaultOptions } from './whitespace-cleaner.options';
import { SAMPLE_INPUT } from './whitespace-cleaner.sample';

const ALL_OFF: CleanerOptions = {
  stripLineNumbers: false,
  removeAnsi: false,
  stripBoxDrawing: false,
  stripBulletMarkers: false,
  trimTrailing: false,
  collapseBlankLines: false,
  normalizeIndent: false,
  removeDiffMarkers: false,
  smartUnwrap: false,
  markdownMode: false,
  unifyLineEndings: false,
};

function isolated(...keys: (keyof CleanerOptions)[]): CleanerOptions {
  return { ...ALL_OFF, ...Object.fromEntries(keys.map(key => [key, true])) };
}

// `·` marks a space where the count matters.
function sp(text: string): string {
  return text.replace(/·/g, ' ');
}

const PYTHON_FENCE = [
  '```python',
  'def foo():',
  '    if x:',
  '',
  '        return 1',
  '```',
].join('\n');

describe('whitespace-cleaner', () => {
  describe('cleanText, isolated options', () => {
    const cases: { id: string; options: CleanerOptions; input: string; expected: string }[] = [
      { id: 'LE1', options: isolated('unifyLineEndings'), input: 'a\r\nb\rc', expected: 'a\nb\nc' },
      { id: 'AN1', options: isolated('removeAnsi'), input: '\x1B[31mred\x1B[0m', expected: 'red' },
      { id: 'AN2 (defect 6)', options: isolated('removeAnsi'), input: '\x1B[?25lx\x1B[?25h', expected: 'x' },
      { id: 'AN3 (defect 6)', options: isolated('removeAnsi'), input: '\x1B]8;;https://example.com\x07link\x1B]8;;\x07', expected: 'link' },
      { id: 'AN4 (defect 6)', options: isolated('removeAnsi'), input: '\x1B]0;title\x1B\\x', expected: 'x' },
      { id: 'AN5 (defect 6)', options: isolated('removeAnsi'), input: '\x1B(Bx', expected: 'x' },
      { id: 'AW1', options: ALL_OFF, input: '\n\na\u00A0b\u200Bc\n\n', expected: 'a bc' },
      { id: 'LN1', options: isolated('stripLineNumbers'), input: sp('···1\tfoo\n···2\tbar'), expected: 'foo\nbar' },
      { id: 'LN2 (defect 3)', options: isolated('stripLineNumbers', 'stripBoxDrawing'), input: sp('··12·│·a\n··13·│·b'), expected: 'a\nb' },
      { id: 'LN3', options: isolated('stripLineNumbers'), input: sp('·····1→a\n·····2→b'), expected: 'a\nb' },
      { id: 'LN4', options: isolated('stripLineNumbers'), input: '1\tlong\ncontinued\n2\tnext', expected: 'long\ncontinued\nnext' },
      { id: 'LN5', options: isolated('stripLineNumbers'), input: '42\tfoo', expected: '42\tfoo' },
      { id: 'LN6 (defect 5)', options: isolated('stripLineNumbers'), input: '0: "zero",\n1: "one",', expected: '0: "zero",\n1: "one",' },
      { id: 'LN7 (defect 5)', options: isolated('stripLineNumbers'), input: '10\tfoo\n20\tbar', expected: '10\tfoo\n20\tbar' },
      { id: 'LN8', options: isolated('stripLineNumbers'), input: '3\tx\n4\t\n5\ty', expected: 'x\n\ny' },
      { id: 'BM1', options: isolated('stripBulletMarkers'), input: sp('●·foo'), expected: sp('··foo') },
      { id: 'BM2', options: isolated('stripBulletMarkers'), input: 'a ● b', expected: 'a ● b' },
      { id: 'BX1', options: isolated('stripBoxDrawing'), input: 'x\n┌───┐\ny', expected: 'x\n\ny' },
      { id: 'BX2', options: isolated('stripBoxDrawing'), input: sp('│··x'), expected: sp('···x') },
      { id: 'BX3 (defect 4)', options: isolated('stripBoxDrawing'), input: 'print("a → b ■ done")', expected: 'print("a → b ■ done")' },
      { id: 'BX4', options: isolated('stripBoxDrawing'), input: sp('│·x·│'), expected: sp('··x') },
      {
        id: 'DF1 (defect 9)',
        options: isolated('removeDiffMarkers'),
        input: sp('@@ -1,3 +1,3 @@\n·def foo():\n-····return 1\n+····return 2\n·x = 1'),
        expected: sp('def foo():\n····return 2\nx = 1'),
      },
      { id: 'DF2', options: isolated('removeDiffMarkers'), input: '+a\n-b\n--- c', expected: 'a\nb\n--- c' },
      { id: 'TT1', options: isolated('trimTrailing'), input: sp('a··\t\nb'), expected: 'a\nb' },
      { id: 'IN1', options: isolated('normalizeIndent'), input: sp('····a\n······b\n\n····c'), expected: sp('a\n··b\n\nc') },
      { id: 'IN2 (defect 7)', options: isolated('normalizeIndent'), input: sp('\tfoo\n····bar'), expected: sp('\tfoo\n····bar') },
      { id: 'SU1 (defect 10)', options: isolated('smartUnwrap'), input: 'one two\nthree four\nfive six\nseven', expected: 'one two three four five six seven' },
      { id: 'SU2', options: isolated('smartUnwrap'), input: 'first part\nends here.\nnext', expected: 'first part ends here.\nnext' },
      { id: 'SU3', options: isolated('smartUnwrap'), input: 'intro\n- item', expected: 'intro\n- item' },
      { id: 'SU4', options: isolated('smartUnwrap'), input: '```\nshort\nlines\n```', expected: '```\nshort\nlines\n```' },
      { id: 'MD1', options: isolated('markdownMode'), input: sp('··some wrapped\n··text here'), expected: 'some wrapped text here' },
      { id: 'MD2', options: isolated('markdownMode'), input: sp('··- a\n··- b'), expected: '- a\n- b' },
      { id: 'MD3 (defect 2)', options: isolated('markdownMode'), input: PYTHON_FENCE, expected: PYTHON_FENCE },
      { id: 'CB1', options: isolated('collapseBlankLines'), input: 'a\n\n\n\nb', expected: 'a\n\nb' },
    ];

    for (const { id, options, input, expected } of cases) {
      it(id, () => {
        expect(cleanText(input, options)).to.eql(expected);
      });
    }

    it('returns any input unchanged when all options are off, apart from the always-on steps', () => {
      const input = sp('··1\t●·│·foo··\r\n\n\n\x1B[31m+bar\x1B[0m\n@@ -1 +1 @@\n····baz');

      expect(cleanText(input, ALL_OFF)).to.eql(input);
    });
  });

  describe('cleanText, default options', () => {
    it('G1 cleans the sample', () => {
      const expected = [
        'function greetUser(name: string) {',
        // eslint-disable-next-line no-template-curly-in-string -- The sample is TypeScript source text.
        '  console.log(`Hello, ${name}!`);',
        '}',
        '',
        'greetUser("world");',
        '',
        '   Done in 0.3s',
        '   1 file changed',
      ].join('\n');

      expect(cleanText(SAMPLE_INPUT, getDefaultOptions())).to.eql(expected);
    });

    it('G2 (defect 1) keeps unfenced code on separate lines', () => {
      const input = sp('def foo():\n····if x:\n········return 1');

      expect(cleanText(input, getDefaultOptions())).to.eql(input);
    });

    it('G3 strips a bullet marker and the common indent', () => {
      expect(cleanText(sp('⏺·I fixed the bug.\n··It was in the parser.'), getDefaultOptions())).to.eql('I fixed the bug.\nIt was in the parser.');
    });
  });

  describe('computeStats', () => {
    it('ST1 returns zero counts for empty input', () => {
      expect(computeStats('', '')).to.eql({ inputLines: 0, inputChars: 0, outputLines: 0, outputChars: 0, savedPercent: 0 });
    });

    it('ST2 computes the saved percentage', () => {
      expect(computeStats('a'.repeat(100), 'a'.repeat(80)).savedPercent).to.eql(20);
    });

    it('counts lines', () => {
      expect(computeStats('a\r\nb\nc', 'a').inputLines).to.eql(3);
    });
  });
});
