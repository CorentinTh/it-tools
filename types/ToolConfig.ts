interface ToolConfig {
  title: string;
  description: string;
  icon: string;
  keywords: string[];
}

type ToolConfigMethod = () => ToolConfig;

export {ToolConfig, ToolConfigMethod}
