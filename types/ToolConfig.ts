
interface ToolConfig {
  title: string;
  description: string;
  icon: string;
  keywords: string[];
  path?: string
}

interface ToolRouteConfig extends ToolConfig{
  componentPath: string
}

export {ToolConfig, ToolRouteConfig}
