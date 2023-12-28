import _ from 'lodash';

export { isValidProperties, parseProperties };

function isValidProperties(properties: string): boolean {
  const lines = properties.split('\n');
  const keys: Set<string> = new Set();

  for (const line of lines) {
    if (line.trim().startsWith('#') || line.trim() === '') {
      continue;
    }

    if (!line.includes('=')) {
      return false;
    }

    const [key, _value] = line.split('=');

    if (!key) {
      return false;
    }

    if (keys.has(key.trim())) {
      return false;
    }

    keys.add(key.trim());
  }

  return true;
}

// Thanks to https://github.com/sdoxsee/env-gen
function parseProperties(properties: string): Record<string, string> {
  const result = properties
    .split('\n')
    .filter(Boolean) // removes empty lines
    .reduce((acc, line) => {
      const pair = line.split('=');
      _.set(acc, pair[0], pair[1]);
      return acc;
    }, {});
  return result;
}
