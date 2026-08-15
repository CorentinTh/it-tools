import JSON5 from 'json5';
import { DiffLimitError, diffWithReport } from './json-diff.models';
import {
  JSON_DIFF_ERROR_MESSAGES,
  JSON_DIFF_MAX_DEPTH,
  JSON_DIFF_MAX_INPUT_NODES,
  JSON_DIFF_MAX_LCS_CELLS,
  JSON_DIFF_MAX_OUTPUT_NODES,
  type JsonDiffTaskError,
  type JsonDiffWorkerErrorCode,
  type JsonDiffWorkerMessage,
  parseJsonDiffWorkerJobId,
  parseJsonDiffWorkerRequest,
  toJsonDiffTaskError,
} from './json-diff.worker.protocol';

function workerErrorCode(error: JsonDiffTaskError): JsonDiffWorkerErrorCode {
  return error.code === 'validation' || error.code === 'limit' || error.code === 'parse'
    ? error.code
    : 'diff';
}

export function handleJsonDiffWorkerRequest(value: unknown): JsonDiffWorkerMessage {
  let jobId = 1;

  try {
    jobId = parseJsonDiffWorkerJobId(value);
    const { task } = parseJsonDiffWorkerRequest(value);
    let left: unknown;
    let right: unknown;
    try {
      left = JSON5.parse(task.left);
      right = JSON5.parse(task.right);
    }
    catch {
      return { jobId, type: 'error', code: 'parse', message: JSON_DIFF_ERROR_MESSAGES.parse };
    }

    const result = diffWithReport(left, right, {
      alignArrays: task.alignArrays,
      maxDepth: JSON_DIFF_MAX_DEPTH,
      maxInputNodes: JSON_DIFF_MAX_INPUT_NODES,
      maxLcsCells: JSON_DIFF_MAX_LCS_CELLS,
      maxOutputNodes: JSON_DIFF_MAX_OUTPUT_NODES,
      onlyShowDifferences: task.onlyShowDifferences,
    });
    return { jobId, type: 'result', result };
  }
  catch (error) {
    if (error instanceof DiffLimitError) {
      return { jobId, type: 'error', code: 'limit', message: JSON_DIFF_ERROR_MESSAGES.limit };
    }
    const taskError = toJsonDiffTaskError(error);
    const code = workerErrorCode(taskError);
    return { jobId, type: 'error', code, message: JSON_DIFF_ERROR_MESSAGES[code] };
  }
}
