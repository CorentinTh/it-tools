import {
  SQL_ERROR_MESSAGES,
  SQL_MAX_OUTPUT_BYTES,
  SQL_TASK_TIMEOUT_MS,
  type SqlFormatTask,
  parseSqlFormatTask,
} from './sql-prettify.worker.protocol';
import { BoundedTextWorkerClient } from '@/utils/bounded-text-task';

export function createSqlWorkerClient(): BoundedTextWorkerClient<SqlFormatTask> {
  return new BoundedTextWorkerClient({
    errorMessages: SQL_ERROR_MESSAGES,
    maxOutputBytes: SQL_MAX_OUTPUT_BYTES,
    taskName: 'SQL formatting',
    timeoutMs: SQL_TASK_TIMEOUT_MS,
    validateTask: parseSqlFormatTask,
    workerFactory: () => new Worker(new URL('./sql-prettify.worker.ts', import.meta.url), {
      type: 'module',
      name: 'it-tools-sql-formatter',
    }),
  });
}
