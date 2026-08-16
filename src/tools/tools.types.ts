import type { Component } from 'vue';

export const TOOL_CATEGORY_NAMES = [
  'Crypto',
  'Converter',
  'Web',
  'Images and videos',
  'Development',
  'Network',
  'Math',
  'Measurement',
  'Text',
  'Data',
] as const;

export type ToolCategoryName = typeof TOOL_CATEGORY_NAMES[number];

export interface ToolRegistryMetadata {
  category: ToolCategoryName
  order: number
}

export interface Tool {
  name: string
  path: string
  description: string
  keywords: string[]
  component: () => Promise<Component>
  icon: Component
  redirectFrom?: string[]
  isNew: boolean
  createdAt?: Date
}

export interface ToolCategory {
  name: string
  components: Tool[]
}

export type ToolWithCategory = Tool & { category: string };
