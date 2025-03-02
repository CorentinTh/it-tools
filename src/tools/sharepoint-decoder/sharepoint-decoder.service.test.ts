import { describe, expect, it } from 'vitest';
import { decodeSharePointsURL } from './sharepoint-decoder.service';

describe('sharepoint-decoder', () => {
  describe('decodeSharePointsURL', () => {
    describe('decode outlook sharepoint urls', () => {
      it('should decode basic sharepoint urls', () => {
        expect(decodeSharePointsURL('https://my-site.sharepoint.com/sites/SBL-AssuranceofLearning/AoL%20Reviews/Forms/AllItems.aspx?FolderCTID=0x0120004A7E52B45BF74940ABEB3A8AA69FF829&id=%2Fsites%2FSBL%2DAssuranceofLearning%2FAoL%20Reviews%2FAnalytics%2FSQL%2EDefinitions%2Fcourse%5Funit%5Fsets%2Esql&viewid=d65c252e%2Db796%2D4457%2D88dd%2D2a8095006fb9&parent=%2Fsites%2FSBL%2DAssuranceofLearning%2FAoL%20Reviews%2FAnalytics%2FSQL%2EDefinitions'))
          .toBe('https://my-site.sharepoint.com/sites/SBL-AssuranceofLearning/AoL Reviews/Analytics/SQL.Definitions/course_unit_sets.sql');
      });

      it('throw on not outlook sharepoint urls', () => {
        expect(() => decodeSharePointsURL('https://google.com'))
          .toThrow('Invalid SharePoint URL provided');
      });
    });
  });
});
