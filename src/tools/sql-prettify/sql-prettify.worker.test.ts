import { describe, expect, it } from 'vitest';
import { handleSqlWorkerRequest } from './sql-prettify.worker';
import { SQL_ERROR_MESSAGES } from './sql-prettify.worker.protocol';

const options = {
  indentStyle: 'standard' as const,
  keywordCase: 'upper' as const,
  language: 'sql' as const,
  tabulateAlias: true,
  useTabs: false,
};

describe('SQL formatting worker', () => {
  it('formats a valid explicit task', () => {
    expect(handleSqlWorkerRequest({ jobId: 4, task: { options, source: 'select a from t' } })).toMatchObject({
      jobId: 4,
      type: 'result',
      result: { value: 'SELECT\n  a\nFROM\n  t' },
    });
  });

  it('rejects malformed options without exposing parser details', () => {
    expect(handleSqlWorkerRequest({ jobId: 4, task: { options: { ...options, language: 'bad' }, source: 'select 1' } })).toEqual({
      jobId: 4,
      type: 'error',
      code: 'validation',
      message: SQL_ERROR_MESSAGES.validation,
    });
  });
});
