import type { Component } from 'vue';
import type { UAParser } from 'ua-parser-js';

export interface UserAgentResultSection {
  heading: string
  icon?: Component
  content: {
    label: string
    getValue: (blocks?: UAParser.IResult) => string | undefined
    undefinedFallback?: string
  }[]
}
