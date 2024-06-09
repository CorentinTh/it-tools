// prettier-ignore
import fonts from './unicode-fonts.json';

export type AllFontNames = keyof typeof fonts;
export interface AllOptions {
  remove?: string
  append?: string
  reverse?: boolean
  clear?: boolean
};

// list of font characters for checking if character is formatted
const allCharacters = new Set(Object.values(fonts).join(''));

// check if text is already formatted with a certain font
function alreadyFormatted(text: string, font: AllFontNames) {
  const fontCharacters = new Set(fonts[font]);
  // flag as already formatted if all characters are in font or not in any other font
  return Array.from(text).every(char => fontCharacters.has(char) || !allCharacters.has(char));
}

// check if text is already formatted with a certain font
function alreadyAppended(text: string, append: string) {
  // check if at least half the characters are the append character
  return Array.from(text).filter(char => char === append).length >= text.length / 2;
}

// format text into selected font
function formatText(text: string, font: AllFontNames | undefined, options?: AllOptions) {
  // set font to normal if already formatted with selected font
  if (font && fonts[font] && alreadyFormatted(text, font)) {
    font = 'normal';
  }
  // remove and don't append if character is already appended
  if (options?.append) {
    options.remove = options.append;
    options.append = !alreadyAppended(text, options.append) ? options.append : '';
  }
  // Array.from() splits the string by symbol and not by code points
  let newText = Array.from(text);
  // exchange font symbols
  if (font && fonts[font]) {
    const targetFont = Array.from(fonts[font]);
    const charLists = Object.values(fonts);
    // map characters to new font
    newText = newText.map((char) => {
      let index = -1;
      // find the index of the character in some font
      const found = charLists.some((charList) => {
        index = Array.from(charList).indexOf(char);
        return index > -1;
      });
      // if found, replace with the corresponding character in the target font
      // if not found, keep the character the same
      return found ? targetFont[index] : char;
    });
  }
  // reverse text if reverse option is set
  newText = options?.reverse ? newText.reverse() : newText;
  // remove appended symbol of specific type from the end
  newText = options?.remove
    ? newText.map(char => char.replace(new RegExp(`${options.remove}$`, 'u'), ''))
    : newText;
  // append symbol (underline, strikethrough, etc.) to end of each character if append is set
  newText = options?.append ? newText.map(char => char + options.append) : newText;
  // remove appended symbols (underline, strikethrough, etc.) if using eraser
  // \u035f = Underline, \u0333 = Double Underline, \u0335 = Short Strikethrough \u0336 = Strikethrough
  newText = options?.clear ? newText.map(char => char.replace(/\u035F|\u0333|\u0335|\u0336/gu, '')) : newText;
  // set textarea content and select text around the replacement
  return newText.join('');
}

export function formatTextPart(
  text: string,
  selectionStart: number, selectionEnd: number,
  font: AllFontNames | undefined,
  options?: AllOptions) {
  const regexSpaces = /^(\s*)(.+?)(\s*)$/g; // NOSONAR
  const [_, spaceBefore, selection, spaceAfter] = regexSpaces.exec(text.substring(selectionStart, selectionEnd) || '') || [];

  const prefix = text.substring(0, selectionStart);
  const newSelection = formatText(selection, font, options);
  const suffix = text.substring(selectionEnd);
  return {
    text: `${prefix}${spaceBefore}${newSelection}${spaceAfter}${suffix}`,
    from: selectionStart,
    to: selectionStart + (spaceBefore?.length || 0) + newSelection.length + (spaceAfter?.length || 0),
  };
}

// format selected text
export function formatSelection(textArea: HTMLTextAreaElement, font: AllFontNames | undefined, options?: AllOptions) {
  const selectionStart = textArea.selectionStart;
  const selectionEnd = textArea.selectionEnd;
  const oldText = textArea.value;

  const { text: newText, from, to } = formatTextPart(oldText, selectionStart, selectionEnd, font, options);

  textArea.value = newText;
  textArea.setSelectionRange(from, to);

  textArea.focus();
}
