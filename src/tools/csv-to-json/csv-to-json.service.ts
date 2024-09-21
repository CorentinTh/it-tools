export { getHeaders, convertCsvToArray };

function getHeaders(csv: string): string[] {
  if (csv.trim() === '') {
    return [];
  }

  const firstLine = csv.split('\n')[0];
  return firstLine.split(/[,;]/).map(header => header.trim());
}
function deserializeValue(value: string): unknown {
  if (value === 'null') {
    return null;
  }

  if (value === '') {
    return undefined;
  }

  const valueAsString = value.replace(/\\n/g, '\n').replace(/\\r/g, '\r').replace(/\\"/g, '"');

  if (valueAsString.startsWith('"') && valueAsString.endsWith('"')) {
    return valueAsString.slice(1, -1);
  }

  return valueAsString;
}

function convertCsvToArray(csv: string): Record<string, unknown>[] {
  const lines = csv.split('\n');
  const headers = getHeaders(csv);

  return lines.slice(1).map(line => {
    // Split on comma or semicolon not within quotes
    const data = line.split(/[,;](?=(?:(?:[^"]*"){2})*[^"]*$)/).map(value => value.trim());
    return headers.reduce((obj, header, index) => {
      obj[header] = deserializeValue(data[index]);
      return obj;
    }, {} as Record<string, unknown>);
  });
}
