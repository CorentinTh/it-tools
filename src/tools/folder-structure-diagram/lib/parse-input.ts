import last from 'lodash.last';
import type { FileStructure } from './FileStructure';

/**
 * Matches the whitespace in front of a file name.
 * Also will match a markdown bullet point if included.
 * For example, testing against "  - hello" will return
 * a positive match with the first capturing group
 * with "  - " and a second with "  "
 */
const leadingWhitespaceAndBulletRegex = /^((\s*)(?:-\s)?)/;

/** Matches lines that only contain whitespace */
const onlyWhitespaceRegex = /^\s*$/;

/** Used to split a block of text into individual lines */
const newlineSplitterRegex = /[^\r\n]+/g;

/**
 * Translates a block of user-created text into
 * a nested FileStructure structure
 * @param input The plain-text input from the user
 */
export function parseInput(input: string): FileStructure {
  const structures = splitInput(input);

  const root: FileStructure = {
    name: '.',
    children: [],
    indentCount: -1,
    parent: null,
  };

  const path = [root];
  for (const s of structures) {
    while (last(path)!.indentCount >= s.indentCount) {
      path.pop();
    }

    const parent = last(path) as FileStructure;
    parent.children.push(s);
    s.parent = parent;

    path.push(s);
  }

  return root;
}

/**
 * Splits a block of user-created text into
 * individual, un-nested FileStructure objects.
 * Used internally as part of `parseInput`.
 * @param input The plain-text input from the user
 */
export function splitInput(input: string): FileStructure[] {
  let lines = input.match(newlineSplitterRegex)?.map(m => m) || [];

  // filter out empty lines
  lines = lines.filter(l => !onlyWhitespaceRegex.test(l));

  return lines.map((l) => {
    const matchResult = leadingWhitespaceAndBulletRegex.exec(l);

    if (!matchResult) {
      throw new Error(
        `Unable to execute leadingWhitespaceAndBulletRegex against string: "${l}"`,
      );
    }

    const name = l.replace(matchResult[1], '');
    const indentCount = matchResult[2].length;

    return {
      name,
      children: [],
      indentCount,
      parent: null,
    };
  });
}
