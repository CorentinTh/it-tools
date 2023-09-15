import TurnDownService from 'turndown';

const turnDownService = new TurnDownService();

/**
 * Converts the given HTML string to Markdown format.
 *
 * @param html - The HTML string to convert.
 * @returns The converted Markdown string.
 */
export const convertHtmlToMarkdown = (html: string): string => {
  return turnDownService.turndown(html);
};
