import { keyBy, map } from 'lodash-es';
import { randomPortGeneratorTool } from './definitions/random-port-generator/random-port-generator.tool';
import { tokenGeneratorTool } from './definitions/token-generator/token-generator.tool';

export const toolDefinitions = [
  tokenGeneratorTool,
  randomPortGeneratorTool,
];

export const toolSlugs = map(toolDefinitions, 'slug');
export const toolDefinitionBySlug = keyBy(toolDefinitions, 'slug');

export { getToolDefinitionBySlug };

function getToolDefinitionBySlug({ slug }: { slug: string }) {
  return toolDefinitionBySlug[slug];
}
