import {RouteConfig} from '@nuxt/types/config/router';

interface ToolConfig {
  title: string;
  description: string;
  icon: string;
  keywords: string[];
}

type ToolConfigMethod = () => ToolConfig;
type ToolRouteConfig = RouteConfig & {config: ToolConfig}

export {ToolConfig, ToolConfigMethod, ToolRouteConfig}
