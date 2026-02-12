import { BrandJavascript } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Javascript Unobfuscator/Unpacker',
  path: '/js-unobfuscator',
  description: 'webcrack is a tool for reverse engineering javascript. It can deobfuscate obfuscator.io, unminify, transpile, and unpack webpack/browserify, to resemble the original source code as much as possible.',
  keywords: ['js', 'unobfuscator', 'obfuscator.io', 'unminify', 'transpile', 'unpack', 'webpack', 'browserify'],
  component: () => import('./js-unobfuscator.vue'),
  icon: BrandJavascript,
  createdAt: new Date('2024-05-11'),
});
