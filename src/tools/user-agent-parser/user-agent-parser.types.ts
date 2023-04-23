import type { Component } from 'vue';
import { UAParser } from 'ua-parser-js';

export type UserAgentResultSection = {
  heading: string;
  icon?: Component;
  content: {
    label: string;
    getValue: (blocks?: UAParser.IResult) => string | undefined;
    undefinedFallback?: string;
  }[];
};
