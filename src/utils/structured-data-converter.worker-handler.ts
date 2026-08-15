import {
  STRUCTURED_CONVERTER_ERROR_MESSAGES,
  STRUCTURED_CONVERTER_MAX_OUTPUT_BYTES,
  type StructuredDataConversion,
  type StructuredDataConversionTask,
  parseStructuredDataConversionTask,
} from './structured-data-converter.worker.protocol';
import {
  BoundedTextTaskError,
  type BoundedTextWorkerMessage,
  createBoundedTextResult,
  parseBoundedTextWorkerJobId,
  parseBoundedTextWorkerRequest,
} from './bounded-text-task';

export interface StructuredDataConverterWorkerOptions {
  allowedConversions: readonly StructuredDataConversion[]
  convert: (task: StructuredDataConversionTask) => Promise<string> | string
}

export async function handleStructuredDataConverterWorkerRequest(
  value: unknown,
  options: StructuredDataConverterWorkerOptions,
): Promise<BoundedTextWorkerMessage> {
  let jobId = 1;
  try {
    jobId = parseBoundedTextWorkerJobId(value);
    const { task } = parseBoundedTextWorkerRequest(
      value,
      task => parseStructuredDataConversionTask(task, options.allowedConversions),
    );
    const result = createBoundedTextResult(await options.convert(task), STRUCTURED_CONVERTER_MAX_OUTPUT_BYTES);
    return result === undefined
      ? { jobId, type: 'error', code: 'output-limit', message: STRUCTURED_CONVERTER_ERROR_MESSAGES['output-limit'] }
      : { jobId, type: 'result', result };
  }
  catch (error) {
    const code = error instanceof BoundedTextTaskError && (error.code === 'validation' || error.code === 'input-limit')
      ? error.code
      : 'processing';
    return { jobId, type: 'error', code, message: STRUCTURED_CONVERTER_ERROR_MESSAGES[code] };
  }
}
