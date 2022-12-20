import type { TrackerService } from './modules/tracker/tracker.types';
declare module 'vue' {
  interface ComponentCustomProperties {
    $tracker: TrackerService;
  }
}

declare module '*.vue' {
  import type { ComponentOptions, ComponentOptions } from 'vue';
  const Component: ComponentOptions;
  export default Component;
}

declare module '*.md' {
  const Component: ComponentOptions;
  export default Component;
}
