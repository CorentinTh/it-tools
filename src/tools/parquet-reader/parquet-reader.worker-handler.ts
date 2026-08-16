import { inspectParquetFile, previewParquetFile } from './parquet-reader.service';
import { type ParquetReaderWorkerMessage, parquetReaderErrorMessage, parseParquetReaderRequest } from './parquet-reader.worker.protocol';
import { ParquetReaderTaskError, type ParquetReaderWorkerErrorCode } from './parquet-reader.types';

export async function handleParquetReaderRequest(value: unknown): Promise<ParquetReaderWorkerMessage> {
  let jobId = 0;
  try {
    const request = parseParquetReaderRequest(value);
    jobId = request.jobId;
    const result = request.task.kind === 'inspect'
      ? await inspectParquetFile(request.task.file)
      : await previewParquetFile(request.task.file, request.task.columns, request.task.rowStart, request.task.rowCount);
    return { jobId, type: 'result', result };
  }
  catch (error) {
    const code: ParquetReaderWorkerErrorCode = error instanceof ParquetReaderTaskError
      && ['validation', 'limit', 'format', 'unsupported', 'read', 'processing'].includes(error.code)
      ? error.code as ParquetReaderWorkerErrorCode
      : 'processing';
    return { jobId, type: 'error', code, message: parquetReaderErrorMessage(code) };
  }
}
