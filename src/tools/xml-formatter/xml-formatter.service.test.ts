import { describe, expect, it } from 'vitest';
import { formatXml } from './xml-formatter.service';

const options = {
  indentation: '  ',
  collapseContent: true,
  lineSeparator: '\n',
};
const initString = '<hello><world>foo</world><world>bar</world></hello>';
const endString = `<hello>
  <world>foo</world>
  <world>bar</world>
</hello>`;
describe('xml-formatter', () => {
  it('Should generate same string', () => {
    expect(formatXml(initString, options)).toEqual(endString);
  });
});
