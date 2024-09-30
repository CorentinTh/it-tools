import { keyBy, map } from 'lodash-es';
import { tokenGeneratorTool } from './definitions/token-generator/token-generator.tool';

export const toolDefinitions = [
  tokenGeneratorTool,
];

export const toolSlugs = map(toolDefinitions, 'slug');
export const toolDefinitionBySlug = keyBy(toolDefinitions, 'slug');

export { getToolDefinitionBySlug };

function getToolDefinitionBySlug({ slug }: { slug: string }) {
  return toolDefinitionBySlug[slug];
}
