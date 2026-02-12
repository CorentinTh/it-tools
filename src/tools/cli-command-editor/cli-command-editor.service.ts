import { generateRandomId } from '@/utils/random';

export function isOption(token: string): boolean {
  return token?.startsWith('--') || token?.startsWith('-');
}

export function extractOptions(command: string = ''): string[] {
  /*
    in a CLI, the options are either written with a hyphen or double hyphens, however,
    script names or package/library sometimes include a hyphen, too, for example 'describe-load-balancers'
  */

  // split into tokens first
  const tokens = command.split(' ');

  // map each token of the command to an option
  const options = tokens.map((token: string) => {
    // every option in a starts with either a hyphen or double hyphens
    if (isOption(token)) {
      const randomId = generateRandomId();
      return `${token}-${randomId}`;
    }

    return '';
  }).filter((option: string): boolean => !!option);
  return options;
}

export function buildOptionsObject(options: string[]): Record<string, string> {
  const optionsObject: Record<string, string> = {};

  for (const option of options) {
    optionsObject[option] = '';
  }

  return optionsObject;
}

export function sanitizeOption(option: string): string {
  return option.split('-id')?.[0];
}

export function buildEditedCommand(options: Record<string, string>, originalOptions: Record<string, string>, command: string): string {
  if (!Object.keys(options).length) {
    return command;
  }

  const tokens = command.split(' ');
  const editedTokens = [];

  // user may input the option value in any order, from the form
  // preserve the original object with options in the correct
  // order as they appear in the original command, this is done
  // to handle the interpolation of edited option values into the
  // command
  originalOptions = Object.entries(options)
    .reduce((previousValue: Record<string, string>, currentValue: string[]) => {
      previousValue[currentValue[0]] = currentValue[1];

      return previousValue;
    }, originalOptions);

  const defaultValues: Record<string, string> = {};
  // replacing the options and their values (if any) with formatter ($i) to
  // help in interpolation of the command
  for (let i = 0, j = 0, n = tokens.length; i < n; ++i) {
    const token = tokens[i];
    const nextToken = tokens[i + 1];

    if (isOption(token)) {
      editedTokens.push(`$${j}`);

      if (!isOption(nextToken)) {
        ++i;
        defaultValues[`$${j}`] = nextToken;
      }

      ++j;
      continue;
    }

    editedTokens.push(token);
  }

  let editedCommand = editedTokens.join(' ');

  const originalOptionKeys = Object.keys(originalOptions);

  for (let i = 0, n = originalOptionKeys.length; i < n; ++i) {
    const key = originalOptionKeys[i];
    const keyWithoutIdSuffix = key.split('-id-')[0] || key;

    if (originalOptions[key]) {
      editedCommand = editedCommand.replace(`$${i}`, `${keyWithoutIdSuffix} ${originalOptions[key]}`);
    }
    else {
      const value = defaultValues[`$${i}`];
      const replaceValue = value ? `${keyWithoutIdSuffix} ${value}` : keyWithoutIdSuffix;
      editedCommand = editedCommand.replace(`$${i}`, replaceValue);
    }
  }

  return editedCommand;
}
