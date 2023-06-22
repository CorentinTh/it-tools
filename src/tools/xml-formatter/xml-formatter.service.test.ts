import { describe, expect, it } from 'vitest';
import { formatXml } from './xml-formatter.service';

describe('xml-formatter service', () => {
  describe('formatXml', () => {
    it('converts XML into a human readable format', () => {
      const initString = '<hello><world>foo</world><world>bar</world></hello>';

      expect(formatXml(initString)).toMatchInlineSnapshot(`
        "<hello>
            <world>
                foo
            </world>
            <world>
                bar
            </world>
        </hello>"
      `);
    });

    it('returns an empty string if the input is not valid XML', () => {
      const initString = 'hello world';

      expect(formatXml(initString)).toEqual('');
    });
  });
});
