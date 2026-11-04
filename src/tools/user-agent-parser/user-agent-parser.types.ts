import type { UAParser } from 'ua-parser-js';
import type { Component } from 'vue';

export interface UserAgentResultSection {
  heading: string
  icon?: Component
  content: {
    label: string
    getValue: (blocks?: UAParser.IResult) => string | undefined
    undefinedFallback?: string
  }[]
}
