import _ from 'lodash';
import loremIpsumJapanese from 'lorem-ipsum-japanese';
import chinesegen from 'chinesegen';
import languageLorems from './lorem-ipsum.i18n.json';
import { randFromArray } from '@/utils/random';

const firstSentence = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';

export function getSupportedLanguages() {
  return _.union(
    _.flatten(_.chain(languageLorems).map(l => l.languages).value()),
    ['Japanese', 'Chinese'])
    .sort();
}

function generateSentence(language: string, length: number) {
  if (language === 'Japanese') {
    return loremIpsumJapanese({
      count: length,
      units: 'words',
    });
  }
  if (language === 'Chinese') {
    return chinesegen({ count: length }).text;
  }

  if (language === 'Emoticon') {
    const loremIcons = _.find(languageLorems, ({ languages }) => languages.includes(language))?.loremIpsum || '';
    const iconsChars = [...loremIcons];
    return Array.from({ length })
      .map(() => randFromArray(iconsChars))
      .join(' ');
  }

  const vocabulary = _.find(languageLorems, ({ languages }) => languages.includes(language))?.loremIpsum?.split(' ') || [];

  const sentence = Array.from({ length })
    .map(() => randFromArray(vocabulary))
    .join(' ');

  return `${sentence.charAt(0).toUpperCase() + sentence.slice(1)}.`;
}

export function generateLoremIpsum({
  paragraphCount = 1,
  sentencePerParagraph = 3,
  wordCount = 10,
  startWithLoremIpsum = true,
  asHTML = false,
  language = 'English',
}: {
  paragraphCount?: number
  sentencePerParagraph?: number
  wordCount?: number
  startWithLoremIpsum?: boolean
  asHTML?: boolean
  language?: string
}) {
  const paragraphs = Array.from({ length: paragraphCount }).map(() =>
    Array.from({ length: sentencePerParagraph }).map(() => generateSentence(language, wordCount)),
  );

  if (startWithLoremIpsum) {
    paragraphs[0][0] = firstSentence;
  }

  if (asHTML) {
    return `<p>${paragraphs.map(s => s.join(' ')).join('</p>\n\n<p>')}</p>`;
  }

  return paragraphs.map(s => s.join(' ')).join('\n\n');
}
