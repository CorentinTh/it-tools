import { inspectXlsx, previewXlsx } from './xlsx-reader.service';
import { parseXlsxReaderTask } from './xlsx-reader.worker.protocol';
import { type XlsxReaderResult, XlsxReaderTaskError, type XlsxReaderWorkerErrorCode } from './xlsx-reader.types';

export async function runXlsxReaderTask(value: unknown): Promise<XlsxReaderResult> {
  const task = parseXlsxReaderTask(value);
  if (task.kind === 'inspect') {
    return inspectXlsx(task.file);
  }
  return previewXlsx(task.file, task.sheetIndex, task.rowStart, task.rowCount, task.columnStart, task.columnCount);
}

export function xlsxReaderWorkerError(error: unknown): { code: XlsxReaderWorkerErrorCode } {
  if (error instanceof XlsxReaderTaskError && ['validation', 'limit', 'format', 'unsupported', 'read', 'processing'].includes(error.code)) {
    return { code: error.code as XlsxReaderWorkerErrorCode };
  }
  return { code: 'processing' };
}
