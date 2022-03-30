import type { Component } from 'vue';

export interface ITool {
  name: string;
  path: string;
  description: string;
  keywords: string[];
  component: () => Promise<Component>;
}
