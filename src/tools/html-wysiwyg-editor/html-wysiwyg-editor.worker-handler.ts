import { format } from 'prettier';
import htmlParser from 'prettier/plugins/html';
import {
  HTML_FORMAT_ERROR_MESSAGES,
  HTML_FORMAT_MAX_OUTPUT_BYTES,
  type HtmlFormatTask,
  type HtmlFormatTaskError,
  type HtmlFormatWorkerErrorCode,
  type HtmlFormatWorkerMessage,
  parseHtmlFormatWorkerJobId,
  parseHtmlFormatWorkerRequest,
  toHtmlFormatTaskError,
} from './html-wysiwyg-editor.worker.protocol';
import { exceedsUtf8ByteLimit } from '@/utils/utf8';

export type HtmlFormatter = (task: HtmlFormatTask) => Promise<string>;

async function formatHtml({ html }: HtmlFormatTask): Promise<string> {
  return format(html, { parser: 'html', plugins: [htmlParser] });
}

function workerErrorCode(error: HtmlFormatTaskError): HtmlFormatWorkerErrorCode {
  return error.code === 'validation' || error.code === 'limit' ? error.code : 'formatting';
}

export async function handleHtmlFormatWorkerRequest(
  value: unknown,
  formatter: HtmlFormatter = formatHtml,
): Promise<HtmlFormatWorkerMessage> {
  let jobId = 1;

  try {
    jobId = parseHtmlFormatWorkerJobId(value);
    const request = parseHtmlFormatWorkerRequest(value);
    const html = await formatter(request.task);
    if (exceedsUtf8ByteLimit(html, HTML_FORMAT_MAX_OUTPUT_BYTES)) {
      throw new Error('Formatted output exceeded its bound.');
    }
    return {
      jobId,
      type: 'result',
      result: {
        byteLength: new TextEncoder().encode(html).byteLength,
        html,
      },
    };
  }
  catch (error) {
    const taskError = toHtmlFormatTaskError(error);
    const code = workerErrorCode(taskError);
    return {
      jobId,
      type: 'error',
      code,
      message: HTML_FORMAT_ERROR_MESSAGES[code],
    };
  }
}
