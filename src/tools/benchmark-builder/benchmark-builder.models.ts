import _ from 'lodash';

export { computeAverage, computeVariance, arrayToMarkdownTable };

function computeAverage({ data }: { data: number[] }) {
  if (data.length === 0) {
    return 0;
  }

  return _.sum(data) / data.length;
}

function computeVariance({ data }: { data: number[] }) {
  const mean = computeAverage({ data });

  const squaredDiffs = data.map(value => (value - mean) ** 2);

  return computeAverage({ data: squaredDiffs });
}

function arrayToMarkdownTable({ data, headerMap = {} }: { data: Record<string, unknown>[]; headerMap?: Record<string, string> }) {
  if (!Array.isArray(data) || data.length === 0) {
    return '';
  }

  const headers = Object.keys(data[0]);
  const rows = data.map(obj => Object.values(obj));

  const headerRow = `| ${headers.map(header => headerMap[header] ?? header).join(' | ')} |`;
  const separatorRow = `| ${headers.map(() => '---').join(' | ')} |`;
  const dataRows = rows.map(row => `| ${row.join(' | ')} |`).join('\n');

  return `${headerRow}\n${separatorRow}\n${dataRows}`;
}
