import { Hono } from 'hono';
import { generateLoremIpsum } from '@/tools/lorem-ipsum-generator/lorem-ipsum-generator.service.js';
import { getStringSizeInBytes } from '@/tools/text-statistics/text-statistics.service.js';
import { generateNumeronym } from '@/tools/numeronym-generator/numeronym-generator.service.js';
import { obfuscateString } from '@/tools/string-obfuscator/string-obfuscator.model.js';

const router = new Hono();

// Lorem ipsum generator
router.post('/lorem-ipsum', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const {
    paragraphCount = 1,
    sentencePerParagraph = 3,
    wordCount = 10,
    startWithLoremIpsum = true,
    asHTML = false,
  } = body;
  const result = generateLoremIpsum({ paragraphCount, sentencePerParagraph, wordCount, startWithLoremIpsum, asHTML });
  return c.json({ result });
});

// Text statistics
router.post('/statistics', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { text = '' } = body;
  const words = text.trim() === '' ? [] : text.trim().split(/\s+/);
  const sentences = text.trim() === '' ? [] : text.split(/[.!?]+/).filter((s: string) => s.trim());
  const lines = text.split('\n');
  return c.json({
    result: {
      characters: text.length,
      charactersNoSpaces: text.replace(/\s/g, '').length,
      words: words.length,
      sentences: sentences.length,
      lines: lines.length,
      paragraphs: text.split(/\n\s*\n/).filter((p: string) => p.trim()).length,
      bytes: getStringSizeInBytes(text),
    },
  });
});

// Numeronym generator
router.post('/numeronym', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { text = '' } = body;
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 1) {
    return c.json({ result: generateNumeronym(words[0]) });
  }
  const result = words.map((w: string) => generateNumeronym(w)).join(' ');
  return c.json({ result });
});

// String obfuscator
router.post('/obfuscate', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const {
    text = '',
    keepFirst = 4,
    keepLast = 0,
    keepSpace = true,
    replacementChar = '*',
  } = body;
  const result = obfuscateString(text, { keepFirst, keepLast, keepSpace, replacementChar });
  return c.json({ result });
});

// Text diff (line-level)
router.post('/diff', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { left = '', right = '' } = body;
  const leftLines = left.split('\n');
  const rightLines = right.split('\n');
  const added = rightLines.filter((l: string) => !leftLines.includes(l)).length;
  const removed = leftLines.filter((l: string) => !rightLines.includes(l)).length;
  return c.json({ result: { identical: left === right, addedLines: added, removedLines: removed } });
});

export default router;
